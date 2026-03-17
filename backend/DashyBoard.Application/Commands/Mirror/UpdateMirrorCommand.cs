using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Mirror;

public sealed record UpdateMirrorCommand(Guid Id, string Name, double WidthCm, double HeightCm) : IRequest<MirrorDto>;
