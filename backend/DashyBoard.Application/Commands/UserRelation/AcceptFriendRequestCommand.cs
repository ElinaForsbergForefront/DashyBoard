using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record AcceptFriendRequestCommand(
        Guid RelationshipId,
        Guid CurrentUserId
    ) : IRequest;
}
