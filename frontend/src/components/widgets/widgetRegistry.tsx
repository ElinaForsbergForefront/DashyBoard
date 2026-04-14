import type { ComponentType } from 'react';
import { ClockWidget } from './ClockWidget';
import { ReminderForm } from '../forms/ReminderForm';
import { ReminderWidget } from './ReminderWidget';
import { CurrencyWidget } from './CurrencyWidget';
import { CurrencyWidgetForm } from '../forms/CurrencyWidgetForm';
import { WeatherWidget } from './WeatherWidget';


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
  component: ComponentType;
  configForm?: ComponentType;
}

export const widgetRegistry: WidgetDefinition[] = [
    {
        id: 'clock',
        name: 'Clock',
        description: 'Visar aktuell tid baserat på vald tidszon.',
        component: ClockWidget,
    },
  {
    id: 'reminder',
    name: 'Reminder',
    description: 'Skapa påminnelser som visas i reminder-widgeten.',
    component: ReminderWidget,
    configForm: ReminderForm,
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Visar aktuellt väder för vald plats.',
    component: WeatherWidget,
  },
  {
    id: 'currency',
    name: 'Currency',
    description: 'Track any asset — currencies, crypto, stocks — with a live price chart.',
    component: CurrencyWidget,
    configForm: CurrencyWidgetForm,
  },
];

// Hjälptyp — härledd automatiskt från registret, ingen manuell union-typ behövs
export type WidgetType = (typeof widgetRegistry)[number]['id'];
