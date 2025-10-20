const socialModel = require('../models/socialModel');
const logger = require('../config/logger');

const socialController = {
  // ============ GESTION DES CONNEXIONS ============

  /**
   * Ajouter un ami
   */
  async addFriend(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;

      if (!friendId) {
        return res.status(400).json({ message: 'friendId requis' });
      }

      if (userId === friendId) {
        return res.status(400).json({ message: 'Vous ne pouvez pas vous ajouter vous-même' });
      }

      // Vérifier si la connexion existe déjà
      const areFriends = await socialModel.areFriends(userId, friendId);
      if (areFriends) {
        return res.status(400).json({ message: 'Cette connexion existe déjà' });
      }

      await socialModel.createConnection(userId, friendId);
      
      logger.info(`Nouvelle demande de connexion: ${userId} -> ${friendId}`);
      
      res.status(201).json({ 
        message: 'Demande de connexion envoyée',
        status: 'pending'
      });
    } catch (error) {
      logger.error('Erreur lors de l\'ajout d\'ami:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Accepter une demande d'ami
   */
  async acceptFriend(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;

      if (!friendId) {
        return res.status(400).json({ message: 'friendId requis' });
      }

      await socialModel.acceptConnection(userId, friendId);
      
      logger.info(`Connexion acceptée: ${userId} <-> ${friendId}`);
      
      res.json({ 
        message: 'Connexion acceptée',
        status: 'accepted'
      });
    } catch (error) {
      logger.error('Erreur lors de l\'acceptation:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Supprimer un ami
   */
  async removeFriend(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.params;

      if (!friendId) {
        return res.status(400).json({ message: 'friendId requis' });
      }

      await socialModel.removeConnection(userId, parseInt(friendId));
      
      logger.info(`Connexion supprimée: ${userId} <-> ${friendId}`);
      
      res.json({ message: 'Connexion supprimée' });
    } catch (error) {
      logger.error('Erreur lors de la suppression:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Récupérer la liste des amis
   */
  async getFriends(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      const friends = await socialModel.getFriends(parseInt(userId));
      
      res.json({ 
        friends,
        count: friends.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des amis:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Rechercher des utilisateurs
   */
  async searchUsers(req, res) {
    try {
      const userId = req.user.id;
      const { q } = req.query;

      if (!q || q.length < 2) {
        return res.status(400).json({ message: 'Terme de recherche trop court (min 2 caractères)' });
      }

      const users = await socialModel.searchUsers(q, userId);
      
      res.json({ 
        users,
        count: users.length
      });
    } catch (error) {
      logger.error('Erreur lors de la recherche:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // ============ GESTION DU FEED ============

  /**
   * Récupérer le feed social
   */
  async getFeed(req, res) {
    try {
      const userId = req.params.userId || req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      // Vérifier si le feed est déverrouillé
      const { unlocked } = await socialModel.isFeedUnlocked(userId);

      if (!unlocked) {
        return res.json({
          locked: true,
          message: 'Bouge pour rallumer ton cercle 🔒',
          feed: []
        });
      }

      const feed = await socialModel.getFeed(parseInt(userId), limit, offset);
      
      res.json({ 
        locked: false,
        feed,
        count: feed.length
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du feed:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Déverrouiller le feed après une session
   */
  async unlockFeed(req, res) {
    try {
      const userId = req.user.id;
      const { sessionCompletionId, message, emoji } = req.body;

      if (!sessionCompletionId) {
        return res.status(400).json({ message: 'sessionCompletionId requis' });
      }

      // Déverrouiller le feed
      await socialModel.unlockFeed(userId, sessionCompletionId);

      // Créer un événement dans le feed si message fourni
      if (message) {
        await socialModel.createFeedEvent(
          userId,
          'session_completed',
          message,
          emoji || '💪',
          sessionCompletionId
        );
      }

      // Récupérer les statistiques de streak
      const streak = await socialModel.getUserStreak(userId);
      
      logger.info(`Feed déverrouillé pour l'utilisateur ${userId}, streak: ${streak.current_streak}`);
      
      res.json({ 
        message: 'Feed déverrouillé ! 🔓',
        unlocked: true,
        streak: streak.current_streak
      });
    } catch (error) {
      logger.error('Erreur lors du déverrouillage:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Vérifier le statut du feed
   */
  async checkFeedStatus(req, res) {
    try {
      const userId = req.user.id;

      const status = await socialModel.isFeedUnlocked(userId);
      const streak = await socialModel.getUserStreak(userId);
      
      res.json({ 
        ...status,
        streak: streak.current_streak,
        total_days: streak.total_days
      });
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  /**
   * Récupérer les statistiques de cercle (pour la visualisation)
   */
  async getCircleStats(req, res) {
    try {
      const userId = req.user.id;

      const friends = await socialModel.getFriends(userId);
      const streak = await socialModel.getUserStreak(userId);
      const myStatus = await socialModel.isFeedUnlocked(userId);

      // Calculer les amis actifs aujourd'hui
      const activeFriends = friends.filter(f => f.feed_unlocked_today);

      res.json({
        user_status: {
          unlocked: myStatus.unlocked,
          streak: streak.current_streak,
          total_days: streak.total_days
        },
        circle: {
          total_friends: friends.length,
          active_today: activeFriends.length,
          friends: friends.map(f => ({
            id: f.id,
            name: f.name,
            username: f.username,
            avatar_url: f.avatar_url,
            active_today: Boolean(f.feed_unlocked_today),
            unlocked_at: f.unlocked_at
          }))
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des stats:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // ============ PROFIL PUBLIC ============

  /**
   * Récupérer un profil public
   */
  async getPublicProfile(req, res) {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ message: 'Username requis' });
      }

      const profile = await socialModel.getPublicProfile(username);

      if (!profile) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      // Vérifier la visibilité
      if (profile.profile_visibility === 'private') {
        // Vérifier si l'utilisateur connecté est ami
        const requesterId = req.user?.id;
        if (requesterId) {
          const areFriends = await socialModel.areFriends(requesterId, profile.id);
          if (!areFriends && requesterId !== profile.id) {
            return res.status(403).json({ message: 'Profil privé' });
          }
        } else {
          return res.status(403).json({ message: 'Profil privé' });
        }
      }

      // Supprimer des infos sensibles
      delete profile.email;

      res.json({ profile });
    } catch (error) {
      logger.error('Erreur lors de la récupération du profil public:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // ============ GÉNÉRATION DE CARTE DE PARTAGE ============

  /**
   * Préparer les données pour la carte de partage
   */
  async getShareCardData(req, res) {
    try {
      const userId = req.user.id;
      const { sessionCompletionId } = req.query;

      // Récupérer les infos utilisateur
      const friends = await socialModel.getFriends(userId);
      const streak = await socialModel.getUserStreak(userId);
      const myStatus = await socialModel.isFeedUnlocked(userId);

      // Récupérer le dernier événement ou celui spécifié
      let feedEvent = null;
      if (sessionCompletionId) {
        const events = await socialModel.getUserFeedEvents(userId, 1);
        feedEvent = events[0] || null;
      }

      res.json({
        user: {
          name: req.user.name,
          username: req.user.username,
          avatar_url: req.user.avatar_url
        },
        stats: {
          streak: streak.current_streak,
          total_days: streak.total_days,
          friends_count: friends.length
        },
        status: {
          unlocked: myStatus.unlocked
        },
        feed_event: feedEvent
      });
    } catch (error) {
      logger.error('Erreur lors de la génération des données de carte:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};

module.exports = socialController;

