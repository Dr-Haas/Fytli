const webpush = require('web-push');
const pushNotificationsModel = require('../models/pushNotificationsModel');
const { logger } = require('../config/logger');

// Configuration de web-push avec les clés VAPID
// Ces clés doivent être générées et stockées dans les variables d'environnement
// Pour générer les clés: npx web-push generate-vapid-keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
  subject: process.env.VAPID_SUBJECT || 'mailto:contact@fytli.com'
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
} else {
  logger.warn('⚠️  Clés VAPID non configurées. Les notifications push ne fonctionneront pas.');
}

const pushNotificationService = {
  /**
   * Récupérer la clé publique VAPID pour le frontend
   */
  getVapidPublicKey() {
    return vapidKeys.publicKey;
  },

  /**
   * Envoyer une notification push à un utilisateur
   */
  async sendToUser(userId, notification, data = {}) {
    try {
      const subscriptions = await pushNotificationsModel.getUserSubscriptions(userId);
      
      if (subscriptions.length === 0) {
        logger.info(`Aucun abonnement push pour l'utilisateur ${userId}`);
        return { sent: 0, failed: 0 };
      }

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icon-192x192.png',
        badge: notification.badge || '/icon-192x192.png',
        data: data,
        timestamp: Date.now()
      });

      let sent = 0;
      let failed = 0;

      // Envoyer à tous les appareils de l'utilisateur
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          sent++;
          
          // Logger le succès
          await pushNotificationsModel.logNotification(
            userId,
            data.type || 'other',
            notification.title,
            notification.body,
            data,
            true
          );
        } catch (error) {
          failed++;
          logger.error(`Erreur lors de l'envoi de la notification à l'utilisateur ${userId}:`, error);
          
          // Si l'abonnement est invalide (410 Gone), le supprimer
          if (error.statusCode === 410) {
            await pushNotificationsModel.removeInvalidSubscription(sub.subscription.endpoint);
            logger.info(`Abonnement invalide supprimé pour l'utilisateur ${userId}`);
          }
          
          // Logger l'échec
          await pushNotificationsModel.logNotification(
            userId,
            data.type || 'other',
            notification.title,
            notification.body,
            data,
            false,
            error.message
          );
        }
      }

      return { sent, failed };
    } catch (error) {
      logger.error('Erreur dans sendToUser:', error);
      throw error;
    }
  },

  /**
   * Envoyer une notification à plusieurs utilisateurs
   */
  async sendToMultipleUsers(userIds, notification, data = {}) {
    const results = {
      total: userIds.length,
      sent: 0,
      failed: 0
    };

    for (const userId of userIds) {
      try {
        const result = await this.sendToUser(userId, notification, data);
        results.sent += result.sent;
        results.failed += result.failed;
      } catch (error) {
        results.failed++;
        logger.error(`Erreur pour l'utilisateur ${userId}:`, error);
      }
    }

    return results;
  },

  /**
   * Notification: Rappel d'entraînement
   */
  async sendTrainingReminder(userId, program) {
    const notification = {
      title: '🏋️ Rappel d\'entraînement',
      body: `Il est temps de faire votre séance "${program.name}" !`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'training_reminder',
      programId: program.program_id,
      programName: program.name,
      url: `/programs/${program.program_id}`
    };

    return await this.sendToUser(userId, notification, data);
  },

  /**
   * Notification: Un membre a complété sa session
   */
  async sendSessionCompletedByMember(programId, completedByUser, excludeUserId = null) {
    try {
      // Récupérer tous les membres du programme sauf celui qui a complété
      const members = await pushNotificationsModel.getProgramMembers(programId, excludeUserId);
      
      const notification = {
        title: '💪 Session complétée !',
        body: `${completedByUser.first_name} vient de terminer sa session !`,
        icon: '/icon-192x192.png'
      };

      const data = {
        type: 'session_completed',
        programId: programId,
        completedBy: completedByUser.first_name,
        url: `/programs/${programId}`
      };

      const userIds = members.map(m => m.user_id);
      return await this.sendToMultipleUsers(userIds, notification, data);
    } catch (error) {
      logger.error('Erreur dans sendSessionCompletedByMember:', error);
      throw error;
    }
  },

  /**
   * Notification: Badge débloqué
   */
  async sendBadgeUnlocked(userId, badge) {
    const notification = {
      title: '🏆 Nouveau badge débloqué !',
      body: `Félicitations ! Vous avez obtenu le badge "${badge.name}"`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'badge_unlocked',
      badgeId: badge.badge_id,
      badgeName: badge.name,
      url: '/profile/badges'
    };

    return await this.sendToUser(userId, notification, data);
  },

  /**
   * Notification: Objectif hebdomadaire atteint
   */
  async sendWeeklyGoalAchieved(userId, goalDetails) {
    const notification = {
      title: '🎯 Objectif hebdomadaire atteint !',
      body: `Bravo ! Vous avez complété ${goalDetails.completedSessions} séances cette semaine !`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'weekly_goal',
      completedSessions: goalDetails.completedSessions,
      url: '/profile'
    };

    return await this.sendToUser(userId, notification, data);
  },

  /**
   * Notification: Nouveau programme disponible
   */
  async sendNewProgramAvailable(userId, program) {
    const notification = {
      title: '✨ Nouveau programme disponible',
      body: `Découvrez "${program.name}" - ${program.description}`,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'new_program',
      programId: program.program_id,
      programName: program.name,
      url: `/programs/${program.program_id}`
    };

    return await this.sendToUser(userId, notification, data);
  },

  /**
   * Notification: Motivation quotidienne
   */
  async sendDailyMotivation(userId) {
    const motivations = [
      'Chaque pas compte. Continuez comme ça ! 💪',
      'Votre corps vous remerciera demain pour ce que vous faites aujourd\'hui ! 🌟',
      'La seule mauvaise séance est celle qu\'on ne fait pas ! 🔥',
      'Vous êtes plus fort que vous ne le pensez ! 💯',
      'Un jour à la fois. Vous progressez ! 🚀',
      'La constance mène au succès ! ⭐',
      'Votre santé est votre plus grande richesse ! ❤️'
    ];

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

    const notification = {
      title: '💡 Motivation du jour',
      body: randomMotivation,
      icon: '/icon-192x192.png'
    };

    const data = {
      type: 'daily_motivation',
      url: '/'
    };

    return await this.sendToUser(userId, notification, data);
  }
};

module.exports = pushNotificationService;

