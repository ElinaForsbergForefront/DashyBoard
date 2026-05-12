import { useEffect, useState } from 'react';
import { useGeocodeAddressQuery } from '../api/endpoints/geocoding';
import {
  WEATHER_LOCATION_STORAGE_KEY,
  type WeatherLocationSelection,
  buildSearchLocation,
  getInitialSearchLocation,
} from '../utils/weather';

export function useWeatherLocation() {
  const [searchLocation, setSearchLocation] = useState(getInitialSearchLocation);
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

  const hasLocation = searchLocation.trim() !== '';

  const saveWeatherLocation = (location: WeatherLocationSelection) => {
    localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, JSON.stringify(location));
    setSearchLocation(buildSearchLocation(location));
  };

  return {
    searchLocation,
    coordinates,
    weatherLocation,
    isGeocoding,
    geocodeError,
    hasLocation,
    saveWeatherLocation,
  };
}
