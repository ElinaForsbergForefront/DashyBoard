using System;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed record GetFriendQuery(
        Guid CurrentUserId,
        string OtherUsername
    ) : IRequest<UserRelationDto?>;
}
