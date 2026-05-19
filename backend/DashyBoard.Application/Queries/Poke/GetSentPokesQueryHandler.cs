using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Poke.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Poke;

public sealed class GetSentPokesQueryHandler : IRequestHandler<GetSentPokesQuery, IReadOnlyList<PokeDto>>
{
    private readonly IFriendRepository _friendRepository;

    public GetSentPokesQueryHandler(IFriendRepository friendRepository)
    {
        _friendRepository = friendRepository;
    }

    public async Task<IReadOnlyList<PokeDto>> Handle(GetSentPokesQuery request, CancellationToken cancellationToken)
    {
        return await _friendRepository.GetSentPokesAsync(request.UserId, cancellationToken);
    }
}