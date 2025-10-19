const cron = require('node-cron');
const db = require('../db');
const pushNotificationService = require('./pushNotificationService');
const pushNotificationsModel = require('../models/pushNotificationsModel');
const logger = require('../config/logger');

/**
 * Service pour planifier et envoyer les notifications automatiques
 */
class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  /**
   * Démarrer tous les cron jobs
   */
  start() {
    logger.info('🔔 Démarrage du planificateur de notifications...');

    // Rappels d'entraînement (toutes les 15 minutes)
    this.jobs.push(
      cron.schedule('*/15 * * * *', () => {
        this.sendTrainingReminders();
      })
    );

    // Motivation quotidienne (tous les jours à 8h)
    this.jobs.push(
      cron.schedule('0 8 * * *', () => {
        this.sendDailyMotivation();
      })
    );

    // Vérification des objectifs hebdomadaires (tous les dimanches à 20h)
    this.jobs.push(
      cron.schedule('0 20 * * 0', () => {
        this.checkWeeklyGoals();
      })
    );

    // Nettoyage des abonnements inactifs (tous les jours à 3h)
    this.jobs.push(
      cron.schedule('0 3 * * *', () => {
        this.cleanupInactiveSubscriptions();
      })
    );

    logger.info('✅ Planificateur de notifications démarré avec succès');
  }

  /**
   * Arrêter tous les cron jobs
   */
  stop() {
    this.jobs.forEach(job => job.stop());
    logger.info('🛑 Planificateur de notifications arrêté');
  }

  /**
   * Envoyer les rappels d'entraînement selon les time slots
   */
  async sendTrainingReminders() {
    try {
      logger.info('🔔 Vérification des rappels d\'entraînement...');

      // Récupérer tous les programmes avec time slots actifs
      const [programs] = await db.query(`
        SELECT program_id, name, time_slot_start, time_slot_end, is_time_specific
        FROM programs
        WHERE is_time_specific = TRUE
          AND time_slot_start IS NOT NULL
      `);

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      for (const program of programs) {
        // Récupérer les utilisateurs inscrits à ce programme
        const users = await pushNotificationsModel.getUsersForProgramReminder(program.program_id);

        for (const user of users) {
          // Vérifier si on est dans la période de rappel
          const reminderMinutes = user.reminder_minutes_before || 30;
          const timeSlotStart = new Date(`1970-01-01T${program.time_slot_start}`);
          const reminderTime = new Date(timeSlotStart.getTime() - reminderMinutes * 60000);
          const reminderTimeStr = `${String(reminderTime.getHours()).padStart(2, '0')}:${String(reminderTime.getMinutes()).padStart(2, '0')}:00`;

          // Vérifier si on n'est pas dans les heures de silence
          const isQuietHours = this.isInQuietHours(
            currentTime,
            user.quiet_hours_start,
            user.quiet_hours_end
          );

          if (!isQuietHours && this.isTimeToNotify(currentTime, reminderTimeStr, program.time_slot_start)) {
            // Vérifier si l'utilisateur n'a pas déjà fait sa session aujourd'hui
            const [completions] = await db.query(`
              SELECT sc.completion_id
              FROM session_completions sc
              INNER JOIN sessions s ON sc.session_id = s.session_id
              WHERE sc.user_id = ?
                AND s.program_id = ?
                AND DATE(sc.completed_at) = CURDATE()
            `, [user.user_id, program.program_id]);

            if (completions.length === 0) {
              // Envoyer le rappel
              await pushNotificationService.sendTrainingReminder(user.user_id, program);
              logger.info(`📧 Rappel d'entraînement envoyé à ${user.email} pour ${program.name}`);
            }
          }
        }
      }
    } catch (error) {
      logger.error('Erreur lors de l\'envoi des rappels d\'entraînement:', error);
    }
  }

  /**
   * Envoyer la motivation quotidienne
   */
  async sendDailyMotivation() {
    try {
      logger.info('💪 Envoi de la motivation quotidienne...');

      // Récupérer tous les utilisateurs qui ont activé les motivations quotidiennes
      const [users] = await db.query(`
        SELECT u.user_id, u.email, u.first_name,
               np.daily_motivation,
               np.quiet_hours_start,
               np.quiet_hours_end
        FROM users u
        LEFT JOIN notification_preferences np ON u.user_id = np.user_id
        WHERE (np.daily_motivation IS NULL OR np.daily_motivation = TRUE)
      `);

      let sent = 0;
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      for (const user of users) {
        const isQuietHours = this.isInQuietHours(
          currentTime,
          user.quiet_hours_start,
          user.quiet_hours_end
        );

        if (!isQuietHours) {
          await pushNotificationService.sendDailyMotivation(user.user_id);
          sent++;
        }
      }

      logger.info(`✅ Motivation quotidienne envoyée à ${sent} utilisateurs`);
    } catch (error) {
      logger.error('Erreur lors de l\'envoi de la motivation quotidienne:', error);
    }
  }

  /**
   * Vérifier les objectifs hebdomadaires
   */
  async checkWeeklyGoals() {
    try {
      logger.info('🎯 Vérification des objectifs hebdomadaires...');

      // Récupérer les utilisateurs avec leurs sessions complétées cette semaine
      const [users] = await db.query(`
        SELECT 
          u.user_id,
          u.email,
          u.first_name,
          COUNT(DISTINCT sc.completion_id) as sessions_completed,
          COALESCE(wg.target_sessions, 3) as target_sessions
        FROM users u
        LEFT JOIN session_completions sc ON u.user_id = sc.user_id 
          AND YEARWEEK(sc.completed_at, 1) = YEARWEEK(CURDATE(), 1)
        LEFT JOIN weekly_goals wg ON u.user_id = wg.user_id
        LEFT JOIN notification_preferences np ON u.user_id = np.user_id
        WHERE (np.weekly_goals IS NULL OR np.weekly_goals = TRUE)
        GROUP BY u.user_id
        HAVING sessions_completed >= target_sessions
      `);

      let sent = 0;
      for (const user of users) {
        await pushNotificationService.sendWeeklyGoalAchieved(user.user_id, {
          completedSessions: user.sessions_completed,
          targetSessions: user.target_sessions
        });
        sent++;
      }

      logger.info(`✅ Félicitations envoyées à ${sent} utilisateurs pour leurs objectifs hebdomadaires`);
    } catch (error) {
      logger.error('Erreur lors de la vérification des objectifs hebdomadaires:', error);
    }
  }

  /**
   * Nettoyer les abonnements inactifs (plus de 90 jours)
   */
  async cleanupInactiveSubscriptions() {
    try {
      logger.info('🧹 Nettoyage des abonnements inactifs...');

      const [result] = await db.query(`
        DELETE FROM push_subscriptions
        WHERE last_used_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
          OR (is_active = FALSE AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY))
      `);

      logger.info(`✅ ${result.affectedRows} abonnements inactifs supprimés`);
    } catch (error) {
      logger.error('Erreur lors du nettoyage des abonnements:', error);
    }
  }

  /**
   * Vérifier si on est dans les heures de silence
   */
  isInQuietHours(currentTime, quietStart, quietEnd) {
    if (!quietStart || !quietEnd) {
      return false;
    }

    const current = this.timeToMinutes(currentTime);
    const start = this.timeToMinutes(quietStart);
    const end = this.timeToMinutes(quietEnd);

    // Si les heures de silence passent minuit (ex: 22:00 - 07:00)
    if (start > end) {
      return current >= start || current <= end;
    }

    return current >= start && current <= end;
  }

  /**
   * Vérifier si c'est le moment d'envoyer une notification
   * Avec une marge de 15 minutes pour éviter de rater la fenêtre
   */
  isTimeToNotify(currentTime, targetTime, endTime) {
    const current = this.timeToMinutes(currentTime);
    const target = this.timeToMinutes(targetTime);
    const end = this.timeToMinutes(endTime);

    // Envoyer si on est dans une fenêtre de 15 minutes avant le target
    return current >= target - 15 && current <= end;
  }

  /**
   * Convertir un temps HH:MM:SS en minutes
   */
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// Instance unique du planificateur
const notificationScheduler = new NotificationScheduler();

module.exports = notificationScheduler;

