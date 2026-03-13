import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './BaseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Gold', 'WorldTime', 'Mirror'],
  endpoints: () => ({}),
});
