/**
 * Contrôleur Auth - Gestion de l'authentification (register, login)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/usersModel');

/**
 * Inscription d'un nouvel utilisateur
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    // Validation des champs obligatoires
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Les champs email, password, first_name et last_name sont obligatoires'
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
    
    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await usersModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur avec le mot de passe hashé (seulement les 4 champs essentiels)
    const newUser = await usersModel.createUser({
      email,
      password: hashedPassword,
      first_name,
      last_name
    });
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Ne pas retourner le mot de passe dans la réponse
    delete newUser.password_hash;
    
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: error.message
    });
  }
};

/**
 * Connexion d'un utilisateur
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Les champs email et password sont obligatoires'
      });
    }
    
    // Récupérer l'utilisateur par email
    const user = await usersModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Ne pas retourner le mot de passe dans la réponse
    delete user.password_hash;
    
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

/**
 * Récupère le profil de l'utilisateur connecté
 * GET /auth/me
 */
const getProfile = async (req, res) => {
  try {
    // req.user est ajouté par le middleware auth
    const user = await usersModel.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Ne pas retourner le mot de passe
    delete user.password_hash;
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

