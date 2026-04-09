using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record SendFriendRequestCommand
    (
        Guid CurrentUserId,
        string ReceiverUsername
    ) : IRequest;
}
