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
    private readonly IMemoryCache _cache;

    public UserSyncMiddleware(RequestDelegate next, ILogger<UserSyncMiddleware> logger, 
        IServiceScopeFactory scopeFactory, IMemoryCache cache)
    {
        _next = next;
        _logger = logger;
        _scopeFactory = scopeFactory;
        _cache = cache;
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
                // Skip DB entirely if already confirmed synced in this server session
                if (!_cache.TryGetValue($"synced_{sub}", out bool _))
                    await SyncUserAsync(context, sub, email);
            }
        }

        await _next(context);
    }

    private async Task SyncUserAsync(HttpContext context, string sub, string email)
    {
        await using var scope = _scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<DashyBoardDbContext>();

        var user = await db.Users.FirstOrDefaultAsync(u => u.AuthSub == sub);

        if (user?.Username != null)
        {
            // Cache for 1 hour — no more DB hits until cache expires or server restarts
            _cache.Set($"synced_{sub}", true, TimeSpan.FromHours(1));
            return;
        }

        string? username = null, displayName = null, country = null, city = null;
        var userMetadataClaim = context.User.FindFirst("https://api.dashyboard.se/user_metadata");
        if (userMetadataClaim != null)
        {
            var meta = JsonSerializer.Deserialize<JsonElement>(userMetadataClaim.Value);
            username    = meta.TryGetProperty("username",     out var u)  ? u.GetString()  : null;
            displayName = meta.TryGetProperty("display_name", out var d)  ? d.GetString()  : null;
            country     = meta.TryGetProperty("country",      out var c)  ? c.GetString()  : null;
            city        = meta.TryGetProperty("city",         out var ci) ? ci.GetString() : null;
        }

        if (user == null)
        {
            db.Users.Add(new User(sub, email, username, displayName, country, city));
            try
            {
                await db.SaveChangesAsync();
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
            await db.SaveChangesAsync();
            _logger.LogInformation("Updated profile for existing user: {Sub}", sub);
        }

        _cache.Set($"synced_{sub}", true, TimeSpan.FromHours(1));
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: "23505" };
}

public static class UserSyncMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder) =>
        builder.UseMiddleware<UserSyncMiddleware>();
}