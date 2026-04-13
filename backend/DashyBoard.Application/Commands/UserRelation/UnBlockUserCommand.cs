using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record UnBlockUserCommand(
        string Username,
        Guid CurrentUserId
    ) : IRequest;
}
