using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed class InActivatePokeCommandHandler : IRequestHandler<InActivatePokeCommand>
    {
        private readonly IFriendRepository _repository;

        public InActivatePokeCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(InActivatePokeCommand command, CancellationToken ct)
        {
            await _repository.InactivatePokeAsync(command.PokeId, command.CurrentUserId, ct);
        }
    }
}
