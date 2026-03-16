import type { ComponentType } from 'react';
import { useEditModeContext } from '../../context/EditModeContext';
import { useMirrorScale } from '../../hooks/useMirrorScale';
import { MirrorGrid } from './MirrorGrid';
import type { MirrorDto } from '../../api/types/mirror';
import type { WidgetType } from '../layout/dashboard/widgetSidebar/types.ts';
import { ReminderWidget } from '../widgets/ReminderWidget';

const widgetComponentMap: Partial<Record<WidgetType, ComponentType>> = {
  reminder: ReminderWidget,
};

interface MirrorCanvasProps {
  mirror: MirrorDto | null;
  widgets: WidgetType[];
}

export const MirrorCanvas = ({ mirror, widgets }: MirrorCanvasProps) => {
  const { isEditMode } = useEditModeContext();
  const { containerRef, scale, canvasWidth, canvasHeight } = useMirrorScale(
    mirror?.widthCm ?? 0,
    mirror?.heightCm ?? 0,
  );

  const renderedWidgets = widgets
    .map((widget) => {
      const WidgetComponent = widgetComponentMap[widget];

      if (!WidgetComponent) {
        return null;
      }

      return <WidgetComponent key={widget} />;
    })
    .filter(Boolean);

  if (!mirror) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center gap-3 overflow-hidden p-8 min-h-0"
      >
        <p className="text-muted text-sm">Select a mirror to start editing</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center gap-3 overflow-hidden p-8"
    >
      <div
        style={{ width: canvasWidth, height: canvasHeight }}
        className={`relative transition-all duration-300 rounded ${
          isEditMode
            ? 'ring-2 ring-primary outline-dashed outline-2 -outline-offset-2 outline-primary/30 bg-surface/50'
            : 'border border-border bg-surface/30'
        }`}
      >
        <MirrorGrid
          widthPx={canvasWidth}
          heightPx={canvasHeight}
          scale={scale}
          widthCm={mirror.widthCm}
          heightCm={mirror.heightCm}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-3">
          {renderedWidgets}
        </div>
      </div>

      <p className="text-xs text-muted">
        {mirror.widthCm} × {mirror.heightCm} cm
        <span className="ml-2 opacity-50">(1cm = {scale.toFixed(1)}px)</span>
      </p>
    </div>
  );
};
