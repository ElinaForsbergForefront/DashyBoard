import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider, useEditModeContext } from '../context/EditModeContext';
import { useActiveMirror } from '../context/ActiveMirrorContext';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { CreateMirrorModal } from '../components/mirrors/CreateMirrorModal';
import { EditMirrorModal } from '../components/mirrors/EditMirrorModal';
import { DeleteMirrorModal } from '../components/mirrors/DeleteMirrorModal';
import { updateMirrorWidgetConfigDraft } from '../utils/updateMirrorWidgetConfigDraft';
import {
  useGetMyMirrorsQuery,
  useAddWidgetMutation,
  useMoveWidgetMutation,
  useRemoveWidgetMutation,
  useUpdateWidgetConfigMutation,
} from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import type { AnyWidgetConfig, MirrorDto } from '../api/types/mirror';
import type { WidgetType } from '../components/layout/dashboard/widgetSidebar/types.ts';
import { widgetRegistry } from '../components/widgets/widgetRegistry';
import { findFirstFreeCell } from '../utils/widgetPlacement';
import { useGetCurrentUserQuery } from '../api/endpoints/user';
import { useMirrorAutosavePreference } from '../hooks/useMirrorAutosavePreference';
import { buildMirrorWidgetMutationPlan } from '../utils/mirrorWidgetMutationPlan';
import { createMirrorWidgetDraft } from '../utils/createMirrorWidgetDraft';

const AUTOSAVE_INTERVAL_MS = 15_000;
const AUTOSAVE_STATUS_RESET_MS = 2_000;

type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function MirrorContent() {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode } = useEditModeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeMirrorId, setActiveMirrorId } = useActiveMirror();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMirror, setEditingMirror] = useState<MirrorDto | null>(null);
  const [deletingMirror, setDeletingMirror] = useState<MirrorDto | null>(null);
  const [localMirror, setLocalMirror] = useState<MirrorDto | null>(null);
  const [editingWidgetIds, setEditingWidgetIds] = useState<string[]>([]);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');

  const snapshotRef = useRef<MirrorDto | null>(null);
  const localMirrorRef = useRef<MirrorDto | null>(null);
  const saveInFlightRef = useRef(false);
  const pendingAutosaveSyncMirrorIdRef = useRef<string | null>(null);
  const autosaveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAutosaveEnabled, toggleAutosave } = useMirrorAutosavePreference();

  const { data: mirrors = [], refetch: refetchMirrors } = useGetMyMirrorsQuery();
  const { data: currentUser } = useGetCurrentUserQuery();
  const mirrorLimit = currentUser?.isPremium ? 10 : 3;
  const canAddMirror = mirrors.length < mirrorLimit;

  const [addWidget] = useAddWidgetMutation();
  const [moveWidget] = useMoveWidgetMutation();
  const [removeWidget] = useRemoveWidgetMutation();
  const [updateWidgetConfig] = useUpdateWidgetConfigMutation();

  const activeMirror = mirrors.find((mirror) => mirror.id === activeMirrorId) ?? null;
  const displayedMirror = localMirror ?? activeMirror;
  const hasOpenWidgetEditor = editingWidgetIds.length > 0;

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

  const clearAutosaveStatusTimer = useCallback(() => {
    if (autosaveStatusTimeoutRef.current) {
      clearTimeout(autosaveStatusTimeoutRef.current);
      autosaveStatusTimeoutRef.current = null;
    }
  }, []);

  const updateAutosaveStatus = useCallback(
    (nextStatus: AutosaveStatus) => {
      clearAutosaveStatusTimer();
      setAutosaveStatus(nextStatus);

      if (nextStatus === 'saved' || nextStatus === 'error') {
        autosaveStatusTimeoutRef.current = setTimeout(() => {
          setAutosaveStatus('idle');
          autosaveStatusTimeoutRef.current = null;
        }, AUTOSAVE_STATUS_RESET_MS);
      }
    },
    [clearAutosaveStatusTimer],
  );

  useEffect(() => {
    return () => {
      clearAutosaveStatusTimer();
    };
  }, [clearAutosaveStatusTimer]);

  useEffect(() => {
    const stateId = (location.state as { activeMirrorId?: string } | null)?.activeMirrorId;
    if (stateId) {
      setActiveMirrorId(stateId);
    }
  }, [location.state, setActiveMirrorId]);

  useEffect(() => {
    if (isEditMode && activeMirror && snapshotRef.current === null) {
      const snapshot = structuredClone(activeMirror);
      snapshotRef.current = snapshot;
      setLocalMirror(structuredClone(activeMirror));
    }
  }, [isEditMode, activeMirror]);

  useEffect(() => {
    const pendingMirrorId = pendingAutosaveSyncMirrorIdRef.current;

    if (!pendingMirrorId || !activeMirror || activeMirror.id !== pendingMirrorId) {
      return;
    }

    const freshMirror = structuredClone(activeMirror);
    snapshotRef.current = freshMirror;
    localMirrorRef.current = structuredClone(activeMirror);
    setLocalMirror(structuredClone(activeMirror));

    pendingAutosaveSyncMirrorIdRef.current = null;
    saveInFlightRef.current = false;
    updateAutosaveStatus('saved');
  }, [activeMirror, updateAutosaveStatus]);

  const startEditSession = useCallback(
    (mirror: MirrorDto) => {
      const snapshot = structuredClone(mirror);
      snapshotRef.current = snapshot;
      setLocalMirror(structuredClone(mirror));
      updateAutosaveStatus('idle');
      enterEditMode();
    },
    [enterEditMode, updateAutosaveStatus],
  );

  useEffect(() => {
    const state = location.state as { enterEditMode?: boolean } | null;
    if (state?.enterEditMode && activeMirror && !isEditMode) {
      startEditSession(activeMirror);
      navigate('/', { replace: true, state: { activeMirrorId } });
    }
  }, [activeMirror, activeMirrorId, isEditMode, location.state, navigate, startEditSession]);

  const handleEnterEditMode = useCallback(() => {
    if (!activeMirror) return;
    startEditSession(activeMirror);
  }, [activeMirror, startEditSession]);

  const handleAddWidget = useCallback((widgetType: WidgetType) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setLocalMirror((previous) => {
      if (!previous) return previous;

      const definition = widgetRegistry.find((widget) => widget.id === widgetType);
      if (!definition) return previous;

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

      const nextWidget = createMirrorWidgetDraft(tempId, widgetType, position.x, position.y);

      return {
        ...previous,
        widgets: [...previous.widgets, nextWidget],
      };
    });
  }, []);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setLocalMirror((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        widgets: previous.widgets.filter((widget) => widget.id !== widgetId),
      };
    });
  }, []);

  const handleMoveWidget = useCallback((widgetId: string, x: number, y: number) => {
    setLocalMirror((previous) => {
      if (!previous) return previous;
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
      if (!previous) return previous;

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

  const applyMutationPlanSequentially = useCallback(
    async (mirrorId: string, mutationPlan: ReturnType<typeof buildMirrorWidgetMutationPlan>) => {
      for (const widgetId of mutationPlan.removedWidgetIds) {
        await removeWidget({ mirrorId, widgetId }).unwrap();
      }

      for (const widget of mutationPlan.addedWidgets) {
        await addWidget({ mirrorId, body: widget }).unwrap();
      }

      for (const { widgetId, x, y } of mutationPlan.movedWidgets) {
        await moveWidget({ mirrorId, widgetId, body: { x, y } }).unwrap();
      }

      for (const { widgetId, config } of mutationPlan.updatedWidgetConfigs) {
        await updateWidgetConfig({
          mirrorId,
          widgetId,
          body: { config },
        }).unwrap();
      }
    },
    [addWidget, moveWidget, removeWidget, updateWidgetConfig],
  );

  const flushMirrorChanges = useCallback(
    async ({
      exitEditMode,
      trigger,
    }: {
      exitEditMode: boolean;
      trigger: 'manual' | 'autosave';
    }) => {
      if (saveInFlightRef.current || pendingAutosaveSyncMirrorIdRef.current) {
        return false;
      }

      const snapshot = snapshotRef.current;
      const draft = localMirrorRef.current;

      if (!snapshot || !draft) {
        if (exitEditMode) {
          saveEditMode();
          setLocalMirror(null);
          localMirrorRef.current = null;
          snapshotRef.current = null;
        }

        return true;
      }

      const mutationPlan = buildMirrorWidgetMutationPlan(snapshot, draft);

      if (!mutationPlan.hasChanges) {
        if (exitEditMode) {
          saveEditMode();
          setLocalMirror(null);
          localMirrorRef.current = null;
          snapshotRef.current = null;
        }

        return true;
      }

      saveInFlightRef.current = true;

      if (trigger === 'manual') {
        updateAutosaveStatus('saving');
      } else if (trigger === 'autosave') {
        updateAutosaveStatus('saving');
      }

      if (exitEditMode) {
        saveEditMode();
      }

      const mirrorId = draft.id;

      try {
        await applyMutationPlanSequentially(mirrorId, mutationPlan);

        if (exitEditMode) {
          await refetchMirrors();
          setLocalMirror(null);
          localMirrorRef.current = null;
          snapshotRef.current = null;
          saveInFlightRef.current = false;
          updateAutosaveStatus('saved');
          return true;
        }

        pendingAutosaveSyncMirrorIdRef.current = mirrorId;
        await refetchMirrors();
        return true;
      } catch {
        saveInFlightRef.current = false;
        pendingAutosaveSyncMirrorIdRef.current = null;

        if (trigger === 'autosave') {
          updateAutosaveStatus('error');
        }

        return false;
      }
    },
    [
      addWidget,
      moveWidget,
      applyMutationPlanSequentially,
      refetchMirrors,
      removeWidget,
      saveEditMode,
      updateAutosaveStatus,
      updateWidgetConfig,
    ],
  );

  const handleSave = useCallback(async () => {
    await flushMirrorChanges({ exitEditMode: true, trigger: 'manual' });
  }, [flushMirrorChanges]);

  const handleDiscard = useCallback(() => {
    clearAutosaveStatusTimer();
    updateAutosaveStatus('idle');
    pendingAutosaveSyncMirrorIdRef.current = null;
    saveInFlightRef.current = false;
    setEditingWidgetIds([]);
    setLocalMirror(null);
    localMirrorRef.current = null;
    snapshotRef.current = null;
    discardEditMode();
  }, [clearAutosaveStatusTimer, discardEditMode, updateAutosaveStatus]);

  const handleToggleAutosave = useCallback(() => {
    clearAutosaveStatusTimer();
    updateAutosaveStatus('idle');
    toggleAutosave();
  }, [clearAutosaveStatusTimer, toggleAutosave, updateAutosaveStatus]);

  useEffect(() => {
    if (!isEditMode || !activeMirrorId || !isAutosaveEnabled) {
      return;
    }

    const intervalId = setInterval(() => {
      const mutationPlan = buildMirrorWidgetMutationPlan(
        snapshotRef.current,
        localMirrorRef.current,
      );

      if (
        hasOpenWidgetEditor ||
        !mutationPlan.hasChanges ||
        saveInFlightRef.current ||
        pendingAutosaveSyncMirrorIdRef.current
      ) {
        return;
      }

      void flushMirrorChanges({ exitEditMode: false, trigger: 'autosave' });
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeMirrorId, flushMirrorChanges, hasOpenWidgetEditor, isAutosaveEnabled, isEditMode]);

  const handleDeleted = useCallback(() => {
    if (deletingMirror?.id === activeMirrorId) setActiveMirrorId(null);
    setDeletingMirror(null);
  }, [activeMirrorId, deletingMirror?.id, setActiveMirrorId]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={setActiveMirrorId}
        onAddMirror={() => setShowCreateModal(true)}
        onEditMirror={setEditingMirror}
        onDeleteMirror={setDeletingMirror}
        canAddMirror={canAddMirror}
      />

      {showCreateModal && <CreateMirrorModal onClose={() => setShowCreateModal(false)} />}
      {editingMirror && (
        <EditMirrorModal mirror={editingMirror} onClose={() => setEditingMirror(null)} />
      )}
      {deletingMirror && (
        <DeleteMirrorModal
          mirror={deletingMirror}
          onClose={() => setDeletingMirror(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {isEditMode && (
          <WidgetSidebar onAddWidget={handleAddWidget} canAddWidget={Boolean(activeMirrorId)} />
        )}

        <MirrorCanvas
          mirror={displayedMirror}
          onRemoveWidget={handleRemoveWidget}
          onMoveWidget={handleMoveWidget}
          onUpdateWidgetConfig={handleUpdateWidgetConfig}
          onWidgetEditorStateChange={handleWidgetEditorStateChange}
        />

        <EditModeToggle
          disabled={!activeMirror}
          onEnterEditMode={handleEnterEditMode}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onPreview={activeMirrorId ? () => navigate(`/preview/${activeMirrorId}`) : undefined}
          autosaveEnabled={isAutosaveEnabled}
          autosaveStatus={autosaveStatus}
          onToggleAutosave={handleToggleAutosave}
        />
      </div>
    </div>
  );
}

export const Mirrors = () => (
  <EditModeProvider>
    <MirrorContent />
  </EditModeProvider>
);
