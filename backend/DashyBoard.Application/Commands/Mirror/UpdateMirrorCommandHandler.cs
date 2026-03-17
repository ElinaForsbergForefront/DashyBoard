using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Mirror;

public class UpdateMirrorCommandHandler : IRequestHandler<UpdateMirrorCommand, MirrorDto>
{
    private readonly IMirrorRepository _repository;

    public UpdateMirrorCommandHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<MirrorDto> Handle(UpdateMirrorCommand command, CancellationToken cancellationToken)
    {
        return await _repository.UpdateMirrorAsync(command.Id, command.Name, command.WidthCm, command.HeightCm, cancellationToken);
    }
}
