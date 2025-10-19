-- Migration pour ajouter le suivi des notifications lues
-- Date: 2025-10-19
-- Description: Ajoute une table pour suivre quelles notifications ont été lues par quels utilisateurs
-- VERSION SANS FUNCTION (pour éviter le privilège SUPER)

-- Table pour suivre les notifications lues par utilisateur
CREATE TABLE IF NOT EXISTS user_notification_reads (
  read_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_log_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (notification_log_id) REFERENCES notification_logs(log_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_notification (user_id, notification_log_id),
  INDEX idx_user_read (user_id, read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vue pour obtenir les notifications avec leur statut de lecture
DROP VIEW IF EXISTS v_user_notifications;

CREATE VIEW v_user_notifications AS
SELECT 
  nl.log_id as notification_id,
  nl.user_id,
  nl.notification_type,
  nl.title,
  nl.body as message,
  nl.data,
  nl.sent_at,
  nl.was_delivered,
  CASE WHEN unr.read_id IS NOT NULL THEN TRUE ELSE FALSE END as is_read,
  unr.read_at
FROM notification_logs nl
LEFT JOIN user_notification_reads unr ON nl.log_id = unr.notification_log_id AND nl.user_id = unr.user_id
ORDER BY nl.sent_at DESC;

-- Procédure stockée pour marquer une notification comme lue
DROP PROCEDURE IF EXISTS sp_mark_notification_read;

DELIMITER //

CREATE PROCEDURE sp_mark_notification_read(
  IN p_user_id INT,
  IN p_notification_id INT
)
BEGIN
  INSERT IGNORE INTO user_notification_reads (user_id, notification_log_id)
  VALUES (p_user_id, p_notification_id);
END //

DELIMITER ;

-- Procédure stockée pour marquer toutes les notifications comme lues
DROP PROCEDURE IF EXISTS sp_mark_all_notifications_read;

DELIMITER //

CREATE PROCEDURE sp_mark_all_notifications_read(
  IN p_user_id INT
)
BEGIN
  INSERT IGNORE INTO user_notification_reads (user_id, notification_log_id)
  SELECT p_user_id, log_id
  FROM notification_logs
  WHERE user_id = p_user_id
  AND log_id NOT IN (
    SELECT notification_log_id 
    FROM user_notification_reads 
    WHERE user_id = p_user_id
  );
END //

DELIMITER ;

-- Note: La fonction fn_get_unread_count a été supprimée
-- Le comptage se fait maintenant directement dans le code backend
-- Voir backend-fytli/models/pushNotificationsModel.js

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_notification_user_sent ON notification_logs(user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_type ON notification_logs(notification_type);

-- Commentaires
ALTER TABLE user_notification_reads COMMENT = 'Table de suivi des notifications lues par les utilisateurs';

-- Afficher le résultat
SELECT '✅ Migration terminée avec succès !' as status;
SELECT 'ℹ️  La fonction fn_get_unread_count n\'a pas été créée (privilèges insuffisants)' as info;
SELECT 'ℹ️  Le comptage se fait maintenant dans le code backend' as info2;

COMMIT;

