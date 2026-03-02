using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.WorldTime.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.WorldTime;

public sealed class GetTimeByTimezoneQueryHandler : IRequestHandler<GetTimeByTimezoneQuery, WorldTimeDto>
{
    private readonly IWorldTimeApiClient _worldTimeApiClient;

    public GetTimeByTimezoneQueryHandler(IWorldTimeApiClient worldTimeApiClient)
    {
        _worldTimeApiClient = worldTimeApiClient;
    }

    public async Task<WorldTimeDto> Handle(GetTimeByTimezoneQuery request, CancellationToken cancellationToken)
    {
        return await _worldTimeApiClient.GetTimeByTimezoneAsync(request.Timezone, cancellationToken);
    }
}