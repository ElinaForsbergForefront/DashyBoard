import type { MirrorWidgetDto } from '../api/types/mirror';
import { getDefaultWidgetConfig, widgetRegistry } from '../components/widgets/widgetRegistry';

export function createMirrorWidgetDraft(
  id: string,
  type: string,
  x: number,
  y: number,
): MirrorWidgetDto {
  const definition = widgetRegistry.find((w) => w.id === type);
  if (!definition) {
    throw new Error(`Unsupported widget type: ${type}`);
  }
  return {
    id,
    type: type as MirrorWidgetDto['type'],
    x,
    y,
    config: getDefaultWidgetConfig(type),
  } as unknown as MirrorWidgetDto;
}
