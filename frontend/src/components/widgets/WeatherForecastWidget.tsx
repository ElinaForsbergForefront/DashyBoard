import { useEffect, useState } from 'react';
import { GlassCard } from '../ui/glass-card';
import { useTheme } from '../../context/ThemeContext';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';
import { useGetDailyWeatherQuery } from '../../api/endpoints/weather';
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
  rain: {
    label: 'Rain',
    icon: { light: RainLight, dark: RainDark },
    dayIcon: { light: RainDayLight, dark: RainDayDark },
    nightIcon: { light: RainNightLight, dark: RainNightDark },
  },
  snowfall: { label: 'Snow', icon: { light: SnowLight, dark: SnowDark } },
  rainshowers: {
    label: 'Rain showers',
    icon: { light: RainLight, dark: RainDark },
    dayIcon: { light: RainDayLight, dark: RainDayDark },
    nightIcon: { light: RainNightLight, dark: RainNightDark },
  },
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

function getWeatherTypeDisplay(weatherType: string | undefined, theme: 'light' | 'dark') {
  if (!weatherType) {
    return { label: '', icon: undefined };
  }

  const normalizedType = normalizeWeatherType(weatherType);
  const mapped = WEATHER_TYPE_MAP[normalizedType];
  const themedIcon = mapped?.icon;

  return {
    label: mapped?.label ?? normalizeWeatherLabel(weatherType),
    icon: themedIcon?.[theme],
  };
}

function formatDayLabel(dateString: string, index: number): string {
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
  const [location, setLocation] = useState<WeatherLocationSelection>(readStoredWeatherLocation);
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
    data: dailyWeather,
    isFetching: isFetchingWeather,
    error: weatherError,
  } = useGetDailyWeatherQuery(
    { longi: coordinates?.lon.toString() ?? '0', lati: coordinates?.lat.toString() ?? '0' },
    { skip: !coordinates },
  );

  const { theme } = useTheme();

  const isLoading = isGeocoding || isFetchingWeather;
  const hasLocation = searchLocation.trim() !== '';
  const errorMessage = geocodeError
    ? 'Kunde inte tolka platsen. Kontrollera att du skriver in en stad eller ort.'
    : weatherError
      ? 'Kunde inte hämta väderprognosen för platsen.'
      : undefined;

  const handleLocationSubmit = (newLocationCity: string) => {
    const newLocation = { city: newLocationCity };
    setLocation(newLocation);
    localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    setSearchLocation(buildSearchLocation(newLocation));
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard className="glass-widget w-80">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-secondary">7-Day Forecast</h3>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-md border border-border bg-overlay px-2 py-1 text-xs text-foreground-secondary transition hover:bg-glass"
            >
              Edit
            </button>
          </div>

          {isLoading && <p className="text-xs text-muted">Hämtar väderprognos…</p>}

          {!isLoading && !dailyWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Söker plats och hämtar väderdata…</p>
          )}

          {!isLoading && dailyWeather && (
              <div className="space-y-2">
              <p className="text-xs text-muted text-xs">{(weatherLocation || searchLocation).charAt(0).toUpperCase() + (weatherLocation || searchLocation).slice(1)}</p>
              <div className="space-y-1">
                {dailyWeather.daily.time.map((date, index) => {
                  const weatherType = dailyWeather.daily.weather_code?.[index];
                  const maxTemp = dailyWeather.daily.temperature_2m_max?.[index];
                  const minTemp = dailyWeather.daily.temperature_2m_min?.[index];
                  const { label: weatherTypeLabel, icon: weatherIcon } = getWeatherTypeDisplay(weatherType, theme);
                  const dayLabel = formatDayLabel(date, index);

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
            <p className="text-xs text-muted">Ingen plats vald ännu. Klicka på Edit för att lägga till.</p>
          )}

          {!isLoading && !dailyWeather && hasLocation && !errorMessage && (
            <p className="text-xs text-muted">Söker plats och hämtar väderdata…</p>
          )}

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}
        </div>
      </GlassCard>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onClick={() => setIsEditModalOpen(false)}>
          <GlassCard
            className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">7-Day Forecast</h4>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
              >
                Stäng
              </button>
            </div>

            <WeatherForm
              onSuccess={(city) => {
                handleLocationSubmit(city);
                setIsEditModalOpen(false);
              }}
            />
          </GlassCard>
        </div>
      )}
    </>
  );
}