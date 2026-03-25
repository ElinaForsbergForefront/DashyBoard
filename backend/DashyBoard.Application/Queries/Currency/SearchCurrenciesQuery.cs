using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed record SearchCurrenciesQuery(
    string Query
) : IRequest<CurrencySearchDto>;
