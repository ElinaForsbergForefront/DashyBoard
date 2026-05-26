import { createPortal } from 'react-dom';
import type { MirrorDto } from '../../api/types/mirror';

interface UnsavedMirrorChangesModalProps {
  currentMirror: MirrorDto | null;
  nextMirror: MirrorDto;
  isSaving: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export const UnsavedMirrorChangesModal = ({
  currentMirror,
  nextMirror,
  isSaving,
  onClose,
  onDiscard,
  onSave,
}: UnsavedMirrorChangesModalProps) =>
  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        <div className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))] px-6 py-5">
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/12 text-amber-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 8v5m0 3.5h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300/80">
                Unsaved Changes
              </p>
              <h2 className="text-xl font-semibold text-foreground">
                Switch mirror without losing work?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                You have pending layout changes{currentMirror ? ` on ${currentMirror.name}` : ''}.
                Choose what should happen before opening {nextMirror.name}.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/80 bg-background/35 p-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-surface/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Current Mirror
              </p>
              <p className="mt-2 truncate text-sm font-medium text-foreground">
                {currentMirror?.name ?? 'Current mirror'}
              </p>
            </div>
            <div className="rounded-xl border border-primary/25 bg-primary/8 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Next Mirror
              </p>
              <p className="mt-2 truncate text-sm font-medium text-foreground">{nextMirror.name}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md border border-border px-4 py-2 text-sm text-muted transition-all hover:bg-overlay hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Stay Here
          </button>
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-all hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Discard And Switch
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save And Switch'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
