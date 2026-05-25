using System.Text.Json;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

public sealed record UpdateWidgetConfigCommand(
    Guid MirrorId,
    Guid WidgetId,
    JsonElement? Config) : IRequest<MirrorDto>;