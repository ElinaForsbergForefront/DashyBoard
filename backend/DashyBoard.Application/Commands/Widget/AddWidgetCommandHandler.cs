using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

internal class AddWidgetCommandHandler : IRequestHandler<AddWidgetCommand, MirrorDto>
{
    private readonly IMirrorRepository _mirrorRepository;

    public AddWidgetCommandHandler(IMirrorRepository mirrorRepository)
    {
        _mirrorRepository = mirrorRepository;
    }

    public async Task<MirrorDto> Handle(AddWidgetCommand request, CancellationToken cancellationToken)
    {
        return await _mirrorRepository.AddWidgetAsync(
            request.MirrorId,
            request.Type,
            request.X,
            request.Y,
            cancellationToken);
    }
}
