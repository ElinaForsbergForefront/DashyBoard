import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../ui/glass-card';
import { useTheme } from '../../context/ThemeContext';
import { useGetCurrentWeatherQuery } from '../../api/endpoints/weather';
import { getWeatherTypeDisplay } from '../../utils/weather';
import type { WeatherWidgetDto } from '../../api/types/mirror';
import { useWeatherLocation } from '../../hooks/useWeatherLocation';
import { WeatherForm } from '../forms/WeatherForm';
import type { WidgetViewProps } from './types';

const CURRENT_WEATHER_POLLING_INTERVAL_MS = 60 * 60 * 1000;

function toPrimaryLocationLabel(location: string): string {
  return location.split(',')[0]?.trim() ?? '';
}

export function CurrentWeatherWidget({
  widget,
  isEditMode = false,
  onUpdateConfig,
  onEditingStateChange,
}: WidgetViewProps<WeatherWidgetDto>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    searchLocation,
    coordinates,
    weatherLocation,
    formattedWeatherLocation,
    isGeocoding,
    geocodeError,
    hasLocation,
  } = useWeatherLocation(widget.config);

  useEffect(() => {
    onEditingStateChange?.(widget.id, isEditModalOpen);
  }, [isEditModalOpen, onEditingStateChange, widget.id]);

  const {
    data: currentWeather,
    isFetching: isFetchingWeather,
    error: weatherError,
  } = useGetCurrentWeatherQuery(
    { longi: coordinates?.lon.toString() ?? '0', lati: coordinates?.lat.toString() ?? '0' },
    {
      skip: !coordinates,
      pollingInterval: CURRENT_WEATHER_POLLING_INTERVAL_MS,
      skipPollingIfUnfocused: true,
    },
  );

  const { theme } = useTheme();
  const rawWeatherType =
    currentWeather?.current.weatherType ?? currentWeather?.current.weather_code;
  const { label: weatherTypeLabel, icon: weatherIcon } = getWeatherTypeDisplay(
    rawWeatherType,
    theme,
    currentWeather?.current.is_day,
  );

  const isLoading = isGeocoding || isFetchingWeather;
  const errorMessage = geocodeError
    ? 'Could not resolve location. Make sure you enter a city or town.'
    : weatherError
      ? 'Could not fetch weather for the location.'
      : undefined;
  const locationLabel =
    toPrimaryLocationLabel(formattedWeatherLocation) ||
    toPrimaryLocationLabel(weatherLocation) ||
    searchLocation;

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-secondary">Weather</h3>
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

          {isLoading && <p className="text-xs text-muted">Fetching current weather…</p>}

          {!isLoading && !currentWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Searching location and fetching weather data…</p>
          )}

          {!isLoading && currentWeather && (
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground-secondary">
                    {locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1)}
                  </p>
                  {weatherTypeLabel && <p className="text-xs text-muted">{weatherTypeLabel}</p>}
                  <p className="text-4xl font-semibold text-foreground tracking-tight">
                    {Math.round(currentWeather.current.temperature_2m)}°C
                  </p>
                </div>
                {weatherIcon && (
                  <img src={weatherIcon} alt={weatherTypeLabel} className="h-20 w-20" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                <div>
                  <p className="font-semibold text-foreground">Feels like</p>
                  <p>{Math.round(currentWeather.current.apparent_temperature)}°C</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Wind</p>
                  <p>{currentWeather.current.wind_speed_10m} km/h</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Precipitation</p>
                  <p>{currentWeather.current.precipitation} mm</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Probability</p>
                  <p>{currentWeather.current.precipitation_probability}%</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !currentWeather && !hasLocation && (
            <p className="text-xs text-muted">No location selected yet. Click Edit to add one.</p>
          )}

          {!isLoading && !currentWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Searching location and fetching weather data…</p>
          )}

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}
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
                <h4 className="text-sm font-semibold text-foreground">Edit weather</h4>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <WeatherForm
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
