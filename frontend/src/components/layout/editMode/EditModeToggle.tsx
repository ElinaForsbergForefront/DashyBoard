import { useEditModeContext } from '../../../context/EditModeContext';

export function EditModeToggle() {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode } = useEditModeContext();

  if (isEditMode) {
    return (
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
    );
  }

  return (
    <button
      onClick={enterEditMode}
      aria-label="Enter edit mode"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary hover:shadow-[0_0_0_3px_rgba(51,153,255,0.15)] transition-all duration-200 flex items-center justify-center cursor-pointer group"
    >
      <PencilIcon />
    </button>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:rotate-12 transition-transform duration-200"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
