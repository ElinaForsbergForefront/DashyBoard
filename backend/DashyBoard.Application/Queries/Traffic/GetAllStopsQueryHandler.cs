using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetAllStops;

public sealed class GetAllStopsQueryHandler // : IRequestHandler<GetAllStopsQuery, IReadOnlyList<StationDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetAllStopsQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    /*
    public async Task<IReadOnlyList<StationDto>> Handle(GetAllStopsQuery request, CancellationToken ct)
        => await _trafficApiClient.GetAllStopsAsync(ct);
    */
}