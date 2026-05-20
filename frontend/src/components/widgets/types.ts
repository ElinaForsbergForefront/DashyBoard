import type { AnyWidgetConfig, MirrorWidgetDto } from '../../api/types/mirror';

export interface WidgetViewProps<TWidget extends MirrorWidgetDto = MirrorWidgetDto> {
  widget: TWidget;
  isEditMode?: boolean;
  onUpdateConfig?: (config: TWidget['config']) => void;
  onEditingStateChange?: (widgetId: string, isEditing: boolean) => void;
}

export interface WidgetSettingsFormProps<TConfig extends AnyWidgetConfig = AnyWidgetConfig> {
  initialConfig: TConfig;
  onSubmit: (config: TConfig) => void;
  onCancel?: () => void;
}
