import { useEffect, useRef, useState } from 'react';

interface WidgetPosition {
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
  widgets: WidgetPosition[];
  isEditMode: boolean;
  onSaveWidgetPosition: (widgetId: string, x: number, y: number) => Promise<void> | void;
}

export function useWidgetDrag({
  canvasWidth,
  canvasHeight,
  widgets,
  isEditMode,
  onSaveWidgetPosition,
}: UseWidgetDragProps) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const nextPositions = widgets.reduce<Record<string, { x: number; y: number }>>((acc, widget) => {
      acc[widget.id] = { x: widget.x, y: widget.y };
      return acc;
    }, {});

    setLocalPositions(nextPositions);
  }, [widgets]);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>,
    widgetId: string,
    widgetX: number,
    widgetY: number,
  ) => {
    if (!isEditMode || !canvasRef.current) return;

    // Don't start drag if the user clicked on an interactive element
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"], [role="combobox"]')) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - widgetX;
    const offsetY = event.clientY - rect.top - widgetY;

    setDragState({
      widgetId,
      offsetX,
      offsetY,
    });

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const rawX = event.clientX - rect.left - dragState.offsetX;
    const rawY = event.clientY - rect.top - dragState.offsetY;

    const widgetElement = canvasRef.current.querySelector(
      `[data-widget-id="${dragState.widgetId}"]`,
    ) as HTMLDivElement | null;

    const widgetWidth = widgetElement?.offsetWidth ?? 200;
    const widgetHeight = widgetElement?.offsetHeight ?? 100;

    const nextX = clamp(rawX, 0, canvasWidth - widgetWidth);
    const nextY = clamp(rawY, 0, canvasHeight - widgetHeight);

    setLocalPositions((prev) => ({
      ...prev,
      [dragState.widgetId]: { x: nextX, y: nextY },
    }));
  };

  const handlePointerUp = async () => {
    if (!dragState) return;

    const position = localPositions[dragState.widgetId];
    const widgetId = dragState.widgetId;

    setDragState(null);

    if (!position) return;

    await onSaveWidgetPosition(widgetId, position.x, position.y);
  };

  const getWidgetPosition = (widgetId: string, fallbackX: number, fallbackY: number) => {
    return localPositions[widgetId] ?? { x: fallbackX, y: fallbackY };
  };

  return {
    canvasRef,
    dragState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    getWidgetPosition,
  };
}