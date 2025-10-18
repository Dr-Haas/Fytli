-- =====================================================
-- FYTLI - SCHÉMA COMPLET DE LA BASE DE DONNÉES
-- =====================================================
-- Ce fichier crée TOUTES les tables nécessaires pour l'application Fytli
-- Version : 1.0
-- Date : 18 Octobre 2025
-- =====================================================

-- Supprimer les tables existantes si nécessaire (décommenter si besoin)
-- DROP TABLE IF EXISTS user_badges;
-- DROP TABLE IF EXISTS badges;
-- DROP TABLE IF EXISTS session_completions;
-- DROP TABLE IF EXISTS enrollments;
-- DROP TABLE IF EXISTS session_exercises;
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS programs;
-- DROP TABLE IF EXISTS exercises;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS users;

-- =====================================================
-- TABLE 1 : USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
  fitness_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  goal TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2 : CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3 : EXERCISES
-- =====================================================
CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  equipment VARCHAR(255),
  muscle_groups TEXT,
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_difficulty (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 4 : PROGRAMS
-- =====================================================
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  duration_weeks INT,
  image_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_by (created_by),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 5 : SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  target_duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_program (program_id),
  INDEX idx_order (program_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 6 : SESSION_EXERCISES
-- =====================================================
CREATE TABLE IF NOT EXISTS session_exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  exercise_id INT NOT NULL,
  order_index INT DEFAULT 0,
  sets INT DEFAULT 3,
  reps INT,
  duration_seconds INT,
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  INDEX idx_session (session_id),
  INDEX idx_order (session_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 7 : ENROLLMENTS (INSCRIPTIONS)
-- =====================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  status ENUM('active', 'completed', 'paused') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_program (program_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_active_enrollment (user_id, program_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 8 : SESSION_COMPLETIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS session_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  session_id INT NOT NULL,
  duration_minutes INT,
  notes TEXT,
  feeling ENUM('poor', 'okay', 'good', 'great', 'excellent'),
  photo_url VARCHAR(500),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_program (program_id),
  INDEX idx_session (session_id),
  INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 9 : BADGES
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category ENUM('routine', 'performance', 'health', 'achievement') DEFAULT 'achievement',
  points INT DEFAULT 0,
  criteria TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 10 : USER_BADGES
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id),
  INDEX idx_user (user_id),
  INDEX idx_badge (badge_id),
  INDEX idx_earned_at (earned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DONNÉES INITIALES : CATEGORIES
-- =====================================================
INSERT INTO categories (name, description) VALUES
('Force', 'Exercices de musculation et renforcement'),
('Cardio', 'Exercices cardiovasculaires'),
('Flexibilité', 'Étirements et mobilité'),
('Équilibre', 'Exercices d\'équilibre et stabilité'),
('Récupération', 'Exercices de récupération active')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- DONNÉES INITIALES : BADGES
-- =====================================================
INSERT INTO badges (name, description, icon, category, points, criteria) VALUES
('Constance', '5 séances en 7 jours', '🔥', 'routine', 50, '5 completions in 7 days'),
('Progression', 'Augmenter les charges', '💪', 'performance', 75, 'Increase weights by 10%'),
('Sérénité', '10 séances de yoga/stretching', '🧘', 'health', 60, '10 yoga/stretching sessions'),
('Niveau Supérieur', 'Terminer un programme complet', '🚀', 'achievement', 100, 'Complete a full program'),
('Santé Cardiaque', '20 séances de cardio', '❤️', 'health', 80, '20 cardio sessions'),
('Routine Matinale', '10 séances avant 10h', '🌅', 'routine', 50, '10 sessions before 10am'),
('Routine du Soir', '10 séances après 18h', '🌙', 'routine', 50, '10 sessions after 6pm'),
('Objectif Atteint', 'Atteindre un objectif personnel', '🎯', 'achievement', 100, 'Reach personal goal'),
('Challenge Réussi', 'Compléter un challenge', '🏆', 'achievement', 150, 'Complete a challenge'),
('Esprit Fytli', '30 jours consécutifs', '💫', 'achievement', 200, '30 consecutive days')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- DONNÉES DE TEST : EXERCICES
-- =====================================================
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) VALUES
('Pompes', 'Exercice de base pour le haut du corps', 1, 'beginner', 'Aucun', 'Pectoraux, Triceps, Épaules'),
('Squats', 'Exercice de base pour les jambes', 1, 'beginner', 'Aucun', 'Quadriceps, Fessiers'),
('Planche', 'Exercice de gainage', 1, 'beginner', 'Aucun', 'Abdominaux, Core'),
('Burpees', 'Exercice complet cardio + force', 2, 'intermediate', 'Aucun', 'Corps entier'),
('Course à pied', 'Cardio classique', 2, 'beginner', 'Chaussures', 'Jambes, Cardio'),
('Étirements', 'Étirements complets', 3, 'beginner', 'Tapis', 'Corps entier'),
('Yoga', 'Séance de yoga', 3, 'beginner', 'Tapis', 'Corps entier'),
('Mountain Climbers', 'Cardio intense', 2, 'intermediate', 'Aucun', 'Core, Cardio'),
('Dips', 'Exercice pour triceps', 1, 'intermediate', 'Chaise/Banc', 'Triceps, Épaules'),
('Fentes', 'Exercice pour les jambes', 1, 'beginner', 'Aucun', 'Quadriceps, Fessiers')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Afficher le nombre de tables créées
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = DATABASE();

-- Afficher toutes les tables
SHOW TABLES;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- ✅ Base de données Fytli créée avec succès !
-- 
-- Tables créées :
-- 1. users (utilisateurs)
-- 2. categories (catégories d'exercices)
-- 3. exercises (bibliothèque d'exercices)
-- 4. programs (programmes d'entraînement)
-- 5. sessions (sessions d'un programme)
-- 6. session_exercises (exercices d'une session)
-- 7. enrollments (inscriptions aux programmes)
-- 8. session_completions (sessions complétées)
-- 9. badges (badges disponibles)
-- 10. user_badges (badges gagnés)
-- 
-- Données initiales :
-- ✅ 5 catégories
-- ✅ 10 badges
-- ✅ 10 exercices de test
-- =====================================================

