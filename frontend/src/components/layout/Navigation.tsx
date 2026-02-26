import { DesktopNav } from './navigation/DesktopNav';
import { Logo } from './navigation/Logo';

export const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="flex item-center justify-between px-4 py-3 md:px-6">
        <Logo />
        <DesktopNav />
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 text-sm font-medium rounded-md border border-border text-muted hover:text-foreground hover:bg-surface-alt transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Preview
          </button>
          <button
            type="button"
            className="size-10 rounded-full bg-surface-alt text-sm font-medium text-muted hover:bg-primary hover:text-on-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Open user menu"
            aria-haspopup="true"
          >
            U
          </button>
        </div>
      </div>
    </header>
  );
};
