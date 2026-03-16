import { LayoutGrid, Pencil } from 'lucide-react';
import { useEditModeContext } from '../../../context/EditModeContext';

interface EditModeToggleProps {
  disabled?: boolean;
}

export function EditModeToggle({ disabled = false }: EditModeToggleProps) {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode, toggleSidebar } =
    useEditModeContext();

  if (isEditMode) {
    return (
      <>
        {/* Mobile: widgets button bottom-left */}
        <button
          onClick={toggleSidebar}
          aria-label="Open widgets"
          className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary transition-all duration-200 flex items-center justify-center cursor-pointer"
        >
          <LayoutGrid size={18} />
        </button>

        {/* Save / Discard bottom-right */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={discardEditMode}
            className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-surface text-foreground-secondary hover:text-foreground hover:bg-overlay transition-all cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={saveEditMode}
            className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer shadow-lg"
          >
            Save
          </button>
        </div>
      </>
    );
  }

  return (
    <button
      onClick={enterEditMode}
      disabled={disabled}
      aria-label="Enter edit mode"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary hover:shadow-[0_0_0_3px_rgba(51,153,255,0.15)] transition-all duration-200 flex items-center justify-center cursor-pointer group disabled:opacity-40 disabled:pointer-events-none"
    >
      <Pencil size={18} className="group-hover:rotate-12 transition-transform duration-200" />
    </button>
  );
}
