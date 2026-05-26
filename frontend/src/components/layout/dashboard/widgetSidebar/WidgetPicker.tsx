import { useState } from 'react';
import { widgetOptions } from './types.ts';
import type { WidgetType } from './types.ts';

interface WidgetPickerProps {
  onAddWidget: (widget: WidgetType) => void;
  canAddWidget: boolean;
}

export function WidgetPicker({ onAddWidget, canAddWidget }: WidgetPickerProps) {
  const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">1. Select widget</p>
      <div className="flex flex-col gap-2">
        {widgetOptions.map((widget) => (
          <button
            key={widget.id}
            type="button"
            onClick={() => {
              setSelectedWidgetType(widget.id);
              if (canAddWidget) {
                onAddWidget(widget.id);
              }
            }}
            className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
              selectedWidgetType === widget.id
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-surface text-muted hover:text-foreground'
            }`}
            disabled={!canAddWidget}
          >
            <p className="text-sm font-medium">{widget.name}</p>
            <p className="text-xs opacity-80">{widget.description}</p>
          </button>
        ))}
      </div>
      {!canAddWidget && (
        <p className="text-xs text-muted">Select a mirror first to add a widget.</p>
      )}
    </div>
  );
}
