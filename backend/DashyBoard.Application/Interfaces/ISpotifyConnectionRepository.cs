using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Interfaces
{
    public interface ISpotifyConnectionRepository
    {
        Task<SpotifyConnection?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
        Task AddAsync(SpotifyConnection connection, CancellationToken cancellationToken);
        void Update(SpotifyConnection connection);
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}