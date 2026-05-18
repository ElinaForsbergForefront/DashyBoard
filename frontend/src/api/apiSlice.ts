import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './BaseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Gold',
    'WorldTime',
    'Mirror',
    'Reminder',
    'Geocoding',
    'Countries',
    'Cities',
    'Currency',
    'FavoriteCurrency',
    'Traffic',
    'Weather',
    'FriendRequests',
    'Friends',
    'Blocked',
    'Pokes',
  ],
  endpoints: () => ({}),
});
