using DashyBoard.Application.Queries.User.Dto;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.User
{
    public record GetUserBySubQuery(string Sub) : IRequest<UserDto>;

}
