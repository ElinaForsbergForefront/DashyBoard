import { api } from '../apiSlice';
import type { WorldTimeDto, TimezoneDto } from '../types/worldTime';

const worldTimeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTimezones: builder.query<TimezoneDto[], void>({
      query: () => '/worldtime/timezones',
    }),
    getTime: builder.query<WorldTimeDto, string>({
      query: (timezone) => ({
        url: '/worldtime/time',
        params: { timezone },
      }),
    }),
  }),
});

export const { useGetTimezonesQuery, useGetTimeQuery } = worldTimeApi;
