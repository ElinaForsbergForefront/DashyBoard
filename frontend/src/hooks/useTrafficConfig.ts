import { useState } from 'react';

const TRAFFIC_CONFIG_STORAGE_KEY = 'dashyboard.traffic.config';

interface TrafficConfig {
  siteId: string;
  stationName: string;
  dateTime: string | null;
  transportModes: string[];
}

function getInitialTrafficConfig(): TrafficConfig | null {
  try {
    const raw = localStorage.getItem(TRAFFIC_CONFIG_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrafficConfig) : null;
  } catch {
    return null;
  }
}

export function useTrafficConfig() {
  const [config, setConfig] = useState<TrafficConfig | null>(getInitialTrafficConfig);

  const saveTrafficConfig = (next: TrafficConfig) => {
    localStorage.setItem(TRAFFIC_CONFIG_STORAGE_KEY, JSON.stringify(next));
    setConfig(next);
  };

  return { config, saveTrafficConfig };
}