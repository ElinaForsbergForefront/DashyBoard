import { useMemo } from 'react';
import { ReminderWidgetForm } from './ReminderWidgetForm.tsx';
import { widgetOptions } from './types.ts';
import type { WidgetType } from './types.ts';

interface WidgetFormPanelProps {
  selectedWidget: WidgetType | null;
}

export function WidgetFormPanel({ selectedWidget }: WidgetFormPanelProps) {
  const activeWidget = useMemo(
    () => widgetOptions.find((widget) => widget.id === selectedWidget) ?? null,
    [selectedWidget],
  );

  if (!activeWidget) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
        Välj en widget för att fortsätta.
      </div>
    );
  }

  if (activeWidget.id === 'reminder') {
    return <ReminderWidgetForm />;
  }

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted">
      <p className="font-medium text-foreground mb-1">2. Formulär</p>
      <p>Den här widgeten behöver inget formulär ännu.</p>
    </div>
  );
}