/**
 * Contrôleur Users - Gestion de la logique métier pour les utilisateurs
 */

const usersModel = require('../models/usersModel');

/**
 * Récupère tous les utilisateurs
 * GET /users
 */
const getUsers = async (req, res) => {
  try {
    const users = await usersModel.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

/**
 * Récupère un utilisateur spécifique
 * GET /users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await usersModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
};

/**
 * Crée un nouvel utilisateur
 * POST /users
 */
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, birthdate, gender, fitness_level } = req.body;
    
    // Validation des champs obligatoires
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Les champs first_name, last_name, email et password sont obligatoires'
      });
    }
    
    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }
    
    // Vérification si l'email existe déjà
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    
    // Validation du genre (si fourni)
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Le genre doit être: male, female ou other'
      });
    }
    
    // Validation du niveau de fitness (si fourni)
    if (fitness_level && !['beginner', 'intermediate', 'advanced'].includes(fitness_level)) {
      return res.status(400).json({
        success: false,
        message: 'Le fitness_level doit être: beginner, intermediate ou advanced'
      });
    }
    
    const newUser = await usersModel.createUser(req.body);
    
    // Ne pas retourner le mot de passe dans la réponse
    delete newUser.password;
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: newUser
    });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

/**
 * Met à jour un utilisateur existant
 * PUT /users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur existe
    const existingUser = await usersModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`
      });
    }
    
    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (req.body.email && req.body.email !== existingUser.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
          success: false,
          message: 'Format d\'email invalide'
        });
      }
      
      const userWithEmail = await usersModel.getUserByEmail(req.body.email);
      if (userWithEmail) {
        return res.status(409).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }
    }
    
    // Validation du genre (si fourni)
    if (req.body.gender && !['male', 'female', 'other'].includes(req.body.gender)) {
      return res.status(400).json({
        success: false,
        message: 'Le genre doit être: male, female ou other'
      });
    }
    
    // Validation du niveau de fitness (si fourni)
    if (req.body.fitness_level && !['beginner', 'intermediate', 'advanced'].includes(req.body.fitness_level)) {
      return res.status(400).json({
        success: false,
        message: 'Le fitness_level doit être: beginner, intermediate ou advanced'
      });
    }
    
    const updated = await usersModel.updateUser(id, req.body);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }
    
    const updatedUser = await usersModel.getUserById(id);
    delete updatedUser.password;
    
    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser
    });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message
    });
  }
};

/**
 * Supprime un utilisateur
 * DELETE /users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur existe
    const existingUser = await usersModel.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} non trouvé`
      });
    }
    
    const deleted = await usersModel.deleteUser(id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

