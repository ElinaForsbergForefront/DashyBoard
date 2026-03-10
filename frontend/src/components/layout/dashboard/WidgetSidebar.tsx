import { useEditModeContext } from '../../../context/EditModeContext';

export function WidgetSidebar() {
  const { isSidebarOpen, toggleSidebar } = useEditModeContext();

  return (
    <>
      {/* Desktop: always visible inline */}
      <aside className="hidden lg:flex w-60 min-h-full bg-card border-r border-border flex-col gap-4 p-4 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile: slide-in overlay */}
      <>
        {/* Backdrop */}
        <div
          onClick={toggleSidebar}
          className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Drawer */}
        <aside
          className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border flex flex-col gap-4 p-4 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <SidebarHeading />
            <button
              onClick={toggleSidebar}
              className="text-muted hover:text-foreground cursor-pointer"
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </button>
          </div>
          <SidebarContent hideHeading />
        </aside>
      </>
    </>
  );
}

function SidebarHeading() {
  return (
    <div>
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Widgets</h2>
      <p className="text-xs text-muted">Drag to add to your mirror</p>
    </div>
  );
}

function SidebarContent({ hideHeading = false }: { hideHeading?: boolean }) {
  return (
    <>
      {!hideHeading && <SidebarHeading />}
      <div className="flex flex-col gap-2">
        <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-muted text-center">
          No widgets yet
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
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
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
