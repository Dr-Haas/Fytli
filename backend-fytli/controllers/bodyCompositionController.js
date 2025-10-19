/**
 * Contrôleur Body Composition
 * Gestion des mesures corporelles, objectifs et statistiques
 */

const bodyCompositionModel = require('../models/bodyCompositionModel');
const logger = require('../config/logger');

const bodyCompositionController = {
  // =====================================================
  // MEASUREMENTS - Mesures corporelles
  // =====================================================

  /**
   * Créer une nouvelle mesure corporelle
   * POST /api/body-composition/measurements
   */
  async createMeasurement(req, res) {
    try {
      const userId = req.user.id;
      const {
        weight_kg,
        height_cm,
        body_fat_percent,
        lean_mass_percent,
        muscle_mass_kg,
        waist_cm,
        chest_cm,
        hips_cm,
        arms_cm,
        thighs_cm,
        notes,
        measurement_date
      } = req.body;

      // Validation
      if (!weight_kg || !height_cm) {
        return res.status(400).json({
          success: false,
          message: 'Le poids et la taille sont requis'
        });
      }

      if (weight_kg < 20 || weight_kg > 300) {
        return res.status(400).json({
          success: false,
          message: 'Le poids doit être entre 20 et 300 kg'
        });
      }

      if (height_cm < 100 || height_cm > 250) {
        return res.status(400).json({
          success: false,
          message: 'La taille doit être entre 100 et 250 cm'
        });
      }

      // Calculer automatiquement lean_mass_percent si body_fat_percent est fourni
      let finalLeanMassPercent = lean_mass_percent;
      if (body_fat_percent && !lean_mass_percent) {
        finalLeanMassPercent = 100 - body_fat_percent;
      }

      const measurement = await bodyCompositionModel.createMeasurement({
        user_id: userId,
        weight_kg,
        height_cm,
        body_fat_percent,
        lean_mass_percent: finalLeanMassPercent,
        muscle_mass_kg,
        waist_cm,
        chest_cm,
        hips_cm,
        arms_cm,
        thighs_cm,
        notes,
        measurement_date
      });

      // Vérifier les badges automatiquement
      await bodyCompositionModel.checkBodyBadges(userId);

      logger.info(`📊 Nouvelle mesure créée pour l'utilisateur ${userId}`);

      res.status(201).json({
        success: true,
        message: 'Mesure enregistrée avec succès',
        data: measurement
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la mesure:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement de la mesure',
        error: error.message
      });
    }
  },

  /**
   * Récupérer toutes les mesures d'un utilisateur
   * GET /api/body-composition/measurements
   */
  async getMeasurements(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;

      const measurements = await bodyCompositionModel.getUserMeasurements(userId, limit);

      res.json({
        success: true,
        data: measurements,
        count: measurements.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des mesures:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des mesures',
        error: error.message
      });
    }
  },

  /**
   * Récupérer la dernière mesure
   * GET /api/body-composition/measurements/latest
   */
  async getLatestMeasurement(req, res) {
    try {
      const userId = req.user.id;
      const measurement = await bodyCompositionModel.getLatestMeasurement(userId);

      if (!measurement) {
        return res.status(404).json({
          success: false,
          message: 'Aucune mesure trouvée'
        });
      }

      res.json({
        success: true,
        data: measurement
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la dernière mesure:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la mesure',
        error: error.message
      });
    }
  },

  /**
   * Mettre à jour une mesure
   * PUT /api/body-composition/measurements/:id
   */
  async updateMeasurement(req, res) {
    try {
      const userId = req.user.id;
      const measurementId = req.params.id;
      const updateData = req.body;

      // Vérifier que la mesure appartient à l'utilisateur
      const measurement = await bodyCompositionModel.getMeasurementById(measurementId);
      if (!measurement || measurement.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Mesure non trouvée'
        });
      }

      const updated = await bodyCompositionModel.updateMeasurement(measurementId, updateData);

      if (updated) {
        // Re-vérifier les badges
        await bodyCompositionModel.checkBodyBadges(userId);

        res.json({
          success: true,
          message: 'Mesure mise à jour avec succès'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Aucune modification effectuée'
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la mesure:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour',
        error: error.message
      });
    }
  },

  /**
   * Supprimer une mesure
   * DELETE /api/body-composition/measurements/:id
   */
  async deleteMeasurement(req, res) {
    try {
      const userId = req.user.id;
      const measurementId = req.params.id;

      // Vérifier que la mesure appartient à l'utilisateur
      const measurement = await bodyCompositionModel.getMeasurementById(measurementId);
      if (!measurement || measurement.user_id !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Mesure non trouvée'
        });
      }

      const deleted = await bodyCompositionModel.deleteMeasurement(measurementId);

      if (deleted) {
        res.json({
          success: true,
          message: 'Mesure supprimée avec succès'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Erreur lors de la suppression'
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la suppression de la mesure:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression',
        error: error.message
      });
    }
  },

  // =====================================================
  // STATISTICS - Statistiques
  // =====================================================

  /**
   * Récupérer les statistiques corporelles complètes
   * GET /api/body-composition/stats
   */
  async getStats(req, res) {
    try {
      const userId = req.user.id;

      const [
        bodyStats,
        progressStats30Days,
        progressStats90Days,
        latestMeasurement
      ] = await Promise.all([
        bodyCompositionModel.getUserBodyStats(userId),
        bodyCompositionModel.getProgressStats(userId, 30),
        bodyCompositionModel.getProgressStats(userId, 90),
        bodyCompositionModel.getLatestMeasurement(userId)
      ]);

      res.json({
        success: true,
        data: {
          overview: bodyStats || {},
          last30Days: progressStats30Days || {},
          last90Days: progressStats90Days || {},
          latest: latestMeasurement || null
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  },

  /**
   * Récupérer l'évolution du poids (pour graphiques)
   * GET /api/body-composition/trends/weight
   */
  async getWeightTrend(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 90;

      const trend = await bodyCompositionModel.getWeightTrend(userId, days);

      res.json({
        success: true,
        data: trend,
        count: trend.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'évolution du poids:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données',
        error: error.message
      });
    }
  },

  /**
   * Récupérer l'évolution de la composition corporelle
   * GET /api/body-composition/trends/composition
   */
  async getCompositionTrend(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 90;

      const trend = await bodyCompositionModel.getCompositionTrend(userId, days);

      res.json({
        success: true,
        data: trend,
        count: trend.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'évolution de la composition:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données',
        error: error.message
      });
    }
  },

  // =====================================================
  // GOALS - Objectifs
  // =====================================================

  /**
   * Créer un nouvel objectif
   * POST /api/body-composition/goals
   */
  async createGoal(req, res) {
    try {
      logger.info('🎯 [createGoal] Début création objectif');
      const userId = req.user.id;
      logger.info(`🎯 [createGoal] User ID: ${userId}`);
      
      const {
        goal_type,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        start_date,
        target_date,
        description
      } = req.body;

      logger.info(`🎯 [createGoal] Body reçu:`, { goal_type, target_weight_kg, start_date, target_date });

      // Validation
      if (!goal_type || !start_date || !target_date) {
        logger.warn('⚠️ [createGoal] Validation échouée: champs manquants');
        return res.status(400).json({
          success: false,
          message: 'Type d\'objectif, date de début et date cible sont requis'
        });
      }

      const validGoalTypes = ['weight_loss', 'weight_gain', 'muscle_gain', 'fat_loss', 'body_recomposition', 'maintenance'];
      if (!validGoalTypes.includes(goal_type)) {
        return res.status(400).json({
          success: false,
          message: 'Type d\'objectif invalide'
        });
      }

      logger.info('🎯 [createGoal] Appel au model createGoal...');
      const goal = await bodyCompositionModel.createGoal({
        user_id: userId,
        goal_type,
        target_weight_kg,
        target_body_fat_percent,
        target_muscle_mass_kg,
        start_date,
        target_date,
        description
      });

      logger.info(`✅ [createGoal] Nouvel objectif créé pour l'utilisateur ${userId}: ${goal_type}`);

      res.status(201).json({
        success: true,
        message: 'Objectif créé avec succès',
        data: goal
      });
    } catch (error) {
      logger.error('❌ [createGoal] Erreur lors de la création de l\'objectif:', error);
      logger.error('❌ [createGoal] Stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'objectif',
        error: error.message
      });
    }
  },

  /**
   * Récupérer tous les objectifs
   * GET /api/body-composition/goals
   */
  async getGoals(req, res) {
    try {
      const userId = req.user.id;
      const goals = await bodyCompositionModel.getUserGoals(userId);

      res.json({
        success: true,
        data: goals,
        count: goals.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des objectifs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des objectifs',
        error: error.message
      });
    }
  },

  /**
   * Récupérer l'objectif actif
   * GET /api/body-composition/goals/active
   */
  async getActiveGoal(req, res) {
    try {
      const userId = req.user.id;
      const goal = await bodyCompositionModel.getActiveGoal(userId);

      if (!goal) {
        return res.json({
          success: true,
          data: null,
          message: 'Aucun objectif actif'
        });
      }

      // Récupérer la progression
      const progress = await bodyCompositionModel.getGoalProgress(goal.id);

      res.json({
        success: true,
        data: {
          ...goal,
          progress
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'objectif actif:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'objectif',
        error: error.message
      });
    }
  },

  /**
   * Mettre à jour le statut d'un objectif
   * PUT /api/body-composition/goals/:id/status
   */
  async updateGoalStatus(req, res) {
    try {
      const goalId = req.params.id;
      const { status } = req.body;

      const validStatuses = ['active', 'completed', 'abandoned', 'paused'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide'
        });
      }

      const completedDate = status === 'completed' ? new Date() : null;
      const updated = await bodyCompositionModel.updateGoalStatus(goalId, status, completedDate);

      if (updated) {
        res.json({
          success: true,
          message: 'Statut mis à jour avec succès'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Erreur lors de la mise à jour'
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour',
        error: error.message
      });
    }
  },

  /**
   * Supprimer un objectif
   * DELETE /api/body-composition/goals/:id
   */
  async deleteGoal(req, res) {
    try {
      const goalId = req.params.id;
      const deleted = await bodyCompositionModel.deleteGoal(goalId);

      if (deleted) {
        res.json({
          success: true,
          message: 'Objectif supprimé avec succès'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Objectif non trouvé'
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'objectif:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression',
        error: error.message
      });
    }
  },

  // =====================================================
  // BADGES - Badges corporels
  // =====================================================

  /**
   * Récupérer les badges corporels débloqués
   * GET /api/body-composition/badges
   */
  async getBodyBadges(req, res) {
    try {
      const userId = req.user.id;
      const badges = await bodyCompositionModel.getBodyBadgesEarned(userId);

      res.json({
        success: true,
        data: badges,
        count: badges.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des badges:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des badges',
        error: error.message
      });
    }
  }
};

module.exports = bodyCompositionController;

