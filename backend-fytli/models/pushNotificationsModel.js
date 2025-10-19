const db = require('../db');

const pushNotificationsModel = {
  // Créer ou mettre à jour un abonnement push
  async saveSubscription(userId, subscription, userAgent = null) {
    const { endpoint, keys } = subscription;
    
    // Vérifier si l'abonnement existe déjà
    const [existing] = await db.query(
      'SELECT subscription_id FROM push_subscriptions WHERE user_id = ? AND endpoint = ?',
      [userId, endpoint]
    );

    if (existing.length > 0) {
      // Mettre à jour l'abonnement existant
      await db.query(
        `UPDATE push_subscriptions 
         SET p256dh_key = ?, auth_key = ?, is_active = TRUE, last_used_at = CURRENT_TIMESTAMP 
         WHERE subscription_id = ?`,
        [keys.p256dh, keys.auth, existing[0].subscription_id]
      );
      return existing[0].subscription_id;
    } else {
      // Créer un nouvel abonnement
      const [result] = await db.query(
        `INSERT INTO push_subscriptions (user_id, endpoint, p256dh_key, auth_key, user_agent)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, endpoint, keys.p256dh, keys.auth, userAgent]
      );
      return result.insertId;
    }
  },

  // Récupérer tous les abonnements actifs d'un utilisateur
  async getUserSubscriptions(userId) {
    const [subscriptions] = await db.query(
      `SELECT subscription_id, endpoint, p256dh_key, auth_key, created_at, last_used_at
       FROM push_subscriptions
       WHERE user_id = ? AND is_active = TRUE`,
      [userId]
    );
    
    return subscriptions.map(sub => ({
      subscriptionId: sub.subscription_id,
      subscription: {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh_key,
          auth: sub.auth_key
        }
      },
      createdAt: sub.created_at,
      lastUsedAt: sub.last_used_at
    }));
  },

  // Désactiver un abonnement
  async unsubscribe(userId, endpoint) {
    await db.query(
      'UPDATE push_subscriptions SET is_active = FALSE WHERE user_id = ? AND endpoint = ?',
      [userId, endpoint]
    );
  },

  // Supprimer un abonnement invalide
  async removeInvalidSubscription(endpoint) {
    await db.query(
      'DELETE FROM push_subscriptions WHERE endpoint = ?',
      [endpoint]
    );
  },

  // Récupérer les préférences de notification d'un utilisateur
  async getPreferences(userId) {
    const [preferences] = await db.query(
      'SELECT * FROM notification_preferences WHERE user_id = ?',
      [userId]
    );
    
    if (preferences.length === 0) {
      // Créer des préférences par défaut
      await db.query(
        'INSERT INTO notification_preferences (user_id) VALUES (?)',
        [userId]
      );
      return await this.getPreferences(userId);
    }
    
    return preferences[0];
  },

  // Mettre à jour les préférences de notification
  async updatePreferences(userId, preferences) {
    const fields = Object.keys(preferences)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(preferences);
    values.push(userId);

    await db.query(
      `UPDATE notification_preferences SET ${fields} WHERE user_id = ?`,
      values
    );
  },

  // Logger une notification envoyée
  async logNotification(userId, type, title, body, data = null, wasDelivered = true, errorMessage = null) {
    await db.query(
      `INSERT INTO notification_logs (user_id, notification_type, title, body, data, was_delivered, error_message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, title, body, JSON.stringify(data), wasDelivered, errorMessage]
    );
  },

  // Récupérer les utilisateurs inscrits à un programme avec leurs préférences
  async getUsersForProgramReminder(programId) {
    const [users] = await db.query(
      `SELECT DISTINCT
         u.user_id,
         u.first_name,
         u.email,
         p.name as program_name,
         p.time_slot_start,
         p.time_slot_end,
         p.is_time_specific,
         np.training_reminders,
         np.reminder_minutes_before,
         np.quiet_hours_start,
         np.quiet_hours_end
       FROM users u
       INNER JOIN enrollments e ON u.user_id = e.user_id
       INNER JOIN programs p ON e.program_id = p.program_id
       LEFT JOIN notification_preferences np ON u.user_id = np.user_id
       WHERE p.program_id = ? 
         AND e.status = 'active'
         AND (np.training_reminders IS NULL OR np.training_reminders = TRUE)`,
      [programId]
    );
    return users;
  },

  // Récupérer tous les membres d'un programme (pour les notifier des sessions complétées)
  async getProgramMembers(programId, excludeUserId = null) {
    let query = `
      SELECT DISTINCT
        u.user_id,
        u.first_name,
        u.last_name,
        np.session_completed_by_members
      FROM users u
      INNER JOIN enrollments e ON u.user_id = e.user_id
      LEFT JOIN notification_preferences np ON u.user_id = np.user_id
      WHERE e.program_id = ? 
        AND e.status = 'active'
        AND (np.session_completed_by_members IS NULL OR np.session_completed_by_members = TRUE)
    `;
    
    const params = [programId];
    
    if (excludeUserId) {
      query += ' AND u.user_id != ?';
      params.push(excludeUserId);
    }

    const [members] = await db.query(query, params);
    return members;
  },

  // Récupérer les statistiques des notifications d'un utilisateur
  async getNotificationStats(userId) {
    const [stats] = await db.query(
      `SELECT 
         COUNT(DISTINCT ps.subscription_id) as active_devices,
         COUNT(nl.log_id) as total_sent,
         SUM(CASE WHEN nl.sent_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as sent_last_week,
         SUM(CASE WHEN nl.sent_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as sent_last_month,
         SUM(CASE WHEN nl.was_delivered = FALSE THEN 1 ELSE 0 END) as failed_deliveries
       FROM users u
       LEFT JOIN push_subscriptions ps ON u.user_id = ps.user_id AND ps.is_active = TRUE
       LEFT JOIN notification_logs nl ON u.user_id = nl.user_id
       WHERE u.user_id = ?
       GROUP BY u.user_id`,
      [userId]
    );
    
    return stats[0] || {
      active_devices: 0,
      total_sent: 0,
      sent_last_week: 0,
      sent_last_month: 0,
      failed_deliveries: 0
    };
  },

  // Récupérer les notifications d'un utilisateur
  async getUserNotifications(userId, limit = 20) {
    const [notifications] = await db.query(
      `SELECT 
         notification_id as id,
         notification_type as type,
         title,
         message,
         data,
         sent_at as timestamp,
         was_delivered,
         is_read as read
       FROM v_user_notifications
       WHERE user_id = ?
       ORDER BY sent_at DESC
       LIMIT ?`,
      [userId, limit]
    );

    return notifications.map(notif => ({
      id: notif.id.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      timestamp: notif.timestamp,
      read: Boolean(notif.read),
      data: notif.data ? (typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data) : null,
    }));
  },

  // Marquer une notification comme lue
  async markAsRead(userId, notificationId) {
    try {
      await db.query(
        'CALL sp_mark_notification_read(?, ?)',
        [userId, notificationId]
      );
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      return false;
    }
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId) {
    try {
      await db.query(
        'CALL sp_mark_all_notifications_read(?)',
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      return false;
    }
  },

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(userId) {
    try {
      const [result] = await db.query(
        `SELECT COUNT(*) as unread_count
         FROM notification_logs nl
         LEFT JOIN user_notification_reads unr 
           ON nl.log_id = unr.notification_log_id 
           AND nl.user_id = unr.user_id
         WHERE nl.user_id = ?
         AND unr.read_id IS NULL`,
        [userId]
      );
      return result[0]?.unread_count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      return 0;
    }
  }
};

module.exports = pushNotificationsModel;

