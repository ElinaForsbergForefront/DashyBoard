import { api } from '../apiSlice';
import type { MirrorDto, CreateMirrorRequest, UpdateMirrorRequest } from '../types/mirror';

const mirrorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyMirrors: builder.query<MirrorDto[], void>({
      query: () => '/mirror',
      providesTags: [{ type: 'Mirror', id: 'LIST' }],
    }),
    getMirrorById: builder.query<MirrorDto, string>({
      query: (id) => `/mirror/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Mirror', id }],
    }),
    createMirror: builder.mutation<MirrorDto, CreateMirrorRequest>({
      query: (body) => ({ url: '/mirror', method: 'POST', body }),
      invalidatesTags: [{ type: 'Mirror', id: 'LIST' }],
    }),
    updateMirror: builder.mutation<MirrorDto, { id: string } & UpdateMirrorRequest>({
      query: ({ id, ...body }) => ({ url: `/mirror/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Mirror', id },
        { type: 'Mirror', id: 'LIST' },
      ],
    }),
    deleteMirror: builder.mutation<void, string>({
      query: (id) => ({ url: `/mirror/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Mirror', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMyMirrorsQuery,
  useGetMirrorByIdQuery,
  useCreateMirrorMutation,
  useUpdateMirrorMutation,
  useDeleteMirrorMutation,
} = mirrorApi;
