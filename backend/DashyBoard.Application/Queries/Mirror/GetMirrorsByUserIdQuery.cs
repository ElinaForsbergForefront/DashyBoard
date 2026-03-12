using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror;

public record GetMirrorsByUserSubQuery(string  UserSub) : IRequest<IEnumerable<MirrorDto>>;
