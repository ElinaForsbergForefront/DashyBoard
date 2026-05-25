using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

internal sealed class UpdateWidgetConfigCommandHandler : IRequestHandler<UpdateWidgetConfigCommand, MirrorDto>
{
    private readonly IMirrorRepository _mirrorRepository;
    private readonly IWidgetConfigurationService _widgetConfigurationService;

    public UpdateWidgetConfigCommandHandler(
        IMirrorRepository mirrorRepository,
        IWidgetConfigurationService widgetConfigurationService)
    {
        _mirrorRepository = mirrorRepository;
        _widgetConfigurationService = widgetConfigurationService;
    }

    public async Task<MirrorDto> Handle(UpdateWidgetConfigCommand request, CancellationToken cancellationToken)
    {
        var mirror = await _mirrorRepository.GetMirrorByIdAsync(request.MirrorId, cancellationToken);

        var widget = mirror.Widgets.FirstOrDefault(entry => entry.Id == request.WidgetId)
            ?? throw new KeyNotFoundException($"Widget with id {request.WidgetId} not found.");

        var config = _widgetConfigurationService.BuildPersistedConfig(widget.Type, request.Config);

        return await _mirrorRepository.UpdateWidgetConfigAsync(
            request.MirrorId,
            request.WidgetId,
            config,
            cancellationToken);
    }
}