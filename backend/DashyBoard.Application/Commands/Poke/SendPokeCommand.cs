using System;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed record SendPokeCommand(
        Guid CurrentUserId,
        string ToUsername
    ) : IRequest;
}
