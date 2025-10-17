/**
 * Contrôleur Sessions - Gestion de la logique métier pour les sessions
 */

const sessionsModel = require('../models/sessionsModel');

/**
 * Récupère toutes les sessions
 * GET /sessions
 * Query params: ?program_id=X pour filtrer par programme
 */
const getAll = async (req, res) => {
  try {
    const { program_id } = req.query;
    
    let sessions;
    if (program_id) {
      sessions = await sessionsModel.findByProgramId(program_id);
    } else {
      sessions = await sessionsModel.findAll();
    }
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Erreur getAll sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des sessions',
      error: error.message
    });
  }
};

/**
 * Récupère une session spécifique
 * GET /sessions/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await sessionsModel.findById(id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session avec l'ID ${id} non trouvée`
      });
    }
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Erreur getById sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la session',
      error: error.message
    });
  }
};

/**
 * Crée une nouvelle session
 * POST /sessions
 */
const create = async (req, res) => {
  try {
    const { program_id, session_number, name } = req.body;
    
    // Validation des champs obligatoires
    if (!program_id || !session_number || !name) {
      return res.status(400).json({
        success: false,
        message: 'Les champs program_id, session_number et name sont obligatoires'
      });
    }
    
    const newSession = await sessionsModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Session créée avec succès',
      data: newSession
    });
  } catch (error) {
    console.error('Erreur create sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session',
      error: error.message
    });
  }
};

/**
 * Met à jour une session existante
 * PUT /sessions/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la session existe
    const existingSession = await sessionsModel.findById(id);
    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: `Session avec l'ID ${id} non trouvée`
      });
    }
    
    const updated = await sessionsModel.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedSession = await sessionsModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Session mise à jour avec succès',
      data: updatedSession
    });
  } catch (error) {
    console.error('Erreur update sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la session',
      error: error.message
    });
  }
};

/**
 * Supprime une session
 * DELETE /sessions/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la session existe
    const existingSession = await sessionsModel.findById(id);
    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: `Session avec l'ID ${id} non trouvée`
      });
    }
    
    const deleted = await sessionsModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Session supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la session',
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

