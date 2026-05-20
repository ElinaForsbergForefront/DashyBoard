import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Pencil } from 'lucide-react';
import { useClockTimezone } from '../../../hooks/useClockTimezone';
import { useEditModeContext } from '../../../context/EditModeContext';
import { GlassCard } from '../../ui/glass-card';
import { ClockTimezoneForm } from '../../forms/ClockTimezoneForm';

export function ClockMiniWidget() {
  const [now, setNow] = useState(() => new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { selectedTimezone, availableTimezones, handleTimezoneChange } = useClockTimezone();
  const { isEditMode } = useEditModeContext();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zonedNow = toZonedTime(now, selectedTimezone);
  const timeLabel = format(zonedNow, 'HH:mm');
  const dateLabel = format(zonedNow, 'd MMM');
  const tzShort = selectedTimezone.split('/').pop()?.replace('_', ' ') ?? selectedTimezone;

  return (
    <>
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] text-muted leading-none truncate">{tzShort}</p>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="shrink-0 rounded p-0.5 text-muted hover:text-foreground transition-colors"
                aria-label="Ändra tidszon"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-1 text-center">
            <p className="text-3xl font-semibold text-foreground tracking-tight leading-none">
              {timeLabel}
            </p>
            <p className="text-xs text-foreground-secondary">{dateLabel}</p>
          </div>
        </div>
      </GlassCard>

      {isEditModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <GlassCard
            className="glass-form w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Ändra tidszon</h4>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
              >
                Stäng
              </button>
            </div>
            <ClockTimezoneForm
              timezones={availableTimezones}
              selectedTimezone={selectedTimezone}
              onTimezoneChange={handleTimezoneChange}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          </GlassCard>
        </div>,
        document.body,
      )}
    </>
  );
}
