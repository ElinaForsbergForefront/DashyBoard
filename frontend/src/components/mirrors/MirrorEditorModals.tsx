import type { MirrorDto } from '../../api/types/mirror';
import { CreateMirrorModal } from './CreateMirrorModal';
import { EditMirrorModal } from './EditMirrorModal';
import { DeleteMirrorModal } from './DeleteMirrorModal';
import { UnsavedMirrorChangesModal } from './UnsavedMirrorChangesModal';

interface MirrorEditorModalsProps {
  showCreateModal: boolean;
  editingMirror: MirrorDto | null;
  deletingMirror: MirrorDto | null;
  activeMirror: MirrorDto | null;
  pendingMirrorSwitch: MirrorDto | null;
  pendingRouteLabel: string | null;
  isResolvingMirrorSwitch: boolean;
  isResolvingRouteChange: boolean;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCloseDeleteModal: () => void;
  onDeletedMirror: () => void;
  onClosePendingMirrorSwitch: () => void;
  onDiscardAndSwitch: () => void;
  onSaveAndSwitch: () => void;
  onClosePendingRoute: () => void;
  onDiscardAndNavigate: () => void;
  onSaveAndNavigate: () => void;
}

export function MirrorEditorModals({
  showCreateModal,
  editingMirror,
  deletingMirror,
  activeMirror,
  pendingMirrorSwitch,
  pendingRouteLabel,
  isResolvingMirrorSwitch,
  isResolvingRouteChange,
  onCloseCreateModal,
  onCloseEditModal,
  onCloseDeleteModal,
  onDeletedMirror,
  onClosePendingMirrorSwitch,
  onDiscardAndSwitch,
  onSaveAndSwitch,
  onClosePendingRoute,
  onDiscardAndNavigate,
  onSaveAndNavigate,
}: MirrorEditorModalsProps) {
  return (
    <>
      {showCreateModal && <CreateMirrorModal onClose={onCloseCreateModal} />}
      {editingMirror && <EditMirrorModal mirror={editingMirror} onClose={onCloseEditModal} />}
      {deletingMirror && (
        <DeleteMirrorModal
          mirror={deletingMirror}
          onClose={onCloseDeleteModal}
          onDeleted={onDeletedMirror}
        />
      )}
      {pendingMirrorSwitch && (
        <UnsavedMirrorChangesModal
          currentMirror={activeMirror}
          nextLabel={pendingMirrorSwitch.name}
          isSaving={isResolvingMirrorSwitch}
          onClose={onClosePendingMirrorSwitch}
          onDiscard={onDiscardAndSwitch}
          onSave={onSaveAndSwitch}
        />
      )}
      {pendingRouteLabel && (
        <UnsavedMirrorChangesModal
          currentMirror={activeMirror}
          nextLabel={pendingRouteLabel}
          destinationType="page"
          isSaving={isResolvingRouteChange}
          onClose={onClosePendingRoute}
          onDiscard={onDiscardAndNavigate}
          onSave={onSaveAndNavigate}
        />
      )}
    </>
  );
}
