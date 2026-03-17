using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror;

public class GetMirrorsByUserSubQueryHandler : IRequestHandler<GetMirrorsByUserSubQuery, IEnumerable<MirrorDto>>
{
    private readonly IMirrorRepository _repository;

    public GetMirrorsByUserSubQueryHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<MirrorDto>> Handle(GetMirrorsByUserSubQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMirrorsByUserSubAsync(request.UserSub, cancellationToken);
    }
}
