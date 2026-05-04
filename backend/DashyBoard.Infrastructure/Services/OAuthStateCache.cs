using DashyBoard.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace DashyBoard.Infrastructure.Services;

public class OAuthStateCache : IOAuthStateCache
{
    private readonly IMemoryCache _cache;

    public OAuthStateCache(IMemoryCache cache)
    {
        _cache = cache;
    }

    public Task SetAsync(string state, Guid userId, TimeSpan expiration, CancellationToken cancellationToken = default)
    {
        _cache.Set(state, userId, expiration);
        return Task.CompletedTask;
    }

    public Task<Guid?> GetAndRemoveAsync(string state, CancellationToken cancellationToken = default)
    {
        if (_cache.TryGetValue<Guid>(state, out var userId))
        {
            _cache.Remove(state);
            return Task.FromResult<Guid?>(userId);
        }

        return Task.FromResult<Guid?>(null);
    }
}