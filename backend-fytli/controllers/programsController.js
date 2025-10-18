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
    const { title, description, difficulty_level, duration_weeks } = req.body;
    
    // Validation des champs obligatoires
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Le champ title est obligatoire'
      });
    }
    
    // Mapping des niveaux de difficulté français -> anglais
    const levelMapping = {
      'débutant': 'beginner',
      'intermédiaire': 'intermediate',
      'avancé': 'advanced',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    
    // Validation et transformation du niveau de difficulté
    let level = difficulty_level;
    if (difficulty_level) {
      level = levelMapping[difficulty_level.toLowerCase()];
      if (!level) {
        return res.status(400).json({
          success: false,
          message: 'Le difficulty_level doit être: débutant, intermédiaire, avancé (ou beginner, intermediate, advanced)'
        });
      }
    }
    
    // Transformation pour la base de données - extraire les champs du body
    const { sessions_per_week, category_id, is_public } = req.body;
    
    const dbData = {
      title,
      description,
      level,
      duration_weeks,
      sessions_per_week,
      category_id,
      is_public
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
    
    // Mapping des niveaux de difficulté français -> anglais
    const levelMapping = {
      'débutant': 'beginner',
      'intermédiaire': 'intermediate',
      'avancé': 'advanced',
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    
    // Validation et transformation du niveau de difficulté (si fourni)
    if (req.body.difficulty_level) {
      const level = levelMapping[req.body.difficulty_level.toLowerCase()];
      if (!level) {
        return res.status(400).json({
          success: false,
          message: 'Le difficulty_level doit être: débutant, intermédiaire, avancé (ou beginner, intermediate, advanced)'
        });
      }
    }
    
    // Transformation pour la base de données
    const dbData = { ...req.body };
    
    // Transformer difficulty_level en level avec mapping français -> anglais
    if (dbData.difficulty_level !== undefined) {
      dbData.level = levelMapping[dbData.difficulty_level.toLowerCase()];
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

