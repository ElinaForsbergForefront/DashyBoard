using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetDepartures;

public sealed class GetDeparturesSpecificTimeQueryHandler : IRequestHandler<GetDeparturesSpecificTimeQuery, IReadOnlyList<TimetableEntryDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetDeparturesSpecificTimeQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<TimetableEntryDto>> Handle(GetDeparturesSpecificTimeQuery request, CancellationToken ct)
    {
        return await _trafficApiClient.GetDeparturesSpecificTimeAsync(request.SiteId, request.DateTime, ct);
    }
}