import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav-items';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  return (
    <nav
      id="mobile-menu"
      aria-label="Mobile navigation"
      className={`fixed top-16 left-0 right-0 md:hidden bg-surface border-b border-border shadow-lg transition-all duration-300 z-40 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <ul className="flex flex-col px-4 py-2 space-y-1" role="menu">
        {NAV_ITEMS.map(({ to, label }) => (
          <li key={to} role="none">
            <NavLink
              to={to}
              role="menuitem"
              onClick={onClose}
              className={({ isActive }) =>
                `block w-full px-4 py-3 text-base font-medium rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? 'bg-overlay text-foreground'
                    : 'text-muted hover:text-foreground hover:bg-overlay'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
