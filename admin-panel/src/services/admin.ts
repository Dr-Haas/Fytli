import api from './api';
import { User, Stats } from '@/types';

export const adminService = {
  // Récupérer les statistiques
  getStats: async (): Promise<Stats> => {
    const response = await api.get('/admin/stats');
    
    // Le backend retourne une structure différente, on l'adapte
    const backendData = response.data.data;
    return {
      total_users: backendData.users.total,
      total_programs: backendData.programs,
      total_sessions: 0, // Le backend ne retourne pas ce champ
      total_completions: 0, // Le backend ne retourne pas ce champ
      active_enrollments: 0, // Le backend ne retourne pas ce champ
      total_badges_earned: 0, // Le backend ne retourne pas ce champ
      users_today: 0,
      completions_today: 0,
    };
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data.data || [];
  },

  // Récupérer les utilisateurs par rôle
  getUsersByRole: async (role: 'user' | 'admin' | 'coach'): Promise<User[]> => {
    const response = await api.get(`/admin/users/role/${role}`);
    return response.data.data || [];
  },

  // Modifier le rôle d'un utilisateur
  updateUserRole: async (userId: number, role: 'user' | 'admin' | 'coach'): Promise<void> => {
    await api.put(`/admin/users/${userId}/role`, { role });
  },

  // Supprimer un utilisateur
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },
};

