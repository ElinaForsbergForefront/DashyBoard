import { useUpdateMirrorMutation } from '../../api/endpoints/mirror';
import { MirrorFormModal } from './MirrorFormModal';
import type { MirrorDto } from '../../api/types/mirror';

interface EditMirrorModalProps {
  mirror: MirrorDto;
  onClose: () => void;
}

export const EditMirrorModal = ({ mirror, onClose }: EditMirrorModalProps) => {
  const [updateMirror] = useUpdateMirrorMutation();

  return (
    <MirrorFormModal
      title="Edit Mirror"
      submitLabel="Save"
      initialValues={{ name: mirror.name, widthCm: mirror.widthCm, heightCm: mirror.heightCm }}
      onSubmit={async (values) => {
        await updateMirror({ id: mirror.id, ...values });
        onClose();
      }}
      onClose={onClose}
    />
  );
};
