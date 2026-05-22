import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateReminderMutation } from '../../api/endpoints/reminder';
import { DateTimePicker } from '../ui/DateTimePicker';
import { FormCard } from '../ui/form-card';

interface ReminderFormProps {
    onSuccess?: () => void;
}

export function ReminderForm({ onSuccess }: ReminderFormProps = {}) {
    const [title, setTitle] = useState('');
    const [dueAtLocal, setDueAtLocal] = useState('');
    const [note, setNote] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [createReminder, { isLoading }] = useCreateReminderMutation();

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);

        if (!title.trim() || !dueAtLocal) {
            setFeedback('Title and due date must be filled in.');
            return;
        }

        try {
            await createReminder({
                title: title.trim(),
                dueAtUtc: new Date(dueAtLocal).toISOString(),
                note: note.trim() || undefined,
            }).unwrap();

            setTitle('');
            setDueAtLocal('');
            setNote('');
            setFeedback('Reminder created.');
            onSuccess?.();
        } catch {
            setFeedback('Could not create the reminder. Check the API connection.');
        }
    };

    return (
        <FormCard onSubmit={onSubmit}>
            <p className="text-sm font-medium text-foreground">Form: Reminder</p>

            <label className="flex flex-col gap-1 text-xs text-muted">
                Title
                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex: Team meeting"
                    className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                    maxLength={120}
                />
            </label>

            <div className="flex flex-col gap-1 text-xs text-muted">
                When
                <DateTimePicker value={dueAtLocal} onChange={setDueAtLocal} />
            </div>

            <label className="flex flex-col gap-1 text-xs text-muted">
                Note (optional)
                <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ex: Bring numbers from last week"
                    className="min-h-20 resize-y rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                    maxLength={500}
                />
            </label>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {isLoading ? 'Creating...' : 'Create reminder'}
            </button>

            {feedback && <p className="text-xs text-muted">{feedback}</p>}
        </FormCard>
    );
}
