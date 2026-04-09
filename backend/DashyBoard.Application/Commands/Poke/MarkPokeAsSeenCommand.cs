using System;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed record MarkPokeAsSeenCommand(
        Guid PokeId,
        Guid CurrentUserId
    ) : IRequest;
}
