using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation
{
    public sealed class RemoveFriendCommandHandler : IRequestHandler<RemoveFriendCommand>
    {
        private readonly IFriendRepository _repository;

        public RemoveFriendCommandHandler(IFriendRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(RemoveFriendCommand command, CancellationToken ct)
        {
            await _repository.RemoveFriendAsync(command.Username, command.CurrentUserId, ct);
        }
    }
}
