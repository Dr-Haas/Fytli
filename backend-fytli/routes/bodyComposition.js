/**
 * Routes Body Composition
 * Gestion des mesures corporelles, objectifs et statistiques
 */

const express = require('express');
const router = express.Router();
const bodyCompositionController = require('../controllers/bodyCompositionController');
const { authenticateToken } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// =====================================================
// MEASUREMENTS - Mesures corporelles
// =====================================================

/**
 * @route   POST /api/body-composition/measurements
 * @desc    Créer une nouvelle mesure corporelle
 * @access  Private
 */
router.post('/measurements', bodyCompositionController.createMeasurement);

/**
 * @route   GET /api/body-composition/measurements
 * @desc    Récupérer toutes les mesures de l'utilisateur
 * @access  Private
 * @query   limit - Nombre de mesures à retourner (défaut: 50)
 */
router.get('/measurements', bodyCompositionController.getMeasurements);

/**
 * @route   GET /api/body-composition/measurements/latest
 * @desc    Récupérer la dernière mesure
 * @access  Private
 */
router.get('/measurements/latest', bodyCompositionController.getLatestMeasurement);

/**
 * @route   PUT /api/body-composition/measurements/:id
 * @desc    Mettre à jour une mesure
 * @access  Private
 */
router.put('/measurements/:id', bodyCompositionController.updateMeasurement);

/**
 * @route   DELETE /api/body-composition/measurements/:id
 * @desc    Supprimer une mesure
 * @access  Private
 */
router.delete('/measurements/:id', bodyCompositionController.deleteMeasurement);

// =====================================================
// STATISTICS - Statistiques
// =====================================================

/**
 * @route   GET /api/body-composition/stats
 * @desc    Récupérer les statistiques corporelles complètes
 * @access  Private
 */
router.get('/stats', bodyCompositionController.getStats);

/**
 * @route   GET /api/body-composition/trends/weight
 * @desc    Récupérer l'évolution du poids
 * @access  Private
 * @query   days - Nombre de jours à analyser (défaut: 90)
 */
router.get('/trends/weight', bodyCompositionController.getWeightTrend);

/**
 * @route   GET /api/body-composition/trends/composition
 * @desc    Récupérer l'évolution de la composition corporelle
 * @access  Private
 * @query   days - Nombre de jours à analyser (défaut: 90)
 */
router.get('/trends/composition', bodyCompositionController.getCompositionTrend);

// =====================================================
// GOALS - Objectifs
// =====================================================

/**
 * @route   POST /api/body-composition/goals
 * @desc    Créer un nouvel objectif
 * @access  Private
 */
router.post('/goals', bodyCompositionController.createGoal);

/**
 * @route   GET /api/body-composition/goals
 * @desc    Récupérer tous les objectifs
 * @access  Private
 */
router.get('/goals', bodyCompositionController.getGoals);

/**
 * @route   GET /api/body-composition/goals/active
 * @desc    Récupérer l'objectif actif
 * @access  Private
 */
router.get('/goals/active', bodyCompositionController.getActiveGoal);

/**
 * @route   PUT /api/body-composition/goals/:id/status
 * @desc    Mettre à jour le statut d'un objectif
 * @access  Private
 */
router.put('/goals/:id/status', bodyCompositionController.updateGoalStatus);

/**
 * @route   DELETE /api/body-composition/goals/:id
 * @desc    Supprimer un objectif
 * @access  Private
 */
router.delete('/goals/:id', bodyCompositionController.deleteGoal);

// =====================================================
// BADGES - Badges corporels
// =====================================================

/**
 * @route   GET /api/body-composition/badges
 * @desc    Récupérer les badges corporels débloqués
 * @access  Private
 */
router.get('/badges', bodyCompositionController.getBodyBadges);

module.exports = router;

