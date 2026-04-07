import { useEffect, useMemo, useState } from 'react';
import { useGetCurrentUserQuery } from '../api/endpoints/user';
import { useGetTimezonesQuery } from '../api/endpoints/worldTime';

const CLOCK_TIMEZONE_STORAGE_KEY = 'dashyboard.clock.timezone';
const BROWSER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');
}

function getDefaultTimezone(
  city: string | null | undefined,
  country: string | null | undefined,
  availableTimezones: string[],
): string {
  const cityToken = city ? normalizeText(city) : '';
  const countryToken = country ? normalizeText(country) : '';

  if (cityToken) {
    const cityMatch = availableTimezones.find((timezone) =>
      timezone.toLowerCase().includes(cityToken),
    );

    if (cityMatch) {
      return cityMatch;
    }
  }

  if (countryToken) {
    const countryMatch = availableTimezones.find((timezone) =>
      timezone.toLowerCase().includes(countryToken),
    );

    if (countryMatch) {
      return countryMatch;
    }
  }

  if (BROWSER_TIMEZONE && availableTimezones.includes(BROWSER_TIMEZONE)) {
    return BROWSER_TIMEZONE;
  }

  return availableTimezones[0] ?? (BROWSER_TIMEZONE || 'UTC');
}

export function useClockTimezone() {
  const [selectedTimezone, setSelectedTimezone] = useState<string>(BROWSER_TIMEZONE || 'UTC');

  const { data: user } = useGetCurrentUserQuery();
  const { data: timezoneDtos = [] } = useGetTimezonesQuery();

  const availableTimezones = useMemo(
    () => timezoneDtos.map((entry) => entry.timeZone).filter((timezone): timezone is string => Boolean(timezone)),
    [timezoneDtos],
  );

  useEffect(() => {
    if (availableTimezones.length === 0) return;

    const storedTimezone = localStorage.getItem(CLOCK_TIMEZONE_STORAGE_KEY);
    if (storedTimezone && availableTimezones.includes(storedTimezone)) {
      setSelectedTimezone(storedTimezone);
      return;
    }

    const inferredTimezone = getDefaultTimezone(user?.city, user?.country, availableTimezones);
    setSelectedTimezone(inferredTimezone);
  }, [availableTimezones, user?.city, user?.country]);

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
    localStorage.setItem(CLOCK_TIMEZONE_STORAGE_KEY, timezone);
  };

  return {
    selectedTimezone,
    availableTimezones,
    handleTimezoneChange,
  };
}
