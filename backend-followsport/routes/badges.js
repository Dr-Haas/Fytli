const express = require('express');
const router = express.Router();
const badgesController = require('../controllers/badgesController');
const auth = require('../middleware/auth');

/**
 * BADGES ROUTES
 * Toutes les routes nécessitent une authentification
 */

// =====================================================
// BADGES - Définitions
// =====================================================

/**
 * @route   GET /api/badges
 * @desc    Récupérer tous les badges disponibles
 * @access  Private
 */
router.get('/', auth, badgesController.getAllBadges);

/**
 * @route   GET /api/badges/category/:category
 * @desc    Récupérer les badges d'une catégorie
 * @access  Private
 * @params  category: routine | performance | sante | accomplissement
 */
router.get('/category/:category', auth, badgesController.getBadgesByCategory);

/**
 * @route   GET /api/badges/:badgeId
 * @desc    Récupérer un badge par son ID
 * @access  Private
 */
router.get('/:badgeId', auth, badgesController.getBadgeById);

// =====================================================
// USER BADGES - Badges d'un utilisateur
// =====================================================

/**
 * @route   GET /api/badges/user/:userId
 * @desc    Récupérer tous les badges d'un utilisateur avec progression
 * @access  Private
 */
router.get('/user/:userId', auth, badgesController.getUserBadgesWithProgress);

/**
 * @route   GET /api/badges/user/:userId/earned
 * @desc    Récupérer uniquement les badges débloqués
 * @access  Private
 */
router.get('/user/:userId/earned', auth, badgesController.getUserEarnedBadges);

/**
 * @route   GET /api/badges/user/:userId/overview
 * @desc    Vue d'ensemble des badges (stats globales)
 * @access  Private
 */
router.get('/user/:userId/overview', auth, badgesController.getUserBadgesOverview);

/**
 * @route   POST /api/badges/user/:userId/unlock
 * @desc    Débloquer manuellement un badge
 * @access  Private
 * @body    { badgeId: string }
 */
router.post('/user/:userId/unlock', auth, badgesController.unlockBadge);

/**
 * @route   POST /api/badges/user/:userId/check
 * @desc    Vérifier tous les badges d'un utilisateur
 * @access  Private
 */
router.post('/user/:userId/check', auth, badgesController.checkAllBadges);

// =====================================================
// USER STATS - Statistiques
// =====================================================

/**
 * @route   GET /api/badges/user/:userId/stats
 * @desc    Récupérer les statistiques d'un utilisateur
 * @access  Private
 */
router.get('/user/:userId/stats', auth, badgesController.getUserStats);

// =====================================================
// WORKOUT HISTORY - Historique
// =====================================================

/**
 * @route   POST /api/badges/user/:userId/workout
 * @desc    Enregistrer une séance d'entraînement
 * @access  Private
 * @body    { session_id, program_id, duration_minutes, exercises_completed, total_sets, workout_time }
 */
router.post('/user/:userId/workout', auth, badgesController.createWorkoutHistory);

/**
 * @route   GET /api/badges/user/:userId/history
 * @desc    Récupérer l'historique des séances
 * @access  Private
 * @query   limit: number (default: 10)
 */
router.get('/user/:userId/history', auth, badgesController.getUserWorkoutHistory);

// =====================================================
// WEEKLY GOALS - Objectifs hebdomadaires
// =====================================================

/**
 * @route   GET /api/badges/user/:userId/weekly-goal
 * @desc    Récupérer l'objectif de la semaine en cours
 * @access  Private
 */
router.get('/user/:userId/weekly-goal', auth, badgesController.getCurrentWeeklyGoal);

/**
 * @route   POST /api/badges/user/:userId/weekly-goal
 * @desc    Définir un objectif hebdomadaire
 * @access  Private
 * @body    { goalType: 'workouts' | 'duration' | 'exercises', goalTarget: number }
 */
router.post('/user/:userId/weekly-goal', auth, badgesController.setWeeklyGoal);

module.exports = router;

