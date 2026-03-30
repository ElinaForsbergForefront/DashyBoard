using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed class SearchCurrenciesQueryHandler : IRequestHandler<SearchCurrenciesQuery, CurrencySearchDto>
{
    private readonly ICurrencyApiClient _currencyClient;

    public SearchCurrenciesQueryHandler(ICurrencyApiClient currencyClient)
    {
        _currencyClient = currencyClient;
    }

    public async Task<CurrencySearchDto> Handle(SearchCurrenciesQuery request, CancellationToken ct)
    {
        ValidateQuery(request.Query);

        return await _currencyClient.SearchCurrenciesAsync(request.Query, ct);
    }

    private static void ValidateQuery(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            throw new ArgumentException("Search query cannot be empty.", nameof(query));
    }
}
