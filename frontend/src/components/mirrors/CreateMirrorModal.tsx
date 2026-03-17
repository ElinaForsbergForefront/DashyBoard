import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateMirrorMutation } from '../../api/endpoints/mirror';

interface CreateMirrorModalProps {
  onClose: () => void;
}

export const CreateMirrorModal = ({ onClose }: CreateMirrorModalProps) => {
  const [name, setName] = useState('');
  const [widthCm, setWidthCm] = useState<number>(100);
  const [heightCm, setHeightCm] = useState<number>(50);

  const [createMirror, { isLoading }] = useCreateMirrorMutation();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createMirror({ name, widthCm, heightCm });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add Mirror</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted" htmlFor="mirror-name">
              Name
            </label>
            <input
              id="mirror-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My mirror"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-sm text-muted" htmlFor="mirror-width">
                Width (cm)
              </label>
              <input
                id="mirror-width"
                type="number"
                required
                min={1}
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  widthCm <= 0 ? 'border-red-500' : 'border-border'
                }`}
              />
              {widthCm <= 0 && <p className="text-xs text-red-500">Must be greater than 0</p>}
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <label className="text-sm text-muted" htmlFor="mirror-height">
                Height (cm)
              </label>
              <input
                id="mirror-height"
                type="number"
                required
                min={1}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  heightCm <= 0 ? 'border-red-500' : 'border-border'
                }`}
              />
              {heightCm <= 0 && <p className="text-xs text-red-500">Must be greater than 0</p>}
            </div>
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
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
