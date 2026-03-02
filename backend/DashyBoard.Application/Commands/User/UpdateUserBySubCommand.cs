using DashyBoard.Application.Queries.User.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Commands.User
{
    public sealed record UpdateUserBySubCommand(string sub, string? username, string? displayName, string? country, string? city) : IRequest<UserDto>;
}
