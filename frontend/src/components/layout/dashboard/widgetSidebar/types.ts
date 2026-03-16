export type WidgetType = 'reminder' | 'weather';

export interface WidgetOption {
  id: WidgetType;
  name: string;
  description: string;
}

export const widgetOptions: WidgetOption[] = [
  {
    id: 'reminder',
    name: 'Reminder',
    description: 'Skapa påminnelser som visas i reminder-widgeten.',
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Ingen inmatning krävs just nu.',
  },
];