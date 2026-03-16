using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetDepartures;

public sealed class GetDeparturesQueryHandler : IRequestHandler<GetDeparturesQuery, IReadOnlyList<TimetableEntryDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetDeparturesQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<TimetableEntryDto>> Handle(GetDeparturesQuery request, CancellationToken ct)
    {
       return await _trafficApiClient.GetDeparturesAsync(request.SiteId, ct);
    }
}