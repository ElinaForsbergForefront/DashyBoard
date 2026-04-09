using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed class GetFriendListQuerieHandler : IRequestHandler<GetFriendListQuery, IReadOnlyList<UserRelationDto>>
    {
        private readonly IFriendRepository _repository;

        public GetFriendListQuerieHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<UserRelationDto>> Handle(GetFriendListQuery request, CancellationToken ct)
        {
            return await _repository.GetFriendListAsync(request.CurrentUserId, ct);
        }
    }
}
