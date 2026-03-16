import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateReminderMutation } from '../../api/endpoints/reminder';
import { DateTimePicker } from '../ui/DateTimePicker';

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
            setFeedback('Titel och tidpunkt måste fyllas i.');
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
            setFeedback('Påminnelsen skapades.');
            onSuccess?.();
        } catch {
            setFeedback('Kunde inte skapa påminnelsen. Kontrollera API-anslutningen.');
        }
    };

    return (
        <form onSubmit={onSubmit} className="rounded-lg border border-border bg-surface p-3 space-y-3">
            <p className="text-sm font-medium text-foreground">Formulär: Reminder</p>

            <label className="flex flex-col gap-1 text-xs text-muted">
                Titel
                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex: Teammöte"
                    className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                    maxLength={120}
                />
            </label>

            <div className="flex flex-col gap-1 text-xs text-muted">
                När
                <DateTimePicker value={dueAtLocal} onChange={setDueAtLocal} />
            </div>

            <label className="flex flex-col gap-1 text-xs text-muted">
                Notering (valfri)
                <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ex: Ta med siffror från förra veckan"
                    className="min-h-20 resize-y rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                    maxLength={500}
                />
            </label>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {isLoading ? 'Skapar...' : 'Skapa reminder'}
            </button>

            {feedback && <p className="text-xs text-muted">{feedback}</p>}
        </form>
    );
}
