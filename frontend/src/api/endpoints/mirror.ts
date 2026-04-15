import { api } from '../apiSlice';
import type { MirrorDto, CreateMirrorRequest, UpdateMirrorRequest,   AddWidgetRequest,
  MoveWidgetRequest, } from '../types/mirror';

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
     addWidget: builder.mutation<
      MirrorDto,
      { mirrorId: string; body: AddWidgetRequest }
    >({
      query: ({ mirrorId, body }) => ({
        url: `/mirror/${mirrorId}/widget`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { mirrorId }) => [
        { type: 'Mirror', id: mirrorId },
        { type: 'Mirror', id: 'LIST' },
      ],
    }),

    moveWidget: builder.mutation<
      MirrorDto,
      { mirrorId: string; widgetId: string; body: MoveWidgetRequest }
    >({
      query: ({ mirrorId, widgetId, body }) => ({
        url: `/mirror/${mirrorId}/widget/${widgetId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { mirrorId }) => [
        { type: 'Mirror', id: mirrorId },
        { type: 'Mirror', id: 'LIST' },
      ],
    }),

    removeWidget: builder.mutation<
      MirrorDto,
      { mirrorId: string; widgetId: string }
    >({
      query: ({ mirrorId, widgetId }) => ({
        url: `/mirror/${mirrorId}/widget/${widgetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { mirrorId }) => [
        { type: 'Mirror', id: mirrorId },
        { type: 'Mirror', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyMirrorsQuery,
  useGetMirrorByIdQuery,
  useCreateMirrorMutation,
  useUpdateMirrorMutation,
  useDeleteMirrorMutation,
  useAddWidgetMutation,
  useMoveWidgetMutation,
  useRemoveWidgetMutation,
} = mirrorApi;
