using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.UserRelation
{
    public sealed class GetFriendQueryHandler : IRequestHandler<GetFriendQuery, UserRelationDto?>
    {
        private readonly IFriendRepository _repository;

        public GetFriendQueryHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<UserRelationDto?> Handle(GetFriendQuery request, CancellationToken ct)
        {
            return await _repository.GetFriendAsync(request.CurrentUserId, request.OtherUsername, ct);
        }
    }
}
