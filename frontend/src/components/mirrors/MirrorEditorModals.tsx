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
  isResolvingMirrorSwitch: boolean;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCloseDeleteModal: () => void;
  onDeletedMirror: () => void;
  onClosePendingMirrorSwitch: () => void;
  onDiscardAndSwitch: () => void;
  onSaveAndSwitch: () => void;
}

export function MirrorEditorModals({
  showCreateModal,
  editingMirror,
  deletingMirror,
  activeMirror,
  pendingMirrorSwitch,
  isResolvingMirrorSwitch,
  onCloseCreateModal,
  onCloseEditModal,
  onCloseDeleteModal,
  onDeletedMirror,
  onClosePendingMirrorSwitch,
  onDiscardAndSwitch,
  onSaveAndSwitch,
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
          nextMirror={pendingMirrorSwitch}
          isSaving={isResolvingMirrorSwitch}
          onClose={onClosePendingMirrorSwitch}
          onDiscard={onDiscardAndSwitch}
          onSave={onSaveAndSwitch}
        />
      )}
    </>
  );
}
