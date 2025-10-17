import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Dumbbell, Trophy, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/programs', icon: Dumbbell, label: 'Programmes' },
  { to: '/badges', icon: Trophy, label: 'Badges' },
  { to: '/profile', icon: User, label: 'Profil' },
];

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-full bg-background border-2 border-fytli-line shadow-lg"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-fytli-dark" />
        ) : (
          <Menu className="h-6 w-6 text-fytli-dark" />
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background z-40 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-br from-fytli-red/5 to-fytli-orange/5">
                  <h2 className="text-2xl font-bold text-gradient font-brand mb-1">
                    Fytli
                  </h2>
                  {user && (
                    <p className="text-sm text-muted-foreground">
                      {user.firstname} {user.lastname}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all',
                          isActive
                            ? 'bg-gradient-to-r from-fytli-red to-fytli-orange text-white shadow-md'
                            : 'text-muted-foreground hover:bg-fytli-cream'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 w-full text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                  </button>
                  <div className="mt-4 text-center text-xs text-muted-foreground">
                    Fytli v1.0.0
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

