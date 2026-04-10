using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class AcceptFriendRequestCommandHandler : IRequestHandler<AcceptFriendRequestCommand>
    {
        private readonly IFriendRepository _repository;

        public AcceptFriendRequestCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(AcceptFriendRequestCommand command, CancellationToken ct)
        {
            await _repository.AcceptFriendRequestAsync(command.Username, command.CurrentUserId, ct);
        }
    }
}
