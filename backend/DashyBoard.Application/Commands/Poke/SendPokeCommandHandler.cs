using System;
using System.Threading;
using System.Threading.Tasks;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Poke
{
    public sealed class SendPokeCommandHandler : IRequestHandler<SendPokeCommand>
    {
        private readonly IFriendRepository _repository;

        public SendPokeCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(SendPokeCommand command, CancellationToken ct)
        {
            await _repository.SendPokeAsync(command.CurrentUserId, command.ToUsername, ct);
        }
    }
}
