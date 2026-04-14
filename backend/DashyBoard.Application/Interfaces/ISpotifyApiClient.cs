using DashyBoard.Application.Queries.Spotify.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface ISpotifyApiClient
    {
        Task<SpotifyNowPlayingDto?> GetNowPlayingAsync(Guid userId, CancellationToken cancellationToken);
    }
}