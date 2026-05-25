using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

internal class AddWidgetCommandHandler : IRequestHandler<AddWidgetCommand, MirrorDto>
{
    private readonly IMirrorRepository _mirrorRepository;
    private readonly IWidgetConfigurationService _widgetConfigurationService;

    public AddWidgetCommandHandler(IMirrorRepository mirrorRepository, IWidgetConfigurationService widgetConfigurationService)
    {
        _mirrorRepository = mirrorRepository;
        _widgetConfigurationService = widgetConfigurationService;
    }

    public async Task<MirrorDto> Handle(AddWidgetCommand request, CancellationToken cancellationToken)
    {
        var config = _widgetConfigurationService.BuildPersistedConfig(request.Type, request.Config);

        return await _mirrorRepository.AddWidgetAsync(
            request.MirrorId,
            request.Type,
            request.X,
            request.Y,
            config,
            cancellationToken);
    }
}
