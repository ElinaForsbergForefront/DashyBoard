import type { MirrorDto } from '../api/types/mirror';

interface AddedWidgetPlan {
  type: string;
  x: number;
  y: number;
  config: Record<string, unknown>;
}

interface MovedWidgetPlan {
  widgetId: string;
  x: number;
  y: number;
}

interface UpdatedWidgetConfigPlan {
  widgetId: string;
  config: Record<string, unknown>;
}

export interface MirrorWidgetMutationPlan {
  removedWidgetIds: string[];
  addedWidgets: AddedWidgetPlan[];
  movedWidgets: MovedWidgetPlan[];
  updatedWidgetConfigs: UpdatedWidgetConfigPlan[];
  hasChanges: boolean;
}

function normalizeForComparison(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeForComparison);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, normalizeForComparison(nestedValue)]),
    );
  }

  return value;
}

function areConfigsEqual(left: unknown, right: unknown) {
  return (
    JSON.stringify(normalizeForComparison(left)) === JSON.stringify(normalizeForComparison(right))
  );
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
      updatedWidgetConfigs: [],
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
      config: widget.config as Record<string, unknown>,
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

  const updatedWidgetConfigs = draft.widgets
    .filter((widget) => !widget.id.startsWith('temp-'))
    .flatMap((widget) => {
      const originalWidget = snapshotWidgetsById.get(widget.id);

      if (!originalWidget) {
        return [];
      }

      const hasUpdatedConfig = !areConfigsEqual(originalWidget.config, widget.config);

      return hasUpdatedConfig
        ? [
            {
              widgetId: widget.id,
              config: widget.config as Record<string, unknown>,
            },
          ]
        : [];
    });

  return {
    removedWidgetIds,
    addedWidgets,
    movedWidgets,
    updatedWidgetConfigs,
    hasChanges:
      removedWidgetIds.length > 0 ||
      addedWidgets.length > 0 ||
      movedWidgets.length > 0 ||
      updatedWidgetConfigs.length > 0,
  };
}
