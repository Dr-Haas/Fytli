/**
 * Contrôleur Progress - Gestion de la logique métier pour la progression
 */

const progressModel = require('../models/progressModel');

/**
 * Récupère tous les enregistrements de progression
 * GET /progress
 * Query params: ?user_id=X pour filtrer par utilisateur
 */
const getAll = async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let progress;
    if (user_id) {
      progress = await progressModel.findByUserId(user_id);
    } else {
      progress = await progressModel.findAll();
    }
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Erreur getAll progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des progressions',
      error: error.message
    });
  }
};

/**
 * Récupère une progression spécifique
 * GET /progress/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const progress = await progressModel.findById(id);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: `Progression avec l'ID ${id} non trouvée`
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Erreur getById progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la progression',
      error: error.message
    });
  }
};

/**
 * Crée un nouvel enregistrement de progression
 * POST /progress
 */
const create = async (req, res) => {
  try {
    const { user_id, session_id, date } = req.body;
    
    // Validation des champs obligatoires
    if (!user_id || !session_id || !date) {
      return res.status(400).json({
        success: false,
        message: 'Les champs user_id, session_id et date sont obligatoires'
      });
    }
    
    // Validation du rating (si fourni)
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Le rating doit être entre 1 et 5'
      });
    }
    
    const newProgress = await progressModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Progression créée avec succès',
      data: newProgress
    });
  } catch (error) {
    console.error('Erreur create progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la progression',
      error: error.message
    });
  }
};

/**
 * Met à jour une progression existante
 * PUT /progress/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la progression existe
    const existingProgress = await progressModel.findById(id);
    if (!existingProgress) {
      return res.status(404).json({
        success: false,
        message: `Progression avec l'ID ${id} non trouvée`
      });
    }
    
    // Validation du rating (si fourni)
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Le rating doit être entre 1 et 5'
      });
    }
    
    const updated = await progressModel.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedProgress = await progressModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Progression mise à jour avec succès',
      data: updatedProgress
    });
  } catch (error) {
    console.error('Erreur update progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la progression',
      error: error.message
    });
  }
};

/**
 * Supprime une progression
 * DELETE /progress/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la progression existe
    const existingProgress = await progressModel.findById(id);
    if (!existingProgress) {
      return res.status(404).json({
        success: false,
        message: `Progression avec l'ID ${id} non trouvée`
      });
    }
    
    const deleted = await progressModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Progression supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById progress:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la progression',
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

