using DashyBoard.Application.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class SendFriendRequestCommandHandler : IRequestHandler<SendFriendRequestCommand, Guid>
    {
        private readonly IFriendRepository _repository;

        public SendFriendRequestCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(SendFriendRequestCommand command, CancellationToken ct)
        {
            return await _repository.SendFriendRequestAsync(command.CurrentUserId, command.ReceiverUsername, ct);
        }
    }
}
