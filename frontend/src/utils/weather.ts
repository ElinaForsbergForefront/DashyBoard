type ThemedIcon = { light: string; dark: string };

const WEATHER_ICON_MODULES = import.meta.glob<string>(
  '../../assets/weather/{light,dark}/*.png',
  { eager: true, import: 'default' },
);

function buildWeatherIconsMap(): Record<string, ThemedIcon> {
  const partialIcons: Record<string, Partial<ThemedIcon>> = {};

  for (const [path, url] of Object.entries(WEATHER_ICON_MODULES)) {
    const match = path.match(/\/weather\/(light|dark)\/([A-Za-z0-9_-]+)\.png$/);
    if (!match) continue;

    const theme = match[1] as keyof ThemedIcon;
    const iconName = match[2];

    if (!partialIcons[iconName]) {
      partialIcons[iconName] = {};
    }
    partialIcons[iconName][theme] = url;
  }

  const completeIcons: Record<string, ThemedIcon> = {};
  for (const [iconName, iconSet] of Object.entries(partialIcons)) {
    if (iconSet.light && iconSet.dark) {
      completeIcons[iconName] = { light: iconSet.light, dark: iconSet.dark };
    }
  }

  return completeIcons;
}

const WEATHER_ICONS = buildWeatherIconsMap();

function getWeatherIcon(name: string, fallback = 'Cloudy'): ThemedIcon {
  const fallbackIcon = WEATHER_ICONS[fallback] ?? { light: '', dark: '' };
  return WEATHER_ICONS[name] ?? fallbackIcon;
}

type WeatherTypeDisplay = {
  label: string;
  icon: ThemedIcon;
  dayIcon?: ThemedIcon;
  nightIcon?: ThemedIcon;
};

const WEATHER_TYPE_MAP: Record<string, WeatherTypeDisplay> = {
  clearsky: {
    label: 'Clear sky',
    icon: getWeatherIcon('ClearDay'),
    nightIcon: getWeatherIcon('ClearNight'),
  },
  mainlyclear: {
    label: 'Mainly clear',
    icon: getWeatherIcon('ClearDay'),
    nightIcon: getWeatherIcon('ClearNight'),
  },
  partlycloudy: {
    label: 'Partly cloudy',
    icon: getWeatherIcon('CloudyDay'),
    nightIcon: getWeatherIcon('CloudyNight'),
  },
  overcast: { label: 'Overcast', icon: getWeatherIcon('Cloudy') },
  fog: { label: 'Fog', icon: getWeatherIcon('Cloudy') },
  drizzle: {
    label: 'Drizzle',
    icon: getWeatherIcon('Rain'),
    dayIcon: getWeatherIcon('RainDay'),
    nightIcon: getWeatherIcon('RainNight'),
  },
  rain: { label: 'Rain', icon: getWeatherIcon('Rain') },
  snowfall: { label: 'Snow', icon: getWeatherIcon('Snow') },
  rainshowers: { label: 'Rain showers', icon: getWeatherIcon('Rain') },
  snowshowers: { label: 'Snow showers', icon: getWeatherIcon('Snow') },
  thunderstorm: { label: 'Thunderstorm', icon: getWeatherIcon('Thunder') },
  thunderstormwithhail: { label: 'Thunderstorm with hail', icon: getWeatherIcon('Thunder') },
  unknown: { label: 'Unknown', icon: getWeatherIcon('Cloudy', 'ClearDay') },
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

export function getWeatherTypeDisplay(weatherType: string | undefined, theme: 'light' | 'dark', isDay?: number) {
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

export const WEATHER_LOCATION_STORAGE_KEY = 'dashyboard.weather.location';

export type WeatherLocationSelection = {
  city: string;
};

export function buildSearchLocation(location: WeatherLocationSelection) {
  return location.city.trim();
}

export function readStoredWeatherLocation(): WeatherLocationSelection {
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

export function getInitialSearchLocation() {
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
}

