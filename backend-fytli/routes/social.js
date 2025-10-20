const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authenticateToken = require('../middleware/auth');

// ============ ROUTES DES CONNEXIONS ============

/**
 * @route POST /api/social/connections/add
 * @desc Envoyer une demande d'ami
 * @access Private
 */
router.post('/connections/add', authenticateToken, socialController.addFriend);

/**
 * @route POST /api/social/connections/accept
 * @desc Accepter une demande d'ami
 * @access Private
 */
router.post('/connections/accept', authenticateToken, socialController.acceptFriend);

/**
 * @route DELETE /api/social/connections/:friendId
 * @desc Supprimer une connexion
 * @access Private
 */
router.delete('/connections/:friendId', authenticateToken, socialController.removeFriend);

/**
 * @route GET /api/social/connections
 * @desc Récupérer la liste des amis de l'utilisateur connecté
 * @access Private
 */
router.get('/connections', authenticateToken, socialController.getFriends);

/**
 * @route GET /api/social/connections/:userId
 * @desc Récupérer la liste des amis d'un utilisateur spécifique
 * @access Private
 */
router.get('/connections/:userId', authenticateToken, socialController.getFriends);

/**
 * @route GET /api/social/search
 * @desc Rechercher des utilisateurs
 * @access Private
 */
router.get('/search', authenticateToken, socialController.searchUsers);

// ============ ROUTES DU FEED ============

/**
 * @route GET /api/social/feed
 * @desc Récupérer le feed social de l'utilisateur connecté
 * @access Private
 */
router.get('/feed', authenticateToken, socialController.getFeed);

/**
 * @route GET /api/social/feed/:userId
 * @desc Récupérer le feed social d'un utilisateur spécifique
 * @access Private
 */
router.get('/feed/:userId', authenticateToken, socialController.getFeed);

/**
 * @route POST /api/social/feed/unlock
 * @desc Déverrouiller le feed après une session
 * @access Private
 */
router.post('/feed/unlock', authenticateToken, socialController.unlockFeed);

/**
 * @route GET /api/social/feed/status
 * @desc Vérifier le statut du feed
 * @access Private
 */
router.get('/feed/status', authenticateToken, socialController.checkFeedStatus);

/**
 * @route GET /api/social/circle
 * @desc Récupérer les stats du cercle Fytli
 * @access Private
 */
router.get('/circle', authenticateToken, socialController.getCircleStats);

// ============ ROUTES DU PROFIL PUBLIC ============

/**
 * @route GET /api/social/profile/:username
 * @desc Récupérer un profil public par username
 * @access Private (mais visible selon les paramètres de confidentialité)
 */
router.get('/profile/:username', authenticateToken, socialController.getPublicProfile);

// ============ ROUTES DE PARTAGE ============

/**
 * @route GET /api/social/share/card
 * @desc Obtenir les données pour générer une carte de partage
 * @access Private
 */
router.get('/share/card', authenticateToken, socialController.getShareCardData);

module.exports = router;

