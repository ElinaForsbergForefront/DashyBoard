import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import { GlassCard } from '../../ui/glass-card';
import { useTheme } from '../../../context/ThemeContext';
import { useGetCurrentWeatherQuery } from '../../../api/endpoints/weather';
import { getWeatherTypeDisplay } from '../../../utils/weather';
import { useWeatherLocation } from '../../../hooks/useWeatherLocation';
import { useEditModeContext } from '../../../context/EditModeContext';
import { WeatherLocationEditModal } from '../weather/WeatherLocationEditModal';
import type { WidgetViewProps } from '../types';
import type { WeatherWidgetDto } from '../../../api/types/mirror';

export function WeatherMiniWidget({ widget, onUpdateConfig }: WidgetViewProps<WeatherWidgetDto>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isEditMode } = useEditModeContext();
  const { coordinates, hasLocation, weatherLocation, searchLocation, saveWeatherLocation } = useWeatherLocation(widget.config);
  const { theme } = useTheme();

  const { data: currentWeather, isFetching } = useGetCurrentWeatherQuery(
    { longi: coordinates?.lon.toString() ?? '0', lati: coordinates?.lat.toString() ?? '0' },
    { skip: !coordinates },
  );

  const rawWeatherType =
    currentWeather?.current.weatherType ?? currentWeather?.current.weather_code;
  const { label: weatherTypeLabel, icon: weatherIcon } = getWeatherTypeDisplay(
    rawWeatherType,
    theme,
    currentWeather?.current.is_day,
  );

  const cityName = weatherLocation || searchLocation;

  return (
    <>
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col gap-1 h-full">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[10px] text-muted truncate leading-none">
              {cityName
                ? cityName.charAt(0).toUpperCase() + cityName.slice(1)
                : 'Weather'}
            </p>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="shrink-0 rounded p-0.5 text-muted hover:text-foreground transition-colors"
                aria-label="Change location"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-1 text-center">
            {isFetching && <p className="text-xs text-muted">…</p>}

            {!isFetching && !hasLocation && (
              <p className="text-[10px] text-muted">No location</p>
            )}

            {!isFetching && currentWeather && (
              <>
                {weatherIcon && <img src={weatherIcon} alt={weatherTypeLabel ?? ''} className="h-9 w-9" />}
                <p className="text-2xl font-semibold text-foreground tracking-tight leading-none">
                  {Math.round(currentWeather.current.temperature_2m)}°
                </p>
                {weatherTypeLabel && (
                  <p className="text-[10px] text-muted leading-none">{weatherTypeLabel}</p>
                )}
                <p className="text-[10px] text-muted leading-none">
                  Feels {Math.round(currentWeather.current.apparent_temperature)}°
                </p>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {isEditModalOpen &&
        createPortal(
          <WeatherLocationEditModal
            title="Weather Mini"
            onClose={() => setIsEditModalOpen(false)}
            onLocationSubmit={(city) => {
              saveWeatherLocation({ city });
              onUpdateConfig?.({ city });
            }}
          />,
          document.body,
        )}
    </>
  );
}
