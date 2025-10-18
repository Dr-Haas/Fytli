const { pool } = require('../db');

/**
 * BADGES MODEL
 * Gestion des badges et progression des utilisateurs
 */

const badgesModel = {
  // =====================================================
  // BADGES - Définitions
  // =====================================================

  /**
   * Récupérer tous les badges disponibles
   */
  async getAllBadges() {
    const [rows] = await pool.query(
      `SELECT 
        badge_id,
        name,
        description,
        icon,
        color,
        gradient,
        requirement,
        category,
        points,
        is_secret
      FROM badges
      ORDER BY 
        FIELD(category, 'routine', 'performance', 'sante', 'accomplissement'),
        points ASC`
    );
    return rows;
  },

  /**
   * Récupérer un badge par son ID
   */
  async getBadgeById(badgeId) {
    const [rows] = await pool.query(
      `SELECT 
        badge_id,
        name,
        description,
        icon,
        color,
        gradient,
        requirement,
        category,
        points,
        is_secret
      FROM badges
      WHERE badge_id = ?`,
      [badgeId]
    );
    return rows[0];
  },

  /**
   * Récupérer les badges par catégorie
   */
  async getBadgesByCategory(category) {
    const [rows] = await pool.query(
      `SELECT 
        badge_id,
        name,
        description,
        icon,
        color,
        gradient,
        requirement,
        category,
        points,
        is_secret
      FROM badges
      WHERE category = ?
      ORDER BY points ASC`,
      [category]
    );
    return rows;
  },

  // =====================================================
  // USER BADGES - Badges débloqués
  // =====================================================

  /**
   * Récupérer tous les badges d'un utilisateur avec leur statut
   * (débloqués + progression)
   */
  async getUserBadgesWithProgress(userId) {
    const [rows] = await pool.query(
      `SELECT 
        b.badge_id,
        b.name,
        b.description,
        b.icon,
        b.color,
        b.gradient,
        b.category,
        b.requirement,
        b.points,
        b.is_secret,
        CASE 
          WHEN ub.id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END as earned,
        ub.earned_at,
        COALESCE(bp.progress_percent, 0) as progress_percent
      FROM badges b
      LEFT JOIN user_badges ub ON b.badge_id = ub.badge_id AND ub.user_id = ?
      LEFT JOIN badge_progress bp ON b.badge_id = bp.badge_id AND bp.user_id = ?
      ORDER BY 
        FIELD(b.category, 'routine', 'performance', 'sante', 'accomplissement'),
        b.points ASC`,
      [userId, userId]
    );
    return rows;
  },

  /**
   * Récupérer uniquement les badges débloqués d'un utilisateur
   */
  async getUserEarnedBadges(userId) {
    const [rows] = await pool.query(
      `SELECT 
        b.badge_id,
        b.name,
        b.description,
        b.icon,
        b.color,
        b.gradient,
        b.category,
        b.points,
        ub.earned_at,
        ub.progress
      FROM user_badges ub
      INNER JOIN badges b ON ub.badge_id = b.badge_id
      WHERE ub.user_id = ?
      ORDER BY ub.earned_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Vue d'ensemble des badges d'un utilisateur
   */
  async getUserBadgesOverview(userId) {
    const [rows] = await pool.query(
      `SELECT 
        badges_earned,
        total_points,
        total_badges,
        completion_percent
      FROM user_badges_overview
      WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || {
      badges_earned: 0,
      total_points: 0,
      total_badges: 10,
      completion_percent: 0
    };
  },

  /**
   * Débloquer un badge pour un utilisateur
   */
  async unlockBadge(userId, badgeId) {
    try {
      const [result] = await pool.query(
        `INSERT INTO user_badges (user_id, badge_id, progress)
        VALUES (?, ?, 100)
        ON DUPLICATE KEY UPDATE progress = 100`,
        [userId, badgeId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Vérifier si un utilisateur a débloqué un badge
   */
  async hasUserEarnedBadge(userId, badgeId) {
    const [rows] = await pool.query(
      `SELECT id FROM user_badges
      WHERE user_id = ? AND badge_id = ?`,
      [userId, badgeId]
    );
    return rows.length > 0;
  },

  // =====================================================
  // BADGE PROGRESS - Progression
  // =====================================================

  /**
   * Mettre à jour la progression d'un badge
   */
  async updateBadgeProgress(userId, badgeId, progressValue, progressTarget) {
    const [result] = await pool.query(
      `INSERT INTO badge_progress (user_id, badge_id, progress_value, progress_target)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        progress_value = VALUES(progress_value),
        progress_target = VALUES(progress_target),
        last_updated = CURRENT_TIMESTAMP`,
      [userId, badgeId, progressValue, progressTarget]
    );
    return result;
  },

  /**
   * Récupérer la progression d'un badge spécifique
   */
  async getBadgeProgress(userId, badgeId) {
    const [rows] = await pool.query(
      `SELECT 
        badge_id,
        progress_value,
        progress_target,
        progress_percent,
        last_updated
      FROM badge_progress
      WHERE user_id = ? AND badge_id = ?`,
      [userId, badgeId]
    );
    return rows[0];
  },

  // =====================================================
  // USER STATS - Statistiques
  // =====================================================

  /**
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(userId) {
    const [rows] = await pool.query(
      `SELECT 
        total_workouts,
        current_streak,
        longest_streak,
        total_exercises,
        total_sets,
        average_heart_rate,
        programs_completed,
        morning_workouts,
        evening_workouts,
        zen_sessions,
        last_workout_date,
        performance_improvement_percent
      FROM user_stats
      WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Créer les stats pour un nouvel utilisateur
   */
  async createUserStats(userId) {
    const [result] = await pool.query(
      `INSERT INTO user_stats (user_id) VALUES (?)
      ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId]
    );
    return result;
  },

  // =====================================================
  // WORKOUT HISTORY - Historique
  // =====================================================

  /**
   * Enregistrer une séance d'entraînement
   */
  async createWorkoutHistory(data) {
    const {
      user_id,
      session_id,
      program_id,
      duration_minutes,
      exercises_completed,
      total_sets,
      workout_time
    } = data;

    const [result] = await pool.query(
      `INSERT INTO workout_history (
        user_id, 
        session_id, 
        program_id, 
        duration_minutes, 
        exercises_completed, 
        total_sets,
        workout_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, session_id, program_id, duration_minutes, exercises_completed, total_sets, workout_time]
    );
    return result;
  },

  /**
   * Récupérer l'historique des séances d'un utilisateur
   */
  async getUserWorkoutHistory(userId, limit = 10) {
    const [rows] = await pool.query(
      `SELECT 
        id,
        session_id,
        program_id,
        completed_at,
        duration_minutes,
        exercises_completed,
        total_sets,
        workout_time
      FROM workout_history
      WHERE user_id = ?
      ORDER BY completed_at DESC
      LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },

  // =====================================================
  // BADGE CHECKING - Vérification automatique
  // =====================================================

  /**
   * Vérifier tous les badges d'un utilisateur
   * Appelle la stored procedure SQL
   */
  async checkAllBadges(userId) {
    try {
      await pool.query('CALL check_all_badges(?)', [userId]);
      return true;
    } catch (error) {
      console.error('Erreur check_all_badges:', error);
      return false;
    }
  },

  /**
   * Vérifier le badge Constance (7 jours consécutifs)
   */
  async checkConstanceBadge(userId) {
    try {
      await pool.query('CALL check_constance_badge(?)', [userId]);
      return true;
    } catch (error) {
      console.error('Erreur check_constance_badge:', error);
      return false;
    }
  },

  /**
   * Vérifier le badge Routine Matinale
   */
  async checkRoutineMatinaleBadge(userId) {
    try {
      await pool.query('CALL check_routine_matinale_badge(?)', [userId]);
      return true;
    } catch (error) {
      console.error('Erreur check_routine_matinale_badge:', error);
      return false;
    }
  },

  /**
   * Vérifier le badge Challenge Réussi
   */
  async checkChallengeBadge(userId) {
    try {
      await pool.query('CALL check_challenge_badge(?)', [userId]);
      return true;
    } catch (error) {
      console.error('Erreur check_challenge_badge:', error);
      return false;
    }
  },

  // =====================================================
  // WEEKLY GOALS - Objectifs hebdomadaires
  // =====================================================

  /**
   * Récupérer l'objectif de la semaine en cours
   */
  async getCurrentWeeklyGoal(userId) {
    // Trouver le lundi de la semaine en cours
    const [rows] = await pool.query(
      `SELECT 
        id,
        week_start_date,
        goal_type,
        goal_target,
        goal_current,
        goal_achieved
      FROM weekly_goals
      WHERE user_id = ? 
        AND week_start_date = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`,
      [userId]
    );
    return rows[0] || null;
  },

  /**
   * Créer ou mettre à jour un objectif hebdomadaire
   */
  async setWeeklyGoal(userId, goalType, goalTarget) {
    const [result] = await pool.query(
      `INSERT INTO weekly_goals (user_id, week_start_date, goal_type, goal_target)
      VALUES (?, DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), ?, ?)
      ON DUPLICATE KEY UPDATE 
        goal_target = VALUES(goal_target)`,
      [userId, goalType, goalTarget]
    );
    return result;
  }
};

module.exports = badgesModel;

