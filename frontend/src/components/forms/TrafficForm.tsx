import { useState, type FormEvent } from 'react';
import { BusFrontIcon, TrainFrontIcon, TramFrontIcon, type LucideIcon } from 'lucide-react';
import type { TrafficWidgetConfig } from '../../api/types/mirror';
import { useGetStopsByNameQuery } from '../../api/endpoints/traffic';
import type { StationDto } from '../../api/types/traffic';
import { FormCard } from '../ui/form-card';

type SuccessConfig = { siteId: string; stationName: string; transportModes: string[] };

type TrafficFormProps = {
  initialConfig?: TrafficWidgetConfig;
  onSuccess?: (config: SuccessConfig) => void;
  onSubmit?: (config: TrafficWidgetConfig) => void;
  onCancel?: () => void;
};

const DEFAULT_TRANSPORT_MODES = ['BUS', 'TRAM', 'TRAIN'];

export function TrafficForm({ initialConfig, onSuccess, onSubmit, onCancel }: TrafficFormProps) {
  const [searchInput, setSearchInput] = useState(initialConfig?.stationName ?? '');
  const [submittedName, setSubmittedName] = useState('');
  const [selectedStop, setSelectedStop] = useState<StationDto | null>(null);
  const [stationName, setStationName] = useState(initialConfig?.stationName ?? '');
  const [transportModes, setTransportModes] = useState(
    (initialConfig?.transportModes?.length ?? 0) > 0
      ? initialConfig!.transportModes
      : DEFAULT_TRANSPORT_MODES,
  );

  const {
    data: stops = [],
    isLoading,
    isError,
  } = useGetStopsByNameQuery(submittedName, {
    skip: !submittedName,
  });

  const toggleMode = (mode: string) => {
    setTransportModes((previous) =>
      previous.includes(mode) ? previous.filter((value) => value !== mode) : [...previous, mode],
    );
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      return;
    }

    setSubmittedName(searchInput.trim());
    setSelectedStop(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chosenStationName = selectedStop?.name ?? selectedStop?.groupName ?? stationName;

    if (!chosenStationName.trim()) {
      return;
    }

    if (transportModes.length === 0) {
      return;
    }

    if (onSuccess) {
      onSuccess({
        siteId: selectedStop?.groupId ?? selectedStop?.id ?? '',
        stationName: chosenStationName.trim(),
        transportModes,
      });
    } else if (onSubmit) {
      onSubmit({
        stationName: chosenStationName.trim(),
        transportModes,
      });
    }
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Traffic</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Station
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleSearch())}
            placeholder="Ex: Tekniska högskolan"
            className="flex-1 rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
          >
            Search
          </button>
        </div>
      </label>

      {stationName && (
        <p className="text-xs text-muted">
          Vald station: <span className="text-foreground">{stationName}</span>
        </p>
      )}

      {isLoading && <p className="text-xs text-muted">Searching...</p>}
      {isError && <p className="text-xs text-muted">Could not fetch stops.</p>}

      {stops.length > 0 && (
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto subtle-scrollbar pr-1">
          {stops.slice(0, 10).map((stop) => (
            <button
              key={stop.id}
              type="button"
              onClick={() => {
                const nextStationName = stop.name ?? stop.groupName ?? '';

                setSelectedStop(stop);
                setStationName(nextStationName);
                setSearchInput(nextStationName);
                setSubmittedName('');
              }}
              className={`rounded-md border px-2 py-2 text-left text-sm text-foreground transition hover:bg-glass ${
                stationName === (stop.name ?? stop.groupName ?? '')
                  ? 'border-primary bg-overlay'
                  : 'border-border bg-overlay'
              }`}
            >
              {stop.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-3 pt-1">
        {(
          [
            ['BUS', BusFrontIcon],
            ['TRAM', TramFrontIcon],
            ['TRAIN', TrainFrontIcon],
          ] as [string, LucideIcon][]
        ).map(([mode, Icon]) => (
          <button
            key={mode}
            type="button"
            onClick={() => toggleMode(mode)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors ${
              transportModes.includes(mode)
                ? 'border-primary bg-primary/20 text-foreground'
                : 'border-border bg-overlay text-muted'
            }`}
          >
            <Icon size={14} />
            {mode.charAt(0) + mode.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
        >
          Spara
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground"
          >
            Avbryt
          </button>
        )}
      </div>
    </FormCard>
  );
}
