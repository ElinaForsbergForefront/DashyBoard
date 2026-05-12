using DashyBoard.Application.Interfaces;
using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure.Repositories
{
    public sealed class SpotifyConnectionRepository : ISpotifyConnectionRepository
    {
        private readonly DashyBoardDbContext _dbContext;

        public SpotifyConnectionRepository(DashyBoardDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<SpotifyConnection?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            return await _dbContext.SpotifyConnections
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
        }

        public async Task AddAsync(SpotifyConnection connection, CancellationToken cancellationToken)
        {
            await _dbContext.SpotifyConnections.AddAsync(connection, cancellationToken);
        }

        public void Update(SpotifyConnection connection)
        {
            _dbContext.SpotifyConnections.Update(connection);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}