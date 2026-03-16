using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetArrivals;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic;

public sealed class GetArrivalsQueryHandler : IRequestHandler<GetArrivalsQuery, IReadOnlyList<TimetableEntryDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetArrivalsQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<TimetableEntryDto>> Handle(GetArrivalsQuery request, CancellationToken ct)
        => await _trafficApiClient.GetArrivalsAsync(request.SiteId, ct);
}