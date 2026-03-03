using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
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

        private static UserDto MapToDto(Domain.Models.User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            AuthSub = user.AuthSub,
            Username = user.Username,
            DisplayName = user.DisplayName,
            Country = user.Country,
            City = user.City
        };
    }
}
