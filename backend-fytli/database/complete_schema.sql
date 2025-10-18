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
  color VARCHAR(20),
  gradient VARCHAR(100),
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
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
('Constance', 'Enchaîne 7 jours d\'entraînement sans interruption', '🔥', '#FF4D3A', 'from-fytli-red to-fytli-orange', 'routine', 50, '7 jours consécutifs'),
('Progression', 'Améliore tes performances de 20%', '💪', '#FF8A3D', 'from-fytli-orange to-amber-500', 'performance', 75, '+20% de performances'),
('Sérénité', 'Complète 5 séances de stretching ou yoga', '🧘', '#FBFAF7', 'from-fytli-cream to-fytli-orange', 'health', 60, '5 séances zen'),
('Niveau Supérieur', 'Passe du niveau débutant à intermédiaire', '🚀', '#FF6B3D', 'from-fytli-red via-fytli-orange to-amber-400', 'achievement', 100, 'Level up'),
('Santé Cardiaque', 'Maintiens ton pouls dans la zone optimale pendant 30 min', '❤️', '#FF4D3A', 'from-red-500 to-fytli-red', 'health', 80, '30 min zone optimale'),
('Routine Matinale', 'Entraîne-toi avant 9h pendant 5 jours', '🌅', '#FFB84D', 'from-amber-400 to-fytli-orange', 'routine', 50, '5 matins actifs'),
('Routine du Soir', 'Entraîne-toi après 18h pendant 5 jours', '🌙', '#8B7355', 'from-amber-600 to-fytli-orange', 'routine', 50, '5 soirs actifs'),
('Objectif Atteint', 'Atteins ton objectif de la semaine', '🎯', '#2BB673', 'from-fytli-success to-green-600', 'achievement', 100, 'Objectif hebdo'),
('Challenge Réussi', 'Complète un programme d\'entraînement du début à la fin', '🏆', '#FFD700', 'from-yellow-400 to-amber-600', 'achievement', 150, 'Programme complété'),
('Esprit Fytli', 'Incarne la philosophie Fytli : régularité, bienveillance, progression', '💫', '#FF6B3D', 'from-fytli-red via-fytli-orange to-amber-400', 'achievement', 200, 'Badge légendaire')
ON DUPLICATE KEY UPDATE 
  description = VALUES(description),
  icon = VALUES(icon),
  color = VALUES(color),
  gradient = VALUES(gradient),
  criteria = VALUES(criteria),
  points = VALUES(points);

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

