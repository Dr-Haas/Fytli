/**
 * Service Admin - Gestion des opérations administratives
 * Toutes ces fonctions nécessitent un rôle admin
 */

import api from './api';
import { User } from '../types';

interface AdminStatsResponse {
  success: boolean;
  data: {
    users: {
      total: number;
      byRole: Array<{ role: string; count: number }>;
    };
    programs: number;
    exercises: number;
  };
}

interface UsersListResponse {
  success: boolean;
  count: number;
  data: User[];
}

interface UserResponse {
  success: boolean;
  message?: string;
  data: User;
}

interface UpdateRoleData {
  role: 'user' | 'admin' | 'coach';
}

export const adminService = {
  /**
   * Récupère les statistiques de l'application
   * GET /admin/stats
   */
  async getStats() {
    const response = await api.get<AdminStatsResponse>('/admin/stats');
    return response.data.data;
  },

  /**
   * Récupère tous les utilisateurs
   * GET /admin/users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<UsersListResponse>('/admin/users');
    return response.data.data;
  },

  /**
   * Récupère les utilisateurs par rôle
   * GET /admin/users/role/:role
   */
  async getUsersByRole(role: 'user' | 'admin' | 'coach'): Promise<User[]> {
    const response = await api.get<UsersListResponse>(`/admin/users/role/${role}`);
    return response.data.data;
  },

  /**
   * Modifie le rôle d'un utilisateur
   * PUT /admin/users/:id/role
   */
  async updateUserRole(userId: number, data: UpdateRoleData): Promise<User> {
    const response = await api.put<UserResponse>(`/admin/users/${userId}/role`, data);
    return response.data.data;
  },

  /**
   * Supprime un utilisateur
   * DELETE /admin/users/:id
   */
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};

