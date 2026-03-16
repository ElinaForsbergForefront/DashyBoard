import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateReminderMutation, useGetRemindersQuery } from '../../api/endpoints/reminder';
import type { ReminderDto } from '../../api/types/reminder';
import { GlassCard } from '../ui/glass-card';

const dayLabelFormatter = new Intl.DateTimeFormat('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' });
const timeFormatter = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' });

function formatDueAt(dueAtUtc: string): string {
    const dueAt = new Date(dueAtUtc);
    return `${dayLabelFormatter.format(dueAt)} kl ${timeFormatter.format(dueAt)}`;
}

function sortUpcoming(reminders: ReminderDto[]): ReminderDto[] {
    return [...reminders]
        .filter((reminder) => !reminder.isCompleted)
        .sort((a, b) => new Date(a.dueAtUtc).getTime() - new Date(b.dueAtUtc).getTime());
}

export function ReminderWidget() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { data: reminders = [], isLoading, isError } = useGetRemindersQuery();

    const upcoming = useMemo(() => sortUpcoming(reminders), [reminders]);
    const visibleReminders = upcoming.slice(0, 4);
    const showEmptyState = !isLoading && !isError && visibleReminders.length === 0;

    return (
        <>
            <GlassCard className="glass-widget w-72">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white/70">Reminders</h3>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                                {upcoming.length}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                                className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:bg-white/20"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    {isLoading && <p className="text-xs text-white/55">Laddar reminders...</p>}

                    {isError && (
                        <p className="text-xs text-white/55">Kunde inte hämta reminders just nu.</p>
                    )}

                    {showEmptyState && <p className="text-xs text-white/55">Inga aktiva reminders ännu.</p>}

                    {!isLoading && !isError && visibleReminders.length > 0 && (
                        <div className="space-y-2">
                            {visibleReminders.map((reminder) => (
                                <div key={reminder.id} className="rounded-xl bg-white/5 px-3 py-2">
                                    <p className="text-sm font-medium text-white">{reminder.title}</p>
                                    <p className="text-xs text-white/55">{formatDueAt(reminder.dueAtUtc)}</p>
                                    {reminder.note && <p className="mt-1 text-xs text-white/45">{reminder.note}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>

            {isEditModalOpen && <ReminderEditModal onClose={() => setIsEditModalOpen(false)} />}
        </>
    );
}

function ReminderEditModal({ onClose }: { onClose: () => void }) {
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

            onClose();
        } catch {
            setFeedback('Kunde inte skapa påminnelsen. Kontrollera API-anslutningen.');
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Skapa reminder</h4>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                    >
                        Stäng
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-3">
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

                    <label className="flex flex-col gap-1 text-xs text-muted">
                        När
                        <input
                            type="datetime-local"
                            value={dueAtLocal}
                            onChange={(event) => setDueAtLocal(event.target.value)}
                            className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                        />
                    </label>

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

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                            {isLoading ? 'Skapar...' : 'Skapa'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
                        >
                            Avbryt
                        </button>
                    </div>

                    {feedback && <p className="text-xs text-muted">{feedback}</p>}
                </form>
            </div>
        </div>
    );
}

export default ReminderWidget;