using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

internal class RemoveWidgetCommandHandler : IRequestHandler<RemoveWidgetCommand, MirrorDto>
{
    private readonly IMirrorRepository _mirrorRepository;

    public RemoveWidgetCommandHandler(IMirrorRepository mirrorRepository)
    {
        _mirrorRepository = mirrorRepository;
    }

    public async Task<MirrorDto> Handle(RemoveWidgetCommand request, CancellationToken cancellationToken)
    {
        return await _mirrorRepository.RemoveWidgetAsync(
            request.MirrorId, 
            request.WidgetId, 
            cancellationToken);
    }
}
