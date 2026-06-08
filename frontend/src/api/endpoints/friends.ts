import { api } from '../apiSlice';
import type { UserRelationDto } from '../types/userRelation';
import type { PokeDto, SentPokeDto } from '../types/poke';

const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFriendRequests: builder.query<UserRelationDto[], void>({
      query: () => '/friends/requests',
      providesTags: [{ type: 'FriendRequests', id: 'LIST' }],
    }),
    sendFriendRequest: builder.mutation<string, string>({
      query: (username) => ({ url: `/friends/request/${encodeURIComponent(username)}`, method: 'POST' }),
      invalidatesTags: [{ type: 'FriendRequests', id: 'LIST' }, { type: 'FriendRequests', id: 'SENT' }, { type: 'Friends', id: 'LIST' }],
    }),
    acceptFriendRequest: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/accept/${encodeURIComponent(username)}`, method: 'POST' }),
      invalidatesTags: [{ type: 'FriendRequests', id: 'LIST' }, { type: 'Friends', id: 'LIST' }],
    }),
    rejectFriendRequest: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/reject/${encodeURIComponent(username)}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'FriendRequests', id: 'LIST' }],
    }),
    getFriendList: builder.query<UserRelationDto[], void>({
      query: () => '/friends/list',
      providesTags: [{ type: 'Friends', id: 'LIST' }],
    }),
    getFriend: builder.query<UserRelationDto, string>({
      query: (username) => `/friends/${encodeURIComponent(username)}`,
      providesTags: (_result, _error, username) => [{ type: 'Friends', id: username }],
    }),
    removeFriend: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/${encodeURIComponent(username)}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Friends', id: 'LIST' }],
    }),
    blockUser: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/block/${encodeURIComponent(username)}`, method: 'POST' }),
      invalidatesTags: [{ type: 'Friends', id: 'LIST' }, { type: 'Blocked', id: 'LIST' }],
    }),
    unblockUser: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/unblock/${encodeURIComponent(username)}`, method: 'POST' }),
      invalidatesTags: [{ type: 'Blocked', id: 'LIST' }],
    }),
    getBlockedUsers: builder.query<UserRelationDto[], void>({
      query: () => '/friends/blocked',
      providesTags: [{ type: 'Blocked', id: 'LIST' }],
    }),
    sendPoke: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/poke/${encodeURIComponent(username)}`, method: 'POST' }),
      invalidatesTags: [{ type: 'Pokes', id: 'LIST' }, { type: 'Pokes', id: 'SENT' }],
    }),
    getPokes: builder.query<PokeDto[], void>({
      query: () => '/friends/pokes',
      providesTags: [{ type: 'Pokes', id: 'LIST' }],
    }),
    getSentPokes: builder.query<SentPokeDto[], void>({
      query: () => '/friends/pokes/sent',
      providesTags: [{ type: 'Pokes', id: 'SENT' }],
    }),
    markPokeAsSeen: builder.mutation<void, string>({
      query: (pokeId) => ({ url: `/friends/pokes/${pokeId}/seen`, method: 'POST' }),
      invalidatesTags: [{ type: 'Pokes', id: 'LIST' }],
    }),
    dismissPoke: builder.mutation<void, string>({
      query: (pokeId) => ({ url: `/friends/pokes/${pokeId}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Pokes', id: 'LIST' }, { type: 'Pokes', id: 'SENT' }],
    }),
    getSentFriendRequests: builder.query<UserRelationDto[], void>({
      query: () => '/friends/requests/sent',
      providesTags: [{ type: 'FriendRequests', id: 'SENT' }],
    }),
    cancelFriendRequest: builder.mutation<void, string>({
      query: (username) => ({ url: `/friends/withdraw/${encodeURIComponent(username)}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'FriendRequests', id: 'SENT' }],
    }),
  }),
});

export const {
  useGetFriendRequestsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useGetFriendListQuery,
  useGetFriendQuery,
  useRemoveFriendMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetBlockedUsersQuery,
  useSendPokeMutation,
  useGetPokesQuery,
  useGetSentPokesQuery,
  useMarkPokeAsSeenMutation,
  useDismissPokeMutation,
  useGetSentFriendRequestsQuery,
  useCancelFriendRequestMutation,
} = friendsApi;