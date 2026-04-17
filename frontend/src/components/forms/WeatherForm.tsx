import type { FormEvent } from 'react';

interface WeatherFormProps {
  city: string;
  onCityChange: (city: string) => void;
  cityHelperText?: string;
  cityError?: string;
  onSubmit: () => void;
  isLoading?: boolean;
  feedback?: string | null;
  isSubmitDisabled?: boolean;
  buttonText?: string;
}

export function WeatherForm({
  city,
  onCityChange,
  cityHelperText,
  cityError,
  onSubmit,
  isLoading = false,
  feedback,
  isSubmitDisabled = false,
  buttonText = 'Visa väder',
}: WeatherFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-3 space-y-3">
      <p className="text-sm font-medium text-foreground">Väderplats</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Stad
        <input
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          placeholder="Ex: Oskarshamn"
          className="rounded-md border border-border bg-card px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
          maxLength={50}
          autoComplete="off"
        />
        {cityError ? <span className="text-[11px] text-destructive">{cityError}</span> : null}
        {!cityError && cityHelperText && <span className="text-[11px] text-muted">{cityHelperText}</span>}
      </label>

      <button
        type="submit"
        disabled={isLoading || isSubmitDisabled}
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isLoading ? 'Hämtar...' : buttonText}
      </button>

      {feedback && <p className="text-xs text-muted">{feedback}</p>}
    </form>
  );
}