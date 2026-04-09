using System;
using System.Collections.Generic;
using DashyBoard.Application.Queries.Poke.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Poke
{
    public sealed record GetPokesQuery(
        Guid CurrentUserId
    ) : IRequest<IReadOnlyList<PokeDto>>;
}
