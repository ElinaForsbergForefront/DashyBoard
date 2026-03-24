import { createPortal } from 'react-dom';
import { useDeleteMirrorMutation } from '../../api/endpoints/mirror';
import type { MirrorDto } from '../../api/types/mirror';

interface DeleteMirrorModalProps {
  mirror: MirrorDto;
  onClose: () => void;
  onDeleted: () => void;
}

export const DeleteMirrorModal = ({ mirror, onClose, onDeleted }: DeleteMirrorModalProps) => {
  const [deleteMirror, { isLoading }] = useDeleteMirrorMutation();

  const handleDelete = async () => {
    await deleteMirror(mirror.id);
    onDeleted();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Delete Mirror</h2>
        <p className="text-sm text-muted mb-6">
          Are you sure you want to delete{' '}
          <span className="text-foreground font-medium">{mirror.name}</span>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-border text-muted hover:text-foreground hover:bg-overlay transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
