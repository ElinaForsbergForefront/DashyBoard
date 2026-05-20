import type { AnyWidgetConfig, MirrorWidgetDto } from '../../../../api/types/mirror';
import { getWidgetDefinition } from '../../../widgets/widgetRegistry';
import { WidgetSettingsResolver } from '../../../widgets/WidgetSettingsResolver';

interface WidgetFormPanelProps {
  widget: MirrorWidgetDto | null;
  onSubmitWidgetConfig: (widgetId: string, config: AnyWidgetConfig) => void;
  onClearSelectedWidget: () => void;
}

export function WidgetFormPanel({
  widget,
  onSubmitWidgetConfig,
  onClearSelectedWidget,
}: WidgetFormPanelProps) {
  if (!widget) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
        Välj en widget på mirrorn för att ändra inställningar.
      </div>
    );
  }

  const definition = getWidgetDefinition(widget.type);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {definition?.name ?? widget.type}
          </h3>
          <p className="text-xs text-muted">Widget-ID: {widget.id}</p>
        </div>

        <button
          type="button"
          onClick={onClearSelectedWidget}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
        >
          Stäng
        </button>
      </div>

      <WidgetSettingsResolver
        key={widget.id}
        widget={widget}
        onSubmit={(config) => onSubmitWidgetConfig(widget.id, config)}
        onCancel={onClearSelectedWidget}
      />
    </div>
  );
}
