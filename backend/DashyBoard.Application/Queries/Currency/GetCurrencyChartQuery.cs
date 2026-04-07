using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed record GetCurrencyChartQuery(
    string Symbol,
    DateTime StartUtc,
    DateTime EndUtc,
    string Interval = "1d"
) : IRequest<CurrencyChartDataDto>;