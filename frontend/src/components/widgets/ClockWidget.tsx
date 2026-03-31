import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useClockTimezone } from '../../hooks/useClockTimezone';
import { ClockTimezoneForm } from '../forms/ClockTimezoneForm';
import { GlassCard } from '../ui/glass-card';

export function ClockWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const { selectedTimezone, availableTimezones, handleTimezoneChange } = useClockTimezone();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zonedNow = toZonedTime(now, selectedTimezone);
  const timeLabel = format(zonedNow, 'HH:mm:ss');
  const dateLabel = format(zonedNow, 'd MMM, yyyy', { locale: sv });

  return (
    <>
      <GlassCard
        className="glass-widget w-72 cursor-pointer"
        onClick={() => setIsEditModalOpen(true)}
      >
        <div className="space-y-2 text-center">
          <p className="text-5xl font-semibold text-foreground tracking-tight">{timeLabel}</p>
          <p className="text-foreground-secondary">{dateLabel}</p>
          <p className="text-small text-muted">{selectedTimezone.replace('_', ' ')}</p>
        </div>
      </GlassCard>

      {isEditModalOpen && (
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
        </div>
      )}
    </>
  );
}
