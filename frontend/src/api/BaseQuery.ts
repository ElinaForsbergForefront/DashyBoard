import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getApiAccessToken } from './authTokenAccessor';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const token = await getApiAccessToken();

  const modifiedArgs: FetchArgs =
    typeof args === 'string'
      ? { url: args, headers: { ...defaultHeaders, Authorization: `Bearer ${token}` } }
      : {
          ...args,
          headers: { ...defaultHeaders, ...args.headers, Authorization: `Bearer ${token}` },
        };

  return rawBaseQuery(modifiedArgs, api, extraOptions);
};
