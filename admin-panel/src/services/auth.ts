import api from './api';
import { LoginResponse, User } from '@/types';

export const authService = {
  // Connexion admin
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erreur de connexion');
    }
    
    const { user, token } = response.data;
    
    // Vérifier que l'utilisateur est admin
    if (user.role !== 'admin') {
      throw new Error('Accès refusé : droits administrateur requis');
    }
    
    // Sauvegarder le token et les infos utilisateur
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    
    return { user, token };
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },
};

