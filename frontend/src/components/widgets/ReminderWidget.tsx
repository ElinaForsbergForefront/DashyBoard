import { useMemo, useState } from 'react';
import { useGetRemindersQuery } from '../../api/endpoints/reminder';
import type { ReminderDto } from '../../api/types/reminder';
import { ReminderForm } from '../forms/ReminderForm';
import { GlassCard } from '../ui/glass-card';
import { useEditModeContext } from '../../context/EditModeContext';

const dayLabelFormatter = new Intl.DateTimeFormat('sv-SE', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
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
  const { isEditMode } = useEditModeContext();

  const upcoming = useMemo(() => sortUpcoming(reminders), [reminders]);
  const visibleReminders = upcoming.slice(0, 4);
  const showEmptyState = !isLoading && !isError && visibleReminders.length === 0;

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-secondary">Reminders</h3>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-overlay px-2 py-0.5 text-xs text-muted">
                {upcoming.length}
              </span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {isLoading && <p className="text-xs text-muted">Laddar reminders...</p>}

          {isError && <p className="text-xs text-muted">Kunde inte hämta reminders just nu.</p>}

          {showEmptyState && <p className="text-xs text-muted">Inga aktiva reminders ännu.</p>}

          {!isLoading && !isError && visibleReminders.length > 0 && (
            <div className="space-y-2">
              {visibleReminders.map((reminder) => (
                <div key={reminder.id} className="rounded-xl bg-overlay px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{reminder.title}</p>
                  <p className="text-xs text-muted">{formatDueAt(reminder.dueAtUtc)}</p>
                  {reminder.note && <p className="mt-1 text-xs text-muted/70">{reminder.note}</p>}
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
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
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

        <ReminderForm onSuccess={onClose} />
      </div>
    </div>
  );
}

export default ReminderWidget;
