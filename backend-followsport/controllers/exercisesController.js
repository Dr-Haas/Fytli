/**
 * Contrôleur Exercises - Gestion de la logique métier pour les exercices
 */

const exercisesModel = require('../models/exercisesModel');

/**
 * Récupère tous les exercices
 * GET /exercises
 * Query params: ?category_id=X pour filtrer par catégorie
 */
const getAll = async (req, res) => {
  try {
    const { category_id } = req.query;
    
    let exercises;
    if (category_id) {
      exercises = await exercisesModel.findByCategoryId(category_id);
    } else {
      exercises = await exercisesModel.findAll();
    }
    
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Erreur getAll exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des exercices',
      error: error.message
    });
  }
};

/**
 * Récupère un exercice spécifique
 * GET /exercises/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await exercisesModel.findById(id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: `Exercice avec l'ID ${id} non trouvé`
      });
    }
    
    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Erreur getById exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'exercice',
      error: error.message
    });
  }
};

/**
 * Crée un nouvel exercice
 * POST /exercises
 */
const create = async (req, res) => {
  try {
    const { name, category_id } = req.body;
    
    // Validation des champs obligatoires
    if (!name || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Les champs name et category_id sont obligatoires'
      });
    }
    
    // Validation du niveau de difficulté (si fourni)
    if (req.body.difficulty && !['beginner', 'intermediate', 'advanced'].includes(req.body.difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Le difficulty doit être: beginner, intermediate ou advanced'
      });
    }
    
    const newExercise = await exercisesModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Exercice créé avec succès',
      data: newExercise
    });
  } catch (error) {
    console.error('Erreur create exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'exercice',
      error: error.message
    });
  }
};

/**
 * Met à jour un exercice existant
 * PUT /exercises/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'exercice existe
    const existingExercise = await exercisesModel.findById(id);
    if (!existingExercise) {
      return res.status(404).json({
        success: false,
        message: `Exercice avec l'ID ${id} non trouvé`
      });
    }
    
    // Validation du niveau de difficulté (si fourni)
    if (req.body.difficulty && !['beginner', 'intermediate', 'advanced'].includes(req.body.difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Le difficulty doit être: beginner, intermediate ou advanced'
      });
    }
    
    const updated = await exercisesModel.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedExercise = await exercisesModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Exercice mis à jour avec succès',
      data: updatedExercise
    });
  } catch (error) {
    console.error('Erreur update exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'exercice',
      error: error.message
    });
  }
};

/**
 * Supprime un exercice
 * DELETE /exercises/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'exercice existe
    const existingExercise = await exercisesModel.findById(id);
    if (!existingExercise) {
      return res.status(404).json({
        success: false,
        message: `Exercice avec l'ID ${id} non trouvé`
      });
    }
    
    const deleted = await exercisesModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Exercice supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'exercice',
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

