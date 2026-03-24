import { useCreateMirrorMutation } from '../../api/endpoints/mirror';
import { MirrorFormModal } from './MirrorFormModal';

interface CreateMirrorModalProps {
  onClose: () => void;
}

export const CreateMirrorModal = ({ onClose }: CreateMirrorModalProps) => {
  const [createMirror] = useCreateMirrorMutation();

  return (
    <MirrorFormModal
      title="Add Mirror"
      submitLabel="Add"
      initialValues={{ name: '', widthCm: 100, heightCm: 50 }}
      onSubmit={async (values) => {
        await createMirror(values);
        onClose();
      }}
      onClose={onClose}
    />
  );
};
