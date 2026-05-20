import { useEffect, useState, type FormEvent } from 'react';
import type { WeatherWidgetConfig } from '../../api/types/mirror';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';
import { FormCard } from '../ui/form-card';
import type { WidgetSettingsFormProps } from '../widgets/types';

type WeatherFormProps = WidgetSettingsFormProps<WeatherWidgetConfig>;

export function WeatherForm({ initialConfig, onSubmit, onCancel }: WeatherFormProps) {
  const [city, setCity] = useState(initialConfig.city);
  const [debouncedCity, setDebouncedCity] = useState(initialConfig.city.trim());

  const trimmedCity = city.trim();
  const initialCity = initialConfig.city.trim();
  const isCityUnchanged = trimmedCity === initialCity;
  const shouldValidateCity = trimmedCity.length >= 2 && !isCityUnchanged;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCity(trimmedCity);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [trimmedCity]);

  const {
    data: geocodeData,
    isFetching: isValidatingCity,
    error: geocodeError,
  } = useGeocodeAddressQuery(debouncedCity, {
    skip: !shouldValidateCity || debouncedCity.length < 2,
  });

  const isWaitingForValidation = shouldValidateCity && debouncedCity !== trimmedCity;
  const hasCurrentCityValidation = shouldValidateCity && debouncedCity === trimmedCity;
  const hasValidCurrentCity = isCityUnchanged || (hasCurrentCityValidation && !!geocodeData);

  const cityError = !trimmedCity
    ? 'Ange en stad'
    : trimmedCity.length < 2
      ? 'Skriv minst 2 bokstäver'
      : isCityUnchanged
        ? ''
        : isWaitingForValidation || isValidatingCity
          ? ''
          : geocodeError
            ? 'Staden kunde inte hittas'
            : '';

  const isSubmitDisabled =
    !trimmedCity ||
    !!cityError ||
    isWaitingForValidation ||
    isValidatingCity ||
    !hasValidCurrentCity;

  const cityHelperText = isCityUnchanged
    ? ''
    : isWaitingForValidation || isValidatingCity
      ? 'Validerar stad...'
      : 'Ange en stad som existerar';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    onSubmit({ city: trimmedCity });
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <p className="text-sm font-medium text-foreground">Weather</p>

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
        {!cityError && cityHelperText && (
          <span className="text-[11px] text-muted">{cityHelperText}</span>
        )}
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isValidatingCity ? 'Validerar...' : 'Spara'}
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
