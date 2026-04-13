import { useState, useCallback, useRef, useEffect } from 'react';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider, useEditModeContext } from '../context/EditModeContext';
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

function MirrorContent() {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode } = useEditModeContext();
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMirror, setEditingMirror] = useState<MirrorDto | null>(null);
  const [deletingMirror, setDeletingMirror] = useState<MirrorDto | null>(null);

  // Local copy of the mirror used during edit mode – changes are buffered here
  // and only flushed to the server when the user clicks "Save".
  const [localMirror, setLocalMirror] = useState<MirrorDto | null>(null);
  const snapshotRef = useRef<MirrorDto | null>(null);

  const { data: mirrors = [], refetch: refetchMirrors } = useGetMyMirrorsQuery();
  const [addWidget] = useAddWidgetMutation();
  const [moveWidget] = useMoveWidgetMutation();
  const [removeWidget] = useRemoveWidgetMutation();

  const activeMirror = mirrors.find((m) => m.id === activeMirrorId) ?? null;

  // The canvas always renders the local copy while in edit mode so that no API
  // call is needed for instant feedback. In view mode it uses the server data.
  // Show localMirror whenever it exists (including while background save mutations are in-flight)
  const displayedMirror = localMirror ?? activeMirror;

  // Fallback: if edit mode was persisted via localStorage and the mirror data
  // arrives after mount, initialise the local copy automatically.
  useEffect(() => {
    if (isEditMode && activeMirror && snapshotRef.current === null) {
      const snapshot = structuredClone(activeMirror);
      snapshotRef.current = snapshot;
      setLocalMirror(structuredClone(activeMirror));
    }
  }, [isEditMode, activeMirror]);

  const handleEnterEditMode = () => {
    if (!activeMirror) return;
    const snapshot = structuredClone(activeMirror);
    snapshotRef.current = snapshot;
    setLocalMirror(structuredClone(activeMirror));
    enterEditMode();
  };

  // All widget mutations only update the local copy – no API calls yet.
  const handleAddWidget = useCallback((widget: WidgetType) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setLocalMirror((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        widgets: [...prev.widgets, { id: tempId, type: widget, x: 0, y: 0 }],
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

  // On Save: diff local state vs snapshot and flush only the changes.
  const handleSave = useCallback(async () => {
    const snapshot = snapshotRef.current;
    if (!localMirror || !snapshot) {
      saveEditMode();
      return;
    }

    const mirrorId = localMirror.id;
    const promises: Promise<unknown>[] = [];

    // Widgets that were removed during the session
    const removedIds = snapshot.widgets
      .filter((sw) => !localMirror.widgets.find((cw) => cw.id === sw.id))
      .map((sw) => sw.id);
    for (const widgetId of removedIds) {
      promises.push(removeWidget({ mirrorId, widgetId }).unwrap());
    }

    // Widgets that were added (identified by temp IDs)
    for (const w of localMirror.widgets.filter((w) => w.id.startsWith('temp-'))) {
      promises.push(addWidget({ mirrorId, body: { type: w.type, x: w.x, y: w.y } }).unwrap());
    }

    // Existing widgets whose position changed
    for (const w of localMirror.widgets) {
      if (w.id.startsWith('temp-')) continue;
      const orig = snapshot.widgets.find((sw) => sw.id === w.id);
      if (orig && (orig.x !== w.x || orig.y !== w.y)) {
        promises.push(moveWidget({ mirrorId, widgetId: w.id, body: { x: w.x, y: w.y } }).unwrap());
      }
    }

    // Exit edit mode immediately — no perceived lag for the user.
    // localMirror stays set so displayedMirror keeps showing the correct state
    // while mutations run in the background, then refetch so activeMirror is
    // fresh before we clear localMirror (avoids the stale-data flicker).
    saveEditMode();

    Promise.all(promises)
      .then(() => refetchMirrors())
      .finally(() => {
        setLocalMirror(null);
        snapshotRef.current = null;
      });
  }, [localMirror, addWidget, removeWidget, moveWidget, saveEditMode, refetchMirrors]);

  // On Discard: simply throw away the local copy – server state is untouched.
  const handleDiscard = useCallback(() => {
    setLocalMirror(null);
    snapshotRef.current = null;
    discardEditMode();
  }, [discardEditMode]);

  const handleDeleted = () => {
    if (deletingMirror?.id === activeMirrorId) setActiveMirrorId(null);
    setDeletingMirror(null);
  };

  return (
    <div className="flex flex-col flex-1">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={setActiveMirrorId}
        onAddMirror={() => setShowCreateModal(true)}
        onEditMirror={setEditingMirror}
        onDeleteMirror={setDeletingMirror}
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
