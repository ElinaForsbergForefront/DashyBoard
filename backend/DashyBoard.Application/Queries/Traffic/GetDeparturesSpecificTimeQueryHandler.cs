using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetDepartures;

public sealed class GetDeparturesSpecificTimeQueryHandler : IRequestHandler<GetDeparturesSpecificTimeQuery, IReadOnlyList<DepartureDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetDeparturesSpecificTimeQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<DepartureDto>> Handle(GetDeparturesSpecificTimeQuery request, CancellationToken ct)
        => await _trafficApiClient.GetDeparturesSpecificTimeAsync(request.SiteId, request.DateTime, ct);
}