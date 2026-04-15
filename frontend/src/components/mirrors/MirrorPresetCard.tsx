import type { MirrorPreset } from '../constants/mirror';

const PREVIEW_BOX_W = 96;
const PREVIEW_BOX_H = 60;

interface MirrorPresetCardProps {
  preset: MirrorPreset;
  isSelected: boolean;
  onSelect: () => void;
}

export function MirrorPresetCard({ preset, isSelected, onSelect }: MirrorPresetCardProps) {
  const scale = Math.min(PREVIEW_BOX_W / preset.widthCm, PREVIEW_BOX_H / preset.heightCm);
  const previewW = Math.round(preset.widthCm * scale);
  const previewH = Math.round(preset.heightCm * scale);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all cursor-pointer
        ${
          isSelected
            ? 'border-primary bg-primary/10'
            : 'border-border bg-surface hover:border-primary/50 hover:bg-overlay'
        }`}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: PREVIEW_BOX_W, height: PREVIEW_BOX_H }}
      >
        <div
          className="rounded-sm border border-border bg-surface/50"
          style={{ width: previewW, height: previewH }}
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {preset.name}
        </p>
        <p className="text-[10px] text-muted">
          {preset.widthCm} × {preset.heightCm} cm
        </p>
        <p className="text-[10px] text-muted">{preset.resolutionLabel}</p>
      </div>
    </button>
  );
}
