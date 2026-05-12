using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Spotify.Dto;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DashyBoard.Infrastructure.Clients
{
    public sealed class SpotifyApiClient : ISpotifyApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly ISpotifyConnectionRepository _spotifyConnectionRepository;
        private readonly ISpotifyTokenClient _spotifyTokenClient;

        public SpotifyApiClient(
            HttpClient httpClient,
            ISpotifyConnectionRepository spotifyConnectionRepository,
            ISpotifyTokenClient spotifyTokenClient)
        {
            _httpClient = httpClient;
            _spotifyConnectionRepository = spotifyConnectionRepository;
            _spotifyTokenClient = spotifyTokenClient;
        }

        public async Task<SpotifyNowPlayingDto?> GetNowPlayingAsync(Guid userId, CancellationToken cancellationToken)
        {
            var connection = await _spotifyConnectionRepository.GetByUserIdAsync(userId, cancellationToken);
            if (connection is null)
            {
                return null;
            }

            var accessToken = await GetValidAccessTokenAsync(connection, cancellationToken);

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                "https://api.spotify.com/v1/me/player/currently-playing");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using var response = await _httpClient.SendAsync(request, cancellationToken);

            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                return null;
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Spotify now-playing request failed: {content}");
            }

            var payload = JsonSerializer.Deserialize<SpotifyNowPlayingResponse>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (payload?.Item is null)
            {
                return null;
            }

            var artistNames = payload.Item.Artists is { Length: > 0 }
                ? string.Join(", ", payload.Item.Artists.Select(a => a.Name))
                : string.Empty;

            var imageUrl = payload.Item.Album.Images?
                .OrderByDescending(x => x.Width ?? 0)
                .FirstOrDefault()?.Url ?? string.Empty;

            var spotifyUrl = payload.Item.ExternalUrls?.TryGetValue("spotify", out var url) == true
                ? url
                : null;

            return new SpotifyNowPlayingDto
            {
                TrackName = payload.Item.Name,
                ArtistName = artistNames,
                AlbumName = payload.Item.Album.Name,
                AlbumImageUrl = imageUrl,
                IsPlaying = payload.IsPlaying,
                SpotifyUrl = spotifyUrl,
                ProgressMs = payload.ProgressMs,
                DurationMs = payload.Item.DurationMs
            };
        }

        private async Task<string> GetValidAccessTokenAsync(
            Domain.Models.SpotifyConnection connection,
            CancellationToken cancellationToken)
        {
            var threshold = DateTime.UtcNow.AddMinutes(1);

            if (connection.ExpiresAtUtc > threshold)
            {
                return connection.AccessToken;
            }

            // Retry up to 3 times in case of concurrent updates
            for (int attempt = 0; attempt < 3; attempt++)
            {
                try
                {
                    // Re-fetch from DB to get latest state
                    var latestConnection = await _spotifyConnectionRepository
                        .GetByUserIdAsync(connection.UserId, cancellationToken);

                    if (latestConnection is null)
                    {
                        throw new InvalidOperationException("Spotify connection not found");
                    }

                    // Check if another request already refreshed it
                    if (latestConnection.ExpiresAtUtc > threshold)
                    {
                        return latestConnection.AccessToken;
                    }

                    var refreshed = await _spotifyTokenClient.RefreshAsync(
                        latestConnection.RefreshToken, 
                        cancellationToken);

                    latestConnection.UpdateTokens(
                        refreshed.AccessToken,
                        refreshed.RefreshToken,
                        DateTime.UtcNow.AddSeconds(refreshed.ExpiresIn));

                    _spotifyConnectionRepository.Update(latestConnection);
                    await _spotifyConnectionRepository.SaveChangesAsync(cancellationToken);

                    return latestConnection.AccessToken;
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Another request updated the token - retry with fresh data
                    if (attempt == 2) throw; // Last attempt failed
                    await Task.Delay(50 * (attempt + 1), cancellationToken); // Exponential backoff
                }
            }

            throw new InvalidOperationException("Failed to refresh Spotify token after retries");
        }

        private sealed class SpotifyNowPlayingResponse
        {
            [JsonPropertyName("is_playing")]
            public bool IsPlaying { get; init; }

            [JsonPropertyName("progress_ms")]
            public int ProgressMs { get; init; }

            [JsonPropertyName("item")]
            public SpotifyTrackDto? Item { get; init; }
        }

        private sealed class SpotifyTrackDto
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("duration_ms")]
            public int DurationMs { get; init; }

            [JsonPropertyName("album")]
            public SpotifyAlbumDto Album { get; init; } = new();

            [JsonPropertyName("artists")]
            public SpotifyArtistDto[] Artists { get; init; } = Array.Empty<SpotifyArtistDto>();

            [JsonPropertyName("external_urls")]
            public Dictionary<string, string>? ExternalUrls { get; init; }
        }

        private sealed class SpotifyAlbumDto
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;

            [JsonPropertyName("images")]
            public SpotifyImageDto[] Images { get; init; } = Array.Empty<SpotifyImageDto>();
        }

        private sealed class SpotifyArtistDto
        {
            [JsonPropertyName("name")]
            public string Name { get; init; } = string.Empty;
        }

        private sealed class SpotifyImageDto
        {
            [JsonPropertyName("url")]
            public string Url { get; init; } = string.Empty;

            [JsonPropertyName("width")]
            public int? Width { get; init; }

            [JsonPropertyName("height")]
            public int? Height { get; init; }
        }
    }
}