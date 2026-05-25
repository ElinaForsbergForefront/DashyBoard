import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BusFrontIcon,
  HelpCircle,
  TrainFrontIcon,
  TramFrontIcon,
  type LucideIcon,
} from 'lucide-react';
import type { TrafficWidgetDto } from '../../api/types/mirror';
import { useGetDeparturesQuery, useGetStopsByNameQuery } from '../../api/endpoints/traffic';
import type { StationDto, TimetableEntryDto } from '../../api/types/traffic';
import { TrafficForm } from '../forms/TrafficForm';
import { GlassCard } from '../ui/glass-card';
import type { WidgetViewProps } from './types';

const transportIcons: Record<string, LucideIcon> = {
  BUS: BusFrontIcon,
  TRAM: TramFrontIcon,
  TRAIN: TrainFrontIcon,
};

function TransportIcon({ mode }: { mode: string }) {
  const Icon = transportIcons[mode.toUpperCase()] ?? HelpCircle;
  return <Icon size={30} className="text-muted" />;
}

const DEFAULT_TRANSPORT_MODES = ['BUS', 'TRAM', 'TRAIN'];

function matchesStationName(stop: StationDto, stationName: string) {
  const normalizedStationName = stationName.trim().toLowerCase();
  return [stop.name, stop.groupName]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.trim().toLowerCase() === normalizedStationName);
}

function formatDepartureTime(entry: TimetableEntryDto) {
  const reference = entry.realtime ?? entry.scheduled;
  const departureTime = new Date(reference);

  if (Number.isNaN(departureTime.getTime())) {
    return '--:--';
  }

  return departureTime.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeDeparture(entry: TimetableEntryDto) {
  const reference = entry.realtime ?? entry.scheduled;
  const departureTime = new Date(reference);

  if (Number.isNaN(departureTime.getTime())) {
    return 'Unknown';
  }

  const minutesUntilDeparture = Math.max(
    0,
    Math.round((departureTime.getTime() - Date.now()) / 60000),
  );

  if (minutesUntilDeparture <= 1) {
    return 'Now';
  }

  return `${minutesUntilDeparture} min`;
}

export function TrafficWidget({
  widget,
  isEditMode = false,
  onUpdateConfig,
  onEditingStateChange,
}: WidgetViewProps<TrafficWidgetDto>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const stationName = widget.config.stationName ?? '';
  const configuredTransportModes = widget.config.transportModes ?? [];
  const transportModes =
    configuredTransportModes.length > 0 ? configuredTransportModes : DEFAULT_TRANSPORT_MODES;

  const {
    data: stops = [],
    isLoading,
    isError,
  } = useGetStopsByNameQuery(stationName, {
    skip: !stationName.trim(),
  });

  const matchedStop =
    stops.find((stop) => matchesStationName(stop, stationName)) ?? stops.at(0) ?? null;

  const {
    data: departures = [],
    isLoading: isLoadingDepartures,
    isError: isDeparturesError,
  } = useGetDeparturesQuery(matchedStop?.groupId ?? '', {
    skip: !matchedStop?.groupId,
  });

  useEffect(() => {
    onEditingStateChange?.(widget.id, isEditModalOpen);
  }, [isEditModalOpen, onEditingStateChange, widget.id]);

  const visibleDepartures = departures
    .filter((entry) => transportModes.includes(entry.transportMode.toUpperCase()))
    .slice(0, 6);

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-foreground-secondary">Local traffic</h3>
              <p className="text-lg text-muted">{stationName || 'No station selected'}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-overlay px-2 py-0.5 text-xs text-muted">
                {visibleDepartures.length}
              </span>
              {isEditMode && onUpdateConfig && (
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

          {!stationName && <p className="text-xs text-muted">No station selected yet.</p>}

          {(isLoading || isLoadingDepartures) && (
            <p className="text-xs text-muted">Loading departures...</p>
          )}

          {(isError || isDeparturesError) && (
            <p className="text-xs text-muted">Could not fetch traffic departures.</p>
          )}

          {!isLoading &&
            !isLoadingDepartures &&
            !isError &&
            !isDeparturesError &&
            stationName &&
            visibleDepartures.length === 0 && (
              <p className="text-xs text-muted">No departures found.</p>
            )}

          {!isLoading &&
            !isLoadingDepartures &&
            !isError &&
            !isDeparturesError &&
            visibleDepartures.length > 0 && (
              <div className="flex-1 space-y-2 overflow-y-auto subtle-scrollbar pr-2">
                {visibleDepartures.map((departure, index) => (
                  <div
                    key={`${departure.line}-${departure.direction}-${departure.scheduled}-${index}`}
                    className="rounded-xl bg-overlay px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="shrink-0">
                          <TransportIcon mode={departure.transportMode} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-semibold">
                              {departure.line}
                            </span>
                            <p className="truncate">{departure.direction}</p>
                          </div>
                          <p className="text-xs text-muted">
                            {departure.platform ? `Platform ${departure.platform} · ` : ''}
                            {formatDepartureTime(departure)}
                            {departure.delay > 0 ? ` · +${departure.delay} min` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatRelativeDeparture(departure)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
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
                <h4 className="text-sm font-semibold text-foreground">Edit traffic</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <TrafficForm
                initialConfig={widget.config}
                onSubmit={(config) => {
                  onUpdateConfig(config);
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

export default TrafficWidget;
