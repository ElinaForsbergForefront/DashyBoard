using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record UnBlockUserCommand(
        Guid RelationshipId,
        Guid CurrentUserId
    ) : IRequest;
}
