-- =====================================================
-- SYSTÈME SOCIAL - CERCLE FYTLI
-- =====================================================
-- Ce fichier crée les tables nécessaires pour :
-- 1. Connexions entre utilisateurs (amis)
-- 2. Feed social des activités
-- 3. Déverrouillage quotidien du feed
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
-- TABLE 4 : USER PROFILES (Extensions pour profils sociaux)
-- =====================================================
-- Ajouter des colonnes à la table users si elles n'existent pas
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS profile_visibility ENUM('private', 'friends', 'public') DEFAULT 'friends',
  ADD INDEX IF NOT EXISTS idx_username (username),
  ADD INDEX IF NOT EXISTS idx_profile_visibility (profile_visibility);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Afficher les nouvelles tables
SELECT 
  TABLE_NAME, 
  TABLE_ROWS,
  CREATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME IN ('connections', 'feed_events', 'feed_unlocks')
ORDER BY TABLE_NAME;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- ✅ Tables sociales créées avec succès !
-- 
-- Tables créées :
-- 1. connections (connexions entre utilisateurs)
-- 2. feed_events (événements du feed social)
-- 3. feed_unlocks (déverrouillages quotidiens)
-- 
-- Extensions :
-- ✅ Colonnes sociales ajoutées à la table users
-- =====================================================

