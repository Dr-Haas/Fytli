import { Home, Dumbbell, Trophy, User, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/programs', icon: Dumbbell, label: 'Programmes' },
  { to: '/badges', icon: Trophy, label: 'Badges' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r bg-muted/40 min-h-screen">
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Version</p>
            <p className="text-xs text-muted-foreground">1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

