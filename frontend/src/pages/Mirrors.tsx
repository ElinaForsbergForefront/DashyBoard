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
import {
  useGetMyMirrorsQuery,
  useAddWidgetMutation,
  useMoveWidgetMutation,
  useRemoveWidgetMutation,
} from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import type { WidgetType } from '../components/layout/dashboard/widgetSidebar/types.ts';
import type { MirrorDto } from '../api/types/mirror';
import { widgetRegistry } from '../components/widgets/widgetRegistry';
import { findFirstFreeCell } from '../utils/widgetPlacement';
import { useGetCurrentUserQuery } from '../api/endpoints/user';
import { useMirrorAutosavePreference } from '../hooks/useMirrorAutosavePreference';
import { buildMirrorWidgetMutationPlan } from '../utils/mirrorWidgetMutationPlan';

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

  // Local copy of the mirror used during edit mode - changes are buffered here
  // and only flushed to the server when the user clicks "Save" or autosave runs.
  const [localMirror, setLocalMirror] = useState<MirrorDto | null>(null);
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

  const activeMirror = mirrors.find((m) => m.id === activeMirrorId) ?? null;

  // The canvas always renders the local copy while in edit mode so that no API
  // call is needed for instant feedback. In view mode it uses the server data.
  // Show localMirror whenever it exists (including while background save mutations are in-flight)
  const displayedMirror = localMirror ?? activeMirror;

  useEffect(() => {
    localMirrorRef.current = localMirror;
  }, [localMirror]);

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

  // Initialise from navigation state (e.g. when returning from preview)
  useEffect(() => {
    const stateId = (location.state as { activeMirrorId?: string } | null)?.activeMirrorId;
    if (stateId) setActiveMirrorId(stateId);
  }, [location.state, setActiveMirrorId]);

  // Fallback: if edit mode was persisted via localStorage and the mirror data
  // arrives after mount, initialise the local copy automatically.
  useEffect(() => {
    if (isEditMode && activeMirror && snapshotRef.current === null) {
      const snapshot = structuredClone(activeMirror);
      snapshotRef.current = snapshot;
      setLocalMirror(structuredClone(activeMirror));
    }
  }, [isEditMode, activeMirror]);

  // When autosave completes, refetch brings back canonical widget IDs from the API.
  // Rebase both the snapshot and the local draft to that fresh server state so the
  // next autosave diff only includes new changes.
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

  // When navigated back from preview with enterEditMode flag, auto-enter edit mode.
  useEffect(() => {
    const state = location.state as { enterEditMode?: boolean } | null;
    if (state?.enterEditMode && activeMirror && !isEditMode) {
      startEditSession(activeMirror);
      // Clear the state so a refresh doesn't re-trigger.
      navigate('/', { replace: true, state: { activeMirrorId } });
    }
  }, [activeMirror, activeMirrorId, isEditMode, location.state, navigate, startEditSession]);

  const handleEnterEditMode = useCallback(() => {
    if (!activeMirror) return;
    startEditSession(activeMirror);
  }, [activeMirror, startEditSession]);

  // All widget mutations only update the local copy - no API calls yet.
  const handleAddWidget = useCallback((widgetType: WidgetType) => {
    setLocalMirror((prev) => {
      if (!prev) return prev;

      const definition = widgetRegistry.find((w) => w.id === widgetType);
      if (!definition) return prev;

      // Build an occupancy list from currently placed widgets + their registry sizes.
      const placed = prev.widgets.map((w) => {
        const def = widgetRegistry.find((d) => d.id === w.type);
        return { x: w.x, y: w.y, cols: def?.cols ?? 2, rows: def?.rows ?? 2 };
      });

      const position = findFirstFreeCell(
        placed,
        definition.cols,
        definition.rows,
        prev.widthCm,
        prev.heightCm,
      );

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return {
        ...prev,
        widgets: [...prev.widgets, { id: tempId, type: widgetType, x: position.x, y: position.y }],
      };
    });
  }, []);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    setLocalMirror((prev) => {
      if (!prev) return prev;
      return { ...prev, widgets: prev.widgets.filter((w) => w.id !== widgetId) };
    });
  }, []);

  const handleMoveWidget = useCallback((widgetId: string, x: number, y: number) => {
    setLocalMirror((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        widgets: prev.widgets.map((w) => (w.id === widgetId ? { ...w, x, y } : w)),
      };
    });
  }, []);

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

      if (trigger === 'autosave') {
        updateAutosaveStatus('saving');
      }

      // Exit edit mode immediately on manual save - no perceived lag for the user.
      // localMirror stays set so displayedMirror keeps showing the correct state
      // while mutations run in the background, then refetch so activeMirror is
      // fresh before we clear localMirror (avoids the stale-data flicker).
      if (exitEditMode) {
        saveEditMode();
      }

      const mirrorId = draft.id;

      try {
        await Promise.all([
          ...mutationPlan.removedWidgetIds.map((widgetId) =>
            removeWidget({ mirrorId, widgetId }).unwrap(),
          ),
          ...mutationPlan.addedWidgets.map((widget) =>
            addWidget({ mirrorId, body: widget }).unwrap(),
          ),
          ...mutationPlan.movedWidgets.map(({ widgetId, x, y }) =>
            moveWidget({ mirrorId, widgetId, body: { x, y } }).unwrap(),
          ),
        ]);

        if (exitEditMode) {
          await refetchMirrors();
          setLocalMirror(null);
          localMirrorRef.current = null;
          snapshotRef.current = null;
          saveInFlightRef.current = false;
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
    [addWidget, moveWidget, refetchMirrors, removeWidget, saveEditMode, updateAutosaveStatus],
  );

  // On Save: diff local state vs snapshot and flush only the changes.
  const handleSave = useCallback(async () => {
    await flushMirrorChanges({ exitEditMode: true, trigger: 'manual' });
  }, [flushMirrorChanges]);

  // On Discard: simply throw away the local copy - server state is untouched.
  const handleDiscard = useCallback(() => {
    clearAutosaveStatusTimer();
    updateAutosaveStatus('idle');
    pendingAutosaveSyncMirrorIdRef.current = null;
    saveInFlightRef.current = false;
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

  // Autosave runs only while edit mode is active, autosave is enabled, and there
  // are unsaved widget-layout changes in the current local draft.
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
  }, [activeMirrorId, flushMirrorChanges, isAutosaveEnabled, isEditMode]);

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
