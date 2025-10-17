/**
 * Contrôleur Programs - Gestion de la logique métier pour les programmes
 */

const programsModel = require('../models/programsModel');

/**
 * Récupère tous les programmes
 * GET /programs
 */
const getAll = async (req, res) => {
  try {
    const programs = await programsModel.findAll();
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    console.error('Erreur getAll programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des programmes',
      error: error.message
    });
  }
};

/**
 * Récupère un programme spécifique
 * GET /programs/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await programsModel.findById(id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: `Programme avec l'ID ${id} non trouvé`
      });
    }
    
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Erreur getById programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du programme',
      error: error.message
    });
  }
};

/**
 * Crée un nouveau programme
 * POST /programs
 */
const create = async (req, res) => {
  try {
    // Transformation: name (frontend) -> title (database)
    const { name, description, difficulty_level, duration_weeks, goal } = req.body;
    
    // Validation des champs obligatoires
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le champ name est obligatoire'
      });
    }
    
    // Validation du niveau de difficulté (si fourni)
    if (difficulty_level && !['beginner', 'intermediate', 'advanced'].includes(difficulty_level)) {
      return res.status(400).json({
        success: false,
        message: 'Le difficulty_level doit être: beginner, intermediate ou advanced'
      });
    }
    
    // Transformation pour la base de données
    const dbData = {
      title: name,  // name -> title
      description,
      level: difficulty_level,  // difficulty_level -> level
      duration_weeks,
      goal
    };
    
    const newProgram = await programsModel.create(dbData);
    
    res.status(201).json({
      success: true,
      message: 'Programme créé avec succès',
      data: newProgram
    });
  } catch (error) {
    console.error('Erreur create programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du programme',
      error: error.message
    });
  }
};

/**
 * Met à jour un programme existant
 * PUT /programs/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le programme existe
    const existingProgram = await programsModel.findById(id);
    if (!existingProgram) {
      return res.status(404).json({
        success: false,
        message: `Programme avec l'ID ${id} non trouvé`
      });
    }
    
    // Validation du niveau de difficulté (si fourni)
    if (req.body.difficulty_level && !['beginner', 'intermediate', 'advanced'].includes(req.body.difficulty_level)) {
      return res.status(400).json({
        success: false,
        message: 'Le difficulty_level doit être: beginner, intermediate ou advanced'
      });
    }
    
    // Transformation: name (frontend) -> title (database), difficulty_level -> level
    const dbData = { ...req.body };
    if (dbData.name !== undefined) {
      dbData.title = dbData.name;
      delete dbData.name;
    }
    if (dbData.difficulty_level !== undefined) {
      dbData.level = dbData.difficulty_level;
      delete dbData.difficulty_level;
    }
    
    const updated = await programsModel.update(id, dbData);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedProgram = await programsModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Programme mis à jour avec succès',
      data: updatedProgram
    });
  } catch (error) {
    console.error('Erreur update programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du programme',
      error: error.message
    });
  }
};

/**
 * Supprime un programme
 * DELETE /programs/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le programme existe
    const existingProgram = await programsModel.findById(id);
    if (!existingProgram) {
      return res.status(404).json({
        success: false,
        message: `Programme avec l'ID ${id} non trouvé`
      });
    }
    
    const deleted = await programsModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Programme supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById programs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du programme',
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

