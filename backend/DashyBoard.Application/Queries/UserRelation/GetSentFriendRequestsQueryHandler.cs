using System.Collections.Generic;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation;

public sealed class GetSentFriendRequestsQueryHandler : IRequestHandler<GetSentFriendRequestsQuery, IReadOnlyList<UserRelationDto>>
{
    private readonly IFriendRepository _repository;

    public GetSentFriendRequestsQueryHandler(IFriendRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<UserRelationDto>> Handle(GetSentFriendRequestsQuery request, CancellationToken ct)
    {
        return await _repository.GetSentFriendRequestsAsync(request.CurrentUserId, ct);
    }
}
