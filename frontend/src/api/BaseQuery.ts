import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

type GetAccessTokenSilently = (options?: {
  authorizationParams?: { audience?: string };
}) => Promise<string>;

let _getAccessTokenSilently: GetAccessTokenSilently | null = null;

export const injectGetAccessTokenSilently = (fn: GetAccessTokenSilently): void => {
  _getAccessTokenSilently = fn;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
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
        ? { url: args, headers: { Authorization: `Bearer ${token}` } }
        : { ...args, headers: { ...args.headers, Authorization: `Bearer ${token}` } };

    return rawBaseQuery(modifiedArgs, api, extraOptions);
  }

  return rawBaseQuery(args, api, extraOptions);
};
