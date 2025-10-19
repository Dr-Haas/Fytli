const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const verifyToken = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(verifyToken);

/**
 * @route   GET /api/schedule/daily
 * @desc    Récupérer l'agenda du jour de l'utilisateur
 * @access  Private
 */
router.get('/daily', scheduleController.getDailySchedule);

/**
 * @route   GET /api/schedule/weekly
 * @desc    Récupérer l'agenda hebdomadaire de l'utilisateur
 * @access  Private
 */
router.get('/weekly', scheduleController.getWeeklySchedule);

/**
 * @route   GET /api/schedule/next-session/:programId
 * @desc    Récupérer la prochaine session suggérée pour un programme
 * @access  Private
 */
router.get('/next-session/:programId', scheduleController.getNextSession);

/**
 * @route   GET /api/schedule/weekly-stats
 * @desc    Récupérer les statistiques de la semaine
 * @access  Private
 */
router.get('/weekly-stats', scheduleController.getWeeklyStats);

module.exports = router;

