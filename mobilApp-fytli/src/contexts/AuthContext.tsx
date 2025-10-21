import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';
import { User, LoginCredentials, RegisterCredentials } from '../types/database';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

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
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await authService.getStoredToken();
      const storedUser = await authService.getStoredUser();

      console.log('🔐 Auth - Token stored:', !!storedToken);
      console.log('🔐 Auth - User stored:', !!storedUser);

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('🔐 Auth - User parsed:', parsedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('❌ Erreur parsing user:', parseError);
          // Si le parsing échoue, nettoyer le storage
          await authService.logout();
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      console.log('✅ Login successful - User:', response.user);
      console.log('✅ Login successful - Token:', response.token.substring(0, 20) + '...');
      
      setToken(response.token);
      setUser(response.user);
      await authService.storeAuth(response.token, JSON.stringify(response.user));
      
      console.log('✅ Auth stored in AsyncStorage');
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authService.register(credentials);
      console.log('✅ Register successful - User:', response.user);
      
      setToken(response.token);
      setUser(response.user);
      await authService.storeAuth(response.token, JSON.stringify(response.user));
      
      console.log('✅ Auth stored in AsyncStorage');
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

