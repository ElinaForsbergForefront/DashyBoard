import { useState } from 'react';
import type { FormEvent } from 'react';
import { FormCard } from '../ui/form-card';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';

interface WeatherFormProps {
  onSuccess?: (city: string) => void;
}

export function WeatherForm({ onSuccess }: WeatherFormProps = {}) {
  const [city, setCity] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const trimmedCity = city.trim();
  const {
    data: geocodeData,
    isFetching: isValidatingCity,
    error: geocodeError,
  } = useGeocodeAddressQuery(trimmedCity, { skip: trimmedCity.length < 2 });

  const cityError =
    !trimmedCity
      ? 'Ange en stad'
      : trimmedCity.length < 2
        ? 'Skriv minst 2 bokstäver'
        : geocodeError
          ? 'Staden kunde inte hittas'
          : '';

  const isSubmitDisabled = !trimmedCity || !!cityError || isValidatingCity || !geocodeData;

  const cityHelperText =
    isValidatingCity ? 'Validerar stad...' : 'Ange en stad som existerar';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (isSubmitDisabled) return;

    try {
      const submittedCity = city.trim();
      setCity('');
      setFeedback('Väder-konfigurationen sparades.');
      onSuccess?.(submittedCity);
    } catch {
      setFeedback('Kunde inte konfigurera väder. Försök igen.');
    }
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Väder Configuration</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Stad
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
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
        disabled={isSubmitDisabled}
        className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isValidatingCity ? 'Validerar...' : 'Konfigurera väder'}
      </button>

      {feedback && <p className="text-xs text-muted">{feedback}</p>}
    </FormCard>
  );
}