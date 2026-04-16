import { useState } from 'react';
import {
  useGetStopsByNameQuery,
  useGetDeparturesQuery,
  useGetArrivalsQuery,
  useGetDeparturesAtTimeQuery,
  useGetArrivalsAtTimeQuery,
} from '../api/endpoints/traffic';
import { GlassCard } from './ui/glass-card';

export function Traffic() {
    
  const [searchName, setSearchName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [useSpecificTime, setUseSpecificTime] = useState(false);

  const {
    data: stops,
    isLoading: stopsLoading,
    error: stopsError,
  } = useGetStopsByNameQuery(submittedName, { skip: !submittedName });

  const {
    data: departures,
    isLoading: departuresLoading,
    error: departuresError,
  } = useGetDeparturesQuery(selectedSiteId, { skip: !selectedSiteId || useSpecificTime });

  const {
    data: arrivals,
    isLoading: arrivalsLoading,
    error: arrivalsError,
  } = useGetArrivalsQuery(selectedSiteId, { skip: !selectedSiteId || useSpecificTime });

  const {
    data: departuresAtTime,
    isLoading: departuresAtTimeLoading,
    error: departuresAtTimeError,
  } = useGetDeparturesAtTimeQuery(
    { siteId: selectedSiteId, dateTime },
    { skip: !selectedSiteId || !dateTime || !useSpecificTime },
  );

  const {
    data: arrivalsAtTime,
    isLoading: arrivalsAtTimeLoading,
    error: arrivalsAtTimeError,
  } = useGetArrivalsAtTimeQuery(
    { siteId: selectedSiteId, dateTime },
    { skip: !selectedSiteId || !dateTime || !useSpecificTime },
  );

  const activeDepartures = useSpecificTime ? departuresAtTime : departures;
  const activeArrivals = useSpecificTime ? arrivalsAtTime : arrivals;
  const activeDeparturesLoading = useSpecificTime ? departuresAtTimeLoading : departuresLoading;
  const activeArrivalsLoading = useSpecificTime ? arrivalsAtTimeLoading : arrivalsLoading;
  const activeDeparturesError = useSpecificTime ? departuresAtTimeError : departuresError;
  const activeArrivalsError = useSpecificTime ? arrivalsAtTimeError : arrivalsError;

  return (
    <GlassCard className="glass-widget w-72">
    <div>
      <div>
        <input
          type="text"
          placeholder="Search for a stop..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSubmittedName(searchName)}
        />
        <button onClick={() => setSubmittedName(searchName)}>Search</button>
      </div>

      {stopsLoading && <p>Searching...</p>}
      {stopsError && <p>Could not fetch stops.</p>}
      {stops && (
        <ul>
          {stops.map((stop) => (
            <li key={stop.id}>
              <button onClick={() => setSelectedSiteId(stop.id)}>
                {stop.name} {selectedSiteId === stop.id ? '✓' : ''}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedSiteId && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={useSpecificTime}
              onChange={(e) => setUseSpecificTime(e.target.checked)}
            />
            Specifik tid
          </label>
          {useSpecificTime && (
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          )}
        </div>
      )}

      {selectedSiteId && (
        <div>
          <div>
            <h3>Departures</h3>
            {activeDeparturesLoading && <p>Loading...</p>}
            {activeDeparturesError && <p>Could not fetch departures.</p>}
            {activeDepartures?.map((entry, i) => (
              <div key={i}>
                <span>{entry.line}</span>
                <span>{entry.direction}</span>
                <span>{new Date(entry.scheduled).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                {entry.delay > 0 && <span>+{entry.delay} min</span>}
                {entry.canceled && <span>Canceled</span>}
              </div>
            ))}
          </div>

          <div>
            <h3>Arrivals</h3>
            {activeArrivalsLoading && <p>Loading...</p>}
            {activeArrivalsError && <p>Could not fetch arrivals.</p>}
            {activeArrivals?.map((entry, i) => (
              <div key={i}>
                <span>{entry.line}</span>
                <span>{entry.direction}</span>
                <span>{new Date(entry.scheduled).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                {entry.delay > 0 && <span>+{entry.delay} min</span>}
                {entry.canceled && <span>Canceled</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </GlassCard>
  );
}