using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Currency.Dto;

public sealed record CurrencyResponseDto(
    [property: JsonPropertyName("chart")]
    CurrencyChartDto Chart
);

public sealed record CurrencyChartDto(
    [property: JsonPropertyName("result")]
    List<CurrencyResultDto> Result,

    [property: JsonPropertyName("error")]
    object? Error
);

public sealed record CurrencyResultDto(
    [property: JsonPropertyName("meta")]
    CurrencyMetaDto Meta,

    [property: JsonPropertyName("timestamp")]
    List<long> Timestamp,

    [property: JsonPropertyName("indicators")]
    CurrencyIndicatorsDto Indicators
);

public sealed record CurrencyMetaDto(
    [property: JsonPropertyName("currency")]
    string Currency,

    [property: JsonPropertyName("symbol")]
    string Symbol,

    [property: JsonPropertyName("instrumentType")]
    string InstrumentType,

    [property: JsonPropertyName("longName")]
    string LongName,

    [property: JsonPropertyName("timezone")]
    string TimeZone
);


public sealed record CurrencyIndicatorsDto(
    [property: JsonPropertyName("quote")]
    List<CurrencyQuoteDto> Quote
);

public sealed record CurrencyQuoteDto(
    [property: JsonPropertyName("open")]
    List<double?> Open,

    [property: JsonPropertyName("close")]
    List<double?> Close,

    [property: JsonPropertyName("low")]
    List<double?> Low,

    [property: JsonPropertyName("high")]
    List<double?> High
);

public sealed record CurrencyChartDataDto(
    string Symbol,
    string Currency,
    string AssetName,
    List<CurrencyPricePointDto> PriceHistory
);

public sealed record CurrencyPricePointDto(
    long Timestamp,
    double Open,
    double Close,
    double Low,
    double High
);