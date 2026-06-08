import type {
  AnyWidgetConfig,
  MirrorWidgetDto,
} from '../api/types/mirror';

export function updateMirrorWidgetConfigDraft(
  widget: MirrorWidgetDto,
  config: AnyWidgetConfig,
): MirrorWidgetDto {
  return { ...widget, config } as MirrorWidgetDto;
}
