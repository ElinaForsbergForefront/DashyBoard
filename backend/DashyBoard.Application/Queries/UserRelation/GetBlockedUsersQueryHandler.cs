using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed class GetBlockedUsersQueryHandler : IRequestHandler<GetBlockedUsersQuery, IReadOnlyList<UserRelationDto>>
    {
        private readonly IFriendRepository _repository;

        public GetBlockedUsersQueryHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<UserRelationDto>> Handle(GetBlockedUsersQuery request, CancellationToken ct)
        {
            return await _repository.GetBlockedUsersAsync(request.CurrentUserId, ct);
        }
    }
}
