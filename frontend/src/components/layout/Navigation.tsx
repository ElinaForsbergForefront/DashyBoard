import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { DesktopNav } from './navigation/DesktopNav';
import { Logo } from './navigation/Logo';
import { MenuButton } from './navigation/MenuButton';
import { MobileNav } from './navigation/MobileNav';
import { ThemeToggle } from './navigation/ThemeToggle';
import { LogoutButton } from '../auth/LogoutButton';
import { useActiveMirror } from '../../context/ActiveMirrorContext';

interface NavigationProps {
  disableInteractions?: boolean;
}

export const Navigation = ({ disableInteractions = false }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { activeMirrorId } = useActiveMirror();

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="relative flex items-center justify-between px-4 py-3">
          {/* Logo – left */}
          <Logo />

          {/* Desktop Navigation – always centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <DesktopNav disabled={disableInteractions} />
          </div>

          {/* Desktop Actions – right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <ThemeToggle />
            {activeMirrorId && (
              <button
                type="button"
                onClick={() => navigate(`/preview/${activeMirrorId}`)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-border text-muted hover:text-foreground hover:bg-overlay cursor-pointer transition-all"
                aria-label="Preview mirror"
              >
                <Eye size={14} />
                Preview
              </button>
            )}
            <LogoutButton />
          </div>

          {/* Mobile Menu Button */}
          <MenuButton
            isOpen={mobileMenuOpen}
            disabled={disableInteractions}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </header>

      {/* Mobile Navigation - Outside header */}
      <MobileNav
        isOpen={mobileMenuOpen}
        disabled={disableInteractions}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
