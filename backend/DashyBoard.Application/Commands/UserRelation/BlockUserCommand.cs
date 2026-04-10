using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record BlockUserCommand(
        string Username,
        Guid CurrentUserId
    ) : IRequest;
}
