using DashyBoard.Application.Queries.Currency.Dto;

namespace DashyBoard.Application.Mappers.Currency;

public static class CurrencyChartMapper
{
    public static CurrencyChartDataDto ToCurrencyChartData(CurrencyResultDto raw)
    {
        ArgumentNullException.ThrowIfNull(raw);
        
        if (raw.Indicators?.Quote?.Count == 0)
            throw new InvalidOperationException("No quote data in response.");

        var quote = raw.Indicators.Quote[0];

        var priceHistory = BuildPriceHistory(raw.Timestamp, quote);

        return new CurrencyChartDataDto(
            Symbol: raw.Meta.Symbol,
            Currency: raw.Meta.Currency,
            AssetName: raw.Meta.LongName,
            PriceHistory: priceHistory
        );
    }

    private static List<CurrencyPricePointDto> BuildPriceHistory(List<long> timestamps, CurrencyQuoteDto quote)
    {
        var points = new List<CurrencyPricePointDto>(timestamps.Count);

        for (int i = 0; i < timestamps.Count; i++)
        {
            if (!HasCompleteQuoteData(quote, i))
                continue;

            points.Add(new CurrencyPricePointDto(
                Timestamp: timestamps[i],
                Open: quote.Open![i]!.Value,
                Close: quote.Close![i]!.Value,
                Low: quote.Low![i]!.Value,
                High: quote.High![i]!.Value
            ));
        }

        return points;
    }

    private static bool HasCompleteQuoteData(CurrencyQuoteDto quote, int index) =>
        quote.Open is not null &&
        quote.Close is not null &&
        quote.Low is not null &&
        quote.High is not null &&
        index < quote.Open.Count &&
        index < quote.Close.Count &&
        index < quote.Low.Count &&
        index < quote.High.Count &&
        quote.Open[index].HasValue &&
        quote.Close[index].HasValue &&
        quote.Low[index].HasValue &&
        quote.High[index].HasValue;
}
