using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed record CheckIfFavoritedQuery(
    string UserId,
    string Symbol
) : IRequest<bool>;