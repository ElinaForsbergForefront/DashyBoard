using System;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed record InactivatePokeCommand(
        Guid PokeId,
        Guid CurrentUserId
    ) : IRequest;
}
