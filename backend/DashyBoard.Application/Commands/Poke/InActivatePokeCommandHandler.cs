using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed class InactivatePokeCommandHandler : IRequestHandler<InactivatePokeCommand>
    {
        private readonly IFriendRepository _repository;

        public InactivatePokeCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(InactivatePokeCommand command, CancellationToken ct)
        {
            await _repository.InactivatePokeAsync(command.PokeId, command.CurrentUserId, ct);
        }
    }
}
