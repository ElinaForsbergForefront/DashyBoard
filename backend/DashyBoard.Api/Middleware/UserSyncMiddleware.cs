using DashyBoard.Domain.Models;
using DashyBoard.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Npgsql;
using System.Security.Claims;
using System.Text.Json;

namespace DashyBoard.Api.Middleware;

public class UserSyncMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserSyncMiddleware> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly string _userMetadataClaimType;
    private readonly IMemoryCache _cache;

    private const string CacheKeyPrefix = "synced_";

    public UserSyncMiddleware(RequestDelegate next, ILogger<UserSyncMiddleware> logger, 
        IServiceScopeFactory scopeFactory, IMemoryCache cache, IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _scopeFactory = scopeFactory;
        _cache = cache;
        _userMetadataClaimType = configuration["Authentication:UserMetadataClaimType"]
            ?? throw new InvalidOperationException("UserMetadataClaimType not configured");
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var sub = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? context.User.FindFirst("sub")?.Value;
            var email = context.User.FindFirst(ClaimTypes.Email)?.Value
                        ?? context.User.FindFirst("email")?.Value;

            if (!string.IsNullOrEmpty(sub) && !string.IsNullOrEmpty(email))
            {
                var cacheKey = $"{CacheKeyPrefix}{sub}";
                // First cache check
                if (!_cache.TryGetValue(cacheKey, out bool _))
                {
                    try
                    {
                        await SyncUserAsync(context, sub, email, context.RequestAborted);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to sync user {Sub}", sub);
                    }
                }
            }
        }

        await _next(context);
    }

    private async Task SyncUserAsync(HttpContext context, string sub, string email, CancellationToken ct)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<DashyBoardDbContext>();

        var user = await db.Users.FirstOrDefaultAsync(u => u.AuthSub == sub, ct);

        if (user?.Username != null)
        {
            // User already synced - cache it
            _cache.Set($"{CacheKeyPrefix}{sub}", true, TimeSpan.FromHours(1));
            return;
        }

        var (username, displayName, country, city) = ParseUserMetadata(context, sub);

        if (user == null)
        {
            db.Users.Add(new User(sub, email, username, displayName, country, city));
            try
            {
                await db.SaveChangesAsync(ct);
                _logger.LogInformation("New user created: {Sub}", sub);
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
            {
                _logger.LogInformation("User already exists (race condition): {Sub}", sub);
            }
        }
        else if (username != null)
        {
            user.Update(username, displayName, country, city);
            await db.SaveChangesAsync(ct);
            _logger.LogInformation("Updated profile for existing user: {Sub}", sub);
        }

        _cache.Set($"{CacheKeyPrefix}{sub}", true, TimeSpan.FromHours(1));
    }

    private (string? username, string? displayName, string? country, string? city)
        ParseUserMetadata(HttpContext context, string sub)
    {
        var userMetadataClaim = context.User.FindFirst(_userMetadataClaimType);
        if (userMetadataClaim == null)
            return (null, null, null, null);

        try
        {
            var meta = JsonSerializer.Deserialize<JsonElement>(userMetadataClaim.Value);
            var username = meta.TryGetProperty("username", out var u) ? u.GetString() : null;
            var displayName = meta.TryGetProperty("display_name", out var d) ? d.GetString() : null;
            var country = meta.TryGetProperty("country", out var c) ? c.GetString() : null;
            var city = meta.TryGetProperty("city", out var ci) ? ci.GetString() : null;

            return (username, displayName, country, city);
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse user metadata for {Sub}", sub);
            return (null, null, null, null);
        }
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: "23505" };
}

public static class UserSyncMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder) =>
        builder.UseMiddleware<UserSyncMiddleware>();
}