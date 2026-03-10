using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetArrivals;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetArrivals;

public sealed class GetArrivalsSpecificTimeQueryHandler : IRequestHandler<GetArrivalsSpecificTimeQuery, IReadOnlyList<ArrivalDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetArrivalsSpecificTimeQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<ArrivalDto>> Handle(GetArrivalsSpecificTimeQuery request, CancellationToken ct)
        => await _trafficApiClient.GetArrivalsSpecificTimeAsync(request.SiteId, request.DateTime, ct);
}