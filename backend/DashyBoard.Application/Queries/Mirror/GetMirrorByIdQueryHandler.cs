using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Mirror;

public class GetMirrorByIdQueryHandler : IRequestHandler<GetMirrorByIdQuery, MirrorDto>
{
    private readonly IMirrorRepository _repository;

    public GetMirrorByIdQueryHandler(IMirrorRepository repository)
    {
        _repository = repository;
    }

    public async Task<MirrorDto> Handle(GetMirrorByIdQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetMirrorByIdAsync(request.Id, cancellationToken);
    }
}
