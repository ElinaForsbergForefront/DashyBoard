import type { MirrorDto } from '../api/types/mirror';

interface AddedWidgetPlan {
  type: string;
  x: number;
  y: number;
}

interface MovedWidgetPlan {
  widgetId: string;
  x: number;
  y: number;
}

export interface MirrorWidgetMutationPlan {
  removedWidgetIds: string[];
  addedWidgets: AddedWidgetPlan[];
  movedWidgets: MovedWidgetPlan[];
  hasChanges: boolean;
}

export function buildMirrorWidgetMutationPlan(
  snapshot: MirrorDto | null,
  draft: MirrorDto | null,
): MirrorWidgetMutationPlan {
  if (!snapshot || !draft || snapshot.id !== draft.id) {
    return {
      removedWidgetIds: [],
      addedWidgets: [],
      movedWidgets: [],
      hasChanges: false,
    };
  }

  const snapshotWidgetsById = new Map(snapshot.widgets.map((widget) => [widget.id, widget]));
  const draftWidgetsById = new Map(draft.widgets.map((widget) => [widget.id, widget]));

  const removedWidgetIds = snapshot.widgets
    .filter((widget) => !draftWidgetsById.has(widget.id))
    .map((widget) => widget.id);

  const addedWidgets = draft.widgets
    .filter((widget) => widget.id.startsWith('temp-'))
    .map((widget) => ({
      type: widget.type,
      x: widget.x,
      y: widget.y,
    }));

  const movedWidgets = draft.widgets
    .filter((widget) => !widget.id.startsWith('temp-'))
    .flatMap((widget) => {
      const originalWidget = snapshotWidgetsById.get(widget.id);

      if (!originalWidget) {
        return [];
      }

      const hasMoved = originalWidget.x !== widget.x || originalWidget.y !== widget.y;

      return hasMoved
        ? [
            {
              widgetId: widget.id,
              x: widget.x,
              y: widget.y,
            },
          ]
        : [];
    });

  return {
    removedWidgetIds,
    addedWidgets,
    movedWidgets,
    hasChanges: removedWidgetIds.length > 0 || addedWidgets.length > 0 || movedWidgets.length > 0,
  };
}
