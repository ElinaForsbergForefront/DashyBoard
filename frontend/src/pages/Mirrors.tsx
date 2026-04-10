import { useState, useCallback } from 'react';
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
  const { isEditMode } = useEditModeContext();
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMirror, setEditingMirror] = useState<MirrorDto | null>(null);
  const [deletingMirror, setDeletingMirror] = useState<MirrorDto | null>(null);

  const { data: mirrors = [] } = useGetMyMirrorsQuery();
  const [addWidget] = useAddWidgetMutation();
  const [moveWidget] = useMoveWidgetMutation();
  const [removeWidget] = useRemoveWidgetMutation();

  const activeMirror = mirrors.find((m) => m.id === activeMirrorId) ?? null;

  const handleAddWidget = useCallback(
    (widget: WidgetType) => {
      if (!activeMirrorId) return;
      addWidget({ mirrorId: activeMirrorId, body: { type: widget, x: 0, y: 0 } });
    },
    [activeMirrorId, addWidget],
  );

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      if (!activeMirrorId) return;
      removeWidget({ mirrorId: activeMirrorId, widgetId });
    },
    [activeMirrorId, removeWidget],
  );

  const handleMoveWidget = useCallback(
    (widgetId: string, x: number, y: number) => {
      if (!activeMirrorId) return;
      moveWidget({ mirrorId: activeMirrorId, widgetId, body: { x, y } });
    },
    [activeMirrorId, moveWidget],
  );

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
          mirror={activeMirror}
          onRemoveWidget={handleRemoveWidget}
          onMoveWidget={handleMoveWidget}
        />
        <EditModeToggle disabled={!activeMirror} />
      </div>
    </div>
  );
}

export const Mirrors = () => (
  <EditModeProvider>
    <MirrorContent />
  </EditModeProvider>
);
