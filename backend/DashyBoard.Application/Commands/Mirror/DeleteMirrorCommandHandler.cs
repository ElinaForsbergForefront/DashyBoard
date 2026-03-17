using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Mirror;

public class DeleteMirrorCommandHandler : IRequestHandler<DeleteMirrorCommand, Unit>
{
    private readonly IMirrorRepository _repository;

    public DeleteMirrorCommandHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeleteMirrorCommand command, CancellationToken cancellationToken)
    {
        await _repository.DeleteMirrorAsync(command.Id, cancellationToken);
        return Unit.Value;
    }
}
