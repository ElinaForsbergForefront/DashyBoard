import type { MirrorDto } from '../../api/types/mirror';

interface Props {
  mirrors: MirrorDto[];
  mirrorId: string | undefined;
  currentIndex: number;
  isDark: boolean;
  ui: string;
  uiVisible: boolean;
  goTo: (id: string) => void;
}

export function PreviewMirrorSwitcher({ mirrors, mirrorId, currentIndex, isDark, ui, uiVisible, goTo }: Props) {
  if (mirrors.length === 0) return null;

  return (
    <div
      className={`absolute bottom-0 inset-x-0 z-50 flex flex-col items-center gap-4 px-6 pt-20 pb-6 transition-all duration-500 ease-in-out ${ui} ${uiVisible ? 'translate-y-0' : 'translate-y-3'}`}
      style={{
        background: isDark
          ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
          : 'linear-gradient(to top, rgba(170,176,190,0.7) 0%, rgba(170,176,190,0.1) 60%, transparent 100%)',
      }}
    >
      {/* Dot indicators */}
      {mirrors.length > 1 && (
        <div className="flex items-center gap-1.5">
          {mirrors.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => goTo(m.id)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? `w-5 h-1.5 ${isDark ? 'bg-white' : 'bg-black/70'}`
                  : `w-1.5 h-1.5 ${isDark ? 'bg-white/30 hover:bg-white/60' : 'bg-black/20 hover:bg-black/50'}`
              }`}
              aria-label={m.name}
            />
          ))}
        </div>
      )}

      {/* Mirror cards */}
      <div className="flex items-end gap-2 overflow-x-auto max-w-full pb-1 scrollbar-hide">
        {mirrors.map((m) => {
          const isActive = m.id === mirrorId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => goTo(m.id)}
              className={`group flex-shrink-0 flex flex-col gap-1 px-4 py-2.5 rounded-xl text-left cursor-pointer backdrop-blur-md border transition-all duration-300 ${
                isDark
                  ? isActive
                    ? 'bg-white/15 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                  : isActive
                    ? 'bg-black/12 border-black/30 shadow-[0_0_20px_rgba(0,0,0,0.1)]'
                    : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
              }`}
            >
              <span
                className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
                  isDark
                    ? isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                    : isActive ? 'text-black/80' : 'text-black/40 group-hover:text-black/70'
                }`}
              >
                {m.name}
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-white/25' : 'text-black/25'}`}>
                {m.widthCm}×{m.heightCm} cm
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
