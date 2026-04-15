using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

internal class MoveWidgetCommandHandler : IRequestHandler<MoveWidgetCommand, MirrorDto>
{
    private readonly IMirrorRepository _mirrorRepository;

    public MoveWidgetCommandHandler(IMirrorRepository mirrorRepository)
    {
        _mirrorRepository = mirrorRepository;
    }

    public async Task<MirrorDto> Handle(MoveWidgetCommand request, CancellationToken cancellationToken)
    {
        return await _mirrorRepository.MoveWidgetAsync(
            request.MirrorId, 
            request.WidgetId, 
            request.X, 
            request.Y, 
            cancellationToken);
    }
}
