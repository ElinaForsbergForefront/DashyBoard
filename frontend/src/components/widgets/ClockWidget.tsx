import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useGetCurrentUserQuery } from '../../api/endpoints/user';
import { useGetTimezonesQuery } from '../../api/endpoints/worldTime';
import { ClockTimezoneForm } from '../forms/ClockTimezoneForm';
import { GlassCard } from '../ui/glass-card';

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

export function ClockWidget() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [selectedTimezone, setSelectedTimezone] = useState<string>(BROWSER_TIMEZONE || 'UTC');

  const { data: user } = useGetCurrentUserQuery();
  const { data: timezoneDtos = [] } = useGetTimezonesQuery();

  const availableTimezones = useMemo(
    () => timezoneDtos.map((entry) => entry.timeZone).filter((timezone): timezone is string => Boolean(timezone)),
    [timezoneDtos],
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const zonedNow = toZonedTime(now, selectedTimezone);
  const timeLabel = format(zonedNow, 'HH:mm:ss');
  const dateLabel = format(zonedNow, 'd MMM, yyyy', { locale: sv });

  return (
    <>
      <GlassCard
        className="glass-widget w-72 cursor-pointer"
        onClick={() => setIsEditModalOpen(true)}
      >
        <div className="space-y-2 text-center">
          <p className="text-5xl font-semibold text-foreground tracking-tight">{timeLabel}</p>
          <p className="text-foreground-secondary">{dateLabel}</p>
          <p className="text-small text-muted">{selectedTimezone.replace('_', ' ')}</p>
        </div>
      </GlassCard>

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <GlassCard
            className="glass-form w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Ändra tidszon</h4>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
              >
                Stäng
              </button>
            </div>

            <ClockTimezoneForm
              timezones={availableTimezones}
              selectedTimezone={selectedTimezone}
              onTimezoneChange={handleTimezoneChange}
              onSuccess={() => setIsEditModalOpen(false)}
            />
          </GlassCard>
        </div>
      )}
    </>
  );
}
