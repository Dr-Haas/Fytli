-- =====================================================
-- SYSTÈME SOCIAL - CERCLE FYTLI (Version OVH)
-- =====================================================
-- Compatible avec MySQL 5.7+ / MariaDB 10.2+
-- Installation manuelle sur OVH CloudDB
-- =====================================================

-- =====================================================
-- TABLE 1 : CONNECTIONS (Connexions/Amis)
-- =====================================================
CREATE TABLE IF NOT EXISTS connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (user_id, friend_id),
  INDEX idx_user_id (user_id),
  INDEX idx_friend_id (friend_id),
  INDEX idx_status (status),
  INDEX idx_both_users (user_id, friend_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2 : FEED_EVENTS (Événements du feed)
-- =====================================================
CREATE TABLE IF NOT EXISTS feed_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('session_completed', 'program_started', 'streak_achieved', 'goal_reached', 'badge_earned') NOT NULL,
  message TEXT NOT NULL,
  emoji VARCHAR(10),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3 : FEED_UNLOCKS (Déverrouillages quotidiens)
-- =====================================================
CREATE TABLE IF NOT EXISTS feed_unlocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  unlocked_date DATE NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_completion_id INT,
  streak INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_completion_id) REFERENCES session_completions(id) ON DELETE SET NULL,
  UNIQUE KEY unique_daily_unlock (user_id, unlocked_date),
  INDEX idx_user_id (user_id),
  INDEX idx_unlocked_date (unlocked_date),
  INDEX idx_streak (streak)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 4 : EXTENSIONS USERS
-- =====================================================
-- ÉTAPE 1 : Vérifier si les colonnes existent déjà
-- Si une erreur apparaît "Duplicate column", c'est normal, passez à la suivante

-- Ajouter username
ALTER TABLE users ADD COLUMN username VARCHAR(50) UNIQUE;

-- Ajouter avatar_url
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);

-- Ajouter profile_visibility
ALTER TABLE users ADD COLUMN profile_visibility ENUM('private', 'friends', 'public') DEFAULT 'friends';

-- Ajouter les index
ALTER TABLE users ADD INDEX idx_username (username);
ALTER TABLE users ADD INDEX idx_profile_visibility (profile_visibility);

-- =====================================================
-- ÉTAPE 2 : GÉNÉRER LES USERNAMES (optionnel)
-- =====================================================
-- Si vous avez des utilisateurs existants sans username, exécutez :
-- UPDATE users 
-- SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
-- WHERE username IS NULL;

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Vérifier que les tables sont créées
SHOW TABLES LIKE '%connection%';
SHOW TABLES LIKE '%feed%';

-- Vérifier les colonnes de users
DESCRIBE users;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- ✅ Installation terminée !
-- 
-- Tables créées :
-- 1. connections (amis/connexions)
-- 2. feed_events (événements du feed)
-- 3. feed_unlocks (déverrouillages quotidiens)
-- 4. users (colonnes username, avatar_url, profile_visibility ajoutées)
-- =====================================================

