using DashyBoard.Application.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class SendFriendRequestCommandHandler : IRequestHandler<SendFriendRequestCommand>
    {
        private readonly IFriendRepository _repository;

        public SendFriendRequestCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(SendFriendRequestCommand command, CancellationToken ct)
        {
            await _repository.SendFriendRequestAsync(command.CurrentUserId, command.ReceiverUsername, ct);
        }
    }
}
