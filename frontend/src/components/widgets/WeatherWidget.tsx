import { useEffect, useState } from 'react';
import { GlassCard } from '../ui/glass-card';
import { useGeocodeAddressQuery } from '../../api/endpoints/geocoding';
import { useGetCurrentWeatherQuery } from '../../api/endpoints/weather';
import { WeatherForm } from '../forms/WeatherForm';

const WEATHER_LOCATION_STORAGE_KEY = 'dashyboard.weather.location';

export function WeatherWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [location, setLocation] = useState(() => localStorage.getItem(WEATHER_LOCATION_STORAGE_KEY) || '');
  const [searchLocation, setSearchLocation] = useState(location);
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

  const isLoading = isGeocoding || isFetchingWeather;
  const hasLocation = searchLocation.trim() !== '';
  const errorMessage = geocodeError
    ? 'Kunde inte tolka platsen. Kontrollera att du skriver in en stad eller ort.'
    : weatherError
    ? 'Kunde inte hämta vädret för platsen.'
    : undefined;

  const handleLocationSubmit = (newLocation: string) => {
    setLocation(newLocation);
    localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, newLocation);
    setSearchLocation(newLocation);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <GlassCard className="glass-widget w-72">
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
            <div className="space-y-2 text-center">
              <p className="text-sm font-medium text-foreground-secondary">
                {weatherLocation || searchLocation}
              </p>
              <p className="text-4xl font-semibold text-foreground tracking-tight">
                {Math.round(currentWeather.current.temperature_2m)}°C
              </p>
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

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}
        </div>
      </GlassCard>

      {isEditModalOpen && (
        <WeatherEditModal
          location={location}
          onLocationSubmit={handleLocationSubmit}
          onClose={() => setIsEditModalOpen(false)}
          isLoading={isLoading}
          feedback={errorMessage}
        />
      )}
    </>
  );
}

function WeatherEditModal({
  location,
  onLocationSubmit,
  onClose,
  isLoading,
  feedback,
}: {
  location: string;
  onLocationSubmit: (location: string) => void;
  onClose: () => void;
  isLoading: boolean;
  feedback?: string;
}) {
  const [tempLocation, setTempLocation] = useState(location);

  const handleSubmit = () => {
    if (!tempLocation.trim()) return;
    onLocationSubmit(tempLocation.trim());
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <GlassCard
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Ändra väderplats</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
          >
            Stäng
          </button>
        </div>

        <WeatherForm
          location={tempLocation}
          onLocationChange={setTempLocation}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          feedback={feedback}
          buttonText="Spara"
        />
      </GlassCard>
    </div>
  );
}