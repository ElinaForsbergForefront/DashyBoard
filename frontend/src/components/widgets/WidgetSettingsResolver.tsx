import type { AnyWidgetConfig, MirrorWidgetDto } from '../../api/types/mirror';
import { getWidgetDefinition } from './widgetRegistry';

interface WidgetSettingsResolverProps {
  widget: MirrorWidgetDto | null;
  onSubmit: (config: AnyWidgetConfig) => void;
  onCancel?: () => void;
}

export function WidgetSettingsResolver({
  widget,
  onSubmit,
  onCancel,
}: WidgetSettingsResolverProps) {
  if (!widget) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
        Välj en widget på mirrorn för att ändra inställningar.
      </div>
    );
  }

  const definition = getWidgetDefinition(widget.type);

  if (!definition?.configForm) {
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted">
        Den här widgeten har inga mirror-bundna inställningar ännu.
      </div>
    );
  }

  const ConfigForm = definition.configForm;

  return <ConfigForm initialConfig={widget.config} onSubmit={onSubmit} onCancel={onCancel} />;
}
