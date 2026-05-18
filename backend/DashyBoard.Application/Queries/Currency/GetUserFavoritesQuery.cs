using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed record GetUserFavoritesQuery(
    string UserId
) : IRequest<List<FavoriteCurrencyDto>>;