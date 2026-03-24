using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using System.Net.Http.Json;

namespace DashyBoard.Infrastructure.External;

public sealed class CurrencyApiClient : ICurrencyApiClient
{
    private readonly HttpClient _http;

    public CurrencyApiClient(HttpClient http) => _http = http;

    public async Task<CurrencyResultDto> GetCurrencyChartAsync(
        string symbol,
        long startTimestamp,
        long endTimestamp,
        string interval,
        CancellationToken ct)
    {
        ValidateInput(symbol, startTimestamp, endTimestamp);

        var query = BuildQuery(symbol, startTimestamp, endTimestamp, interval);
        var response = await _http.GetFromJsonAsync<CurrencyResponseDto>(query, ct);

        return ExtractResult(response, symbol);
    }

    private static void ValidateInput(string symbol, long startTimestamp, long endTimestamp)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty.", nameof(symbol));

        if (startTimestamp >= endTimestamp)
            throw new ArgumentException("Start timestamp must be less than end timestamp.", nameof(startTimestamp));
    }

    private static string BuildQuery(string symbol, long startTimestamp, long endTimestamp, string interval) =>
        $"v8/finance/chart/{Uri.EscapeDataString(symbol)}" +
        $"?period1={startTimestamp}&period2={endTimestamp}&interval={Uri.EscapeDataString(interval)}";

    private static CurrencyResultDto ExtractResult(CurrencyResponseDto? response, string symbol)
    {
        if (response?.Chart.Error != null)
            throw new InvalidOperationException($"Currency API error: {response.Chart.Error}");

        if (response?.Chart.Result?.Count == 0)
            throw new InvalidOperationException($"No data found for symbol '{symbol}'.");

        return response!.Chart.Result[0];
    }
}
