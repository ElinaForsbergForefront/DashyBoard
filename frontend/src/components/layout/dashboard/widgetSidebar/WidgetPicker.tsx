import { useState } from 'react';
import { widgetOptions } from './types.ts';
import type { WidgetType } from './types.ts';

interface WidgetPickerProps {
  onAddWidget: (widget: WidgetType) => void;
  canAddWidget: boolean;
}

export function WidgetPicker({
  selectedWidget,
  onSelectWidget,
  onAddWidget,
  canAddWidget,
}: WidgetPickerProps) {
  const normalWidgets = widgetOptions.filter((w) => !w.isMini);
  const miniWidgets = widgetOptions.filter((w) => w.isMini);

  const renderButton = (widget: (typeof widgetOptions)[number]) => (
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
      <div className="flex items-center justify-between gap-1">
        <p className="text-sm font-medium">{widget.name}</p>
        {widget.isMini && (
          <span className="shrink-0 rounded px-1 py-0.5 text-[10px] font-medium bg-overlay text-muted">
            {widget.cols}×{widget.rows}
          </span>
        )}
      </div>
      <p className="text-xs opacity-80">{widget.description}</p>
    </button>
  );

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted">1. Välj widget</p>

      <div className="flex flex-col gap-2">
        {normalWidgets.map(renderButton)}
      </div>

      {miniWidgets.length > 0 && (
        <>
          <p className="pt-2 text-xs text-muted">Mini-widgets</p>
          <div className="flex flex-col gap-2">
            {miniWidgets.map(renderButton)}
          </div>
        </>
      )}

      {!canAddWidget && (
        <p className="text-xs text-muted">Select a mirror first to add a widget.</p>
      )}
    </div>
  );
}
