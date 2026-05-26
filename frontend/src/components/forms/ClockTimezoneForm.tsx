import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { ClockWidgetConfig } from '../../api/types/mirror';
import { useClockTimezone } from '../../hooks/useClockTimezone';
import { FormCard } from '../ui/form-card';
import type { WidgetSettingsFormProps } from '../widgets/types';

type ClockTimezoneFormProps = WidgetSettingsFormProps<ClockWidgetConfig>;

export function ClockTimezoneForm({ initialConfig, onSubmit, onCancel }: ClockTimezoneFormProps) {
  const { selectedTimezone, availableTimezones } = useClockTimezone(initialConfig);
  const [pendingTimezone, setPendingTimezone] = useState(initialConfig.timezone);

  const uniqueTimezones = useMemo(
    () =>
      Array.from(
        new Set([selectedTimezone, ...availableTimezones].filter((timezone) => Boolean(timezone))),
      ),
    [availableTimezones, selectedTimezone],
  );

  useEffect(() => {
    if (selectedTimezone) {
      setPendingTimezone(selectedTimezone);
    }
  }, [selectedTimezone]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ timezone: pendingTimezone });
  };

  if (availableTimezones.length === 0) {
    return <div className="p-2 text-sm text-destructive">No timezones available</div>;
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Timezone</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Select timezone
        <select
          value={pendingTimezone}
          onChange={(event) => setPendingTimezone(event.target.value)}
          className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          {uniqueTimezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </FormCard>
  );
}
