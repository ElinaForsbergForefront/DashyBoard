import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateMirrorMutation } from '../../api/endpoints/mirror';
import { MIRROR_PRESETS, type MirrorPresetId } from '../constants/mirror';
import { MirrorPresetCard } from './MirrorPresetCard';

interface CreateMirrorModalProps {
  onClose: () => void;
}

export const CreateMirrorModal = ({ onClose }: CreateMirrorModalProps) => {
  const [createMirror] = useCreateMirrorMutation();

  const [selectedPresetId, setSelectedPresetId] = useState<MirrorPresetId>('mini');
  const [name, setName] = useState<string>(MIRROR_PRESETS[0].name);
  const [isLoading, setIsLoading] = useState(false);

  const preset = MIRROR_PRESETS.find((p) => p.id === selectedPresetId)!;

  const handleSelectPreset = (id: MirrorPresetId) => {
    const next = MIRROR_PRESETS.find((p) => p.id === id)!;
    setSelectedPresetId(id);
    setName(next.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await createMirror({ name, widthCm: preset.widthCm, heightCm: preset.heightCm });
    setIsLoading(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add Mirror</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {MIRROR_PRESETS.map((p) => (
              <MirrorPresetCard
                key={p.id}
                preset={p}
                isSelected={p.id === selectedPresetId}
                onSelect={() => handleSelectPreset(p.id)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted" htmlFor="mirror-name">
              Name
            </label>
            <input
              id="mirror-name"
              type="text"
              required
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My mirror"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted hover:text-foreground hover:bg-overlay transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
