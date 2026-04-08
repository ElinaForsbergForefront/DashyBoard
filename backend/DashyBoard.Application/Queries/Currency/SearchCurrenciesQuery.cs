using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace DashyBoard.Application.Queries.Currency;

public sealed record SearchCurrenciesQuery(
    [Required]
    [MinLength(1)]
    string Query
) : IRequest<CurrencySearchDto>;
