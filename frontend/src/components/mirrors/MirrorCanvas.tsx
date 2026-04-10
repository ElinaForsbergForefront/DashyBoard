import { useCallback, useMemo } from 'react';
import { useEditModeContext } from '../../context/EditModeContext';
import { useMirrorScale } from '../../hooks/useMirrorScale';
import { useWidgetDrag } from '../../hooks/useWidgetDrag';
import { MirrorGrid } from './MirrorGrid';
import type { MirrorDto } from '../../api/types/mirror';
import { widgetRegistry } from '../widgets/widgetRegistry';

interface MirrorCanvasProps {
  mirror: MirrorDto | null;
  onRemoveWidget: (widgetId: string) => void;
  onMoveWidget: (widgetId: string, x: number, y: number) => Promise<void> | void;
}

export const MirrorCanvas = ({
  mirror,
  onRemoveWidget,
  onMoveWidget,
}: MirrorCanvasProps) => {
  const { isEditMode } = useEditModeContext();
  const { containerRef, scale, canvasWidth, canvasHeight } = useMirrorScale(
    mirror?.widthCm ?? 0,
    mirror?.heightCm ?? 0,
  );

  const memoizedOnMoveWidget = useCallback(
    (widgetId: string, x: number, y: number) => {
      onMoveWidget(widgetId, x, y);
    },
    [onMoveWidget],
  );

  const memoizedOnRemoveWidget = useCallback(
    (widgetId: string) => {
      onRemoveWidget(widgetId);
    },
    [onRemoveWidget],
  );


  const widgets = useMemo(() => mirror?.widgets ?? [], [mirror]);

  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp, getWidgetPosition } =
    useWidgetDrag({
      canvasWidth,
      canvasHeight,
      widgets,
      isEditMode,
      onSaveWidgetPosition: memoizedOnMoveWidget,
    });

  if (!mirror) {
    return (
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden p-8"
      >
        <p className="text-sm text-muted">Select a mirror to start editing</p>
      </div>
    );
  }

  const renderedWidgets = mirror.widgets
    .map((widget) => {
      const definition = widgetRegistry.find((w) => w.id === widget.type);

      if (!definition) return null;

      const WidgetComponent = definition.component;
      const position = getWidgetPosition(widget.id, widget.x, widget.y);

      return (
        <div
          key={widget.id}
          data-widget-id={widget.id}
          className={`absolute group touch-none ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{
            left: position.x,
            top: position.y,
          }}
          onPointerDown={
            isEditMode
              ? (event) => handlePointerDown(event, widget.id, position.x, position.y)
              : undefined
          }
        >
          {isEditMode && (
            <button
              type="button"
              onClick={() => memoizedOnRemoveWidget(widget.id)}
              aria-label={`Ta bort ${definition.name}`}
              className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow group-hover:opacity-100 transition-opacity"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <WidgetComponent />
        </div>
      );
    })
    .filter(Boolean);



  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center gap-3 overflow-hidden p-8"
    >
      <div
        ref={canvasRef}
        style={{ width: canvasWidth, height: canvasHeight }}
        className={`relative transition-all duration-300 rounded ${
          isEditMode
            ? 'ring-2 ring-primary outline-dashed outline-2 -outline-offset-2 outline-primary/30 bg-surface/50'
            : 'border border-border bg-surface/30'
        }`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
