import { api } from '../apiSlice';
import type { AssetPriceDto, AssetTickersDto } from '../types/gold';

const goldApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getGoldTickers: builder.query<AssetTickersDto[], void>({
      query: () => '/gold/tickers',
      providesTags: [{ type: 'Gold', id: 'TICKERS' }],
    }),
    getGoldPrice: builder.query<AssetPriceDto, string>({
      query: (symbol) => `/gold/price/${symbol}`,
      providesTags: (_result, _error, symbol) => [{ type: 'Gold', id: symbol }],
    }),
  }),
});

export const { useGetGoldTickersQuery, useGetGoldPriceQuery } = goldApi;
