import api from './api';
import { WeeklyGoal, WeeklyGoalProgress, CreateWeeklyGoalData } from '../types';

/**
 * Service pour gérer les objectifs hebdomadaires
 */
export const weeklyGoalsService = {
  /**
   * Récupérer l'objectif de la semaine en cours
   */
  async getCurrentWeeklyGoal(userId: number): Promise<WeeklyGoalProgress | null> {
    try {
      const response = await api.get(`/badges/user/${userId}/weekly-goal`);
      if (!response.data.data) {
        return null;
      }
      
      const goal = response.data.data;
      
      // Calculer la progression
      const progress_percent = goal.goal_target > 0 
        ? Math.min(Math.round((goal.goal_current / goal.goal_target) * 100), 100)
        : 0;
      
      const remaining = Math.max(goal.goal_target - goal.goal_current, 0);
      
      // Calculer les jours restants dans la semaine
      const weekStart = new Date(goal.week_start_date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const today = new Date();
      const days_left = Math.max(
        Math.ceil((weekEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
        0
      );
      
      // Déterminer si l'objectif est atteignable
      const is_achievable = days_left > 0 && remaining > 0;
      
      return {
        goal,
        progress_percent,
        remaining,
        days_left,
        is_achievable
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erreur getCurrentWeeklyGoal:', error);
      throw error;
    }
  },

  /**
   * Créer un nouvel objectif hebdomadaire
   */
  async createWeeklyGoal(userId: number, data: CreateWeeklyGoalData): Promise<WeeklyGoal> {
    const response = await api.post(`/badges/user/${userId}/weekly-goal`, data);
    return response.data.data;
  },

  /**
   * Mettre à jour l'objectif de la semaine
   */
  async updateWeeklyGoal(userId: number, data: Partial<CreateWeeklyGoalData>): Promise<WeeklyGoal> {
    const response = await api.put(`/badges/user/${userId}/weekly-goal`, data);
    return response.data.data;
  },

  /**
   * Supprimer l'objectif de la semaine
   */
  async deleteWeeklyGoal(userId: number): Promise<void> {
    await api.delete(`/badges/user/${userId}/weekly-goal`);
  },

  /**
   * Récupérer l'historique des objectifs hebdomadaires
   */
  async getWeeklyGoalHistory(userId: number, limit: number = 10): Promise<WeeklyGoal[]> {
    const response = await api.get(`/badges/user/${userId}/weekly-goals`, {
      params: { limit }
    });
    return response.data.data || [];
  },

  /**
   * Marquer l'objectif comme complété
   */
  async completeWeeklyGoal(userId: number): Promise<void> {
    await api.post(`/badges/user/${userId}/weekly-goal/complete`);
  },

  /**
   * Suggérer un objectif basé sur l'historique de l'utilisateur
   */
  async suggestWeeklyGoal(userId: number): Promise<CreateWeeklyGoalData> {
    try {
      const response = await api.get(`/badges/user/${userId}/suggest-goal`);
      return response.data.data;
    } catch (error) {
      // Si l'endpoint n'existe pas, retourner un objectif par défaut
      return {
        goal_type: 'workouts',
        goal_target: 3,
        description: 'Complète 3 séances cette semaine'
      };
    }
  }
};

/**
 * Helpers pour formater les objectifs
 */
export const weeklyGoalHelpers = {
  /**
   * Obtenir le libellé d'un type d'objectif
   */
  getGoalTypeLabel(goalType: string): string {
    const labels: Record<string, string> = {
      workouts: 'Séances d\'entraînement',
      duration: 'Minutes d\'exercice',
      exercises: 'Exercices complétés',
      streak: 'Jours consécutifs',
      programs: 'Programmes complétés',
      sessions: 'Sessions complétées'
    };
    return labels[goalType] || 'Objectif';
  },

  /**
   * Obtenir l'icône d'un type d'objectif
   */
  getGoalTypeIcon(goalType: string): string {
    const icons: Record<string, string> = {
      workouts: '🏋️',
      duration: '⏱️',
      exercises: '💪',
      streak: '🔥',
      programs: '📋',
      sessions: '✅'
    };
    return icons[goalType] || '🎯';
  },

  /**
   * Formater la description d'un objectif
   */
  formatGoalDescription(goal: WeeklyGoal): string {
    if (goal.description) {
      return goal.description;
    }

    const typeLabel = this.getGoalTypeLabel(goal.goal_type).toLowerCase();
    const target = goal.goal_target;

    switch (goal.goal_type) {
      case 'workouts':
        return `Complète ${target} séance${target > 1 ? 's' : ''} cette semaine`;
      case 'duration':
        return `Entraîne-toi pendant ${target} minutes cette semaine`;
      case 'exercises':
        return `Complète ${target} exercice${target > 1 ? 's' : ''} cette semaine`;
      case 'streak':
        return `Enchaîne ${target} jour${target > 1 ? 's' : ''} consécutifs`;
      case 'programs':
        return `Complète ${target} programme${target > 1 ? 's' : ''} cette semaine`;
      case 'sessions':
        return `Complète ${target} session${target > 1 ? 's' : ''} cette semaine`;
      default:
        return `Atteins ton objectif de ${target} ${typeLabel}`;
    }
  },

  /**
   * Obtenir le message de progression
   */
  getProgressMessage(progress: WeeklyGoalProgress): string {
    const { goal, progress_percent, remaining, days_left } = progress;

    if (goal.goal_achieved) {
      return '🎉 Objectif atteint ! Bravo !';
    }

    if (remaining === 0) {
      return '✨ Presque terminé !';
    }

    if (days_left === 0) {
      return '⏰ Dernier jour pour atteindre ton objectif !';
    }

    if (progress_percent >= 75) {
      return `💪 Plus que ${remaining} pour atteindre ton objectif !`;
    }

    if (progress_percent >= 50) {
      return `👍 À mi-chemin ! Continue comme ça !`;
    }

    if (progress_percent >= 25) {
      return `🚀 Bon départ ! ${remaining} restant`;
    }

    return `🎯 Objectif : ${remaining} restant sur ${goal.goal_target}`;
  },

  /**
   * Obtenir la couleur de la barre de progression
   */
  getProgressColor(progress_percent: number): string {
    if (progress_percent >= 100) return 'bg-green-500';
    if (progress_percent >= 75) return 'bg-blue-500';
    if (progress_percent >= 50) return 'bg-yellow-500';
    if (progress_percent >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  }
};

