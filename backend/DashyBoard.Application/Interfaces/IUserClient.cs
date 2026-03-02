using DashyBoard.Application.Queries.User.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Interfaces
{
    public interface IUserClient
    {
        Task<UserDto> GetUserNameAsync(Guid userId, CancellationToken ct);
    }
}
