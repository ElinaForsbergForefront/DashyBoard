import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './nav-items';
import { usePermissions } from '../../../hooks/usePermissions';

export const DesktopNav = () => {
  const { hasPermission } = usePermissions();

  return (
    <nav aria-label="Main navigation" className="hidden md:block">
      <ul
        className="glass-base glass-smooth rounded-lg flex items-center gap-0.5 px-1 py-1"
        role="menubar"
      >
        {NAV_ITEMS.map(({ to, label, requiredPermissions }) => {
          const canView = !requiredPermissions || hasPermission(requiredPermissions);

          if (!canView) return null;

          return (
            <NavLink
              to={to}
              key={label}
              role="menuitem"
              className={({ isActive }) =>
                `inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                  isActive
                    ? 'bg-white/10 backdrop-blur-sm border-white/20 text-foreground shadow-lg'
                    : 'bg-transparent border-white/0 text-muted hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          );
        })}
      </ul>
    </nav>
  );
};
