import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

type GetAccessTokenSilently = (options?: {
  authorizationParams?: { audience?: string };
}) => Promise<string>;

let _getAccessTokenSilently: GetAccessTokenSilently | null = null;

export const injectGetAccessTokenSilently = (fn: GetAccessTokenSilently): void => {
  _getAccessTokenSilently = fn;
};

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
  if (_getAccessTokenSilently) {
    const token = await _getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const modifiedArgs: FetchArgs =
      typeof args === 'string'
        ? { url: args, headers: { ...defaultHeaders, Authorization: `Bearer ${token}` } }
        : { ...args, headers: { ...defaultHeaders, ...args.headers, Authorization: `Bearer ${token}` } };

    return rawBaseQuery(modifiedArgs, api, extraOptions);
  }

  return rawBaseQuery(args, api, extraOptions);
};
