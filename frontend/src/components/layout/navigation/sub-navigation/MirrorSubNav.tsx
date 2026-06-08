import { useEffect, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useGetMyMirrorsQuery } from '../../../../api/endpoints/mirror';
import type { MirrorDto } from '../../../../api/types/mirror';

interface MirrorSubNavProps {
  activeMirrorId: string | null;
  onSelectMirror: (id: string) => void;
  onAddMirror: () => void;
  onEditMirror: (mirror: MirrorDto) => void;
  onDeleteMirror: (mirror: MirrorDto) => void;
  canAddMirror?: boolean;
  isEditMode?: boolean;
  autosaveEnabled?: boolean;
  onToggleAutosave?: () => void;
  lastSavedAt?: Date | null;
}

export const MirrorSubNav = ({
  activeMirrorId,
  onSelectMirror,
  onAddMirror,
  onEditMirror,
  onDeleteMirror,
  canAddMirror,
  isEditMode = false,
  autosaveEnabled,
  onToggleAutosave,
  lastSavedAt,
}: MirrorSubNavProps) => {
  const { data: mirrors = [] } = useGetMyMirrorsQuery();
  const [, setNow] = useState(new Date());

  useEffect(() => {
    if (!isEditMode || !lastSavedAt) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isEditMode, lastSavedAt]);

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="border-b border-border bg-surface flex items-center relative">
      {/* Scrollable mirror tabs */}
      <div className="flex items-center gap-2 overflow-x-auto subtle-scrollbar px-4 py-2 min-w-0 flex-1">
        {mirrors.map((mirror) => (
          <div key={mirror.id} className="group relative flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => onSelectMirror(mirror.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 whitespace-nowrap cursor-pointer pr-16
                ${
                  activeMirrorId === mirror.id
                    ? 'bg-white/10 border-white/20 text-foreground shadow-sm'
                    : 'bg-transparent border-transparent text-muted hover:bg-white/5 hover:text-foreground'
                }`}
            >
              {mirror.name}
            </button>

            <div className="absolute right-1 flex items-center gap-0.5 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-150">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditMirror(mirror);
                }}
                className="p-1 rounded text-muted hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
                aria-label={`Edit ${mirror.name}`}
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMirror(mirror);
                }}
                className="p-1 rounded text-muted hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                aria-label={`Delete ${mirror.name}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Centered autosave controls — desktop only */}
      {isEditMode && (
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            {lastSavedAt && (
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted">
                <span>Last saved: {formatLastSaved(lastSavedAt)}</span>
              </div>
            )}

            {typeof autosaveEnabled === 'boolean' && onToggleAutosave && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-overlay/50">
                <span className="text-xs font-medium text-foreground">Autosave</span>
                <button
                  type="button"
                  onClick={onToggleAutosave}
                  aria-label={`Turn autosave ${autosaveEnabled ? 'off' : 'on'}`}
                  role="switch"
                  aria-checked={autosaveEnabled}
                  className="cursor-pointer relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-overlay transition-all duration-300"
                >
                  <div
                    className={`relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-surface shadow-sm transition-all duration-300 ${
                      autosaveEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                    aria-hidden="true"
                  >
                    {autosaveEnabled ? (
                      <Check className="size-2.5 text-emerald-400" strokeWidth={3} />
                    ) : (
                      <X className="size-2.5 text-foreground-secondary" strokeWidth={3} />
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right-side fixed controls */}
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0 border-l border-border">
        <button
          type="button"
          onClick={onAddMirror}
          disabled={!canAddMirror}
          title={!canAddMirror ? 'Mirror limit reached' : undefined}
          className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">+ Add Mirror</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>
    </div>
  );
};
