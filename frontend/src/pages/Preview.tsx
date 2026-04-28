import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetMirrorByIdQuery, useGetMyMirrorsQuery } from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import { EditModeProvider } from '../context/EditModeContext';
import { useTheme } from '../context/ThemeContext';

function PreviewContent() {
  const { mirrorId } = useParams<{ mirrorId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [mirrorBg, setMirrorBg] = useState<'dark' | 'light'>(theme === 'light' ? 'light' : 'dark');
  const [uiVisible, setUiVisible] = useState(true);

  // Keep mirrorBg in sync when the app theme changes
  useEffect(() => {
    setMirrorBg(theme === 'light' ? 'light' : 'dark');
  }, [theme]);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: mirror, isLoading, isError } = useGetMirrorByIdQuery(mirrorId ?? '', {
    skip: !mirrorId,
  });
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  const currentIndex = mirrors.findIndex((m) => m.id === mirrorId);

  const resetHideTimer = useCallback(() => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), 3500);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [mirrorId, resetHideTimer]);

  const goTo = (id: string) => navigate(`/preview/${id}`);
  const goPrev = () => currentIndex > 0 && goTo(mirrors[currentIndex - 1].id);
  const goNext = () => currentIndex < mirrors.length - 1 && goTo(mirrors[currentIndex + 1].id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const ui = uiVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none';

  const isDark = mirrorBg === 'dark';

  // Shared button class that adapts to room brightness
  const hudBtn =
    isDark
      ? 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/25'
      : 'bg-black/6 text-black/60 hover:text-black hover:bg-black/12 border-black/10 hover:border-black/25';

  return (
    <div
      className="relative flex-1 flex flex-col overflow-hidden min-h-0"
      style={{
        background:
          isDark
            ? 'radial-gradient(ellipse 120% 100% at 50% 40%, #14141c 0%, #0c0c12 50%, #070709 100%)'
            : 'radial-gradient(ellipse 120% 100% at 50% 40%, #dde2ea 0%, #c8cdd8 50%, #b8bec9 100%)',
      }}
      onMouseMove={resetHideTimer}
    >
      {/* ── Top HUD ── */}
      <div
        className={`absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 ease-in-out ${ui} ${uiVisible ? 'translate-y-0' : '-translate-y-3'}`}
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(180,186,198,0.7) 0%, rgba(180,186,198,0.1) 60%, transparent 100%)',
        }}
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-200 cursor-pointer ${hudBtn}`}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </button>

        {/* Mirror name + index */}
        {mirror && (
          <div className="flex flex-col items-center gap-1 select-none">
            <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-black/80'}`}>
              {mirror.name}
            </span>
            <span className={`text-xs font-mono ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              {mirror.widthCm} × {mirror.heightCm} cm
            </span>
          </div>
        )}

        {/* Edit */}
        {mirror ? (
          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => navigate('/', { state: { activeMirrorId: mirrorId, enterEditMode: true } })}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border transition-all duration-200 cursor-pointer ${hudBtn}`}
            >
              <Pencil size={13} className="group-hover:rotate-12 transition-transform duration-200" />
              Edit
            </button>
          </div>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* ── Prev / Next side arrows ── */}
      {mirrors.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex <= 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${ui} ${hudBtn}`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= mirrors.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${ui} ${hudBtn}`}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Mirror canvas ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 animate-spin ${isDark ? 'border-white/20 border-t-white/60' : 'border-black/15 border-t-black/50'}`} />
              <p className={`text-xs tracking-widest uppercase ${isDark ? 'text-white/30' : 'text-black/30'}`}>Loading</p>
            </div>
          </div>
        )}
        {isError && (
          <div className="flex-1 flex items-center justify-center">
            <p className={`text-sm ${isDark ? 'text-white/30' : 'text-black/40'}`}>Mirror not found.</p>
          </div>
        )}
        {mirror && (
          <div className="relative flex-1 flex flex-col overflow-hidden pt-20 pb-36">
            {/* Ambient glow behind the mirror */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(255,255,255,0.03) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(255,255,255,0.55) 0%, transparent 70%)',
              }}
            />
            <MirrorCanvas mirror={mirror} previewMode previewBackground={mirrorBg} />
          </div>
        )}
      </div>

      {/* ── Bottom mirror switcher ── */}
      {mirrors.length > 0 && (
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
      )}
    </div>
  );
}

export function Preview() {
  return (
    <EditModeProvider>
      <PreviewContent />
    </EditModeProvider>
  );
}

