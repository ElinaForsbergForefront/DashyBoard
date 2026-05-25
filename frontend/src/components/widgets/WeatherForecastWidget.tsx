import { useState } from 'react';
import { GlassCard } from '../ui/glass-card';
import { useTheme } from '../../context/ThemeContext';
import { useGetDailyWeatherQuery } from '../../api/endpoints/weather';
import { createPortal } from 'react-dom';
import { getWeatherTypeDisplay } from '../../utils/weather';
import { useWeatherLocation } from '../../hooks/useWeatherLocation';
import { WeatherLocationEditModal } from './weather/WeatherLocationEditModal';
import { useEditModeContext } from '../../context/EditModeContext';

function formatDayLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}

export function WeatherForecastWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isEditMode } = useEditModeContext();
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
    data: dailyWeather,
    isFetching: isFetchingWeather,
    error: weatherError,
  } = useGetDailyWeatherQuery(
    { longi: coordinates?.lon.toString() ?? '0', lati: coordinates?.lat.toString() ?? '0' },
    { skip: !coordinates },
  );

  const { theme } = useTheme();

  const isLoading = isGeocoding || isFetchingWeather;
  const errorMessage = geocodeError
    ? 'Could not resolve location. Make sure you enter a city or town.'
    : weatherError
      ? 'Could not fetch the weather forecast for the location.'
      : undefined;

  const handleLocationSubmit = (newLocationCity: string) => {
    saveWeatherLocation({ city: newLocationCity });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard className="glass-widget w-full h-full">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-secondary">Weather Forecast</h3>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
              >
                Edit
              </button>
            )}
          </div>

          {isLoading && <p className="text-xs text-muted">Fetching weather forecast…</p>}

          {!isLoading && !dailyWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Searching location and fetching weather data…</p>
          )}

          {!isLoading && dailyWeather && (
            <div className="flex flex-col space-y-2 flex-1">
              <p className="text-xs text-muted shrink-0">
                {(weatherLocation || searchLocation).charAt(0).toUpperCase() +
                  (weatherLocation || searchLocation).slice(1)}
              </p>
              <div className="space-y-1 overflow-y-auto subtle-scrollbar pr-4 flex-1">
                {dailyWeather.daily.time.map((date, index) => {
                  const weatherType = dailyWeather.daily.weather_code?.[index];
                  const maxTemp = dailyWeather.daily.temperature_2m_max?.[index];
                  const minTemp = dailyWeather.daily.temperature_2m_min?.[index];
                  const { label: weatherTypeLabel, icon: weatherIcon } = getWeatherTypeDisplay(
                    weatherType,
                    theme,
                  );
                  const dayLabel = formatDayLabel(date);

                  return (
                    <div
                      key={date}
                      className="flex items-center justify-between rounded-md border border-border bg-overlay p-2 gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{dayLabel}</p>
                        {weatherTypeLabel && (
                          <p className="text-xs text-muted truncate">{weatherTypeLabel}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {weatherIcon && (
                          <img src={weatherIcon} alt={weatherTypeLabel} className="h-10 w-10" />
                        )}
                        <div className="flex flex-col items-end">
                          <p className="text-base font-semibold text-foreground">
                            {maxTemp !== undefined ? `${Math.round(maxTemp)}°` : '-'}
                          </p>
                          <p className="text-xs text-muted">
                            {minTemp !== undefined ? `${Math.round(minTemp)}°` : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!isLoading && !dailyWeather && !hasLocation && (
            <p className="text-xs text-muted">No location selected yet. Click Edit to add one.</p>
          )}

          {!isLoading && !dailyWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Searching location and fetching weather data…</p>
          )}

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}
        </div>
      </GlassCard>

      {isEditModalOpen &&
        createPortal(
          <WeatherLocationEditModal
            title="Weather Forecast"
            onClose={() => setIsEditModalOpen(false)}
            onLocationSubmit={handleLocationSubmit}
          />,
          document.body,
        )}
    </>
  );
}
