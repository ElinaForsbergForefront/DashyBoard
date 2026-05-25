using System.Text.Json;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Widget;

public sealed record AddWidgetCommand(
    Guid MirrorId, 
    string Type, 
    double X, 
    double Y,
    JsonElement? Config) : IRequest<MirrorDto>;
