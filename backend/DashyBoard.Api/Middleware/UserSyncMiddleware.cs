using DashyBoard.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using System.Text.Json;

namespace DashyBoard.Api.Middleware;

/// <summary>
/// Middleware that syncs authenticated users from Auth0 to the database.
/// Uses caching to prevent redundant database calls.
/// </summary>
public class UserSyncMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserSyncMiddleware> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly string _userMetadataClaimType;
    private readonly IMemoryCache _cache;

    private const string CacheKeyPrefix = "synced_";

    public UserSyncMiddleware(
        RequestDelegate next,
        ILogger<UserSyncMiddleware> logger,
        IServiceScopeFactory scopeFactory,
        IMemoryCache cache,
        IConfiguration configuration)
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
            await TrySyncUserAsync(context);
        }

        await _next(context);
    }

    private async Task TrySyncUserAsync(HttpContext context)
    {
        var (sub, email) = ExtractUserClaims(context);

        if (string.IsNullOrEmpty(sub) || string.IsNullOrEmpty(email))
            return;

        var cacheKey = $"{CacheKeyPrefix}{sub}";

        if (_cache.TryGetValue(cacheKey, out bool _))
            return; // Already synced

        try
        {
            await SyncUserAndCacheAsync(context, sub, email, cacheKey);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync user {Sub}", sub);
        }
    }

    private async Task SyncUserAndCacheAsync(HttpContext context, string sub, string email, string cacheKey)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var userSyncService = scope.ServiceProvider.GetRequiredService<IUserSyncService>();

        var (username, displayName, country, city) = ParseUserMetadata(context);

        await userSyncService.SyncUserFromAuthAsync(sub, email, username, displayName, country, city, context.RequestAborted);

        _cache.Set(cacheKey, true, TimeSpan.FromHours(1));
    }

    private static (string? sub, string? email) ExtractUserClaims(HttpContext context)
    {
        var sub = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? context.User.FindFirst("sub")?.Value;

        var email = context.User.FindFirst(ClaimTypes.Email)?.Value
                    ?? context.User.FindFirst("email")?.Value;

        return (sub, email);
    }

    private (string? username, string? displayName, string? country, string? city) ParseUserMetadata(HttpContext context)
    {
        var userMetadataClaim = context.User.FindFirst(_userMetadataClaimType);

        if (userMetadataClaim == null)
            return (null, null, null, null);

        try
        {
            var meta = JsonSerializer.Deserialize<JsonElement>(userMetadataClaim.Value);

            return (
                username: meta.TryGetProperty("username", out var u) ? u.GetString() : null,
                displayName: meta.TryGetProperty("display_name", out var d) ? d.GetString() : null,
                country: meta.TryGetProperty("country", out var c) ? c.GetString() : null,
                city: meta.TryGetProperty("city", out var ci) ? ci.GetString() : null
            );
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse user metadata");
            return (null, null, null, null);
        }
    }
}

public static class UserSyncMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder) =>
        builder.UseMiddleware<UserSyncMiddleware>();
}