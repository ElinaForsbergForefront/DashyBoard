using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using DashyBoard.Application.Queries.User.Dto;

namespace DashyBoard.Application.Queries.User
{
    public record GetUserQuery(Guid Id): IRequest<UserDto>;
}
