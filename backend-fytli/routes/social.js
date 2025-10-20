/**
 * Routes Social - Gestion des connexions et du feed
 */

const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticateToken } = require('../middleware/auth');

// ============ GESTION DES CONNEXIONS ============

/**
 * GET /social/connections
 * Récupérer la liste des amis de l'utilisateur connecté
 */
router.get('/connections', authenticateToken, socialController.getFriends);

/**
 * GET /social/connections/:userId
 * Récupérer la liste des amis d'un utilisateur spécifique
 */
router.get('/connections/:userId', authenticateToken, socialController.getFriends);

/**
 * POST /social/connections/add
 * Envoyer une demande d'ami
 * Body: { friendId: number }
 */
router.post('/connections/add', authenticateToken, socialController.addFriend);

/**
 * POST /social/connections/accept
 * Accepter une demande d'ami
 * Body: { friendId: number }
 */
router.post('/connections/accept', authenticateToken, socialController.acceptFriend);

/**
 * DELETE /social/connections/:friendId
 * Supprimer une connexion (ami)
 */
router.delete('/connections/:friendId', authenticateToken, socialController.removeFriend);

/**
 * GET /social/search?q=query
 * Rechercher des utilisateurs
 * Query: q (minimum 2 caractères)
 */
router.get('/search', authenticateToken, socialController.searchUsers);

// ============ GESTION DU FEED ============

/**
 * GET /social/feed
 * Récupérer le feed social (activités des amis)
 * Query: limit (default: 50), offset (default: 0)
 */
router.get('/feed', authenticateToken, socialController.getFeed);

/**
 * GET /social/feed/:userId
 * Récupérer le feed d'un utilisateur spécifique
 * Query: limit (default: 50), offset (default: 0)
 */
router.get('/feed/:userId', authenticateToken, socialController.getFeed);

/**
 * POST /social/feed/unlock
 * Déverrouiller le feed après avoir complété une session
 * Body: { sessionCompletionId: number, message?: string, emoji?: string }
 */
router.post('/feed/unlock', authenticateToken, socialController.unlockFeed);

/**
 * GET /social/feed/status
 * Vérifier si le feed est déverrouillé aujourd'hui
 */
router.get('/feed/status', authenticateToken, socialController.checkFeedStatus);

/**
 * GET /social/circle
 * Récupérer les statistiques du cercle (amis actifs, etc.)
 */
router.get('/circle', authenticateToken, socialController.getCircleStats);

// ============ PROFIL PUBLIC ============

/**
 * GET /social/profile/:username
 * Récupérer le profil public d'un utilisateur
 */
router.get('/profile/:username', authenticateToken, socialController.getPublicProfile);

// ============ PARTAGE ============

/**
 * GET /social/share/card
 * Obtenir les données pour générer une carte de partage
 * Query: sessionCompletionId? (optional)
 */
router.get('/share/card', authenticateToken, socialController.getShareCardData);

module.exports = router;

