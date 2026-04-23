import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../ui/glass-card';
import { useTheme } from '../../context/ThemeContext';
import { useGetCurrentWeatherQuery } from '../../api/endpoints/weather';
import { getWeatherTypeDisplay } from '../../utils/weather';
import type { WeatherLocationSelection } from '../../utils/weather';
import { useWeatherLocation } from '../../hooks/useWeatherLocation';
import { WeatherLocationEditModal } from './weather/WeatherLocationEditModal';

export function CurrentWeatherWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    searchLocation,
    coordinates,
    weatherLocation,
    isGeocoding,
    geocodeError,
    hasLocation,
    saveWeatherLocation,
  } = useWeatherLocation();

  const {
    data: currentWeather,
    isFetching: isFetchingWeather,
    error: weatherError,
  } = useGetCurrentWeatherQuery(
    { longi: coordinates?.lon.toString() ?? '0', lati: coordinates?.lat.toString() ?? '0' },
    { skip: !coordinates },
  );

  const { theme } = useTheme();
  const rawWeatherType = currentWeather?.current.weatherType ?? currentWeather?.current.weather_code;
  const { label: weatherTypeLabel, icon: weatherIcon } = getWeatherTypeDisplay(
    rawWeatherType,
    theme,
    currentWeather?.current.is_day,
  );

  const isLoading = isGeocoding || isFetchingWeather;
  const errorMessage = geocodeError
    ? 'Kunde inte tolka platsen. Kontrollera att du skriver in en stad eller ort.'
    : weatherError
      ? 'Kunde inte hämta vädret för platsen.'
      : undefined;

  const handleLocationSubmit = (newLocation: WeatherLocationSelection) => {
    saveWeatherLocation(newLocation);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-secondary">Weather</h3>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
            >
              Edit
            </button>
          </div>

          {isLoading && <p className="text-xs text-muted">Hämtar aktuellt väder…</p>}

          {!isLoading && !currentWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Söker plats och hämtar väderdata…</p>
          )}

          {!isLoading && currentWeather && (
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground-secondary">
                    {(weatherLocation || searchLocation).charAt(0).toUpperCase() + (weatherLocation || searchLocation).slice(1)}
                  </p>
                  {weatherTypeLabel && (
                    <p className="text-xs text-muted">{weatherTypeLabel}</p>
                  )}
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
                  <p className="font-semibold text-foreground">Känns som</p>
                  <p>{Math.round(currentWeather.current.apparent_temperature)}°C</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Vind</p>
                  <p>{currentWeather.current.wind_speed_10m} km/h</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Nederbörd</p>
                  <p>{currentWeather.current.precipitation} mm</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Sannolikhet</p>
                  <p>{currentWeather.current.precipitation_probability}%</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !currentWeather && !hasLocation && (
            <p className="text-xs text-muted">Ingen plats vald ännu. Klicka på Edit för att lägga till.</p>
          )}

          {!isLoading && !currentWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Söker plats och hämtar väderdata…</p>
          )}

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}
        </div>
      </GlassCard>

      {isEditModalOpen && createPortal(
        <WeatherLocationEditModal
          title="Weather"
          onClose={() => setIsEditModalOpen(false)}
          onLocationSubmit={(city) => handleLocationSubmit({ city })}
        />,
        document.body,
      )}
    </>
  );
}