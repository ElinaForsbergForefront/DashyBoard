using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Gold.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External
{
    /// <summary>
    /// GoldApiClient is responsible for communication with the external Gold API.
    /// We isolate HTTP and integration logic here instead of in the controller/handler.
    /// </summary>
    public sealed class GoldApiClient : IGoldApiClient
    {
        private readonly HttpClient _http;

        public GoldApiClient(HttpClient http) => _http = http;

        public async Task<IReadOnlyList<AssetTickersDto>> GetApiAssetTickerAsync(CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<List<AssetTickersDto>>("symbols", ct);
            return result ?? [];
        }

        public async Task<AssetPriceDto> GetPriceAsync(string symbol, CancellationToken ct)
        {
            var result = await _http.GetFromJsonAsync<AssetPriceDto>($"price/{symbol}", ct);
            return result ?? throw new InvalidOperationException("Empty response from Gold API.");
        }
    }
}
