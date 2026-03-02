using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.User
{
    public sealed record UpdateUserByIdCommand (Guid Id,
        string? Username,
        string? DisplayName,
        string? Country,
        string? City) : IRequest<UserDto>;
    
}
