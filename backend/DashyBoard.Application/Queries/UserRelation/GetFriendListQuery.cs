using System;
using System.Collections.Generic;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed record GetFriendListQuery(
        Guid CurrentUserId
    ) : IRequest<IReadOnlyList<UserRelationDto>>;
}
