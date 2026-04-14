import { api } from '../apiSlice';
import type { SpotifyLoginUrlDto, SpotifyNowPlayingDto } from '../types/spotify';

export const spotifyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpotifyNowPlaying: builder.query<SpotifyNowPlayingDto | null, void>({
      query: () => '/spotify/now-playing',
      transformResponse: (response: SpotifyNowPlayingDto) => response,
      transformErrorResponse: (response) => {
        if (response.status === 204) {
          return { status: 204 };
        }

        return response;
      },
    }),

    getSpotifyLoginUrl: builder.query<SpotifyLoginUrlDto, void>({
      query: () => '/spotify/login-url',
    }),
  }),
});

export const {
  useGetSpotifyNowPlayingQuery,
  useLazyGetSpotifyLoginUrlQuery,
} = spotifyApi;