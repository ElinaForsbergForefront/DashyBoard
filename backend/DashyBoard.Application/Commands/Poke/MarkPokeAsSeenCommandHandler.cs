using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed class MarkPokeAsSeenCommandHandler : IRequestHandler<MarkPokeAsSeenCommand>
    {
        private readonly IFriendRepository _repository;

        public MarkPokeAsSeenCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(MarkPokeAsSeenCommand command, CancellationToken ct)
        {
            await _repository.MarkPokeAsSeenAsync(command.PokeId, command.CurrentUserId, ct);
        }
    }
}
