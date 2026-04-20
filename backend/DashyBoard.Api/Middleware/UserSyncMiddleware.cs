using DashyBoard.Domain.Models;
using DashyBoard.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Npgsql;
using System.Collections.Concurrent;
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

    private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

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
                    // Create a sempahore for this specific user
                    var semaphore = _locks.GetOrAdd(sub, _ => new SemaphoreSlim(1, 1));

                    // Wait for our turn (only one request per user can enter)
                    await semaphore.WaitAsync(context.RequestAborted);
                    try
                    {
                        // Check cache again after getting lock
                        if (!_cache.TryGetValue(cacheKey, out bool _))
                        {
                            await SyncUserAsync(context, sub, email, context.RequestAborted);
                        }
                    } catch(Exception ex)
                    {
                        _logger.LogError(ex, "Failed to sync user {Sub}", sub);
                    }
                    finally
                    {
                        // ALWAYS release the lock, even if error occurs
                        semaphore.Release();
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
            SetCacheWithCleanup(sub);
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

        SetCacheWithCleanup(sub);
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

    private void SetCacheWithCleanup(string sub)
    {
        var cacheKey = $"{CacheKeyPrefix}{sub}";

        _cache.Set(
            cacheKey,
            true,
            new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1),
                PostEvictionCallbacks =
                {
                    new PostEvictionCallbackRegistration
                    {
                        EvictionCallback = (key, value, reason, state) =>
                        {
                            try
                        {
                            // Clean up semaphore when cache entry expires
                            if (key is string k && k.StartsWith(CacheKeyPrefix))
                            {
                                var userSub = k.Replace(CacheKeyPrefix, "");
                                if (_locks.TryRemove(userSub, out var semaphore))
                                {
                                    semaphore?.Dispose();
                                    _logger.LogDebug(
                                        "Cleaned up semaphore for {Sub}, Reason: {Reason}",
                                        userSub,
                                        reason);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to cleanup semaphore for cache key {Key}", key);
                        }
                        }
                    }
                }
            });
    }

    private static bool IsUniqueConstraintViolation(DbUpdateException ex) =>
        ex.InnerException is PostgresException { SqlState: "23505" };
}

public static class UserSyncMiddlewareExtensions
{
    public static IApplicationBuilder UseUserSync(this IApplicationBuilder builder) =>
        builder.UseMiddleware<UserSyncMiddleware>();
}