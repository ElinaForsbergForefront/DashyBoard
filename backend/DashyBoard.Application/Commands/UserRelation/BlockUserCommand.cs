using System;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed record BlockUserCommand(
        Guid RelationshipId,
        Guid CurrentUserId
    ) : IRequest;
}
