import type { ReactNode } from 'react';
import type {
  AnyWidgetConfig,
  ClockWidgetConfig,
  ClockWidgetDto,
  CurrencyWidgetConfig,
  CurrencyWidgetDto,
  TrafficWidgetConfig,
  TrafficWidgetDto,
  WeatherForecastWidgetConfig,
  WeatherForecastWidgetDto,
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
  createDefaultConfig: () => AnyWidgetConfig;
  isPremium?: boolean;
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
    component: (props) => (
      <WeatherForecastWidget {...props} widget={props.widget as WeatherForecastWidgetDto} />
    ),
    configForm: ({ initialConfig, onSubmit, onCancel }) => (
      <WeatherForm
        initialConfig={initialConfig as WeatherForecastWidgetConfig}
        onSubmit={(config) => onSubmit(config)}
        onCancel={onCancel}
      />
    ),
    createDefaultConfig: () => ({
      city: '',
    }),
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
        onSubmit={(config) => onSubmit(config)}
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
];

const widgetRegistryMap = new Map(widgetRegistry.map((widget) => [widget.id, widget]));

export function getWidgetDefinition(widgetType: string) {
  return widgetRegistryMap.get(widgetType) ?? null;
}

export function getDefaultWidgetConfig(widgetType: string): AnyWidgetConfig {
  return getWidgetDefinition(widgetType)?.createDefaultConfig() ?? {};
}

export type WidgetType = (typeof widgetRegistry)[number]['id'];
