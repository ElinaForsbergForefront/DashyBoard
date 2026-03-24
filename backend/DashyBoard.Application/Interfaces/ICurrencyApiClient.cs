using DashyBoard.Application.Queries.Currency.Dto;

namespace DashyBoard.Application.Interfaces;

public interface ICurrencyApiClient
{
    Task<CurrencyResultDto> GetCurrencyChartAsync(
        string symbol,
        long startTimestamp,
        long endTimestamp,
        string interval,
        CancellationToken ct);
}
