import type { FormEvent } from 'react';
import { FormCard } from '../ui/form-card';

interface ClockTimezoneFormProps {
  timezones: string[];
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  onSuccess?: () => void;
}

export function ClockTimezoneForm({
  timezones,
  selectedTimezone,
  onTimezoneChange,
  onSuccess,
}: ClockTimezoneFormProps) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSuccess?.();
  };

  return (
    <FormCard onSubmit={onSubmit}>
      <p className="text-sm font-medium text-foreground">Tidszon</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Välj tidszon
        <select
          value={selectedTimezone}
          onChange={(event) => onTimezoneChange(event.target.value)}
          className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white"
      >
        Klar
      </button>
    </FormCard>
  );
}
