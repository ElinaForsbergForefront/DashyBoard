using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.User;

public sealed class SearchUsersQueryHandler : IRequestHandler<SearchUsersQuery, IReadOnlyList<UserDto>>
{
    private readonly IUserRepository _repository;

    public SearchUsersQueryHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<UserDto>> Handle(SearchUsersQuery request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.SearchTerm) || request.SearchTerm.Length < 2)
        {
            return Array.Empty<UserDto>();
        }

        return await _repository.SearchUsersAsync(request.SearchTerm, request.CurrentUserId, ct);
    }
}