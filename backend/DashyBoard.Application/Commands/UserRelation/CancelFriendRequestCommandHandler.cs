using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.UserRelation;

public sealed class CancelFriendRequestCommandHandler : IRequestHandler<CancelFriendRequestCommand>
{
    private readonly IFriendRepository _repository;

    public CancelFriendRequestCommandHandler(IFriendRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(CancelFriendRequestCommand command, CancellationToken ct)
    {
        await _repository.CancelFriendRequestAsync(command.Username, command.CurrentUserId, ct);
    }
}
