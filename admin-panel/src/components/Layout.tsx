import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  UserCheck,
  LogOut,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/users', icon: Users },
    { name: 'Programmes', href: '/programs', icon: BookOpen },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Inscriptions', href: '/enrollments', icon: UserCheck },
    { name: 'Badges', href: '/badges', icon: Award },
    { name: 'Statistiques', href: '/stats', icon: TrendingUp },
  ];

  const handleLogout = () => {
    authService.logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar pour desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-primary-600 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Fytli Admin</h1>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-primary-500 p-4">
            <div className="flex items-center w-full">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-primary-200">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 rounded-lg text-primary-200 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-primary-600">
            <div className="flex items-center justify-between px-6 py-6">
              <h1 className="text-2xl font-bold text-white">Fytli Admin</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-primary-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-700 text-white' 
                        : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 flex border-t border-primary-500 p-4">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-primary-200">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 p-2 rounded-lg text-primary-200 hover:bg-primary-500 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header mobile */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900">Fytli Admin</h1>
          </div>
        </div>

        {/* Contenu */}
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

