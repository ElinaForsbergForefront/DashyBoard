import { api } from '../apiSlice';
import type {
  CurrencyChartDataDto,
  CurrencySearchDto,
  GetCurrencyChartParams,
  FavoriteCurrencyDto,
  CheckFavoritedResponse,
} from '../types/currency';

const currencyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrencyChart: builder.query<CurrencyChartDataDto, GetCurrencyChartParams>({
      query: ({ symbol, start, end, interval }) => ({
        url: `/currency/chart/${encodeURIComponent(symbol)}`,
        params: Object.fromEntries(
          Object.entries({ start, end, interval }).filter(([, v]) => v !== undefined),
        ),
      }),
      providesTags: (_result, _error, { symbol }) => [{ type: 'Currency', id: symbol }],
    }),
    searchCurrencies: builder.query<CurrencySearchDto, string>({
      query: (q) => `/currency/search?q=${encodeURIComponent(q)}`,
    }),
    getUserFavorites: builder.query<FavoriteCurrencyDto[], void>({
      query: () => '/currency/favorites',
      providesTags: ['FavoriteCurrency'],
    }),
    checkIfFavorited: builder.query<CheckFavoritedResponse, string>({
      query: (symbol) => `/currency/favorites/${encodeURIComponent(symbol)}/check`,
    }),
    addFavoriteCurrency: builder.mutation<FavoriteCurrencyDto, string>({
      query: (symbol) => ({
        url: `/currency/favorites/${encodeURIComponent(symbol)}`,
        method: 'POST',
      }),
      invalidatesTags: ['FavoriteCurrency'],
    }),
    removeFavoriteCurrency: builder.mutation<void, string>({
      query: (symbol) => ({
        url: `/currency/favorites/${encodeURIComponent(symbol)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FavoriteCurrency'],
    }),
  }),
});

export const {
  useGetCurrencyChartQuery,
  useLazySearchCurrenciesQuery,
  useGetUserFavoritesQuery,
  useCheckIfFavoritedQuery,
  useAddFavoriteCurrencyMutation,
  useRemoveFavoriteCurrencyMutation,
} = currencyApi;
