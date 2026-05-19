import type { ComponentType } from 'react';
import { ClockWidget } from './ClockWidget';
import { ReminderForm } from '../forms/ReminderForm';
import { ReminderWidget } from './ReminderWidget';
import { CurrencyWidget } from './CurrencyWidget';
import { CurrencyWidgetForm } from '../forms/CurrencyWidgetForm';
import { TrafficForm } from '../forms/TrafficForm';
import { TrafficWidget } from './TrafficWidget';
import { WeatherForm } from '../forms/WeatherForm';
import { CurrentWeatherWidget} from './CurrentWeatherWidget';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { SpotifyWidget } from './spotify/SpotifyWidget';


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
  component: ComponentType;
  configForm?: ComponentType;
  isPremium?: boolean;
}

export const widgetRegistry: WidgetDefinition[] = [
  {
    id: 'reminder',
    name: 'Reminder',
    description: 'Create reminders that appear in the reminder widget.',
    cols: 2,
    rows: 2,
    component: ReminderWidget,
    configForm: ReminderForm,
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Shows current weather for the selected location.',
    cols: 2,
    rows: 2,
    component: CurrentWeatherWidget,
    configForm: WeatherForm,
  },
  {
    id: 'weather-forecast',
    name: 'Weather Forecast',
    description: 'Shows weather forecast for the selected location.',
    cols: 2,
    rows: 3,
    component: WeatherForecastWidget,
    isPremium: true,
  },
  {
    id: 'currency',
    name: 'Currency',
    description: 'Track any asset — currencies, crypto, stocks — with a live price chart.',
    cols: 3,
    rows: 2,
    component: CurrencyWidget,
    configForm: CurrencyWidgetForm,
    isPremium: true,
  },
  {
    id: 'clock',
    name: 'Clock',
    description: 'Shows the current time based on the selected timezone.',
    cols: 2,
    rows: 2,
    component: ClockWidget,
  },
  {
    id: 'traffic',
    name: 'Traffic',
    description: 'Shows departing public transport from a selected station.',
    cols: 3,
    rows: 3,
    component: TrafficWidget, 
    configForm: TrafficForm,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Shows what you\'re currently listening to.',
    cols: 2,
    rows: 2,
    component: SpotifyWidget,
    isPremium: true,
  }
];

// Helper type — automatically derived from the registry, no manual union type needed
export type WidgetType = (typeof widgetRegistry)[number]['id'];