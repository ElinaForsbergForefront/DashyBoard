import { api } from '../apiSlice';
import type {
  CurrencyChartDataDto,
  CurrencySearchDto,
  GetCurrencyChartParams,
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
  }),
});

export const { useGetCurrencyChartQuery, useLazySearchCurrenciesQuery } = currencyApi;
