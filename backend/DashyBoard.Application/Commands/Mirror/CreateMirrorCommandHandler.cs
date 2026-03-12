using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Mirror;

public class CreateMirrorCommandHandler : IRequestHandler<CreateMirrorCommand, MirrorDto>
{
    private readonly IMirrorRepository _repository;

    public CreateMirrorCommandHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<MirrorDto> Handle(CreateMirrorCommand command, CancellationToken cancellationToken)
    {
        return await _repository.CreateMirrorAsync(command.UserId, command.Name, command.WidthCm, command.HeightCm, cancellationToken);
    }
}
