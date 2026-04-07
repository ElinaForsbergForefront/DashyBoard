using System.Text.Json.Serialization;

namespace DashyBoard.Application.Queries.Currency.Dto;

public sealed record CurrencySearchDto(
    [property: JsonPropertyName("count")]
    int Count,

    [property: JsonPropertyName("quotes")]
    List<CurrencySearchQuoteDto> Quotes
);

public sealed record CurrencySearchQuoteDto(
    [property: JsonPropertyName("symbol")]
    string Symbol,
    
    [property: JsonPropertyName("shortname")]
    string ShortName,
    
    [property: JsonPropertyName("quoteType")]
    string QuoteType,
    
    [property: JsonPropertyName("exchange")]
    string? Exchange,
    
    [property: JsonPropertyName("logoUrl")]
    string? LogoUrl
);
