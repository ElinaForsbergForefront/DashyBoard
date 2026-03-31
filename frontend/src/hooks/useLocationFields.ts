import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetCitiesQuery, useGetCountriesQuery } from '../api/endpoints/location';

interface UseLocationFieldsResult {
  countryOptions: { value: string; label: string }[];
  cityOptions: { value: string; label: string }[];
  selectedCountryCode: string;
  isCountriesLoading: boolean;
  isCitiesFetching: boolean;
  cityError: string;
}

export const useLocationFields = (countryName: string, citySearch: string): UseLocationFieldsResult => {
  const { data: countries = [], isLoading: isCountriesLoading } = useGetCountriesQuery();

  const selectedCountryCode = countries.find((c) => c.name === countryName)?.code ?? '';
  const trimmedCity = citySearch.trim();

  const [debouncedCity, setDebouncedCity] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedCity(trimmedCity);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [trimmedCity]);

  const { data: cities = [], isFetching: isCitiesFetching } = useGetCitiesQuery(
    { cityName: debouncedCity, countryCode: selectedCountryCode },
    { skip: !selectedCountryCode || debouncedCity.length < 3 },
  );

  const countryOptions = countries.map((c) => ({
    value: c.name,
    label: c.FlagEmoji ? `${c.FlagEmoji} ${c.name}` : c.name,
  }));

  const cityOptions = useMemo(
    () =>
      Array.from(new Map(cities.map((c) => [c.name.toLowerCase(), c.name])).values()).map((name) => ({
        value: name,
        label: name,
      })),
    [cities],
  );

  const cityError = useMemo(() => {
    if (!trimmedCity) return '';
    if (!selectedCountryCode) return 'Select a country first';
    if (trimmedCity.length < 3) return 'Type at least 3 letters to search for a city';
    if (isCitiesFetching) return '';
    const match = cityOptions.some((c) => c.value.toLowerCase() === trimmedCity.toLowerCase());
    return match ? '' : 'Choose a city from the selected country';
  }, [trimmedCity, selectedCountryCode, isCitiesFetching, cityOptions]);

  return { countryOptions, cityOptions, selectedCountryCode, isCountriesLoading, isCitiesFetching, cityError };
};
