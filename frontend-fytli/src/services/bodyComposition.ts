/**
 * Service Body Composition
 * Gestion des mesures corporelles, objectifs et statistiques
 */

import api from './api';

export interface BodyMeasurement {
  id?: number;
  user_id?: number;
  weight_kg: number;
  height_cm: number;
  body_fat_percent?: number | null;
  lean_mass_percent?: number | null;
  muscle_mass_kg?: number | null;
  bmi?: number;
  waist_cm?: number | null;
  chest_cm?: number | null;
  hips_cm?: number | null;
  arms_cm?: number | null;
  thighs_cm?: number | null;
  notes?: string | null;
  measurement_date?: string | Date;
  created_at?: string;
}

export interface BodyGoal {
  id?: number;
  user_id?: number;
  goal_type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'body_recomposition' | 'maintenance';
  target_weight_kg?: number | null;
  target_body_fat_percent?: number | null;
  target_muscle_mass_kg?: number | null;
  start_date: string | Date;
  target_date: string | Date;
  completed_date?: string | null;
  status?: 'active' | 'completed' | 'abandoned' | 'paused';
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GoalProgress {
  goal_id: number;
  user_id: number;
  goal_type: string;
  status: string;
  start_date: string;
  target_date: string;
  start_weight?: number;
  start_body_fat?: number;
  current_weight?: number;
  current_body_fat?: number;
  target_weight_kg?: number;
  target_body_fat_percent?: number;
  target_muscle_mass_kg?: number;
  progress_percent?: number;
  days_remaining: number;
  days_elapsed: number;
}

export interface BodyStats {
  overview?: {
    user_id: number;
    current_weight?: number;
    current_height?: number;
    current_body_fat?: number;
    current_bmi?: number;
    starting_weight?: number;
    starting_body_fat?: number;
    total_weight_change?: number;
    total_body_fat_change?: number;
    total_measurements: number;
    first_measurement_date?: string;
    last_measurement_date?: string;
    tracking_days: number;
  };
  last30Days?: {
    avg_weight?: number;
    min_weight?: number;
    max_weight?: number;
    avg_body_fat?: number;
    avg_bmi?: number;
    measurements_count: number;
  };
  last90Days?: {
    avg_weight?: number;
    min_weight?: number;
    max_weight?: number;
    avg_body_fat?: number;
    avg_bmi?: number;
    measurements_count: number;
  };
  latest?: BodyMeasurement | null;
}

export interface TrendData {
  date: string;
  weight_kg?: number;
  bmi?: number;
  body_fat_percent?: number;
  lean_mass_percent?: number;
  muscle_mass_kg?: number;
}

export interface BodyBadge {
  badge_id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  points: number;
  earned_at: string;
}

const bodyCompositionService = {
  // =====================================================
  // MEASUREMENTS - Mesures corporelles
  // =====================================================

  /**
   * Créer une nouvelle mesure corporelle
   */
  async createMeasurement(data: BodyMeasurement) {
    const response = await api.post('/body-composition/measurements', data);
    return response.data;
  },

  /**
   * Récupérer toutes les mesures
   */
  async getMeasurements(limit = 50): Promise<BodyMeasurement[]> {
    const response = await api.get(`/body-composition/measurements?limit=${limit}`);
    return response.data.data;
  },

  /**
   * Récupérer la dernière mesure
   */
  async getLatestMeasurement(): Promise<BodyMeasurement | null> {
    try {
      const response = await api.get('/body-composition/measurements/latest');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Mettre à jour une mesure
   */
  async updateMeasurement(id: number, data: Partial<BodyMeasurement>) {
    const response = await api.put(`/body-composition/measurements/${id}`, data);
    return response.data;
  },

  /**
   * Supprimer une mesure
   */
  async deleteMeasurement(id: number) {
    const response = await api.delete(`/body-composition/measurements/${id}`);
    return response.data;
  },

  // =====================================================
  // STATISTICS - Statistiques
  // =====================================================

  /**
   * Récupérer les statistiques corporelles complètes
   */
  async getStats(): Promise<BodyStats> {
    const response = await api.get('/body-composition/stats');
    return response.data.data;
  },

  /**
   * Récupérer l'évolution du poids
   */
  async getWeightTrend(days = 90): Promise<TrendData[]> {
    const response = await api.get(`/body-composition/trends/weight?days=${days}`);
    return response.data.data;
  },

  /**
   * Récupérer l'évolution de la composition corporelle
   */
  async getCompositionTrend(days = 90): Promise<TrendData[]> {
    const response = await api.get(`/body-composition/trends/composition?days=${days}`);
    return response.data.data;
  },

  // =====================================================
  // GOALS - Objectifs
  // =====================================================

  /**
   * Créer un nouvel objectif
   */
  async createGoal(data: BodyGoal) {
    const response = await api.post('/body-composition/goals', data);
    return response.data;
  },

  /**
   * Récupérer tous les objectifs
   */
  async getGoals(): Promise<BodyGoal[]> {
    const response = await api.get('/body-composition/goals');
    return response.data.data;
  },

  /**
   * Récupérer l'objectif actif
   */
  async getActiveGoal(): Promise<(BodyGoal & { progress?: GoalProgress }) | null> {
    try {
      const response = await api.get('/body-composition/goals/active');
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Mettre à jour le statut d'un objectif
   */
  async updateGoalStatus(id: number, status: 'active' | 'completed' | 'abandoned' | 'paused') {
    const response = await api.put(`/body-composition/goals/${id}/status`, { status });
    return response.data;
  },

  /**
   * Supprimer un objectif
   */
  async deleteGoal(id: number) {
    const response = await api.delete(`/body-composition/goals/${id}`);
    return response.data;
  },

  // =====================================================
  // BADGES - Badges corporels
  // =====================================================

  /**
   * Récupérer les badges corporels débloqués
   */
  async getBodyBadges(): Promise<BodyBadge[]> {
    const response = await api.get('/body-composition/badges');
    return response.data.data;
  },

  // =====================================================
  // UTILS - Utilitaires
  // =====================================================

  /**
   * Calculer l'IMC
   */
  calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  },

  /**
   * Interpréter l'IMC
   */
  interpretBMI(bmi: number): { category: string; color: string; description: string } {
    if (bmi < 18.5) {
      return {
        category: 'Sous-poids',
        color: '#3B82F6',
        description: 'IMC inférieur à la normale'
      };
    } else if (bmi < 25) {
      return {
        category: 'Poids normal',
        color: '#10B981',
        description: 'IMC dans la zone santé'
      };
    } else if (bmi < 30) {
      return {
        category: 'Surpoids',
        color: '#F59E0B',
        description: 'IMC légèrement élevé'
      };
    } else {
      return {
        category: 'Obésité',
        color: '#EF4444',
        description: 'IMC significativement élevé'
      };
    }
  },

  /**
   * Obtenir le label d'un type d'objectif
   */
  getGoalTypeLabel(goalType: string): string {
    const labels: Record<string, string> = {
      weight_loss: 'Perte de poids',
      weight_gain: 'Prise de poids',
      muscle_gain: 'Prise de masse musculaire',
      fat_loss: 'Perte de masse grasse',
      body_recomposition: 'Recomposition corporelle',
      maintenance: 'Maintien'
    };
    return labels[goalType] || goalType;
  },

  /**
   * Obtenir l'icône d'un type d'objectif
   */
  getGoalTypeIcon(goalType: string): string {
    const icons: Record<string, string> = {
      weight_loss: '📉',
      weight_gain: '📈',
      muscle_gain: '💪',
      fat_loss: '🔥',
      body_recomposition: '⚡',
      maintenance: '🎯'
    };
    return icons[goalType] || '🎯';
  }
};

export default bodyCompositionService;

