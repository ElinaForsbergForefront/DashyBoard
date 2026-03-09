import { api } from '../apiSlice';
import type { UpdateUserByIdCommand, UpdateUserBySubCommand, UserDto } from '../types/users';

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserDto, void>({
      query: () => '/User/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
    getUserProfile: builder.query<UserDto, string>({
      query: (userId) => `/User/profile/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    updateCurrentUser: builder.mutation<UserDto, UpdateUserBySubCommand>({
      query: (body) => ({ url: `/User/me`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
    deleteCurrentUser: builder.mutation<void, void>({
      query: () => ({ url: `/User/me`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User' }],
    }),
    updateUserById: builder.mutation<UserDto, UpdateUserByIdCommand>({
      query: ({ id, ...body }) => ({ url: `/User/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
    }),
    deleteUserById: builder.mutation<void, string>({
      query: (id) => ({ url: `/User/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useUpdateCurrentUserMutation,
  useDeleteCurrentUserMutation,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} = userApi;
