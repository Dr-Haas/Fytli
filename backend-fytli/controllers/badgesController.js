const badgesModel = require('../models/badgesModel');

/**
 * BADGES CONTROLLER
 * Gestion des requêtes HTTP pour les badges
 */

const badgesController = {
  // =====================================================
  // BADGES - Définitions
  // =====================================================

  /**
   * GET /api/badges
   * Récupérer tous les badges disponibles
   */
  async getAllBadges(req, res) {
    try {
      const badges = await badgesModel.getAllBadges();
      
      res.json({
        success: true,
        count: badges.length,
        data: badges
      });
    } catch (error) {
      console.error('Erreur getAllBadges:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges',
        error: error.message
      });
    }
  },

  /**
   * GET /api/badges/:badgeId
   * Récupérer un badge par son ID
   */
  async getBadgeById(req, res) {
    try {
      const { badgeId } = req.params;
      const badge = await badgesModel.getBadgeById(badgeId);

      if (!badge) {
        return res.status(404).json({
          success: false,
          message: 'Badge non trouvé'
        });
      }

      res.json({
        success: true,
        data: badge
      });
    } catch (error) {
      console.error('Erreur getBadgeById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du badge',
        error: error.message
      });
    }
  },

  /**
   * GET /api/badges/category/:category
   * Récupérer les badges d'une catégorie
   */
  async getBadgesByCategory(req, res) {
    try {
      const { category } = req.params;
      
      // Valider la catégorie
      const validCategories = ['routine', 'performance', 'sante', 'accomplissement'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie invalide. Catégories valides: routine, performance, sante, accomplissement'
        });
      }

      const badges = await badgesModel.getBadgesByCategory(category);
      
      res.json({
        success: true,
        count: badges.length,
        data: badges
      });
    } catch (error) {
      console.error('Erreur getBadgesByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges',
        error: error.message
      });
    }
  },

  // =====================================================
  // USER BADGES - Badges d'un utilisateur
  // =====================================================

  /**
   * GET /api/badges/user/:userId
   * Récupérer tous les badges d'un utilisateur avec progression
   */
  async getUserBadgesWithProgress(req, res) {
    try {
      const { userId } = req.params;
      
      const badges = await badgesModel.getUserBadgesWithProgress(userId);
      const overview = await badgesModel.getUserBadgesOverview(userId);
      
      res.json({
        success: true,
        overview: overview,
        data: badges
      });
    } catch (error) {
      console.error('Erreur getUserBadgesWithProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges utilisateur',
        error: error.message
      });
    }
  },

  /**
   * GET /api/badges/user/:userId/earned
   * Récupérer uniquement les badges débloqués d'un utilisateur
   */
  async getUserEarnedBadges(req, res) {
    try {
      const { userId } = req.params;
      
      const badges = await badgesModel.getUserEarnedBadges(userId);
      
      res.json({
        success: true,
        count: badges.length,
        data: badges
      });
    } catch (error) {
      console.error('Erreur getUserEarnedBadges:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges débloqués',
        error: error.message
      });
    }
  },

  /**
   * GET /api/badges/user/:userId/overview
   * Vue d'ensemble des badges d'un utilisateur
   */
  async getUserBadgesOverview(req, res) {
    try {
      const { userId } = req.params;
      
      const overview = await badgesModel.getUserBadgesOverview(userId);
      
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Erreur getUserBadgesOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'aperçu',
        error: error.message
      });
    }
  },

  /**
   * POST /api/badges/user/:userId/unlock
   * Débloquer manuellement un badge pour un utilisateur
   * Body: { badgeId: 'constance' }
   */
  async unlockBadge(req, res) {
    try {
      const { userId } = req.params;
      const { badgeId } = req.body;

      if (!badgeId) {
        return res.status(400).json({
          success: false,
          message: 'Le badgeId est requis'
        });
      }

      // Vérifier que le badge existe
      const badge = await badgesModel.getBadgeById(badgeId);
      if (!badge) {
        return res.status(404).json({
          success: false,
          message: 'Badge non trouvé'
        });
      }

      // Vérifier si déjà débloqué
      const alreadyEarned = await badgesModel.hasUserEarnedBadge(userId, badgeId);
      if (alreadyEarned) {
        return res.status(400).json({
          success: false,
          message: 'Badge déjà débloqué'
        });
      }

      // Débloquer le badge
      await badgesModel.unlockBadge(userId, badgeId);
      
      res.json({
        success: true,
        message: `Badge "${badge.name}" débloqué ! 🎉`,
        data: {
          badgeId: badge.badge_id,
          name: badge.name,
          points: badge.points
        }
      });
    } catch (error) {
      console.error('Erreur unlockBadge:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du déblocage du badge',
        error: error.message
      });
    }
  },

  // =====================================================
  // BADGE CHECKING - Vérification automatique
  // =====================================================

  /**
   * POST /api/badges/user/:userId/check
   * Vérifier tous les badges d'un utilisateur
   */
  async checkAllBadges(req, res) {
    try {
      const { userId } = req.params;
      
      await badgesModel.checkAllBadges(userId);
      
      // Récupérer les badges nouvellement débloqués
      const badges = await badgesModel.getUserBadgesWithProgress(userId);
      const overview = await badgesModel.getUserBadgesOverview(userId);
      
      res.json({
        success: true,
        message: 'Vérification des badges effectuée',
        overview: overview,
        data: badges
      });
    } catch (error) {
      console.error('Erreur checkAllBadges:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des badges',
        error: error.message
      });
    }
  },

  // =====================================================
  // USER STATS - Statistiques
  // =====================================================

  /**
   * GET /api/badges/user/:userId/stats
   * Récupérer les statistiques d'un utilisateur
   */
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;
      
      let stats = await badgesModel.getUserStats(userId);
      
      // Si pas de stats, créer
      if (!stats) {
        await badgesModel.createUserStats(userId);
        stats = await badgesModel.getUserStats(userId);
      }
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erreur getUserStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  },

  // =====================================================
  // WORKOUT HISTORY - Historique
  // =====================================================

  /**
   * POST /api/badges/user/:userId/workout
   * Enregistrer une séance d'entraînement
   * Body: { session_id, program_id, duration_minutes, exercises_completed, total_sets, workout_time }
   */
  async createWorkoutHistory(req, res) {
    try {
      const { userId } = req.params;
      const {
        session_id,
        program_id,
        duration_minutes,
        exercises_completed,
        total_sets,
        workout_time
      } = req.body;

      // Validation
      if (!session_id || !duration_minutes) {
        return res.status(400).json({
          success: false,
          message: 'session_id et duration_minutes sont requis'
        });
      }

      // Créer l'entrée workout_history
      await badgesModel.createWorkoutHistory({
        user_id: userId,
        session_id,
        program_id,
        duration_minutes,
        exercises_completed: exercises_completed || 0,
        total_sets: total_sets || 0,
        workout_time: workout_time || new Date().toTimeString().split(' ')[0]
      });

      // Vérifier automatiquement les badges
      await badgesModel.checkAllBadges(userId);

      // Récupérer les badges mis à jour
      const badges = await badgesModel.getUserBadgesWithProgress(userId);
      
      res.json({
        success: true,
        message: 'Séance enregistrée ! 💪',
        data: badges
      });
    } catch (error) {
      console.error('Erreur createWorkoutHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement de la séance',
        error: error.message
      });
    }
  },

  /**
   * GET /api/badges/user/:userId/history
   * Récupérer l'historique des séances
   */
  async getUserWorkoutHistory(req, res) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      
      const history = await badgesModel.getUserWorkoutHistory(userId, limit);
      
      res.json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error) {
      console.error('Erreur getUserWorkoutHistory:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  },

  // =====================================================
  // WEEKLY GOALS - Objectifs hebdomadaires
  // =====================================================

  /**
   * GET /api/badges/user/:userId/weekly-goal
   * Récupérer l'objectif de la semaine en cours
   */
  async getCurrentWeeklyGoal(req, res) {
    try {
      const { userId } = req.params;
      
      const goal = await badgesModel.getCurrentWeeklyGoal(userId);
      
      res.json({
        success: true,
        data: goal
      });
    } catch (error) {
      console.error('Erreur getCurrentWeeklyGoal:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'objectif',
        error: error.message
      });
    }
  },

  /**
   * POST /api/badges/user/:userId/weekly-goal
   * Définir un objectif hebdomadaire
   * Body: { 
   *   goal_type: 'workouts', 
   *   goal_target: 3,
   *   description: 'Description personnalisée',
   *   target_programs: [1, 2],
   *   target_sessions: [5, 6]
   * }
   */
  async setWeeklyGoal(req, res) {
    try {
      const { userId } = req.params;
      const { 
        goal_type,
        goalType, // Support ancien format
        goal_target, 
        goalTarget, // Support ancien format
        description,
        target_programs,
        target_sessions
      } = req.body;

      // Support des deux formats (snake_case et camelCase)
      const type = goal_type || goalType;
      const target = goal_target || goalTarget;

      // Validation
      const validGoalTypes = ['workouts', 'duration', 'exercises', 'streak', 'programs', 'sessions'];
      if (!validGoalTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'goal_type invalide. Types valides: workouts, duration, exercises, streak, programs, sessions'
        });
      }

      if (!target || target < 1) {
        return res.status(400).json({
          success: false,
          message: 'goal_target doit être un nombre positif'
        });
      }

      // Validation spécifique pour les programmes
      if (type === 'programs' && (!target_programs || target_programs.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'target_programs requis pour le type "programs"'
        });
      }

      // Créer l'objectif avec tous les champs
      await badgesModel.setWeeklyGoal(userId, {
        goal_type: type,
        goal_target: target,
        description,
        target_programs: target_programs ? JSON.stringify(target_programs) : null,
        target_sessions: target_sessions ? JSON.stringify(target_sessions) : null
      });
      
      res.json({
        success: true,
        message: 'Objectif hebdomadaire défini ! 🎯'
      });
    } catch (error) {
      console.error('Erreur setWeeklyGoal:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la définition de l\'objectif',
        error: error.message
      });
    }
  }
};

module.exports = badgesController;

