/**
 * Contrôleur pour gérer les sessions complétées
 */

const sessionCompletionsModel = require('../models/sessionCompletionsModel');
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

