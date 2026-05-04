using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Spotify.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Spotify
{
    public sealed class GetSpotifyNowPlayingQueryHandler
        : IRequestHandler<GetSpotifyNowPlayingQuery, SpotifyNowPlayingDto?>
    {
        private readonly ISpotifyApiClient _spotifyApiClient;

        public GetSpotifyNowPlayingQueryHandler(ISpotifyApiClient spotifyApiClient)
        {
            _spotifyApiClient = spotifyApiClient;
        }

        public async Task<SpotifyNowPlayingDto?> Handle(
            GetSpotifyNowPlayingQuery request,
            CancellationToken cancellationToken)
        {
            return await _spotifyApiClient.GetNowPlayingAsync(request.UserId, cancellationToken);
        }
    }
}