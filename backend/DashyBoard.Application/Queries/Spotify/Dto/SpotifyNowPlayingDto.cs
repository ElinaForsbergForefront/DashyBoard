namespace DashyBoard.Application.Queries.Spotify.Dto
{
    public sealed class SpotifyNowPlayingDto
    {
        public string TrackName { get; init; } = string.Empty;
        public string ArtistName { get; init; } = string.Empty;
        public string AlbumName { get; init; } = string.Empty;
        public string AlbumImageUrl { get; init; } = string.Empty;
        public bool IsPlaying { get; init; }
        public string? SpotifyUrl { get; init; }
        public int ProgressMs { get; init; }
        public int DurationMs { get; init; }
    }
}
