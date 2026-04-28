import { useCallback, useMemo } from 'react';
import { useEditModeContext } from '../../context/EditModeContext';
import { useMirrorScale } from '../../hooks/useMirrorScale';
import { useWidgetDrag } from '../../hooks/useWidgetDrag';
import { MirrorGrid } from './MirrorGrid';
import type { MirrorDto } from '../../api/types/mirror';
import { widgetRegistry } from '../widgets/widgetRegistry';
import { GRID_UNIT_CM, REFERENCE_SCALE } from '../../constants/grid';

interface MirrorCanvasProps {
  mirror: MirrorDto | null;
  onRemoveWidget?: (widgetId: string) => void;
  onMoveWidget?: (widgetId: string, xCm: number, yCm: number) => Promise<void> | void;
  previewMode?: boolean;
  previewBackground?: 'dark' | 'light';
}

export const MirrorCanvas = ({
  mirror,
  onRemoveWidget,
  onMoveWidget,
  previewMode = false,
  previewBackground = 'dark',
}: MirrorCanvasProps) => {
  const { isEditMode: contextEditMode } = useEditModeContext();
  const isEditMode = previewMode ? false : contextEditMode;
  const { containerRef, scale, canvasWidth, canvasHeight } = useMirrorScale(
    mirror?.widthCm ?? 0,
    mirror?.heightCm ?? 0,
  );

  const memoizedOnMoveWidget = useCallback(
    (widgetId: string, xCm: number, yCm: number) => onMoveWidget?.(widgetId, xCm, yCm),
    [onMoveWidget],
  );

  const memoizedOnRemoveWidget = useCallback(
    (widgetId: string) => onRemoveWidget?.(widgetId),
    [onRemoveWidget],
  );

  const widgets = useMemo(() => mirror?.widgets ?? [], [mirror]);

  const widgetSizesPx = useMemo(() => {
    const map: Record<string, { width: number; height: number }> = {};
    for (const widget of widgets) {
      const def = widgetRegistry.find((w) => w.id === widget.type);
      if (def) {
        map[widget.id] = {
          width: def.cols * GRID_UNIT_CM * scale,
          height: def.rows * GRID_UNIT_CM * scale,
        };
      }
    }
    return map;
  }, [widgets, scale]);

  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp, getWidgetPosition } =
    useWidgetDrag({
      canvasWidth,
      canvasHeight,
      scale,
      widgets,
      widgetSizesPx,
      isEditMode,
      onSaveWidgetPosition: memoizedOnMoveWidget,
    });

  if (!mirror) {
    if (previewMode) return null;
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

      const slotWidthPx = definition.cols * GRID_UNIT_CM * scale;
      const slotHeightPx = definition.rows * GRID_UNIT_CM * scale;
      const naturalWidthPx = definition.cols * GRID_UNIT_CM * REFERENCE_SCALE;
      const naturalHeightPx = definition.rows * GRID_UNIT_CM * REFERENCE_SCALE;
      const contentScale = scale / REFERENCE_SCALE;

      return (
        <div
          key={widget.id}
          data-widget-id={widget.id}
          className={`absolute group touch-none ${isEditMode && !previewMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{
            left: position.x,
            top: position.y,
            width: slotWidthPx,
            height: slotHeightPx,
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
              aria-label={`Remove ${definition.name}`}
              className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 shadow group-hover:opacity-100 transition-opacity"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 1l8 8M9 1L1 9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          <div style={{ width: slotWidthPx, height: slotHeightPx, overflow: 'hidden' }}>
            <div
              style={{
                width: naturalWidthPx,
                height: naturalHeightPx,
                transform: `scale(${contentScale})`,
                transformOrigin: 'top left',
              }}
            >
              <WidgetComponent />
            </div>
          </div>
        </div>
      );
    })
    .filter(Boolean);

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col items-center justify-center gap-3 overflow-hidden p-8 ${
        previewMode
          ? previewBackground === 'light'
            ? 'light'
            : 'dark-theme-scope'
          : ''
      }`}
    >
      {previewMode ? (
        <div
          className="relative p-[5px] rounded-[20px] transition-all duration-500"
          style={{
            background:
              previewBackground === 'light'
                ? 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(210,215,225,0.9) 40%, rgba(190,196,208,0.85) 100%)'
                : 'linear-gradient(145deg, rgba(60,62,72,0.9) 0%, rgba(32,34,42,0.95) 40%, rgba(18,19,24,1) 100%)',
            boxShadow:
              previewBackground === 'light'
                ? '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.18), 0 60px 120px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.06)'
                : '0 4px 20px rgba(0,0,0,0.6), 0 30px 80px rgba(0,0,0,0.85), 0 80px 160px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.5)',
          }}
        >
          <div
            ref={canvasRef}
            style={{ width: canvasWidth, height: canvasHeight }}
            className={`relative rounded-[16px] overflow-hidden transition-all duration-500 ${
              previewBackground === 'light' ? 'bg-white' : 'bg-[#0d0d10]'
            }`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {renderedWidgets}
          </div>
        </div>
      ) : (
      <div
        ref={canvasRef}
        style={{ width: canvasWidth, height: canvasHeight }}
        className={`relative transition-all duration-500 ${
          isEditMode
            ? 'rounded ring-2 ring-primary outline-dashed outline-2 -outline-offset-2 outline-primary/30 bg-surface/50'
            : 'rounded border border-border bg-surface/30'
        }`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <MirrorGrid
          widthPx={canvasWidth}
          heightPx={canvasHeight}
          scale={scale}
          widthCm={mirror.widthCm}
          heightCm={mirror.heightCm}
        />

        {renderedWidgets}
      </div>
      )}

      {!previewMode && (
        <p className="text-xs text-muted">
          {mirror.widthCm} × {mirror.heightCm} cm
          <span className="ml-2 opacity-50">(1 cm = {scale.toFixed(1)} px)</span>
        </p>
      )}
    </div>
  );
};
