import { GlassCard } from '../../ui/glass-card';
import { WeatherForm } from '../../forms/WeatherForm';

type WeatherLocationEditModalProps = {
  title: string;
  onClose: () => void;
  onLocationSubmit: (city: string) => void;
};

export function WeatherLocationEditModal({ title, onClose, onLocationSubmit }: WeatherLocationEditModalProps) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <GlassCard
        className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground"
          >
            Stäng
          </button>
        </div>

        <WeatherForm
          onSuccess={(city) => {
            onLocationSubmit(city);
            onClose();
          }}
        />
      </GlassCard>
    </div>
  );
}
