using DashyBoard.Application.Interfaces;
using DashyBoard.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DashyBoard.Infrastructure.Clients
{
    public sealed class SpotifyTokenClient : ISpotifyTokenClient
    {
        private readonly HttpClient _httpClient;
        private readonly SpotifyOptions _options;

        public SpotifyTokenClient(HttpClient httpClient, IOptions<SpotifyOptions> options)
        {
            _httpClient = httpClient;
            _options = options.Value;
        }

        public async Task<SpotifyTokenResponse> ExchangeCodeAsync(string code, CancellationToken cancellationToken)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");

            var credentials = $"{_options.ClientId}:{_options.ClientSecret}";
            var base64Credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(credentials));

            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", base64Credentials);

            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["redirect_uri"] = _options.RedirectUri
            });

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Spotify token exchange failed: {content}");
            }

            var result = JsonSerializer.Deserialize<SpotifyTokenResponseDto>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result is null || string.IsNullOrWhiteSpace(result.AccessToken))
            {
                throw new InvalidOperationException($"Could not deserialize Spotify token response. Body: {content}");
            }

            return new SpotifyTokenResponse
            {
                AccessToken = result.AccessToken,
                TokenType = result.TokenType,
                ExpiresIn = result.ExpiresIn,
                RefreshToken = result.RefreshToken,
                Scope = result.Scope
            };
        }

        public async Task<SpotifyTokenResponse> RefreshAsync(string refreshToken, CancellationToken cancellationToken)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");

            var credentials = $"{_options.ClientId}:{_options.ClientSecret}";
            var base64Credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes(credentials));

            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", base64Credentials);

            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "refresh_token",
                ["refresh_token"] = refreshToken
            });

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Spotify token refresh failed: {content}");
            }

            var result = JsonSerializer.Deserialize<SpotifyTokenResponseDto>(
                content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result is null || string.IsNullOrWhiteSpace(result.AccessToken))
            {
                throw new InvalidOperationException($"Could not deserialize Spotify refresh response. Body: {content}");
            }

            return new SpotifyTokenResponse
            {
                AccessToken = result.AccessToken,
                TokenType = result.TokenType,
                ExpiresIn = result.ExpiresIn,
                RefreshToken = result.RefreshToken,
                Scope = result.Scope
            };
        }



        private sealed class SpotifyTokenResponseDto
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; init; } = string.Empty;

        [JsonPropertyName("token_type")]
        public string TokenType { get; init; } = string.Empty;

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; init; }

        [JsonPropertyName("refresh_token")]
        public string? RefreshToken { get; init; }

        [JsonPropertyName("scope")]
        public string? Scope { get; init; }
    }
}
}