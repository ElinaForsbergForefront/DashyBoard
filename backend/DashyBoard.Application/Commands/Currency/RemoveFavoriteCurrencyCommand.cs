using MediatR;

namespace DashyBoard.Application.Commands.Currency;

public sealed record RemoveFavoriteCurrencyCommand(
    string UserId,
    string Symbol
) : IRequest;