-- =====================================================
-- MIGRATION: Système de notifications push
-- Date: 2025-10-19
-- Description: Création des tables pour les notifications push
-- =====================================================

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

-- Initialiser les préférences pour tous les utilisateurs existants
INSERT INTO notification_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences);

-- Vue pour voir les statistiques des notifications
CREATE OR REPLACE VIEW notification_stats AS
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

-- Fonction pour nettoyer les anciennes notifications (plus de 90 jours)
DELIMITER $$
CREATE EVENT IF NOT EXISTS cleanup_old_notification_logs
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  DELETE FROM notification_logs 
  WHERE sent_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
END$$
DELIMITER ;

-- Vérification
SELECT 'Tables créées avec succès' as status;
SELECT COUNT(*) as total_users_with_preferences FROM notification_preferences;

