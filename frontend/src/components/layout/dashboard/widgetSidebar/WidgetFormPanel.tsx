import { useMemo } from 'react';
import { widgetRegistry } from '../../../widgets/widgetRegistry';
import type { WidgetType } from './types.ts';

interface WidgetFormPanelProps {
  selectedWidget: WidgetType | null;
}

export function WidgetFormPanel({ selectedWidget }: WidgetFormPanelProps) {
  const activeWidget = useMemo(
    () => widgetRegistry.find((w) => w.id === selectedWidget) ?? null,
    [selectedWidget],
  );

  if (!activeWidget) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
        Välj en widget för att fortsätta.
      </div>
    );
  }

  if (!activeWidget.configForm) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted">
        <p>Den här widgeten behöver ingen konfiguration.</p>
      </div>
    );
  }

  const ConfigForm = activeWidget.configForm;
  return <ConfigForm />;
}