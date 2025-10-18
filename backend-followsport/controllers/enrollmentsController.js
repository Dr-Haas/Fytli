/**
 * Contrôleur pour gérer les inscriptions aux programmes
 */

const enrollmentsModel = require('../models/enrollmentsModel');
const { logger } = require('../config/logger');

/**
 * Inscrire un utilisateur à un programme
 */
const enroll = async (req, res) => {
  try {
    const { program_id } = req.body;
    const userId = req.user.userId;

    if (!program_id) {
      return res.status(400).json({
        success: false,
        message: 'Le champ program_id est obligatoire'
      });
    }

    // Vérifier si déjà inscrit
    const alreadyEnrolled = await enrollmentsModel.isEnrolled(userId, program_id);
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à ce programme'
      });
    }

    const enrollment = await enrollmentsModel.enroll(userId, program_id);
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: enrollment
    });
  } catch (error) {
    logger.error('Erreur enroll:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

/**
 * Désinscrire un utilisateur d'un programme
 */
const unenroll = async (req, res) => {
  try {
    const { programId } = req.params;
    const userId = req.user.userId;

    const success = await enrollmentsModel.unenroll(userId, parseInt(programId));
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Désinscription réussie'
    });
  } catch (error) {
    logger.error('Erreur unenroll:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désinscription'
    });
  }
};

/**
 * Mettre à jour le statut d'une inscription
 */
const updateStatus = async (req, res) => {
  try {
    const { programId } = req.params;
    const { status } = req.body;
    const userId = req.user.userId;

    if (!['active', 'paused', 'completed', 'abandoned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const success = await enrollmentsModel.updateStatus(userId, parseInt(programId), status);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour'
    });
  } catch (error) {
    logger.error('Erreur updateStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

/**
 * Récupérer les utilisateurs inscrits à un programme
 */
const getUsersByProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const users = await enrollmentsModel.getUsersByProgram(parseInt(programId));
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    logger.error('Erreur getUsersByProgram:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

/**
 * Récupérer les programmes d'un utilisateur
 */
const getProgramsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const programs = await enrollmentsModel.getProgramsByUser(parseInt(userId));
    
    res.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    logger.error('Erreur getProgramsByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des programmes'
    });
  }
};

/**
 * Vérifier si un utilisateur est inscrit à un programme
 */
const checkEnrollment = async (req, res) => {
  try {
    const { programId } = req.params;
    const userId = req.user.userId;
    
    const enrolled = await enrollmentsModel.isEnrolled(userId, parseInt(programId));
    
    res.json({
      success: true,
      data: { enrolled }
    });
  } catch (error) {
    logger.error('Erreur checkEnrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
};

/**
 * Récupérer les statistiques d'un programme
 */
const getProgramStats = async (req, res) => {
  try {
    const { programId } = req.params;
    const stats = await enrollmentsModel.getProgramStats(parseInt(programId));
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Erreur getProgramStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  enroll,
  unenroll,
  updateStatus,
  getUsersByProgram,
  getProgramsByUser,
  checkEnrollment,
  getProgramStats
};

