using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class BlockUserCommandHandler : IRequestHandler<BlockUserCommand>
    {
        private readonly IFriendRepository _repository;

        public BlockUserCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(BlockUserCommand command, CancellationToken ct)
        {
            await _repository.BlockUserAsync(command.RelationshipId, command.CurrentUserId, ct);
        }
    }
}
