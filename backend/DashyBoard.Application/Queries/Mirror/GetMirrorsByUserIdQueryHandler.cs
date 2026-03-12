using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror;

public class GetMirrorsByUserIdQueryHandler : IRequestHandler<GetMirrorsByUserIdQuery, IEnumerable<MirrorDto>>
{
    private readonly IMirrorRepository _repository;

    public GetMirrorsByUserIdQueryHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MirrorDto>> Handle(GetMirrorsByUserIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMirrorsByUserIdAsync(request.UserId, cancellationToken);
    }
}
