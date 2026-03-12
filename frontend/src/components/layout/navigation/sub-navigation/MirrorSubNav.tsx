import { useGetMyMirrorsQuery } from '../../../../api/endpoints/mirror';

interface MirroSubNavProps {
  activeMirrorId: string | null;
  onSelectMirror: (id: string) => void;
  onAddMirror: () => void;
}

export const MirrorSubNav = ({ activeMirrorId, onSelectMirror, onAddMirror }: MirroSubNavProps) => {
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  return (
    <div className="border-b border-border bg-surface px-4 py-2 flex items-center gap-2 overflow-x-auto">
      {mirrors.map((mirror) => (
        <button
          key={mirror.id}
          type="button"
          onClick={() => onSelectMirror(mirror.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 whitespace-nowrap cursor-pointer
            ${
              activeMirrorId === mirror.id
                ? 'bg-white/10 border-white/20 text-foreground shadow-sm'
                : 'bg-transparent border-transparent text-muted hover:bg-white/5 hover:text-foreground'
            }`}
        >
          {mirror.name}
        </button>
      ))}

      <button
        type="button"
        onClick={onAddMirror}
        className="ml-auto px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-all duration-200 whitespace-nowrap cursor-pointer"
      >
        + Add Mirror
      </button>
    </div>
  );
};
