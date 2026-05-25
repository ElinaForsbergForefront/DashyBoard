import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, BusFrontIcon, HelpCircle, TrainFrontIcon, TramFrontIcon, type LucideIcon } from 'lucide-react';
import { useGetDeparturesQuery, useGetStopsByNameQuery } from '../../../api/endpoints/traffic';
import { GlassCard } from '../../ui/glass-card';
import { TrafficForm } from '../../forms/TrafficForm';
import type { WidgetViewProps } from '../types';
import type { TrafficWidgetDto } from '../../../api/types/mirror';

const transportIcons: Record<string, LucideIcon> = {
  BUS: BusFrontIcon,
  TRAM: TramFrontIcon,
  TRAIN: TrainFrontIcon,
};

const departureTimeFormatter = new Intl.DateTimeFormat('sv-SE', {
  hour: '2-digit',
  minute: '2-digit',
});

export function TrafficMiniWidget({ widget, onUpdateConfig }: WidgetViewProps<TrafficWidgetDto>) {
  const [siteId, setSiteId] = useState<string | null>(widget.config.siteId ?? null);
  const [stationName, setStationName] = useState<string | null>(widget.config.stationName || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Auto-resolve siteId from stationName when it's missing (e.g. config saved before siteId was tracked)
  const { data: autoStops } = useGetStopsByNameQuery(widget.config.stationName ?? '', {
    skip: !!siteId || !widget.config.stationName,
  });
  useEffect(() => {
    if (siteId || !autoStops?.length) return;
    const resolvedId = autoStops[0].groupId ?? autoStops[0].id;
    setSiteId(resolvedId);
    onUpdateConfig?.({
      stationName: widget.config.stationName,
      transportModes: widget.config.transportModes,
      siteId: resolvedId,
    });
  }, [autoStops, siteId]);

  const { data: departures = [], isLoading } = useGetDeparturesQuery(siteId ?? '', {
    skip: !siteId,
    pollingInterval: 30 * 1000,
  });

  const seen = new Set<string>();
  const uniqueDepartures = departures.filter(d => {
    const key = `${d.line}|${d.direction}|${d.scheduled}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const next = uniqueDepartures[0];
  const second = uniqueDepartures[1] ?? null;
  const Icon = next ? (transportIcons[next.transportMode.toUpperCase()] ?? HelpCircle) : null;
  const SecondIcon = second ? (transportIcons[second.transportMode.toUpperCase()] ?? HelpCircle) : null;

  const handleFormSuccess = (config: {
    siteId: string;
    stationName: string;
    dateTime?: string;
    transportModes: string[];
  }) => {
    setSiteId(config.siteId);
    setStationName(config.stationName);
    setIsEditModalOpen(false);
    onUpdateConfig?.({
      siteId: config.siteId,
      stationName: config.stationName,
      transportModes: config.transportModes,
    });
  };

  return (
    <>
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col gap-1.5 h-full">

          {/* Header — same structure as the large TrafficWidget */}
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground-secondary">Local traffic</p>
              <p className="text-[10px] text-muted truncate leading-snug">
                {stationName ?? 'Ingen station'}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {siteId && (
                <span className="rounded-full bg-overlay px-1.5 py-0.5 text-[10px] text-muted">
                  {uniqueDepartures.length}
                </span>
              )}
              <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="rounded p-0.5 text-muted hover:text-foreground transition-colors"
                  aria-label="Välj station"
                >
                  <Pencil size={11} />
                </button>
            </div>
          </div>

          {/* States */}
          {siteId && isLoading && <p className="text-[10px] text-muted">…</p>}
          {siteId && !isLoading && !next && (
            <p className="text-[10px] text-muted">Inga avgångar</p>
          )}

          {/* Departure cards — same style as the large widget */}
          <div className="space-y-1 flex-1 overflow-hidden">
            {next && Icon && (
              <div className="rounded-xl bg-overlay px-2 py-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <Icon size={12} className="text-muted shrink-0" />
                    <div className="min-w-0">
                      <div className="flex gap-1.5 text-[10px] font-medium text-foreground">
                        <span className="shrink-0">{next.line}</span>
                        <span className="truncate">{next.direction}</span>
                      </div>
                      {next.canceled && (
                        <p className="text-[10px] text-destructive leading-none">Inställd</p>
                      )}
                      {!next.canceled && Math.round(next.delay / 60) > 0 && (
                        <p className="text-[10px] text-warning leading-none">
                          +{Math.round(next.delay / 60)} min
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground shrink-0">
                    {departureTimeFormatter.format(new Date(next.realtime ?? next.scheduled))}
                  </p>
                </div>
              </div>
            )}

            {second && SecondIcon && (
              <div className="rounded-xl bg-overlay px-2 py-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <SecondIcon size={12} className="text-muted shrink-0" />
                    <div className="min-w-0">
                      <div className="flex gap-1.5 text-[10px] font-medium text-foreground">
                        <span className="shrink-0">{second.line}</span>
                        <span className="truncate">{second.direction}</span>
                      </div>
                      {second.canceled && (
                        <p className="text-[10px] text-destructive leading-none">Inställd</p>
                      )}
                      {!second.canceled && Math.round(second.delay / 60) > 0 && (
                        <p className="text-[10px] text-warning leading-none">
                          +{Math.round(second.delay / 60)} min
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-foreground shrink-0">
                    {departureTimeFormatter.format(new Date(second.realtime ?? second.scheduled))}
                  </p>
                </div>
              </div>
            )}
          </div>

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
                <h4 className="text-sm font-semibold text-foreground">Välj station</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Stäng
                </button>
              </div>
              <TrafficForm onSuccess={handleFormSuccess} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
