import { useEffect, useMemo, useState } from 'react';
import type { WeatherWidgetConfig } from '../api/types/mirror';
import { useGeocodeAddressQuery } from '../api/endpoints/geocoding';
import {
  WEATHER_LOCATION_STORAGE_KEY,
  type WeatherLocationSelection,
  buildSearchLocation,
  getInitialSearchLocation,
} from '../utils/weather';

export function useWeatherLocation(config?: Partial<WeatherWidgetConfig>) {
  const configuredSearchLocation = useMemo(() => {
    if (config) {
      const configuredCity = config.city?.trim();
      return configuredCity ? buildSearchLocation({ city: configuredCity }) : '';
    }

    return getInitialSearchLocation();
  }, [config?.city]);

  const [searchLocation, setSearchLocation] = useState(configuredSearchLocation);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherLocation, setWeatherLocation] = useState<string>('');
  const [formattedWeatherLocation, setFormattedWeatherLocation] = useState<string>('');

  useEffect(() => {
  setSearchLocation(configuredSearchLocation);
  setCoordinates(null);
  setWeatherLocation('');
  setFormattedWeatherLocation('');
  }, [configuredSearchLocation]);

  const {
    data: geocodeData,
    isFetching: isGeocoding,
    error: geocodeError,
  } = useGeocodeAddressQuery(searchLocation, {
    skip: searchLocation.trim() === '',
  });

useEffect(() => {
  if (!geocodeData) {
    setCoordinates(null);
    setWeatherLocation('');
    setFormattedWeatherLocation('');
    return;
  }

setCoordinates({ lat: geocodeData.latitude, lon: geocodeData.longitude });
setWeatherLocation(geocodeData.address ?? searchLocation);
setFormattedWeatherLocation(geocodeData.formattedAddress ?? geocodeData.address ?? '');
}, [geocodeData, searchLocation]);

  const hasLocation = searchLocation.trim() !== '';

  const saveWeatherLocation = (location: WeatherLocationSelection) => {
    if (!config) {
      localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, JSON.stringify(location));
    }

    setSearchLocation(buildSearchLocation(location));
  };

  return {
    searchLocation,
    coordinates,
    weatherLocation,
    formattedWeatherLocation,
    isGeocoding,
    geocodeError,
    hasLocation,
    saveWeatherLocation,
  };
}
