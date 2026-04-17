import { useEffect, useState, type FormEvent } from 'react';
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
  const [pendingTimezone, setPendingTimezone] = useState(selectedTimezone);

  const applyTimezone = () => {
    onTimezoneChange(pendingTimezone);
    onSuccess?.();
  };

  useEffect(() => {
    if (selectedTimezone && timezones.includes(selectedTimezone)) {
      setPendingTimezone(selectedTimezone);
    } else if (timezones.length > 0) {
      setPendingTimezone(timezones[0]);
    }
  }, [selectedTimezone, timezones]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyTimezone();
  };

  if (timezones.length === 0) {
    return <div className="p-2 text-sm text-destructive">Inga tidszoner är tillgängliga</div>;
  }

  return (
    <FormCard onSubmit={onSubmit}>
      <p className="text-sm font-medium text-foreground">Tidszon</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Välj tidszon
        <select
          value={pendingTimezone}
          onChange={(event) => setPendingTimezone(event.target.value)}
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
