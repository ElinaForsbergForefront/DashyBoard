using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Commands.Currency;

public sealed class RemoveFavoriteCurrencyCommandHandler : IRequestHandler<RemoveFavoriteCurrencyCommand>
{
    private readonly IFavoriteCurrencyRepository _repository;

    public RemoveFavoriteCurrencyCommandHandler(IFavoriteCurrencyRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        RemoveFavoriteCurrencyCommand request,
        CancellationToken ct)
    {
        ValidateSymbol(request.Symbol);
        await _repository.RemoveFavoriteAsync(request.UserId, request.Symbol, ct);
    }

    private static void ValidateSymbol(string symbol)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty.", nameof(symbol));
    }
}