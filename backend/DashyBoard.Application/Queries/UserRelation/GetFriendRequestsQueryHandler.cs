using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed class GetFriendRequestsQueryHandler : IRequestHandler<GetFriendRequestsQuery, IReadOnlyList<UserRelationDto>>
    {
        private readonly IFriendRepository _repository;

        public GetFriendRequestsQueryHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<UserRelationDto>> Handle(GetFriendRequestsQuery request, CancellationToken ct)
        {
            return await _repository.GetFriendRequestsAsync(request.CurrentUserId, ct);
        }
    }
}
