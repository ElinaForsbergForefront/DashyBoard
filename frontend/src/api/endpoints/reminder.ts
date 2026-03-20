import { api } from '../apiSlice';
import type { CompleteReminderCommand, CreateReminderCommand, DeleteReminderCommand, ReminderDto, UncompleteReminderCommand, UpdateReminderCommand } from '../types/reminder';

const reminderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<ReminderDto[], void>({
      query: () => '/reminders/me',
      providesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    createReminder: builder.mutation<ReminderDto, CreateReminderCommand>({
      query: (body) => ({ url: '/reminders/create', method: 'POST', body }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    updateReminder: builder.mutation<ReminderDto, UpdateReminderCommand>({
      query: ({ id, ...body }) => ({ url: `/reminders/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    completeReminder: builder.mutation<void, CompleteReminderCommand>({
      query: ({ id }) => ({ url: `/reminders/${id}/complete`, method: 'POST' }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    deleteReminder: builder.mutation<void, DeleteReminderCommand>({
      query: ({ id }) => ({ url: `/reminders/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
    uncompleteReminder: builder.mutation<void, UncompleteReminderCommand>({
      query: ({ id }) => ({ url: `/reminders/${id}/uncomplete`, method: 'POST' }),
      invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],
    }),
  }),
});

export const {
    useGetRemindersQuery,
    useCreateReminderMutation,
    useUpdateReminderMutation,
    useCompleteReminderMutation,
    useDeleteReminderMutation,
    useUncompleteReminderMutation,
} = reminderApi;