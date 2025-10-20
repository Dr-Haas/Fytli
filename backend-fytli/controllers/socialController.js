/**
 * Contrôleur Social - Gestion des connexions et du feed
 */

const socialModel = require('../models/socialModel');
const { logger } = require('../config/logger');

// ============ GESTION DES CONNEXIONS ============

/**
 * Ajouter un ami (envoyer une demande)
 */
const addFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    
    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de l\'ami est requis'
      });
    }
    
    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous ajouter vous-même'
      });
    }
    
    const connectionId = await socialModel.addFriendRequest(userId, friendId);
    
    res.json({
      success: true,
      message: 'Demande d\'ami envoyée',
      connectionId
    });
  } catch (error) {
    logger.error('Erreur lors de l\'ajout d\'ami:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'ajout d\'ami'
    });
  }
};

/**
 * Accepter une demande d'ami
 */
const acceptFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    
    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de l\'ami est requis'
      });
    }
    
    await socialModel.acceptFriendRequest(userId, friendId);
    
    res.json({
      success: true,
      message: 'Demande d\'ami acceptée'
    });
  } catch (error) {
    logger.error('Erreur lors de l\'acceptation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'acceptation'
    });
  }
};

/**
 * Supprimer un ami
 */
const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;
    
    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de l\'ami est requis'
      });
    }
    
    const removed = await socialModel.removeFriend(userId, parseInt(friendId));
    
    if (removed) {
      res.json({
        success: true,
        message: 'Connexion supprimée'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Connexion non trouvée'
      });
    }
  } catch (error) {
    logger.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression'
    });
  }
};

/**
 * Récupérer la liste des amis
 */
const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: targetUserId } = req.params;
    
    const friends = await socialModel.getFriendsList(
      targetUserId ? parseInt(targetUserId) : userId
    );
    
    res.json({
      success: true,
      friends,
      count: friends.length
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des amis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des amis'
    });
  }
};

/**
 * Rechercher des utilisateurs
 */
const searchUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La recherche doit contenir au moins 2 caractères'
      });
    }
    
    const users = await socialModel.searchUsers(query, userId);
    
    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    logger.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la recherche'
    });
  }
};

// ============ GESTION DU FEED ============

/**
 * Récupérer le feed social
 */
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: targetUserId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    // Vérifier si le feed est déverrouillé
    const status = await socialModel.checkFeedStatus(userId);
    
    if (!status.unlocked) {
      return res.json({
        success: true,
        locked: true,
        message: 'Complète une séance pour déverrouiller le feed',
        feed: [],
        count: 0
      });
    }
    
    const feed = await socialModel.getFeed(
      targetUserId ? parseInt(targetUserId) : userId,
      limit,
      offset
    );
    
    res.json({
      success: true,
      locked: false,
      feed,
      count: feed.length
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du feed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du feed'
    });
  }
};

/**
 * Déverrouiller le feed après une session
 */
const unlockFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionCompletionId, message, emoji } = req.body;
    
    if (!sessionCompletionId) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID de la session complétée est requis'
      });
    }
    
    const result = await socialModel.unlockFeed(
      userId,
      sessionCompletionId,
      message,
      emoji
    );
    
    res.json({
      success: true,
      message: 'Feed déverrouillé avec succès',
      unlocked: result.unlocked,
      streak: result.streak
    });
  } catch (error) {
    logger.error('Erreur lors du déverrouillage:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors du déverrouillage'
    });
  }
};

/**
 * Vérifier le statut du feed
 */
const checkFeedStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const status = await socialModel.checkFeedStatus(userId);
    
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    logger.error('Erreur lors de la vérification du statut:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la vérification du statut'
    });
  }
};

/**
 * Récupérer les statistiques du cercle
 */
const getCircleStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await socialModel.getCircleStats(userId);
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des stats'
    });
  }
};

// ============ PROFIL PUBLIC ============

/**
 * Récupérer un profil public
 */
const getPublicProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Le nom d\'utilisateur est requis'
      });
    }
    
    const profile = await socialModel.getPublicProfile(username, userId);
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(error.message === 'Utilisateur non trouvé' ? 404 : 500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération du profil'
    });
  }
};

// ============ PARTAGE ============

/**
 * Obtenir les données pour générer une carte de partage
 */
const getShareCardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionCompletionId } = req.query;
    
    const data = await socialModel.getShareCardData(
      userId,
      sessionCompletionId ? parseInt(sessionCompletionId) : null
    );
    
    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    logger.error('Erreur lors de la génération de la carte:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la génération de la carte'
    });
  }
};

module.exports = {
  // Connexions
  addFriend,
  acceptFriend,
  removeFriend,
  getFriends,
  searchUsers,
  
  // Feed
  getFeed,
  unlockFeed,
  checkFeedStatus,
  getCircleStats,
  
  // Profil
  getPublicProfile,
  
  // Partage
  getShareCardData
};

