using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Commands.Currency;

public sealed class AddFavoriteCurrencyCommandHandler : IRequestHandler<AddFavoriteCurrencyCommand, FavoriteCurrencyDto>
{
    private readonly IFavoriteCurrencyRepository _repository;
    private const int MaxFavorites = 5;

    public AddFavoriteCurrencyCommandHandler(IFavoriteCurrencyRepository repository)
    {
        _repository = repository;
    }

    public async Task<FavoriteCurrencyDto> Handle(
        AddFavoriteCurrencyCommand request,
        CancellationToken ct)
    {
        ValidateSymbol(request.Symbol);

        var isAlreadyFavorited = await _repository.IsFavoritedAsync(
            request.UserId,
            request.Symbol,
            ct);

        if (isAlreadyFavorited)
            throw new InvalidOperationException($"Currency '{request.Symbol}' is already favorited.");

        var count = await _repository.GetFavoriteCountAsync(request.UserId, ct);

        if (count >= MaxFavorites)
            throw new InvalidOperationException($"User has reached maximum of {MaxFavorites} favorites.");

        return await _repository.AddFavoriteAsync(request.UserId, request.Symbol, ct);
    }

    private static void ValidateSymbol(string symbol)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty.", nameof(symbol));
    }
}
