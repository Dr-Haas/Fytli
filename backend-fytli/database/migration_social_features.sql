-- Migration pour l'écosystème "Cercle Fytli"
-- Date: 2025-10-19

-- Table des connexions sociales entre utilisateurs
CREATE TABLE IF NOT EXISTS user_connections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (user_id, friend_id),
  INDEX idx_user_id (user_id),
  INDEX idx_friend_id (friend_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table du feed social (événements visibles)
CREATE TABLE IF NOT EXISTS user_feed (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('session_completed', 'program_started', 'streak_achieved', 'goal_reached', 'badge_earned') DEFAULT 'session_completed',
  message TEXT NOT NULL,
  emoji VARCHAR(10),
  session_completion_id INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_completion_id) REFERENCES session_completions(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table de gestion du verrouillage du feed
CREATE TABLE IF NOT EXISTS social_unlocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP NULL,
  session_completion_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_completion_id) REFERENCES session_completions(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_date (user_id, date),
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  INDEX idx_unlocked (unlocked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter un champ username public aux utilisateurs si pas déjà présent
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_visibility ENUM('private', 'friends', 'public') DEFAULT 'friends';
ALTER TABLE users ADD COLUMN IF NOT EXISTS share_count INT DEFAULT 0;

-- Index pour optimiser les requêtes du feed
CREATE INDEX IF NOT EXISTS idx_connections_accepted ON user_connections(user_id, status) WHERE status = 'accepted';

-- Vue pour faciliter les requêtes de feed
CREATE OR REPLACE VIEW v_friends_feed AS
SELECT 
  uf.id,
  uf.user_id,
  uf.type,
  uf.message,
  uf.emoji,
  uf.created_at,
  u.name,
  u.username,
  u.avatar_url,
  sc.duration,
  sc.average_heart_rate
FROM user_feed uf
JOIN users u ON uf.user_id = u.id
LEFT JOIN session_completions sc ON uf.session_completion_id = sc.id
ORDER BY uf.created_at DESC;

-- Procédure pour créer automatiquement un événement feed après une session
DELIMITER //

CREATE OR REPLACE PROCEDURE create_feed_event(
  IN p_user_id INT,
  IN p_session_completion_id INT,
  IN p_message TEXT,
  IN p_emoji VARCHAR(10)
)
BEGIN
  DECLARE v_event_type VARCHAR(50);
  DECLARE v_today DATE;
  
  SET v_today = CURDATE();
  SET v_event_type = 'session_completed';
  
  -- Créer l'événement dans le feed
  INSERT INTO user_feed (user_id, type, message, emoji, session_completion_id)
  VALUES (p_user_id, v_event_type, p_message, p_emoji, p_session_completion_id);
  
  -- Déverrouiller le feed pour aujourd'hui
  INSERT INTO social_unlocks (user_id, date, unlocked, unlocked_at, session_completion_id)
  VALUES (p_user_id, v_today, TRUE, NOW(), p_session_completion_id)
  ON DUPLICATE KEY UPDATE 
    unlocked = TRUE,
    unlocked_at = NOW(),
    session_completion_id = p_session_completion_id;
    
END //

DELIMITER ;

-- Fonction pour vérifier si le feed est déverrouillé
DELIMITER //

CREATE OR REPLACE FUNCTION is_feed_unlocked(
  p_user_id INT,
  p_date DATE
) RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_unlocked BOOLEAN;
  
  SELECT unlocked INTO v_unlocked
  FROM social_unlocks
  WHERE user_id = p_user_id AND date = p_date;
  
  RETURN IFNULL(v_unlocked, FALSE);
END //

DELIMITER ;

-- Trigger pour créer automatiquement une entrée social_unlocks
DELIMITER //

CREATE OR REPLACE TRIGGER after_session_completion
AFTER INSERT ON session_completions
FOR EACH ROW
BEGIN
  DECLARE v_today DATE;
  DECLARE v_user_name VARCHAR(255);
  DECLARE v_message TEXT;
  DECLARE v_emoji VARCHAR(10);
  
  SET v_today = CURDATE();
  
  -- Récupérer le nom de l'utilisateur
  SELECT name INTO v_user_name FROM users WHERE id = NEW.user_id;
  
  -- Générer un message simple
  SET v_message = CONCAT(v_user_name, ' a terminé une séance');
  SET v_emoji = '💪';
  
  -- Créer l'événement feed
  CALL create_feed_event(NEW.user_id, NEW.id, v_message, v_emoji);
END //

DELIMITER ;

