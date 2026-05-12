export interface SpotifyNowPlayingDto {
  trackName: string;
  artistName: string;
  albumName: string;
  albumImageUrl: string;
  isPlaying: boolean;
  spotifyUrl: string | null;
  progressMs: number;
  durationMs: number;
}

export interface SpotifyLoginUrlDto {
  url: string;
}