import api from './api';
import { Badge, UserBadge, BadgeId } from '../types/badges';

/**
 * BADGES SERVICE
 * Service pour gérer les appels API liés aux badges
 */

// =====================================================
// Types de réponse
// =====================================================

interface BadgesResponse {
  success: boolean;
  count?: number;
  data: Badge[];
}

interface BadgeResponse {
  success: boolean;
  data: Badge;
}

interface UserBadgeWithProgress {
  badge_id: BadgeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient?: string;
  category: 'routine' | 'performance' | 'sante' | 'accomplissement';
  requirement: string;
  points: number;
  is_secret: boolean;
  earned: boolean;
  earned_at?: string;
  progress_percent: number;
}

interface UserBadgesResponse {
  success: boolean;
  overview: {
    badges_earned: number;
    total_points: number;
    total_badges: number;
    completion_percent: number;
  };
  data: UserBadgeWithProgress[];
}

interface UserBadgesOverviewResponse {
  success: boolean;
  data: {
    badges_earned: number;
    total_points: number;
    total_badges: number;
    completion_percent: number;
  };
}

interface UnlockBadgeResponse {
  success: boolean;
  message: string;
  data: {
    badgeId: string;
    name: string;
    points: number;
  };
}

interface UserStatsResponse {
  success: boolean;
  data: {
    total_workouts: number;
    current_streak: number;
    longest_streak: number;
    total_exercises: number;
    total_sets: number;
    average_heart_rate: number | null;
    programs_completed: number;
    morning_workouts: number;
    evening_workouts: number;
    zen_sessions: number;
    last_workout_date: string | null;
    performance_improvement_percent: number;
  };
}

interface WorkoutData {
  session_id: number;
  program_id?: number;
  duration_minutes: number;
  exercises_completed: number;
  total_sets: number;
  workout_time?: string; // Format: 'HH:MM:SS'
}

interface WeeklyGoalResponse {
  success: boolean;
  data: {
    id: number;
    week_start_date: string;
    goal_type: 'workouts' | 'duration' | 'exercises';
    goal_target: number;
    goal_current: number;
    goal_achieved: boolean;
  } | null;
}

// =====================================================
// Service Badges
// =====================================================

export const badgesService = {
  // =============== BADGES - Définitions ===============

  /**
   * Récupérer tous les badges disponibles
   */
  async getAllBadges(): Promise<Badge[]> {
    const response = await api.get<BadgesResponse>('/badges');
    return response.data.data;
  },

  /**
   * Récupérer un badge par son ID
   */
  async getBadgeById(badgeId: BadgeId): Promise<Badge> {
    const response = await api.get<BadgeResponse>(`/badges/${badgeId}`);
    return response.data.data;
  },

  /**
   * Récupérer les badges d'une catégorie
   */
  async getBadgesByCategory(category: 'routine' | 'performance' | 'sante' | 'accomplissement'): Promise<Badge[]> {
    const response = await api.get<BadgesResponse>(`/badges/category/${category}`);
    return response.data.data;
  },

  // =============== USER BADGES - Badges utilisateur ===============

  /**
   * Récupérer tous les badges d'un utilisateur avec progression
   */
  async getUserBadgesWithProgress(userId: number): Promise<UserBadgesResponse> {
    const response = await api.get<UserBadgesResponse>(`/badges/user/${userId}`);
    return response.data;
  },

  /**
   * Récupérer uniquement les badges débloqués
   */
  async getUserEarnedBadges(userId: number): Promise<UserBadge[]> {
    const response = await api.get<{ success: boolean; count: number; data: UserBadge[] }>(
      `/badges/user/${userId}/earned`
    );
    return response.data.data;
  },

  /**
   * Vue d'ensemble des badges (stats globales)
   */
  async getUserBadgesOverview(userId: number): Promise<UserBadgesOverviewResponse['data']> {
    const response = await api.get<UserBadgesOverviewResponse>(`/badges/user/${userId}/overview`);
    return response.data.data;
  },

  /**
   * Débloquer manuellement un badge (admin/test)
   */
  async unlockBadge(userId: number, badgeId: BadgeId): Promise<UnlockBadgeResponse> {
    const response = await api.post<UnlockBadgeResponse>(`/badges/user/${userId}/unlock`, {
      badgeId,
    });
    return response.data;
  },

  /**
   * Vérifier tous les badges d'un utilisateur
   */
  async checkAllBadges(userId: number): Promise<UserBadgesResponse> {
    const response = await api.post<UserBadgesResponse>(`/badges/user/${userId}/check`);
    return response.data;
  },

  // =============== USER STATS - Statistiques ===============

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(userId: number): Promise<UserStatsResponse['data']> {
    const response = await api.get<UserStatsResponse>(`/badges/user/${userId}/stats`);
    return response.data.data;
  },

  // =============== WORKOUT HISTORY - Historique ===============

  /**
   * Enregistrer une séance d'entraînement
   * Déclenche automatiquement la vérification des badges
   */
  async createWorkoutHistory(userId: number, workoutData: WorkoutData): Promise<UserBadgeWithProgress[]> {
    const response = await api.post<{ success: boolean; message: string; data: UserBadgeWithProgress[] }>(
      `/badges/user/${userId}/workout`,
      workoutData
    );
    return response.data.data;
  },

  /**
   * Récupérer l'historique des séances
   */
  async getUserWorkoutHistory(userId: number, limit: number = 10): Promise<any[]> {
    const response = await api.get<{ success: boolean; count: number; data: any[] }>(
      `/badges/user/${userId}/history`,
      {
        params: { limit },
      }
    );
    return response.data.data;
  },

  // =============== WEEKLY GOALS - Objectifs hebdomadaires ===============

  /**
   * Récupérer l'objectif de la semaine en cours
   */
  async getCurrentWeeklyGoal(userId: number): Promise<WeeklyGoalResponse['data']> {
    const response = await api.get<WeeklyGoalResponse>(`/badges/user/${userId}/weekly-goal`);
    return response.data.data;
  },

  /**
   * Définir un objectif hebdomadaire
   */
  async setWeeklyGoal(
    userId: number,
    goalType: 'workouts' | 'duration' | 'exercises',
    goalTarget: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/badges/user/${userId}/weekly-goal`,
      {
        goalType,
        goalTarget,
      }
    );
    return response.data;
  },
};

