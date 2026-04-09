using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Poke.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Poke
{
    public sealed class GetPokesQueryHandler : IRequestHandler<GetPokesQuery, IReadOnlyList<PokeDto>>
    {
        private readonly IFriendRepository _repository;

        public GetPokesQueryHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<IReadOnlyList<PokeDto>> Handle(GetPokesQuery request, CancellationToken ct)
        {
            return await _repository.GetPokesAsync(request.CurrentUserId, ct);
        }
    }
}
