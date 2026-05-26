import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnyWidgetConfig, MirrorDto } from '../api/types/mirror';
import type { WidgetType } from '../components/layout/dashboard/widgetSidebar/types.ts';
import { widgetRegistry } from '../components/widgets/widgetRegistry';
import { createMirrorWidgetDraft } from '../utils/createMirrorWidgetDraft';
import { buildMirrorWidgetMutationPlan } from '../utils/mirrorWidgetMutationPlan';
import { findFirstFreeCell } from '../utils/widgetPlacement';
import { updateMirrorWidgetConfigDraft } from '../utils/updateMirrorWidgetConfigDraft';

export function useMirrorDraft(activeMirror: MirrorDto | null) {
  const [localMirror, setLocalMirror] = useState<MirrorDto | null>(null);
  const [editingWidgetIds, setEditingWidgetIds] = useState<string[]>([]);

  const snapshotRef = useRef<MirrorDto | null>(null);
  const localMirrorRef = useRef<MirrorDto | null>(null);

  const displayedMirror = localMirror ?? activeMirror;
  const hasOpenWidgetEditor = editingWidgetIds.length > 0;

  const initializeDraft = useCallback((mirror: MirrorDto) => {
    snapshotRef.current = structuredClone(mirror);
    setLocalMirror(structuredClone(mirror));
    setEditingWidgetIds([]);
  }, []);

  const syncDraftFromMirror = useCallback((mirror: MirrorDto) => {
    snapshotRef.current = structuredClone(mirror);
    localMirrorRef.current = structuredClone(mirror);
    setLocalMirror(structuredClone(mirror));
  }, []);

  const clearDraft = useCallback(() => {
    setEditingWidgetIds([]);
    setLocalMirror(null);
    localMirrorRef.current = null;
    snapshotRef.current = null;
  }, []);

  const hasUnsavedChanges = useCallback(() => {
    const mutationPlan = buildMirrorWidgetMutationPlan(snapshotRef.current, localMirrorRef.current);
    return mutationPlan.hasChanges;
  }, []);

  const handleAddWidget = useCallback((widgetType: WidgetType) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setLocalMirror((previous) => {
      if (!previous) {
        return previous;
      }

      const definition = widgetRegistry.find((widget) => widget.id === widgetType);
      if (!definition) {
        return previous;
      }

      const placed = previous.widgets.map((widget) => {
        const widgetDefinition = widgetRegistry.find((entry) => entry.id === widget.type);
        return {
          x: widget.x,
          y: widget.y,
          cols: widgetDefinition?.cols ?? 2,
          rows: widgetDefinition?.rows ?? 2,
        };
      });

      const position = findFirstFreeCell(
        placed,
        definition.cols,
        definition.rows,
        previous.widthCm,
        previous.heightCm,
      );

      return {
        ...previous,
        widgets: [
          ...previous.widgets,
          createMirrorWidgetDraft(tempId, widgetType, position.x, position.y),
        ],
      };
    });
  }, []);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setLocalMirror((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        widgets: previous.widgets.filter((widget) => widget.id !== widgetId),
      };
    });
  }, []);

  const handleMoveWidget = useCallback((widgetId: string, x: number, y: number) => {
    setLocalMirror((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        widgets: previous.widgets.map((widget) =>
          widget.id === widgetId ? { ...widget, x, y } : widget,
        ),
      };
    });
  }, []);

  const handleUpdateWidgetConfig = useCallback((widgetId: string, config: AnyWidgetConfig) => {
    setLocalMirror((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        widgets: previous.widgets.map((widget) =>
          widget.id === widgetId ? updateMirrorWidgetConfigDraft(widget, config) : widget,
        ),
      };
    });
  }, []);

  const handleWidgetEditorStateChange = useCallback((widgetId: string, isEditing: boolean) => {
    setEditingWidgetIds((previous) => {
      if (isEditing) {
        return previous.includes(widgetId) ? previous : [...previous, widgetId];
      }

      return previous.filter((currentWidgetId) => currentWidgetId !== widgetId);
    });
  }, []);

  useEffect(() => {
    localMirrorRef.current = localMirror;
  }, [localMirror]);

  useEffect(() => {
    if (!displayedMirror) {
      setEditingWidgetIds([]);
      return;
    }

    const widgetIds = new Set(displayedMirror.widgets.map((widget) => widget.id));
    setEditingWidgetIds((previous) => previous.filter((widgetId) => widgetIds.has(widgetId)));
  }, [displayedMirror]);

  return {
    displayedMirror,
    snapshotRef,
    localMirrorRef,
    hasOpenWidgetEditor,
    hasDraftSession: snapshotRef.current !== null,
    initializeDraft,
    syncDraftFromMirror,
    clearDraft,
    hasUnsavedChanges,
    handleAddWidget,
    handleRemoveWidget,
    handleMoveWidget,
    handleUpdateWidgetConfig,
    handleWidgetEditorStateChange,
  };
}
