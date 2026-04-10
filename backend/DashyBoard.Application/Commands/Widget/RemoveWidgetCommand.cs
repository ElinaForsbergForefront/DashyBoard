using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

public sealed record RemoveWidgetCommand(
    Guid MirrorId,
    Guid WidgetId) : IRequest<MirrorDto>;
