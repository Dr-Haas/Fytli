/**
 * Contrôleur SessionExercises - Gestion de la logique métier pour les associations session-exercice
 */

const sessionExercisesModel = require('../models/sessionExercisesModel');

/**
 * Récupère toutes les associations session-exercice
 * GET /session-exercises
 * Query params: ?session_id=X pour filtrer par session
 */
const getAll = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    let sessionExercises;
    if (session_id) {
      sessionExercises = await sessionExercisesModel.findBySessionId(session_id);
    } else {
      sessionExercises = await sessionExercisesModel.findAll();
    }
    
    res.status(200).json({
      success: true,
      count: sessionExercises.length,
      data: sessionExercises
    });
  } catch (error) {
    console.error('Erreur getAll session-exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des associations session-exercice',
      error: error.message
    });
  }
};

/**
 * Récupère une association spécifique
 * GET /session-exercises/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const sessionExercise = await sessionExercisesModel.findById(id);
    
    if (!sessionExercise) {
      return res.status(404).json({
        success: false,
        message: `Association avec l'ID ${id} non trouvée`
      });
    }
    
    res.status(200).json({
      success: true,
      data: sessionExercise
    });
  } catch (error) {
    console.error('Erreur getById session-exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'association',
      error: error.message
    });
  }
};

/**
 * Crée une nouvelle association session-exercice
 * POST /session-exercises
 */
const create = async (req, res) => {
  try {
    const { session_id, exercise_id, order_index } = req.body;
    
    // Validation des champs obligatoires
    if (!session_id || !exercise_id || order_index === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Les champs session_id, exercise_id et order_index sont obligatoires'
      });
    }
    
    const newSessionExercise = await sessionExercisesModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Association session-exercice créée avec succès',
      data: newSessionExercise
    });
  } catch (error) {
    console.error('Erreur create session-exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'association',
      error: error.message
    });
  }
};

/**
 * Met à jour une association existante
 * PUT /session-exercises/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'association existe
    const existingSessionExercise = await sessionExercisesModel.findById(id);
    if (!existingSessionExercise) {
      return res.status(404).json({
        success: false,
        message: `Association avec l'ID ${id} non trouvée`
      });
    }
    
    const updated = await sessionExercisesModel.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedSessionExercise = await sessionExercisesModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Association mise à jour avec succès',
      data: updatedSessionExercise
    });
  } catch (error) {
    console.error('Erreur update session-exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'association',
      error: error.message
    });
  }
};

/**
 * Supprime une association
 * DELETE /session-exercises/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'association existe
    const existingSessionExercise = await sessionExercisesModel.findById(id);
    if (!existingSessionExercise) {
      return res.status(404).json({
        success: false,
        message: `Association avec l'ID ${id} non trouvée`
      });
    }
    
    const deleted = await sessionExercisesModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Association supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById session-exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'association',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
};

