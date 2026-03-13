import { api } from '../apiSlice';
import type { UpdateUserByIdCommand, UpdateUserBySubCommand, UserDto } from '../types/users';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserDto, void>({
      query: () => '/user/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
    getUserProfile: builder.query<UserDto, string>({
      query: (userId) => `/user/profile/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    checkUsername: builder.query<boolean, string>({
      query: (username) => `/user/check-username?username=${encodeURIComponent(username)}`,
    }),
    updateCurrentUser: builder.mutation<UserDto, UpdateUserBySubCommand>({
      query: (body) => ({ url: `/user/me`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    deleteCurrentUser: builder.mutation<void, void>({
      query: () => ({ url: `/user/me`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User' }],
    }),
    updateUserById: builder.mutation<UserDto, UpdateUserByIdCommand>({
      query: ({ id, ...body }) => ({ url: `/user/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({ url: `/user/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useLazyCheckUsernameQuery,
  useUpdateCurrentUserMutation,
  useDeleteCurrentUserMutation,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;
