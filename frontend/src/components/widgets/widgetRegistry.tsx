import type { ReactNode } from 'react';
import type {
  AnyWidgetConfig,
  ClockWidgetConfig,
  ClockWidgetDto,
  CurrencyWidgetConfig,
  CurrencyWidgetDto,
  TrafficWidgetConfig,
  TrafficWidgetDto,
  WeatherWidgetConfig,
  WeatherWidgetDto,
} from '../../api/types/mirror';
import { ClockTimezoneForm } from '../forms/ClockTimezoneForm';
import { CurrencyWidgetForm } from '../forms/CurrencyWidgetForm';
import { TrafficForm } from '../forms/TrafficForm';
import { WeatherForm } from '../forms/WeatherForm';
import type { WidgetSettingsFormProps, WidgetViewProps } from './types';
import { ClockWidget } from './ClockWidget';
import { CurrencyWidget } from './CurrencyWidget';
import { CurrentWeatherWidget } from './CurrentWeatherWidget';
import { ReminderWidget } from './ReminderWidget';
import { SpotifyWidget } from './spotify/SpotifyWidget';
import { TrafficWidget } from './TrafficWidget';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { ClockMiniWidget } from './miniWidgets/ClockMiniWidget';
import { WeatherMiniWidget } from './miniWidgets/WeatherMiniWidget';
import { CurrencyMiniWidget } from './miniWidgets/CurrencyMiniWidget';
import { ReminderMiniWidget } from './miniWidgets/ReminderMiniWidget';
import { TrafficMiniWidget } from './miniWidgets/TrafficMiniWidget';
import { SpotifyMiniWidget } from './miniWidgets/SpotifyMiniWidget';

const DEFAULT_CLOCK_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

type WidgetComponent = (props: WidgetViewProps) => ReactNode;
type WidgetConfigFormComponent = (props: WidgetSettingsFormProps) => ReactNode;

/**
 * Widget registry — the only place you need to change to add a new widget.
 *
 * Add a new widget like this:
 *
 *   {
 *     id: 'gold',
 *     name: 'Gold',
 *     description: 'Shows the current gold price.',
 *     component: GoldWidget,
 *     // configForm: GoldWidgetForm,  ← add if the widget needs a config form
 *   },
 */

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  cols: number;
  rows: number;
  component: WidgetComponent;
  configForm?: WidgetConfigFormComponent;
  createDefaultConfig?: () => AnyWidgetConfig;
  isPremium?: boolean;
  isMini?: boolean;
}

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: 'reminder',
    name: 'Reminder',
    description: 'Create reminders that appear in the reminder widget.',
    cols: 2,
    rows: 2,
    component: () => <ReminderWidget />,
    createDefaultConfig: () => ({}),
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Shows current weather for the selected location.',
    cols: 2,
    rows: 2,
    component: (props) => (
      <CurrentWeatherWidget {...props} widget={props.widget as WeatherWidgetDto} />
    ),
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <WeatherForm
        initialConfig={initialConfig as WeatherWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({
      city: '',
    }),
  },
  {
    id: 'weather-forecast',
    name: 'Weather Forecast',
    description: 'Shows weather forecast for the selected location.',
    cols: 2,
    rows: 3,
    component: () => <WeatherForecastWidget />,
    createDefaultConfig: () => ({}),
    isPremium: true,
  },
  {
    id: 'currency',
    name: 'Currency',
    description: 'Track any asset — currencies, crypto, stocks — with a live price chart.',
    cols: 3,
    rows: 2,
    component: (props) => <CurrencyWidget {...props} widget={props.widget as CurrencyWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <CurrencyWidgetForm
        initialConfig={initialConfig as CurrencyWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({
      symbol: '',
    }),
    isPremium: true,
  },
  {
    id: 'clock',
    name: 'Clock',
    description: 'Shows the current time based on the selected timezone.',
    cols: 2,
    rows: 2,
    component: (props) => <ClockWidget {...props} widget={props.widget as ClockWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <ClockTimezoneForm
        initialConfig={initialConfig as ClockWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({
      timezone: DEFAULT_CLOCK_TIMEZONE,
    }),
  },
  {
    id: 'traffic',
    name: 'Traffic',
    description: 'Shows departing public transport from a selected station.',
    cols: 3,
    rows: 3,
    component: (props) => <TrafficWidget {...props} widget={props.widget as TrafficWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <TrafficForm
        initialConfig={initialConfig as TrafficWidgetConfig}
        onSuccess={({ siteId, stationName, transportModes }) =>
          onSubmit({ stationName, transportModes, siteId } as TrafficWidgetConfig)
        }
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({
      stationName: '',
      transportModes: ['BUS', 'TRAM', 'TRAIN'],
    }),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: "Shows what you're currently listening to.",
    cols: 2,
    rows: 2,
    component: () => <SpotifyWidget />,
    createDefaultConfig: () => ({}),
    isPremium: true,
  },
  // ── Mini variants ──────────────────────────────────────────────────
  {
    id: 'clock-mini',
    name: 'Clock Mini',
    description: 'Kompakt klocka — visar aktuell tid.',
    cols: 1,
    rows: 1,
    component: (props) => <ClockMiniWidget {...props} widget={props.widget as ClockWidgetDto} />,
    createDefaultConfig: () => ({ timezone: '' }),
    isMini: true,
  },
  {
    id: 'weather-mini',
    name: 'Weather Mini',
    description: 'Kompakt väder — visar temperatur och ikon.',
    cols: 1,
    rows: 1,
    component: (props) => <WeatherMiniWidget {...props} widget={props.widget as WeatherWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <WeatherForm
        initialConfig={initialConfig as WeatherWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({ city: '' }),
    isMini: true,
  },
  {
    id: 'currency-mini',
    name: 'Currency Mini',
    description: 'Kompakt kurs — visar aktuellt pris.',
    cols: 2,
    rows: 1,
    component: (props) => <CurrencyMiniWidget {...props} widget={props.widget as CurrencyWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <CurrencyWidgetForm
        initialConfig={initialConfig as CurrencyWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({ symbol: '' }),
    isPremium: true,
    isMini: true,
  },
  {
    id: 'reminder-mini',
    name: 'Reminder Mini',
    description: 'Kompakt reminder — visar nästa påminnelse.',
    cols: 1,
    rows: 1,
    component: ReminderMiniWidget,
    createDefaultConfig: () => ({}),
    isMini: true,
  },
  {
    id: 'traffic-mini',
    name: 'Traffic Mini',
    description: 'Kompakt trafik — visar nästa avgång.',
    cols: 1,
    rows: 1,
    component: (props) => <TrafficMiniWidget {...props} widget={props.widget as TrafficWidgetDto} />,
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <TrafficForm
        initialConfig={initialConfig as TrafficWidgetConfig}
        onSuccess={({ siteId, stationName, transportModes }) =>
          onSubmit({ stationName, transportModes, siteId } as TrafficWidgetConfig)
        }
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({ stationName: '', transportModes: ['BUS', 'TRAM', 'TRAIN'] }),
    isMini: true,
  },
  {
    id: 'spotify-mini',
    name: 'Spotify Mini',
    description: 'Kompakt Spotify — visar aktuell låt.',
    cols: 1,
    rows: 1,
    component: SpotifyMiniWidget,
    createDefaultConfig: () => ({}),
    isPremium: true,
    isMini: true,
  },
];

export type WidgetType = (typeof widgetRegistry)[number]['id'];

export function getDefaultWidgetConfig(type: string): AnyWidgetConfig {
  const definition = widgetRegistry.find((w) => w.id === type);
  if (!definition?.createDefaultConfig) return {};
  return definition.createDefaultConfig();
}

export function getWidgetDefinition(type: string): WidgetDefinition | undefined {
  return widgetRegistry.find((w) => w.id === type);
}
