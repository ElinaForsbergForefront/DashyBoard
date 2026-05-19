using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation;

public sealed class RejectFriendRequestCommandHandler : IRequestHandler<RejectFriendRequestCommand>
{
    private readonly IFriendRepository _repository;

    public RejectFriendRequestCommandHandler(IFriendRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(RejectFriendRequestCommand command, CancellationToken ct)
    {
        await _repository.RejectFriendRequestAsync(command.Username, command.CurrentUserId, ct);
    }
}