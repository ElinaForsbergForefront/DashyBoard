namespace DashyBoard.Application.Interfaces
{
    public interface ISpotifyTokenClient
    {
        Task<SpotifyTokenResponse> ExchangeCodeAsync(string code, CancellationToken cancellationToken);
        Task<SpotifyTokenResponse> RefreshAsync(string refreshToken, CancellationToken cancellationToken);
    }

    public sealed class SpotifyTokenResponse
    {
        public string AccessToken { get; init; } = string.Empty;
        public string TokenType { get; init; } = string.Empty;
        public int ExpiresIn { get; init; }
        public string? RefreshToken { get; init; }
        public string? Scope { get; init; }
    }
}