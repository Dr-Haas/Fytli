/**
 * Contrôleur Categories - Gestion de la logique métier pour les catégories
 */

const categoriesModel = require('../models/categoriesModel');

/**
 * Récupère toutes les catégories
 * GET /categories
 */
const getAll = async (req, res) => {
  try {
    const categories = await categoriesModel.findAll();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Erreur getAll categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

/**
 * Récupère une catégorie spécifique
 * GET /categories/:id
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoriesModel.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Catégorie avec l'ID ${id} non trouvée`
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erreur getById categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message
    });
  }
};

/**
 * Crée une nouvelle catégorie
 * POST /categories
 */
const create = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validation des champs obligatoires
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le champ name est obligatoire'
      });
    }
    
    // Vérifier si le nom existe déjà
    const existingCategory = await categoriesModel.findByName(name);
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      });
    }
    
    const newCategory = await categoriesModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: newCategory
    });
  } catch (error) {
    console.error('Erreur create categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error.message
    });
  }
};

/**
 * Met à jour une catégorie existante
 * PUT /categories/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la catégorie existe
    const existingCategory = await categoriesModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: `Catégorie avec l'ID ${id} non trouvée`
      });
    }
    
    // Si le nom est modifié, vérifier qu'il n'existe pas déjà
    if (req.body.name && req.body.name !== existingCategory.name) {
      const categoryWithName = await categoriesModel.findByName(req.body.name);
      if (categoryWithName) {
        return res.status(409).json({
          success: false,
          message: 'Une catégorie avec ce nom existe déjà'
        });
      }
    }
    
    const updated = await categoriesModel.update(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedCategory = await categoriesModel.findById(id);
    
    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Erreur update categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error.message
    });
  }
};

/**
 * Supprime une catégorie
 * DELETE /categories/:id
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la catégorie existe
    const existingCategory = await categoriesModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: `Catégorie avec l'ID ${id} non trouvée`
      });
    }
    
    const deleted = await categoriesModel.deleteById(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteById categories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie',
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

