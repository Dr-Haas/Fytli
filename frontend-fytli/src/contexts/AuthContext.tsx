import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { authService } from '../services/auth';
import { AuthContextType, LoginCredentials, RegisterCredentials, User } from '../types';
import { showToast, getErrorMessage } from '../utils/toast';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation : vérifier si un token existe au mount
  useEffect(() => {
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      authService.storeAuth(response.token, JSON.stringify(response.user));
      showToast.success('Connexion réussie ! Bienvenue 👋');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const message = getErrorMessage(error);
      showToast.error(message);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      setToken(response.token);
      setUser(response.user);
      authService.storeAuth(response.token, JSON.stringify(response.user));
      showToast.success('Compte créé ! Bienvenue chez Fytli 🎉');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      const message = getErrorMessage(error);
      showToast.error(message);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    showToast.info('À bientôt ! 👋');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

