using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror;

public record GetMirrorsByUserIdQuery(string  UserId) : IRequest<IEnumerable<MirrorDto>>;
