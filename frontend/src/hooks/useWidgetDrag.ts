import { useEffect, useRef, useState } from 'react';
import { GRID_UNIT_CM } from '../constants/grid';

interface WidgetPositionCm {
  id: string;
  x: number;
  y: number;
}

interface DragState {
  widgetId: string;
  offsetX: number;
  offsetY: number;
}

interface UseWidgetDragProps {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  widgets: WidgetPositionCm[];
  widgetSizesPx: Record<string, { width: number; height: number }>;
  isEditMode: boolean;
  onSaveWidgetPosition: (widgetId: string, xCm: number, yCm: number) => Promise<void> | void;
}

export function useWidgetDrag({
  canvasWidth,
  canvasHeight,
  scale,
  widgets,
  widgetSizesPx,
  isEditMode,
  onSaveWidgetPosition,
}: UseWidgetDragProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>(
    {},
  );

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    setLocalPositions((prev) => {
      const next: Record<string, { x: number; y: number }> = {};
      for (const w of widgets) {
        if (dragStateRef.current?.widgetId === w.id) {
          // Keep the in-progress drag position, don't overwrite with server value.
          next[w.id] = prev[w.id] ?? { x: w.x * scale, y: w.y * scale };
        } else {
          next[w.id] = { x: w.x * scale, y: w.y * scale };
        }
      }
      return next;
    });
  }, [widgets, scale]);

  const snapToPx = (px: number): number => {
    const step = GRID_UNIT_CM * scale;
    return Math.round(px / step) * step;
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>,
    widgetId: string,
    widgetX: number,
    widgetY: number,
  ) => {
    if (!isEditMode || !canvasRef.current) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"], [role="combobox"]'))
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const state: DragState = {
      widgetId,
      offsetX: event.clientX - rect.left - widgetX,
      offsetY: event.clientY - rect.top - widgetY,
    };
    dragStateRef.current = state;
    setDragState(state);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStateRef.current;
    if (!ds || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = event.clientX - rect.left - ds.offsetX;
    const rawY = event.clientY - rect.top - ds.offsetY;

    const size = widgetSizesPx[ds.widgetId] ?? { width: 0, height: 0 };
    const nextX = clamp(snapToPx(rawX), 0, canvasWidth - size.width);
    const nextY = clamp(snapToPx(rawY), 0, canvasHeight - size.height);

    setLocalPositions((prev) => ({
      ...prev,
      [ds.widgetId]: { x: nextX, y: nextY },
    }));
  };

  const handlePointerUp = () => {
    const ds = dragStateRef.current;
    if (!ds) return;

    const position = localPositions[ds.widgetId];
    const widgetId = ds.widgetId;

    dragStateRef.current = null;
    setDragState(null);

    if (!position) return;

    void onSaveWidgetPosition(widgetId, position.x / scale, position.y / scale);
  };

  const getWidgetPosition = (widgetId: string, fallbackXCm: number, fallbackYCm: number) =>
    localPositions[widgetId] ?? { x: fallbackXCm * scale, y: fallbackYCm * scale };

  return {
    canvasRef,
    dragState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getWidgetPosition,
  };
}
