using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.WorldTime.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.WorldTime;

public sealed class GetAllTimezonesQueryHandler : IRequestHandler<GetAllTimezonesQuery, IReadOnlyList<TimezoneDto>>
{
    private readonly IWorldTimeApiClient _worldTimeApiClient;

    public GetAllTimezonesQueryHandler(IWorldTimeApiClient worldTimeApiClient)
    {
        _worldTimeApiClient = worldTimeApiClient;
    }

    public async Task<IReadOnlyList<TimezoneDto>> Handle(GetAllTimezonesQuery request, CancellationToken cancellationToken)
    {
        return await _worldTimeApiClient.GetAllTimezonesAsync(cancellationToken);
    }
}