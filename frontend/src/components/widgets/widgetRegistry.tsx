import type { ComponentType } from 'react';
import { ClockWidget } from './ClockWidget';
import { ReminderForm } from '../forms/ReminderForm';
import { ReminderWidget } from './ReminderWidget';
import { CurrencyWidget } from './CurrencyWidget';
import { CurrencyWidgetForm } from '../forms/CurrencyWidgetForm';
import { TrafficForm } from '../forms/TrafficForm';
import { TrafficWidget } from './TrafficWidget';
import { SpotifyWidget } from './spotify/SpotifyWidget';

/**
 * Widget registry — det enda stället du behöver ändra för att lägga till en ny widget.
 *
 * Lägg till en ny widget så här:
 *
 *   {
 *     id: 'gold',
 *     name: 'Guld',
 *     description: 'Visar aktuellt guldpris.',
 *     component: GoldWidget,
 *     // configForm: GoldWidgetForm,  ← lägg till om widgeten behöver konfigformulär
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
    description: 'Skapa påminnelser som visas i reminder-widgeten.',
    cols: 2,
    rows: 2,
    component: ReminderWidget,
    configForm: ReminderForm,
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Visar aktuellt väder. Ingen konfiguration krävs.',
    cols: 2,
    rows: 2,
    component: ReminderWidget, // TODO: ersätt med WeatherWidget när den finns
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
    description: 'Visar aktuell tid baserat på vald tidszon.',
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
    description: 'Visar vad du lyssnar på just nu.',
    cols: 2,
    rows: 2,
    component: SpotifyWidget,
    isPremium: true,
  }
];

// Hjälptyp — härledd automatiskt från registret, ingen manuell union-typ behövs
export type WidgetType = (typeof widgetRegistry)[number]['id'];