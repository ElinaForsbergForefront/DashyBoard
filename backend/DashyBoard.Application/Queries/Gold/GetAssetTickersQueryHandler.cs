using MediatR;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Gold.Dto;

namespace DashyBoard.Application.Queries.Gold
{
    public class GetAssetTickersQueryHandler : IRequestHandler<GetAssetTickersQuery, IReadOnlyList<AssetTickersDto>>
    {
        private readonly IGoldApiClient _goldApiClient;

        public GetAssetTickersQueryHandler(IGoldApiClient goldApiClient)
        {
            _goldApiClient = goldApiClient;
        }

        public async Task<IReadOnlyList<AssetTickersDto>> Handle(GetAssetTickersQuery request, CancellationToken cancellationToken)
        {
            return await _goldApiClient.GetApiAssetTickerAsync(cancellationToken);
        }
    }
}
