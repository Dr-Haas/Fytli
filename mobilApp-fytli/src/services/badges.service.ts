import api from './api';
import { Badge, UserBadge } from '@/types/database';

interface BadgesResponse {
  success: boolean;
  data: Badge[];
}

interface UserBadgesResponse {
  success: boolean;
  data: UserBadge[];
}

interface UserStatsResponse {
  success: boolean;
  data: {
    total_sessions: number;
    total_duration: number;
    current_streak: number;
    best_streak: number;
    total_badges: number;
    badges_earned: number;
  };
}

export const badgesService = {
  /**
   * Récupérer tous les badges disponibles
   */
  async getAll(): Promise<Badge[]> {
    const response = await api.get<BadgesResponse>('/badges');
    return response.data.data;
  },

  /**
   * Récupérer tous les badges d'un utilisateur
   */
  async getUserBadges(userId?: number): Promise<UserBadge[]> {
    const url = userId ? `/badges/user/${userId}` : '/badges/user';
    const response = await api.get<UserBadgesResponse>(url);
    return response.data.data;
  },

  /**
   * Récupérer uniquement les badges débloqués d'un utilisateur
   */
  async getUserEarnedBadges(userId: number): Promise<UserBadge[]> {
    const response = await api.get<{ success: boolean; count: number; data: UserBadge[] }>(
      `/badges/user/${userId}/earned`
    );
    return response.data.data;
  },

  /**
   * Récupérer les statistiques badges d'un utilisateur
   */
  async getUserStats(userId: number): Promise<UserStatsResponse['data']> {
    const response = await api.get<UserStatsResponse>(`/badges/user/${userId}/stats`);
    return response.data.data;
  },

  /**
   * Vérifier et attribuer les badges automatiquement
   */
  async checkAndAwardBadges(): Promise<UserBadge[]> {
    const response = await api.post<UserBadgesResponse>('/badges/check');
    return response.data.data;
  },

  /**
   * Vérifier tous les badges d'un utilisateur
   */
  async checkAllBadges(userId: number): Promise<UserBadgesResponse> {
    const response = await api.post<UserBadgesResponse>(`/badges/user/${userId}/check`);
    return response.data;
  },
};
