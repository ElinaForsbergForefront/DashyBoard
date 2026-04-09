using System;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed record InActivatePokeCommand(
        Guid PokeId,
        Guid CurrentUserId
    ) : IRequest;
}
