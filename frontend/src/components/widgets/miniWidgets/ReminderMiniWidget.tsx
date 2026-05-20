import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import { useGetRemindersQuery } from '../../../api/endpoints/reminder';
import { GlassCard } from '../../ui/glass-card';
import { useEditModeContext } from '../../../context/EditModeContext';
import { ReminderForm } from '../../forms/ReminderForm';

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

export function ReminderMiniWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isEditMode } = useEditModeContext();
  const { data: reminders = [], isLoading } = useGetRemindersQuery();

  const upcoming = useMemo(
    () =>
      [...reminders]
        .filter((r) => !r.isCompleted)
        .sort((a, b) => new Date(a.dueAtUtc).getTime() - new Date(b.dueAtUtc).getTime()),
    [reminders],
  );

  const next = upcoming[0];

  return (
    <>
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="relative flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground-secondary">Reminders</p>
            <div className="flex items-center gap-1">
              <span className="rounded-full bg-overlay px-1.5 py-0.5 text-[10px] text-muted">
                {upcoming.length}
              </span>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded p-0.5 text-muted hover:text-foreground transition-colors"
                  aria-label="Skapa reminder"
                >
                  <Pencil size={11} />
                </button>
              )}
            </div>
          </div>

          {isLoading && <p className="text-[10px] text-muted">…</p>}

          {!isLoading && upcoming.length === 0 && (
            <p className="text-[10px] text-muted">Inga aktiva</p>
          )}

          {!isLoading && next && (
            <div className="rounded-xl bg-overlay px-2 py-1.5">
              <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                {next.title}
              </p>
              <p className="text-[10px] text-muted leading-snug">{formatDueAt(next.dueAtUtc)}</p>
            </div>
          )}
        </div>
      </GlassCard>

      {isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Skapa reminder</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Stäng
                </button>
              </div>
              <ReminderForm onSuccess={() => setIsEditModalOpen(false)} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
