using DashyBoard.Application.Queries.Gold.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface IGoldApiClient
    {
        Task<IReadOnlyList<AssetTickersDto>> GetApiAssetTickerAsync(CancellationToken ct);
        Task<AssetPriceDto> GetPriceAsync(string symbol, CancellationToken ct);
    }
}
