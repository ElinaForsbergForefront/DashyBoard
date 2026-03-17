import { widgetOptions } from './types.ts';
import type { WidgetType } from './types.ts';

interface WidgetPickerProps {
  selectedWidget: WidgetType | null;
  onSelectWidget: (widget: WidgetType) => void;
  onAddWidget: (widget: WidgetType) => void;
  canAddWidget: boolean;
}

export function WidgetPicker({
  selectedWidget,
  onSelectWidget,
  onAddWidget,
  canAddWidget,
}: WidgetPickerProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">1. Välj widget</p>
      <div className="flex flex-col gap-2">
        {widgetOptions.map((widget) => (
          <button
            key={widget.id}
            type="button"
            onClick={() => {
              onSelectWidget(widget.id);
              if (canAddWidget) {
                onAddWidget(widget.id);
              }
            }}
            className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
              selectedWidget === widget.id
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
        <p className="text-xs text-muted">Välj först en mirror för att lägga till widget.</p>
      )}
    </div>
  );
}