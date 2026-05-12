import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMirrorByIdQuery, useGetMyMirrorsQuery } from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import { EditModeProvider } from '../context/EditModeContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoHideUI } from '../hooks/useAutoHideUI';
import { usePreviewNavigation } from '../hooks/usePreviewNavigation';
import { PreviewHUD } from '../components/preview/PreviewHUD';
import { PreviewSideArrows } from '../components/preview/PreviewSideArrows';
import { PreviewMirrorSwitcher } from '../components/preview/PreviewMirrorSwitcher';

function PreviewContent() {
  const { mirrorId } = useParams<{ mirrorId: string }>();
  const { theme } = useTheme();
  const [mirrorBg, setMirrorBg] = useState<'dark' | 'light'>(theme === 'light' ? 'light' : 'dark');

  useEffect(() => {
    setMirrorBg(theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  const { data: mirror, isLoading, isError } = useGetMirrorByIdQuery(mirrorId ?? '', {
    skip: !mirrorId,
  });
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  const { uiVisible, resetHideTimer } = useAutoHideUI(mirrorId);
  const { currentIndex, goTo, goPrev, goNext } = usePreviewNavigation(mirrorId, mirrors);

  const isDark = mirrorBg === 'dark';
  const ui = uiVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none';
  const hudBtn = isDark
    ? 'bg-white/8 text-white/70 hover:text-white hover:bg-white/15 border-white/10 hover:border-white/25'
    : 'bg-black/6 text-black/60 hover:text-black hover:bg-black/12 border-black/10 hover:border-black/25';

  return (
    <div
      className="relative flex-1 flex flex-col overflow-hidden min-h-0"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse 120% 100% at 50% 40%, #14141c 0%, #0c0c12 50%, #070709 100%)'
          : 'radial-gradient(ellipse 120% 100% at 50% 40%, #dde2ea 0%, #c8cdd8 50%, #b8bec9 100%)',
      }}
      onMouseMove={resetHideTimer}
    >
      <PreviewHUD mirror={mirror} mirrorId={mirrorId} isDark={isDark} hudBtn={hudBtn} ui={ui} uiVisible={uiVisible} />

      <PreviewSideArrows count={mirrors.length} currentIndex={currentIndex} goPrev={goPrev} goNext={goNext} hudBtn={hudBtn} ui={ui} />

      {/* Mirror canvas */}
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

      <PreviewMirrorSwitcher mirrors={mirrors} mirrorId={mirrorId} currentIndex={currentIndex} isDark={isDark} ui={ui} uiVisible={uiVisible} goTo={goTo} />
    </div>
  );
}

export function Preview() {
  return (
    <EditModeProvider initialEditMode={false}>
      <PreviewContent />
    </EditModeProvider>
  );
}
