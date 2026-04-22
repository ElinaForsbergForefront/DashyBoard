namespace DashyBoard.Application.Interfaces;

public interface IOAuthStateCache
{
    Task SetAsync(string state, Guid userId, TimeSpan expiration, CancellationToken cancellationToken = default);
    Task<Guid?> GetAndRemoveAsync(string state, CancellationToken cancellationToken = default);
}