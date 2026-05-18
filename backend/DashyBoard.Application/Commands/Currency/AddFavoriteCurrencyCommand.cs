using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Currency;

public sealed record AddFavoriteCurrencyCommand(
    string UserId,
    string Symbol
) : IRequest<FavoriteCurrencyDto>;
