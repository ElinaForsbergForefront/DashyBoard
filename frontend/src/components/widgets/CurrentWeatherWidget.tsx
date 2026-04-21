import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GlassCard } from '../ui/glass-card';
import { useTheme } from '../../context/ThemeContext';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';
import { useGetCurrentWeatherQuery } from '../../api/endpoints/weather';
import { WeatherForm } from '../forms/WeatherForm';
import ClearDayLight from '../../../assets/weather/light/ClearDay.png';
import ClearNightLight from '../../../assets/weather/light/ClearNight.png';
import CloudyLight from '../../../assets/weather/light/Cloudy.png';
import CloudyDayLight from '../../../assets/weather/light/CloudyDay.png';
import CloudyNightLight from '../../../assets/weather/light/CloudyNight.png';
import RainLight from '../../../assets/weather/light/Rain.png';
import RainDayLight from '../../../assets/weather/light/RainDay.png';
import RainNightLight from '../../../assets/weather/light/RainNight.png';
import SnowLight from '../../../assets/weather/light/Snow.png';
import ThunderLight from '../../../assets/weather/light/Thunder.png';
import ClearDayDark from '../../../assets/weather/dark/ClearDay.png';
import ClearNightDark from '../../../assets/weather/dark/ClearNight.png';
import CloudyDark from '../../../assets/weather/dark/Cloudy.png';
import CloudyDayDark from '../../../assets/weather/dark/CloudyDay.png';
import CloudyNightDark from '../../../assets/weather/dark/CloudyNight.png';
import RainDark from '../../../assets/weather/dark/Rain.png';
import RainDayDark from '../../../assets/weather/dark/RainDay.png';
import RainNightDark from '../../../assets/weather/dark/RainNight.png';
import SnowDark from '../../../assets/weather/dark/Snow.png';
import ThunderDark from '../../../assets/weather/dark/Thunder.png';

const WEATHER_LOCATION_STORAGE_KEY = 'dashyboard.weather.location';

type WeatherLocationSelection = {
  city: string;
};

function buildSearchLocation(location: WeatherLocationSelection) {
  return location.city.trim();
}

function readStoredWeatherLocation(): WeatherLocationSelection {
  const raw = localStorage.getItem(WEATHER_LOCATION_STORAGE_KEY);
  if (!raw) return { city: '' };

  try {
    const parsed = JSON.parse(raw) as Partial<WeatherLocationSelection & { country?: string }>;
    if (typeof parsed?.city === 'string') {
      return { city: parsed.city };
    }
  } catch {
    return { city: raw };
  }

  return { city: '' };
}

type ThemedIcon = { light: string; dark: string };

type WeatherTypeDisplay = {
  label: string;
  icon: ThemedIcon;
  dayIcon?: ThemedIcon;
  nightIcon?: ThemedIcon;
};

const WEATHER_TYPE_MAP: Record<string, WeatherTypeDisplay> = {
  clearsky: {
    label: 'Clear sky',
    icon: { light: ClearDayLight, dark: ClearDayDark },
    nightIcon: { light: ClearNightLight, dark: ClearNightDark },
  },
  mainlyclear: {
    label: 'Mainly clear',
    icon: { light: ClearDayLight, dark: ClearDayDark },
    nightIcon: { light: ClearNightLight, dark: ClearNightDark },
  },
  partlycloudy: {
    label: 'Partly cloudy',
    icon: { light: CloudyDayLight, dark: CloudyDayDark },
    nightIcon: { light: CloudyNightLight, dark: CloudyNightDark },
  },
  overcast: { label: 'Overcast', icon: { light: CloudyLight, dark: CloudyDark } },
  fog: { label: 'Fog', icon: { light: CloudyLight, dark: CloudyDark } },
  drizzle: {
    label: 'Drizzle',
    icon: { light: RainLight, dark: RainDark },
    dayIcon: { light: RainDayLight, dark: RainDayDark },
    nightIcon: { light: RainNightLight, dark: RainNightDark },
  },
  rain: { label: 'Rain', icon: { light: RainLight, dark: RainDark } },
  snowfall: { label: 'Snow', icon: { light: SnowLight, dark: SnowDark } },
  rainshowers: { label: 'Rain showers', icon: { light: RainLight, dark: RainDark } },
  snowshowers: { label: 'Snow showers', icon: { light: SnowLight, dark: SnowDark } },
  thunderstorm: { label: 'Thunderstorm', icon: { light: ThunderLight, dark: ThunderDark } },
  thunderstormwithhail: { label: 'Thunderstorm with hail', icon: { light: ThunderLight, dark: ThunderDark } },
  unknown: { label: 'Unknown', icon: { light: ClearDayLight, dark: CloudyDark } },
};

function normalizeWeatherType(type?: string) {
  return type?.trim().replace(/[-_\s]+/g, '').toLowerCase();
}

function normalizeWeatherLabel(rawType: string) {
  return rawType
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
}

function getWeatherTypeDisplay(weatherType: string | undefined, theme: 'light' | 'dark', isDay?: number) {
  if (!weatherType) {
    return { label: '', icon: undefined };
  }

  const normalizedType = normalizeWeatherType(weatherType);
  if (!normalizedType) {
    return { label: '', icon: undefined };
  }
  const mapped = WEATHER_TYPE_MAP[normalizedType];
  const themedIcon = mapped
    ? isDay === 0
      ? mapped.nightIcon ?? mapped.icon
      : isDay === 1
        ? mapped.dayIcon ?? mapped.icon
        : mapped.icon
    : undefined;

  return {
    label: mapped?.label ?? normalizeWeatherLabel(weatherType),
    icon: themedIcon?.[theme],
  };
}

export function CurrentWeatherWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState(() => {
    const raw = localStorage.getItem(WEATHER_LOCATION_STORAGE_KEY);
    const parsed = readStoredWeatherLocation();
    const fromStructuredValue = buildSearchLocation(parsed);

    if (fromStructuredValue) return fromStructuredValue;
    if (!raw) return '';

    try {
      JSON.parse(raw);
      return '';
    } catch {
      return raw;
    }
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherLocation, setWeatherLocation] = useState<string>('');

  const {
    data: geocodeData,
    isFetching: isGeocoding,
    error: geocodeError,
  } = useGeocodeAddressQuery(searchLocation, {
    skip: searchLocation.trim() === '',
  });

  useEffect(() => {
    if (!geocodeData) return;
    setCoordinates({ lat: geocodeData.latitude, lon: geocodeData.longitude });
    setWeatherLocation(geocodeData.address ?? searchLocation);
  }, [geocodeData, searchLocation]);

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
  const hasLocation = searchLocation.trim() !== '';
  const errorMessage = geocodeError
    ? 'Kunde inte tolka platsen. Kontrollera att du skriver in en stad eller ort.'
    : weatherError
      ? 'Kunde inte hämta vädret för platsen.'
      : undefined;

  const handleLocationSubmit = (newLocation: WeatherLocationSelection) => {
    localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    setSearchLocation(buildSearchLocation(newLocation));
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
        <CurrentWeatherEditModal
          onClose={() => setIsEditModalOpen(false)}
          onLocationSubmit={handleLocationSubmit}
        />,
        document.body,
      )}
    </>
  );
}

function CurrentWeatherEditModal({ onClose, onLocationSubmit }: { onClose: () => void; onLocationSubmit: (location: WeatherLocationSelection) => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <GlassCard
        className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Weather</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
          >
            Stäng
          </button>
        </div>

        <WeatherForm
          onSuccess={(city) => {
            onLocationSubmit({ city });
            onClose();
          }}
        />
      </GlassCard>
    </div>
  );
}