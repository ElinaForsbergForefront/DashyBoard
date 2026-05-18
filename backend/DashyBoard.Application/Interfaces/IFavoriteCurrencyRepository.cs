using DashyBoard.Application.Queries.Currency.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IFavoriteCurrencyRepository
{
    Task<FavoriteCurrencyDto> AddFavoriteAsync(string userId, string symbol, CancellationToken ct = default);
    Task RemoveFavoriteAsync(string userId, string symbol, CancellationToken ct = default);
    Task<List<FavoriteCurrencyDto>> GetUserFavoritesAsync(string userId, CancellationToken ct = default);
    Task<bool> IsFavoritedAsync(string userId, string symbol, CancellationToken ct = default);
    Task<int> GetFavoriteCountAsync(string userId, CancellationToken ct = default);
}
