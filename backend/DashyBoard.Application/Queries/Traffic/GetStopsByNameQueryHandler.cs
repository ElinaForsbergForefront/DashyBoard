using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Traffic.GetStopByName;

public sealed class GetStopByNameQueryHandler : IRequestHandler<GetStopByNameQuery, IReadOnlyList<StationDto>>
{
    private readonly ITrafficApiClient _trafficApiClient;

    public GetStopByNameQueryHandler(ITrafficApiClient trafficApiClient)
    {
        _trafficApiClient = trafficApiClient;
    }

    public async Task<IReadOnlyList<StationDto>> Handle(GetStopByNameQuery request, CancellationToken ct)
    {
        return await _trafficApiClient.GetStopByNameAsync(request.Name, ct);
    }
}