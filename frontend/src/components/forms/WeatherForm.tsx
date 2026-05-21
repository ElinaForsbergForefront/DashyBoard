import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { FormCard } from '../ui/form-card';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';

interface WeatherFormProps {
  onSuccess?: (city: string) => void;
}

export function WeatherForm({ onSuccess }: WeatherFormProps = {}) {
  const [city, setCity] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [debouncedCity, setDebouncedCity] = useState('');

  const trimmedCity = city.trim();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCity(trimmedCity);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [trimmedCity]);

  const {
    data: geocodeData,
    isFetching: isValidatingCity,
    error: geocodeError,
  } = useGeocodeAddressQuery(debouncedCity, { skip: debouncedCity.length < 2 });

  const isWaitingForValidation = trimmedCity.length >= 2 && debouncedCity !== trimmedCity;
  const hasCurrentCityValidation = trimmedCity.length >= 2 && debouncedCity === trimmedCity;
  const hasValidCurrentCity = hasCurrentCityValidation && !!geocodeData;

  const cityError =
    !trimmedCity
      ? 'Enter a city'
      : trimmedCity.length < 2
        ? 'Enter at least 2 characters'
        : isWaitingForValidation || isValidatingCity
          ? ''
        : geocodeError
          ? 'City could not be found'
          : '';

  const isSubmitDisabled =
    !trimmedCity || !!cityError || isWaitingForValidation || isValidatingCity || !hasValidCurrentCity;

  const cityHelperText =
    isWaitingForValidation || isValidatingCity
      ? 'Validating city...'
      : 'Enter an existing city';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (isSubmitDisabled) return;

    try {
      const submittedCity = city.trim();
      setCity('');
      setFeedback('Weather configuration saved.');
      onSuccess?.(submittedCity);
    } catch {
      setFeedback('Could not configure weather. Please try again.');
    }
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Weather Configuration</p>

      <label className="flex flex-col gap-1 text-xs text-muted">
        City
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
        {isValidatingCity ? 'Validating...' : 'Configure weather'}
      </button>

      {feedback && <p className="text-xs text-muted">{feedback}</p>}
    </FormCard>
  );
}
