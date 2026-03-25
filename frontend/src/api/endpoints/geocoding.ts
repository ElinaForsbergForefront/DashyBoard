import { api } from '../apiSlice';
import type { GeocodeResponseDto } from '../types/geocoding';

const geocodingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    geocodeAddress: builder.query<GeocodeResponseDto, string>({
      query: (address) => `/geocoding/${encodeURIComponent(address)}`,
      providesTags: (_result, _error, address) => [{ type: 'Geocoding', id: address }],
    }),
  }),
});

export const { useGeocodeAddressQuery } = geocodingApi;
