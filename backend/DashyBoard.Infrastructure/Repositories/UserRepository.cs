using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure.Repositories
{
    public sealed class UserRepository : IUserRepository
    {
        private readonly DashyBoardDbContext _context;

        public UserRepository(DashyBoardDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto> GetUserByIdAsync(Guid userId, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId, ct)
                ?? throw new KeyNotFoundException($"User with id {userId} not found.");

            return MapToDto(user);
        }

        public async Task<UserDto> GetUserBySubAsync(string sub, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AuthSub == sub, ct)
                ?? throw new KeyNotFoundException($"User with sub {sub} not found.");

            return MapToDto(user);
        }

        public async Task<bool> IsUsernameTakenAsync(string username, CancellationToken ct)
        {
            return await _context.Users
                .AnyAsync(u => u.Username != null && u.Username.ToLower() == username.ToLower(), ct);
        }
        public async Task DeleteUserBySubAsync(string sub, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AuthSub == sub, ct)
                ?? throw new KeyNotFoundException($"User with sub {sub} not found.");
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteUserByIdAsync(Guid userId, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId, ct)
                ?? throw new KeyNotFoundException($"User with id {userId} not found.");
            _context.Users.Remove(user);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<UserDto> UpdateUserBySubAsync(string sub, string? username, string? displayName, string? country, string? city, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AuthSub == sub, ct)
                ?? throw new KeyNotFoundException($"User with sub {sub} not found.");

            user.Update(username, displayName, country, city);
            await _context.SaveChangesAsync(ct);

            return MapToDto(user);
        }

        public async Task<UserDto> UpdateUserByIdAsync(Guid id, string? username, string? displayName, string? country, string? city, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id, ct)
                ?? throw new KeyNotFoundException($"User with id {id} not found.");
            user.Update(username, displayName, country, city);
            await _context.SaveChangesAsync(ct);
            return MapToDto(user);
        }

        private static UserDto MapToDto(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            AuthSub = user.AuthSub,
            Username = user.Username,
            DisplayName = user.DisplayName,
            Country = user.Country,
            City = user.City
        };

        public async Task<UserDto> CreateOrUpdateUserBySubAsync(string sub, string email, string? username, string? displayName, string? country, string? city, CancellationToken ct)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.AuthSub == sub, ct);

            if (user != null)
            {
                user.Update(username, displayName, country, city);
            }
            else
            {
                user = new User(sub, email, username, displayName, country, city);
                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync(ct);
            return MapToDto(user);
        }

        public async Task<IReadOnlyList<UserDto>> SearchUsersAsync(string searchTerm, Guid currentUserId, CancellationToken ct)
        {
            // Hämta användare som har blockerat mig (ActionByUserId != currentUserId och jag är involverad)
            var blockedByOthersIds = await _context.UserRelationships
                .Where(r => r.Status == UserRelationshipStatus.Blocked 
                            && r.ActionByUserId != currentUserId
                            && (r.User1Id == currentUserId || r.User2Id == currentUserId))
                .Select(r => r.ActionByUserId)
                .ToListAsync(ct);

            // Sök användare vars användarnamn innehåller söktermen, exkludera mig själv och de som blockerat mig
            var users = await _context.Users
                .Where(u => u.Username != null 
                            && u.Username.ToLower().Contains(searchTerm.ToLower())
                            && u.Id != currentUserId
                            && !blockedByOthersIds.Contains(u.Id))
                .Take(20) // Begränsa till max 20 resultat
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    AuthSub = u.AuthSub,
                    Username = u.Username,
                    DisplayName = u.DisplayName,
                    Country = u.Country,
                    City = u.City
                })
                .ToListAsync(ct);

            return users;
        }
    }
}
