using MediatR;

namespace DashyBoard.Application.Commands.Mirror;

public sealed record DeleteMirrorCommand(Guid Id) : IRequest<Unit>;
