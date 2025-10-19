const pushNotificationsModel = require('../models/pushNotificationsModel');
const pushNotificationService = require('../services/pushNotificationService');
const { logger } = require('../config/logger');

const pushNotificationsController = {
  /**
   * GET /api/push/vapid-public-key
   * Récupérer la clé publique VAPID pour le frontend
   */
  async getVapidPublicKey(req, res) {
    try {
      const publicKey = pushNotificationService.getVapidPublicKey();
      
      if (!publicKey) {
        return res.status(503).json({
          error: 'Les notifications push ne sont pas configurées'
        });
      }

      res.json({ publicKey });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la clé VAPID:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * POST /api/push/subscribe
   * S'abonner aux notifications push
   */
  async subscribe(req, res) {
    try {
      const userId = req.user.userId;
      const { subscription } = req.body;
      const userAgent = req.headers['user-agent'];

      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({
          error: 'Données d\'abonnement invalides'
        });
      }

      const subscriptionId = await pushNotificationsModel.saveSubscription(
        userId,
        subscription,
        userAgent
      );

      logger.info(`Nouvel abonnement push pour l'utilisateur ${userId}`);

      res.status(201).json({
        message: 'Abonnement enregistré avec succès',
        subscriptionId
      });
    } catch (error) {
      logger.error('Erreur lors de l\'abonnement aux notifications:', error);
      res.status(500).json({ error: 'Erreur lors de l\'abonnement' });
    }
  },

  /**
   * POST /api/push/unsubscribe
   * Se désabonner des notifications push
   */
  async unsubscribe(req, res) {
    try {
      const userId = req.user.userId;
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          error: 'Endpoint requis'
        });
      }

      await pushNotificationsModel.unsubscribe(userId, endpoint);

      logger.info(`Désabonnement push pour l'utilisateur ${userId}`);

      res.json({
        message: 'Désabonnement réussi'
      });
    } catch (error) {
      logger.error('Erreur lors du désabonnement:', error);
      res.status(500).json({ error: 'Erreur lors du désabonnement' });
    }
  },

  /**
   * GET /api/push/preferences
   * Récupérer les préférences de notification de l'utilisateur
   */
  async getPreferences(req, res) {
    try {
      const userId = req.user.userId;
      const preferences = await pushNotificationsModel.getPreferences(userId);

      res.json(preferences);
    } catch (error) {
      logger.error('Erreur lors de la récupération des préférences:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * PUT /api/push/preferences
   * Mettre à jour les préférences de notification
   */
  async updatePreferences(req, res) {
    try {
      const userId = req.user.userId;
      const preferences = req.body;

      // Liste des champs autorisés
      const allowedFields = [
        'training_reminders',
        'session_completed_by_members',
        'badge_unlocked',
        'weekly_goals',
        'new_programs',
        'daily_motivation',
        'quiet_hours_start',
        'quiet_hours_end',
        'reminder_minutes_before'
      ];

      // Filtrer pour ne garder que les champs autorisés
      const filteredPreferences = {};
      for (const field of allowedFields) {
        if (preferences.hasOwnProperty(field)) {
          filteredPreferences[field] = preferences[field];
        }
      }

      if (Object.keys(filteredPreferences).length === 0) {
        return res.status(400).json({
          error: 'Aucune préférence valide fournie'
        });
      }

      await pushNotificationsModel.updatePreferences(userId, filteredPreferences);

      logger.info(`Préférences de notification mises à jour pour l'utilisateur ${userId}`);

      res.json({
        message: 'Préférences mises à jour avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour des préférences:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  },

  /**
   * POST /api/push/test
   * Envoyer une notification de test
   */
  async sendTestNotification(req, res) {
    try {
      const userId = req.user.userId;

      const notification = {
        title: '🎉 Notification de test',
        body: 'Si vous voyez ceci, les notifications fonctionnent parfaitement !',
        icon: '/icon-192x192.png'
      };

      const data = {
        type: 'other',
        url: '/'
      };

      const result = await pushNotificationService.sendToUser(userId, notification, data);

      res.json({
        message: 'Notification de test envoyée',
        result
      });
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la notification de test:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi' });
    }
  },

  /**
   * GET /api/push/stats
   * Récupérer les statistiques des notifications
   */
  async getStats(req, res) {
    try {
      const userId = req.user.userId;
      const stats = await pushNotificationsModel.getNotificationStats(userId);

      res.json(stats);
    } catch (error) {
      logger.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * GET /api/push/subscriptions
   * Récupérer les abonnements actifs de l'utilisateur
   */
  async getSubscriptions(req, res) {
    try {
      const userId = req.user.userId;
      const subscriptions = await pushNotificationsModel.getUserSubscriptions(userId);

      // Ne pas renvoyer les clés complètes pour des raisons de sécurité
      const sanitizedSubscriptions = subscriptions.map(sub => ({
        subscriptionId: sub.subscriptionId,
        endpoint: sub.subscription.endpoint.substring(0, 50) + '...',
        createdAt: sub.createdAt,
        lastUsedAt: sub.lastUsedAt
      }));

      res.json(sanitizedSubscriptions);
    } catch (error) {
      logger.error('Erreur lors de la récupération des abonnements:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * GET /api/push/notifications
   * Récupérer les notifications de l'utilisateur
   */
  async getNotifications(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 20;
      
      const notifications = await pushNotificationsModel.getUserNotifications(userId, limit);

      res.json(notifications);
    } catch (error) {
      logger.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * POST /api/push/notifications/:id/read
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      await pushNotificationsModel.markAsRead(userId, id);

      res.json({ message: 'Notification marquée comme lue' });
    } catch (error) {
      logger.error('Erreur lors du marquage de la notification:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * POST /api/push/notifications/read-all
   * Marquer toutes les notifications comme lues
   */
  async markAllNotificationsAsRead(req, res) {
    try {
      const userId = req.user.userId;

      await pushNotificationsModel.markAllAsRead(userId);

      res.json({ message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes les notifications:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  /**
   * GET /api/push/notifications/unread-count
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.userId;
      const count = await pushNotificationsModel.getUnreadCount(userId);

      res.json({ unreadCount: count });
    } catch (error) {
      logger.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = pushNotificationsController;

