import { api } from '../apiSlice';
import type { CreateReminderCommand, ReminderDto } from '../types/reminder';

const reminderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getReminders: builder.query<ReminderDto[], void>({
            query: () => '/reminders',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Reminder' as const, id })), { type: 'Reminder', id: 'LIST' }]
                    : [{ type: 'Reminder', id: 'LIST' }],
        }),     
        createReminder: builder.mutation<ReminderDto, CreateReminderCommand>({
            query: (body) => ({ url: '/reminders', method: 'POST', body }),
            invalidatesTags: [{ type: 'Reminder', id: 'LIST' }],    
        }),
    }),
});

export const { useGetRemindersQuery, useCreateReminderMutation } = reminderApi;