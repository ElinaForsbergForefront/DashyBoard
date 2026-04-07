import { api } from '../apiSlice';
import type { countryDto, CityDto } from '../types/location';

const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<countryDto[], void>({
      query: () => '/location/countries',
      providesTags: ['Countries'],
    }),
    getCountryByName: builder.query<countryDto, string>({
      query: (countryName) => `/location/Country/${encodeURIComponent(countryName)}`,
      providesTags: (_result, _error, countryName) => [{ type: 'Countries', id: countryName }],
    }),
    getCities: builder.query<CityDto[], { cityName: string; countryCode: string }>({
      query: ({ cityName, countryCode }) => ({
        url: '/location/city',
        params: { cityName, countryCode },
      }),
      providesTags: (_result, _error, { countryCode, cityName }) => [
        { type: 'Cities', id: `${countryCode}:${cityName}` },
      ],
    }),
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountryByNameQuery,
  useGetCitiesQuery,
  useLazyGetCountryByNameQuery,
  useLazyGetCitiesQuery,
} = locationApi;
