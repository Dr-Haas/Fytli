import api from './api';
import { Badge, UserBadge } from '@/types';

export const badgesService = {
  // Récupérer tous les badges
  getAll: async (): Promise<Badge[]> => {
    const response = await api.get('/badges');
    return response.data.data || [];
  },

  // Créer un badge
  create: async (badgeData: Partial<Badge>): Promise<Badge> => {
    const response = await api.post('/badges', badgeData);
    return response.data.data;
  },

  // Modifier un badge
  update: async (id: number, badgeData: Partial<Badge>): Promise<Badge> => {
    const response = await api.put(`/badges/${id}`, badgeData);
    return response.data.data;
  },

  // Supprimer un badge
  delete: async (id: number): Promise<void> => {
    await api.delete(`/badges/${id}`);
  },

  // Récupérer tous les badges gagnés
  getAllUserBadges: async (): Promise<UserBadge[]> => {
    const response = await api.get('/badges/users');
    return response.data.data || [];
  },

  // Récupérer les badges d'un utilisateur
  getUserBadges: async (userId: number): Promise<UserBadge[]> => {
    const response = await api.get(`/badges/user/${userId}`);
    return response.data.data || [];
  },
};

