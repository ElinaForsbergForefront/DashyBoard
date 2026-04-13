using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record AcceptFriendRequestCommand(
        string Username,
        Guid CurrentUserId
    ) : IRequest;
}
