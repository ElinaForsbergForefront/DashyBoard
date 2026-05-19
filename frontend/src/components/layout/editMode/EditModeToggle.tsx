import { Check, LayoutGrid, Pencil, X } from 'lucide-react';
import { useEditModeContext } from '../../../context/EditModeContext';

type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface EditModeToggleProps {
  disabled?: boolean;
  /** Called instead of context enterEditMode when provided */
  onEnterEditMode?: () => void;
  /** Called instead of context saveEditMode when provided */
  onSave?: () => void | Promise<void>;
  /** Called instead of context discardEditMode when provided */
  onDiscard?: () => void;
  /** When provided, shows a Preview button in view mode */
  onPreview?: () => void;
  autosaveEnabled?: boolean;
  autosaveStatus?: AutosaveStatus;
  onToggleAutosave?: () => void;
}

function getAutosavePresentation(status: AutosaveStatus, autosaveEnabled: boolean) {
  if (!autosaveEnabled) {
    return {
      label: 'Autosave disabled',
      dotClassName: 'bg-zinc-400',
      containerClassName: 'border-border bg-surface text-foreground-secondary',
    };
  }

  switch (status) {
    case 'saving':
      return {
        label: 'Saving changes...',
        dotClassName: 'bg-amber-400 animate-pulse',
        containerClassName: 'border-amber-300/40 bg-amber-500/10 text-amber-100',
      };
    case 'saved':
      return {
        label: 'All changes saved',
        dotClassName: 'bg-emerald-400',
        containerClassName: 'border-emerald-300/40 bg-emerald-500/10 text-emerald-100',
      };
    case 'error':
      return {
        label: 'Autosave failed',
        dotClassName: 'bg-red-400',
        containerClassName: 'border-red-300/40 bg-red-500/10 text-red-100',
      };
    default:
      return {
        label: 'Autosave on',
        dotClassName: 'bg-sky-400',
        containerClassName: 'border-sky-300/30 bg-sky-500/10 text-sky-100',
      };
  }
}

export function EditModeToggle({
  disabled = false,
  onEnterEditMode,
  onSave,
  onDiscard,
  autosaveEnabled,
  autosaveStatus = 'idle',
  onToggleAutosave,
}: EditModeToggleProps) {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode, toggleSidebar } =
    useEditModeContext();

  if (isEditMode) {
    const shouldShowAutosaveControls =
      typeof autosaveEnabled === 'boolean' && typeof onToggleAutosave === 'function';

    const autosavePresentation = shouldShowAutosaveControls
      ? getAutosavePresentation(autosaveStatus, autosaveEnabled)
      : null;

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

        {shouldShowAutosaveControls && autosavePresentation && (
          <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm ${autosavePresentation.containerClassName}`}
              aria-live="polite"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${autosavePresentation.dotClassName}`} />
              <span>{autosavePresentation.label}</span>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-border bg-surface/90 px-4 py-2 shadow-lg backdrop-blur-sm">
              <span className="text-sm font-medium text-foreground-secondary">Autosave</span>
              <button
                type="button"
                onClick={onToggleAutosave}
                aria-label={`Turn autosave ${autosaveEnabled ? 'off' : 'on'}`}
                role="switch"
                aria-checked={autosaveEnabled}
                className="cursor-pointer relative inline-flex h-7 w-12 items-center rounded-full border border-white/10 bg-glass backdrop-blur-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div
                  className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-overlay shadow-md transition-all duration-300 ${
                    autosaveEnabled ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
                  }`}
                  aria-hidden="true"
                >
                  {autosaveEnabled ? (
                    <Check className="size-3.5 text-emerald-400" strokeWidth={2.5} />
                  ) : (
                    <X className="size-3.5 text-foreground-secondary" strokeWidth={2.5} />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Save / Discard bottom-right */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={onDiscard ?? discardEditMode}
            className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-surface text-foreground-secondary hover:text-foreground hover:bg-overlay transition-all cursor-pointer"
          >
            Discard
          </button>
          <button
            onClick={onSave ?? saveEditMode}
            className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer shadow-lg"
          >
            Save
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <button
        onClick={onEnterEditMode ?? enterEditMode}
        disabled={disabled}
        aria-label="Enter edit mode"
        className="w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary hover:shadow-[0_0_0_3px_rgba(51,153,255,0.15)] transition-all duration-200 flex items-center justify-center cursor-pointer group disabled:opacity-40 disabled:pointer-events-none"
      >
        <Pencil size={18} className="group-hover:rotate-12 transition-transform duration-200" />
      </button>
    </div>
  );
}
