import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { MobileNav } from './MobileNav';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gradient font-brand">
              Fytli
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {user.firstname} {user.lastname}
                </span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </>
  );
};

