import { Pencil, Trash2 } from 'lucide-react';
import { useGetMyMirrorsQuery } from '../../../../api/endpoints/mirror';
import type { MirrorDto } from '../../../../api/types/mirror';

interface MirrorSubNavProps {
  activeMirrorId: string | null;
  onSelectMirror: (id: string) => void;
  onAddMirror: () => void;
  onEditMirror: (mirror: MirrorDto) => void;
  onDeleteMirror: (mirror: MirrorDto) => void;
  canAddMirror?: boolean;
}

export const MirrorSubNav = ({
  activeMirrorId,
  onSelectMirror,
  onAddMirror,
  onEditMirror,
  onDeleteMirror,
  canAddMirror
}: MirrorSubNavProps) => {
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  return (
    <div className="border-b border-border bg-surface px-4 py-2 flex items-center gap-2 overflow-x-auto subtle-scrollbar">
      {mirrors.map((mirror) => (
        <div key={mirror.id} className="group relative flex items-center">
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

          <div className="absolute right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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

      <button
        type="button"
        onClick={onAddMirror}
        disabled={!canAddMirror}
        title={!canAddMirror ? 'Mirror limit reached' : undefined}
        className="ml-auto px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        + Add Mirror
      </button>
    </div>
  );
};
