using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Gold.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Gold
{
    public sealed class GetAssetPriceQueryHandler : IRequestHandler<GetAssetPriceQuery, AssetPriceDto>
    {
        private readonly IGoldApiClient _goldApiClient;

        public GetAssetPriceQueryHandler(IGoldApiClient goldApiClient)
        {
            _goldApiClient = goldApiClient;
        }

        public async Task<AssetPriceDto> Handle(GetAssetPriceQuery request, CancellationToken cancellationToken)
        {
            return await _goldApiClient.GetPriceAsync(request.Symbol, cancellationToken);
        }
    }
}
