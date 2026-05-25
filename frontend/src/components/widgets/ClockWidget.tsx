import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import type { ClockWidgetDto } from '../../api/types/mirror';
import { ClockTimezoneForm } from '../forms/ClockTimezoneForm';
import { useClockTimezone } from '../../hooks/useClockTimezone';
import { GlassCard } from '../ui/glass-card';
import type { WidgetViewProps } from './types';

export function ClockWidget({
  widget,
  isEditMode = false,
  onUpdateConfig,
  onEditingStateChange,
}: WidgetViewProps<ClockWidgetDto>) {
  const [now, setNow] = useState(() => new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDraftSavedBadge, setShowDraftSavedBadge] = useState(false);
  const { selectedTimezone } = useClockTimezone(widget.config);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    onEditingStateChange?.(widget.id, isEditModalOpen);
  }, [isEditModalOpen, onEditingStateChange, widget.id]);

  useEffect(() => {
    if (!showDraftSavedBadge) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowDraftSavedBadge(false);
    }, 1600);

    return () => window.clearTimeout(timeoutId);
  }, [showDraftSavedBadge]);

  const zonedNow = toZonedTime(now, selectedTimezone);
  const timeLabel = format(zonedNow, 'HH:mm:ss');
  const dateLabel = format(zonedNow, 'd MMM, yyyy', { locale: enUS });

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="space-y-2 text-center">
          <p className="text-5xl font-semibold text-foreground tracking-tight">{timeLabel}</p>
          <p className="text-foreground-secondary">{dateLabel}</p>
          <p className="text-small text-muted">{selectedTimezone.replace('_', ' ')}</p>
          {showDraftSavedBadge && (
            <p className="text-xs font-medium text-emerald-400">Updated in draft</p>
          )}
        </div>

        {isEditMode && onUpdateConfig && (
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="mt-3 w-full rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
          >
            Change timezone
          </button>
        )}
      </GlassCard>

      {isEditModalOpen &&
        onUpdateConfig &&
        createPortal(
          <div
            className="fixed inset-0 z-80 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <GlassCard
              className="glass-form w-full max-w-md"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">Change timezone</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <ClockTimezoneForm
                initialConfig={widget.config}
                onSubmit={(config) => {
                  onUpdateConfig(config);
                  setShowDraftSavedBadge(true);
                  setIsEditModalOpen(false);
                }}
                onCancel={() => setIsEditModalOpen(false)}
              />
            </GlassCard>
          </div>,
          document.body,
        )}
    </>
  );
}
