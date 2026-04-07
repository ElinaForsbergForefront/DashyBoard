using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Mappers.Currency;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using DashyBoard.Application.Utilities;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed class GetCurrencyChartQueryHandler : IRequestHandler<GetCurrencyChartQuery, CurrencyChartDataDto>
{
    private readonly ICurrencyApiClient _currencyClient;

    public GetCurrencyChartQueryHandler(ICurrencyApiClient currencyClient)
    {
        _currencyClient = currencyClient;
    }

    public async Task<CurrencyChartDataDto> Handle(GetCurrencyChartQuery request, CancellationToken ct)
    {
        ValidateDateRange(request.StartUtc, request.EndUtc);

        var startTimestamp = UnixTimestampConverter.ToUnixTimestamp(request.StartUtc);
        var endTimestamp = UnixTimestampConverter.ToUnixTimestamp(request.EndUtc);

        var raw = await _currencyClient.GetCurrencyChartAsync(
            request.Symbol,
            startTimestamp,
            endTimestamp,
            request.Interval,
            ct);

        return CurrencyChartMapper.ToCurrencyChartData(raw);
    }

    private static void ValidateDateRange(DateTime startUtc, DateTime endUtc)
    {
        if (startUtc.Kind != DateTimeKind.Utc || endUtc.Kind != DateTimeKind.Utc)
            throw new ArgumentException("Both dates must be UTC.");

        if (startUtc >= endUtc)
            throw new ArgumentException("Start date must be before end date.");
    }
}