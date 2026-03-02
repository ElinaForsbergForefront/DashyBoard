using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure.Client
{
    public sealed class UserClient : IUserClient
    {
        private readonly DashyBoardDbContext _context;

        public UserClient(DashyBoardDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto> GetUserNameAsync(Guid userId, CancellationToken ct)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId, ct)
                ?? throw new KeyNotFoundException($"User with id {userId} not found.");

            return new UserDto
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
}
