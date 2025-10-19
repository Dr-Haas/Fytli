-- =====================================================
-- MIGRATION: Système de notifications push (VERSION SÉCURISÉE)
-- Date: 2025-10-19
-- Description: Création des tables pour les notifications push
--              Cette version peut être exécutée plusieurs fois sans erreur
-- =====================================================

USE lyfti;

-- Table pour stocker les abonnements push des utilisateurs
CREATE TABLE IF NOT EXISTS push_subscriptions (
  subscription_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_active (user_id, is_active),
  INDEX idx_created_at (created_at)
);

SELECT '✅ Table push_subscriptions créée ou déjà existante' AS message;

-- Table pour les préférences de notifications de chaque utilisateur
CREATE TABLE IF NOT EXISTS notification_preferences (
  preference_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  
  -- Types de notifications
  training_reminders BOOLEAN DEFAULT TRUE,
  session_completed_by_members BOOLEAN DEFAULT TRUE,
  badge_unlocked BOOLEAN DEFAULT TRUE,
  weekly_goals BOOLEAN DEFAULT TRUE,
  new_programs BOOLEAN DEFAULT FALSE,
  daily_motivation BOOLEAN DEFAULT TRUE,
  
  -- Paramètres horaires
  quiet_hours_start TIME DEFAULT '22:00:00',
  quiet_hours_end TIME DEFAULT '07:00:00',
  
  -- Rappels d'entraînement
  reminder_minutes_before INT DEFAULT 30, -- Rappel X minutes avant le time slot
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT '✅ Table notification_preferences créée ou déjà existante' AS message;

-- Table pour logger les notifications envoyées
CREATE TABLE IF NOT EXISTS notification_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type ENUM(
    'training_reminder',
    'session_completed',
    'badge_unlocked',
    'weekly_goal',
    'new_program',
    'daily_motivation',
    'other'
  ) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSON,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  was_delivered BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_type (user_id, notification_type),
  INDEX idx_sent_at (sent_at)
);

SELECT '✅ Table notification_logs créée ou déjà existante' AS message;

-- Initialiser les préférences pour tous les utilisateurs existants (évite les doublons)
INSERT IGNORE INTO notification_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences);

SELECT CONCAT('✅ Préférences initialisées pour ', ROW_COUNT(), ' utilisateur(s)') AS message;

-- Vue pour voir les statistiques des notifications (DROP + CREATE pour mise à jour)
DROP VIEW IF EXISTS notification_stats;

CREATE VIEW notification_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT ps.subscription_id) as active_devices,
  np.training_reminders,
  np.session_completed_by_members,
  np.badge_unlocked,
  COUNT(nl.log_id) as total_notifications_sent,
  SUM(CASE WHEN nl.sent_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as notifications_last_week
FROM users u
LEFT JOIN push_subscriptions ps ON u.id = ps.user_id AND ps.is_active = TRUE
LEFT JOIN notification_preferences np ON u.id = np.user_id
LEFT JOIN notification_logs nl ON u.id = nl.user_id
GROUP BY u.id;

SELECT '✅ Vue notification_stats créée' AS message;

-- Fonction pour nettoyer les anciennes notifications (plus de 90 jours)
-- Supprimer l'événement s'il existe déjà
DROP EVENT IF EXISTS cleanup_old_notification_logs;

DELIMITER $$
CREATE EVENT cleanup_old_notification_logs
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  DELETE FROM notification_logs 
  WHERE sent_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END$$
DELIMITER ;

SELECT '✅ Événement de nettoyage créé' AS message;

-- Vérification finale
SELECT '🎉 Migration notifications push terminée avec succès !' AS status;

SELECT 
  'push_subscriptions' as table_name,
  COUNT(*) as nombre_lignes
FROM push_subscriptions
UNION ALL
SELECT 
  'notification_preferences' as table_name,
  COUNT(*) as nombre_lignes
FROM notification_preferences
UNION ALL
SELECT 
  'notification_logs' as table_name,
  COUNT(*) as nombre_lignes
FROM notification_logs;

-- Afficher un aperçu des préférences
SELECT 
  COUNT(*) as total_users,
  SUM(training_reminders) as avec_rappels_entrainement,
  SUM(session_completed_by_members) as avec_notif_sessions,
  SUM(badge_unlocked) as avec_notif_badges,
  SUM(daily_motivation) as avec_motivation_quotidienne
FROM notification_preferences;

