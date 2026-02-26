import { useState } from 'react';
import { DesktopNav } from './navigation/DesktopNav';
import { Logo } from './navigation/Logo';
import { MenuButton } from './navigation/MenuButton';
import { MobileNav } from './navigation/MobileNav';
import { ThemeToggle } from './navigation/ThemeToggle';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium rounded-md border border-border text-muted hover:text-foreground hover:bg-overlay cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Preview
            </button>
            <button
              type="button"
              className="size-10 rounded-full bg-overlay text-sm font-medium text-muted hover:bg-primary hover:text-on-primary cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Open user menu"
              aria-haspopup="true"
            >
              U
            </button>
          </div>

          {/* Mobile Menu Button */}
          <MenuButton isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>
      </header>

      {/* Mobile Navigation - Outside header */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};
