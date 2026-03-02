using DashyBoard.Application.Queries.User.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto> GetUserByIdAsync(Guid userId, CancellationToken ct);
        Task<UserDto> GetUserBySubAsync(string sub, CancellationToken ct);
        Task DeleteUserBySubAsync(string sub, CancellationToken ct);
        Task DeleteUserByIdAsync(Guid userId, CancellationToken ct);
        Task<UserDto> UpdateUserBySubAsync(string sub, string? username, string? displayName, string? country, string? city, CancellationToken ct);
        Task<UserDto> UpdateUserByIdAsync(Guid id, string? username, string? displayName, string? country, string? city, CancellationToken ct);

    }
}
