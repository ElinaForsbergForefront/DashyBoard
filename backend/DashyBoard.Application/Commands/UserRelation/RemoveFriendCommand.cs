using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record RemoveFriendCommand(
        Guid RelationshipId,
        Guid CurrentUserId
    ) : IRequest;
}
