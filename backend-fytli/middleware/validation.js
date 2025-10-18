/**
 * Middleware de validation avec express-validator
 * Centralise toutes les règles de validation pour les différentes ressources
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Validations pour l'authentification
 */
const validateRegister = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
  body('first_name')
    .trim()
    .notEmpty().withMessage('Le prénom est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  body('last_name')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Le genre doit être: male, female ou other'),
  body('fitness_level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Le niveau doit être: beginner, intermediate ou advanced'),
  body('birthdate')
    .optional()
    .isISO8601().withMessage('Date invalide (format: YYYY-MM-DD)'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est obligatoire'),
  handleValidationErrors
];

/**
 * Validations pour les utilisateurs
 */
const validateUserId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID utilisateur invalide'),
  handleValidationErrors
];

/**
 * Validations pour les programmes
 */
const validateCreateProgram = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du programme est obligatoire')
    .isLength({ min: 3, max: 255 }).withMessage('Le nom doit contenir entre 3 et 255 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),
  body('difficulty_level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Le niveau doit être: beginner, intermediate ou advanced'),
  body('duration_weeks')
    .optional()
    .isInt({ min: 1, max: 52 }).withMessage('La durée doit être entre 1 et 52 semaines'),
  handleValidationErrors
];

const validateProgramId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID programme invalide'),
  handleValidationErrors
];

/**
 * Validations pour les sessions
 */
const validateCreateSession = [
  body('program_id')
    .isInt({ min: 1 }).withMessage('ID programme invalide'),
  body('session_number')
    .isInt({ min: 1 }).withMessage('Le numéro de session doit être un entier positif'),
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de la session est obligatoire')
    .isLength({ min: 3, max: 255 }).withMessage('Le nom doit contenir entre 3 et 255 caractères'),
  body('duration_minutes')
    .optional()
    .isInt({ min: 1, max: 300 }).withMessage('La durée doit être entre 1 et 300 minutes'),
  handleValidationErrors
];

/**
 * Validations pour les catégories
 */
const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de la catégorie est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La description ne peut pas dépasser 500 caractères'),
  handleValidationErrors
];

/**
 * Validations pour les exercices
 */
const validateCreateExercise = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom de l\'exercice est obligatoire')
    .isLength({ min: 3, max: 255 }).withMessage('Le nom doit contenir entre 3 et 255 caractères'),
  body('category_id')
    .isInt({ min: 1 }).withMessage('ID catégorie invalide'),
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced']).withMessage('La difficulté doit être: beginner, intermediate ou advanced'),
  body('video_url')
    .optional()
    .isURL().withMessage('URL de vidéo invalide'),
  body('image_url')
    .optional()
    .isURL().withMessage('URL d\'image invalide'),
  handleValidationErrors
];

/**
 * Validations pour la progression
 */
const validateCreateProgress = [
  body('user_id')
    .isInt({ min: 1 }).withMessage('ID utilisateur invalide'),
  body('session_id')
    .isInt({ min: 1 }).withMessage('ID session invalide'),
  body('date')
    .isISO8601().withMessage('Date invalide (format: YYYY-MM-DD)'),
  body('duration_minutes')
    .optional()
    .isInt({ min: 1, max: 300 }).withMessage('La durée doit être entre 1 et 300 minutes'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  handleValidationErrors
];

/**
 * Validations pour la pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Le numéro de page doit être un entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
  handleValidationErrors
];

/**
 * Validation ID générique
 */
const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID invalide'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUserId,
  validateCreateProgram,
  validateProgramId,
  validateCreateSession,
  validateCreateCategory,
  validateCreateExercise,
  validateCreateProgress,
  validatePagination,
  validateId
};

