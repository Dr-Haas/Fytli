/**
 * Contrôleur pour gérer les sessions complétées
 */

const sessionCompletionsModel = require('../models/sessionCompletionsModel');
const badgesModel = require('../models/badgesModel');
const pushNotificationService = require('../services/pushNotificationService');
const db = require('../db');
const { logger } = require('../config/logger');

/**
 * Créer une nouvelle completion de session
 */
const create = async (req, res) => {
  try {
    const {
      program_id,
      session_id,
      duration_minutes,
      photo_url,
      notes,
      feeling
    } = req.body;
    
    const userId = req.user.userId;

    // Validation
    if (!program_id || !session_id) {
      return res.status(400).json({
        success: false,
        message: 'Les champs program_id et session_id sont obligatoires'
      });
    }

    const completion = await sessionCompletionsModel.create({
      user_id: userId,
      program_id,
      session_id,
      duration_minutes,
      photo_url,
      notes,
      feeling
    });
    
    // =====================================================
    // VÉRIFICATION AUTOMATIQUE DES BADGES
    // =====================================================
    try {
      // 1. Créer une entrée dans workout_history
      const now = new Date();
      const workoutTime = now.toTimeString().split(' ')[0]; // Format HH:MM:SS
      
      await badgesModel.createWorkoutHistory({
        user_id: userId,
        session_id,
        program_id,
        duration_minutes: duration_minutes || 30,
        exercises_completed: 0, // Peut être amélioré plus tard
        total_sets: 0,
        workout_time: workoutTime
      });
      
      // 2. Mettre à jour les statistiques utilisateur (streak, total workouts, etc.)
      await badgesModel.updateUserStats(userId);
      
      // 3. Vérifier tous les badges automatiquement
      await badgesModel.checkAllBadges(userId);
      
      logger.info(`Badges vérifiés pour l'utilisateur ${userId} après completion de session ${session_id}`);
    } catch (badgeError) {
      // Logger l'erreur mais ne pas faire échouer la requête
      logger.error('Erreur lors de la vérification des badges:', badgeError);
    }
    
    // Envoyer des notifications aux autres membres du programme
    try {
      // Récupérer les infos de l'utilisateur qui a complété
      const [users] = await db.query(
        'SELECT first_name, last_name FROM users WHERE user_id = ?',
        [userId]
      );
      
      if (users.length > 0) {
        const completedByUser = users[0];
        
        // Envoyer les notifications de manière asynchrone (ne pas bloquer la réponse)
        pushNotificationService.sendSessionCompletedByMember(
          program_id,
          completedByUser,
          userId
        ).catch(error => {
          logger.error('Erreur lors de l\'envoi des notifications de session complétée:', error);
        });
      }
    } catch (error) {
      // Logger l'erreur mais ne pas faire échouer la requête
      logger.error('Erreur lors de la préparation des notifications:', error);
    }
    
    res.status(201).json({
      success: true,
      message: 'Session enregistrée avec succès',
      data: completion
    });
  } catch (error) {
    logger.error('Erreur create completion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la session'
    });
  }
};

/**
 * Récupérer les completions d'un utilisateur
 */
const getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const completions = await sessionCompletionsModel.getByUser(parseInt(userId));
    
    res.json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    logger.error('Erreur getByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions'
    });
  }
};

/**
 * Récupérer les completions d'un programme
 */
const getByProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const completions = await sessionCompletionsModel.getByProgram(parseInt(programId));
    
    res.json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    logger.error('Erreur getByProgram:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions'
    });
  }
};

/**
 * Récupérer les completions d'une session
 */
const getBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const completions = await sessionCompletionsModel.getBySession(parseInt(sessionId));
    
    res.json({
      success: true,
      count: completions.length,
      data: completions
    });
  } catch (error) {
    logger.error('Erreur getBySession:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions'
    });
  }
};

/**
 * Récupérer une completion par ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const completion = await sessionCompletionsModel.getById(parseInt(id));
    
    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'Completion non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: completion
    });
  } catch (error) {
    logger.error('Erreur getById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la session'
    });
  }
};

/**
 * Supprimer une completion
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await sessionCompletionsModel.deleteById(parseInt(id));
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Completion non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Session supprimée avec succès'
    });
  } catch (error) {
    logger.error('Erreur deleteById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
};

/**
 * Récupérer les stats d'un utilisateur sur un programme
 */
const getUserProgramStats = async (req, res) => {
  try {
    const { userId, programId } = req.params;
    const stats = await sessionCompletionsModel.getUserProgramStats(
      parseInt(userId),
      parseInt(programId)
    );
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Erreur getUserProgramStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

/**
 * Récupérer le feed d'activité d'un programme
 */
const getProgramActivityFeed = async (req, res) => {
  try {
    const { programId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const activities = await sessionCompletionsModel.getProgramActivityFeed(
      parseInt(programId),
      limit
    );
    
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    logger.error('Erreur getProgramActivityFeed:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du feed'
    });
  }
};

module.exports = {
  create,
  getByUser,
  getByProgram,
  getBySession,
  getById,
  deleteById,
  getUserProgramStats,
  getProgramActivityFeed
};

