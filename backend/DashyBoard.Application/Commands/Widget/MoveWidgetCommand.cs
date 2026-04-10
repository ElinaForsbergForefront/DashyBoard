using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

public sealed record MoveWidgetCommand(
    Guid MirrorId, 
    Guid WidgetId, 
    double X, 
    double Y) : IRequest<MirrorDto>;
