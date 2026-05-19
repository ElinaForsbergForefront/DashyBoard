using DashyBoard.Application.Queries.Poke.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Poke;

public sealed record GetSentPokesQuery(Guid UserId) : IRequest<IReadOnlyList<PokeDto>>;