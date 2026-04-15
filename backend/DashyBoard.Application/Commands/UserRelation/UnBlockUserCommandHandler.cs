using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class UnBlockUserCommandHandler : IRequestHandler<UnBlockUserCommand>
    {
        private readonly IFriendRepository _repository;

        public UnBlockUserCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(UnBlockUserCommand command, CancellationToken ct)
        {
            await _repository.UnblockUserAsync(command.Username, command.CurrentUserId, ct);
        }
    }
}
