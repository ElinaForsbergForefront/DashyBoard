using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror
{
    public record GetMirrorByIdQuery(Guid Id) : IRequest<MirrorDto>;
}
