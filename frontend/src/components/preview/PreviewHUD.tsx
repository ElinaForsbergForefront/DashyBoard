import { ArrowLeft, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { MirrorDto } from '../../api/types/mirror';

interface Props {
  mirror: MirrorDto | undefined;
  mirrorId: string | undefined;
  isDark: boolean;
  hudBtn: string;
  ui: string;
  uiVisible: boolean;
}

export function PreviewHUD({ mirror, mirrorId, isDark, hudBtn, ui, uiVisible }: Props) {
  const navigate = useNavigate();

  return (
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

      {/* Mirror name + dimensions */}
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
  );
}
