const express = require('express');
const router = express.Router();
const pushNotificationsController = require('../controllers/pushNotificationsController');
const verifyToken = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(verifyToken);

/**
 * @route   GET /api/push/vapid-public-key
 * @desc    Récupérer la clé publique VAPID
 * @access  Private
 */
router.get('/vapid-public-key', pushNotificationsController.getVapidPublicKey);

/**
 * @route   POST /api/push/subscribe
 * @desc    S'abonner aux notifications push
 * @access  Private
 */
router.post('/subscribe', pushNotificationsController.subscribe);

/**
 * @route   POST /api/push/unsubscribe
 * @desc    Se désabonner des notifications push
 * @access  Private
 */
router.post('/unsubscribe', pushNotificationsController.unsubscribe);

/**
 * @route   GET /api/push/preferences
 * @desc    Récupérer les préférences de notification
 * @access  Private
 */
router.get('/preferences', pushNotificationsController.getPreferences);

/**
 * @route   PUT /api/push/preferences
 * @desc    Mettre à jour les préférences de notification
 * @access  Private
 */
router.put('/preferences', pushNotificationsController.updatePreferences);

/**
 * @route   POST /api/push/test
 * @desc    Envoyer une notification de test
 * @access  Private
 */
router.post('/test', pushNotificationsController.sendTestNotification);

/**
 * @route   GET /api/push/stats
 * @desc    Récupérer les statistiques des notifications
 * @access  Private
 */
router.get('/stats', pushNotificationsController.getStats);

/**
 * @route   GET /api/push/subscriptions
 * @desc    Récupérer les abonnements actifs
 * @access  Private
 */
router.get('/subscriptions', pushNotificationsController.getSubscriptions);

module.exports = router;

