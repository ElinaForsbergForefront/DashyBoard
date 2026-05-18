using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using DashyBoard.Domain.Models;
using MongoDB.Driver;

namespace DashyBoard.Infrastructure.Repositories;

public sealed class FavoriteCurrencyRepository : IFavoriteCurrencyRepository
{
    private readonly IMongoCollection<FavoriteCurrency> _collection;

    public FavoriteCurrencyRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<FavoriteCurrency>("user_favorite_currencies");
    }
    public async Task<FavoriteCurrencyDto> AddFavoriteAsync(string userId, string symbol, CancellationToken ct = default)
    {
        ValidateSymbol(symbol);

        var favorite = new FavoriteCurrency(userId, symbol);
        await _collection.InsertOneAsync(favorite, cancellationToken: ct);

        return MapToDto(favorite);
    }

    public async Task<int> GetFavoriteCountAsync(string userId, CancellationToken ct = default)
    {
        var filter = Builders<FavoriteCurrency>.Filter.Eq(fc => fc.UserId, userId);
        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: ct);
        return (int)count;
    }

    public async Task<List<FavoriteCurrencyDto>> GetUserFavoritesAsync(string userId, CancellationToken ct = default)
    {
        var filter = Builders<FavoriteCurrency>.Filter.Eq(fc => fc.UserId, userId);
        var sort = Builders<FavoriteCurrency>.Sort.Descending(fc => fc.AddedAt);

        var favorites = await _collection
            .Find(filter)
            .Sort(sort)
            .ToListAsync(ct);

        return favorites.ConvertAll(MapToDto);
    }

    public async Task<bool> IsFavoritedAsync(string userId, string symbol, CancellationToken ct = default)
    {
        ValidateSymbol(symbol);

        var filter = Builders<FavoriteCurrency>.Filter.And(
            Builders<FavoriteCurrency>.Filter.Eq(fc => fc.UserId, userId),
            Builders<FavoriteCurrency>.Filter.Eq(fc => fc.Symbol, symbol)
        );

        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: ct);
        return count > 0;
    }

    public async Task RemoveFavoriteAsync(string userId, string symbol, CancellationToken ct = default)
    {
        ValidateSymbol(symbol);

        var filter = Builders<FavoriteCurrency>.Filter.And(
            Builders<FavoriteCurrency>.Filter.Eq(fc => fc.UserId, userId),
            Builders<FavoriteCurrency>.Filter.Eq(fc => fc.Symbol, symbol)
            );

        await _collection.DeleteOneAsync(filter, cancellationToken: ct);
    }

    private static void ValidateSymbol(string symbol)
    {
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty.", nameof(symbol));
    }

    private static FavoriteCurrencyDto MapToDto(FavoriteCurrency favorite) =>
        new(favorite.Symbol, favorite.AddedAt);
}
