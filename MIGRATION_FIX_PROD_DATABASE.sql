-- =====================================================
-- MIGRATION COMPLÈTE POUR CORRIGER LA BASE DE PRODUCTION
-- =====================================================
-- Date: 18 Octobre 2025
-- À exécuter sur la base de données OVH via phpMyAdmin

-- =====================================================
-- 1. MODIFICATION DE LA TABLE BADGES
-- =====================================================
-- Ajouter les colonnes manquantes à la table badges

ALTER TABLE badges 
ADD COLUMN IF NOT EXISTS badge_id VARCHAR(50) UNIQUE AFTER id,
ADD COLUMN IF NOT EXISTS gradient VARCHAR(100) AFTER color,
ADD COLUMN IF NOT EXISTS requirement VARCHAR(255) AFTER gradient,
ADD COLUMN IF NOT EXISTS is_secret BOOLEAN DEFAULT FALSE AFTER points;

-- Remplir badge_id avec des valeurs uniques basées sur le nom (pour les badges existants)
UPDATE badges SET badge_id = 'constance' WHERE name = 'Constance' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'progression' WHERE name = 'Progression' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'serenite' WHERE name = 'Sérénité' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'niveau_superieur' WHERE name = 'Niveau Supérieur' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'sante_cardiaque' WHERE name = 'Santé Cardiaque' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'routine_matinale' WHERE name = 'Routine Matinale' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'routine_soir' WHERE name = 'Routine du Soir' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'objectif_atteint' WHERE name = 'Objectif Atteint' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'challenge_reussi' WHERE name = 'Challenge Réussi' AND badge_id IS NULL;
UPDATE badges SET badge_id = 'esprit_fytli' WHERE name = 'Esprit Fytli' AND badge_id IS NULL;

-- Ajouter les gradients
UPDATE badges SET gradient = 'from-fytli-red to-fytli-orange' WHERE badge_id = 'constance';
UPDATE badges SET gradient = 'from-fytli-orange to-amber-500' WHERE badge_id = 'progression';
UPDATE badges SET gradient = 'from-fytli-cream to-fytli-orange' WHERE badge_id = 'serenite';
UPDATE badges SET gradient = 'from-fytli-red via-fytli-orange to-amber-400' WHERE badge_id = 'niveau_superieur';
UPDATE badges SET gradient = 'from-red-500 to-fytli-red' WHERE badge_id = 'sante_cardiaque';
UPDATE badges SET gradient = 'from-amber-400 to-fytli-orange' WHERE badge_id = 'routine_matinale';
UPDATE badges SET gradient = 'from-amber-600 to-fytli-orange' WHERE badge_id = 'routine_soir';
UPDATE badges SET gradient = 'from-fytli-success to-green-600' WHERE badge_id = 'objectif_atteint';
UPDATE badges SET gradient = 'from-yellow-400 to-amber-600' WHERE badge_id = 'challenge_reussi';
UPDATE badges SET gradient = 'from-fytli-red via-fytli-orange to-amber-400' WHERE badge_id = 'esprit_fytli';

-- Ajouter les requirements
UPDATE badges SET requirement = '7 jours consécutifs' WHERE badge_id = 'constance';
UPDATE badges SET requirement = '+20% de performances' WHERE badge_id = 'progression';
UPDATE badges SET requirement = '5 séances zen' WHERE badge_id = 'serenite';
UPDATE badges SET requirement = 'Level up' WHERE badge_id = 'niveau_superieur';
UPDATE badges SET requirement = '30 min zone optimale' WHERE badge_id = 'sante_cardiaque';
UPDATE badges SET requirement = '5 matins actifs' WHERE badge_id = 'routine_matinale';
UPDATE badges SET requirement = '5 soirs actifs' WHERE badge_id = 'routine_soir';
UPDATE badges SET requirement = 'Objectif hebdo' WHERE badge_id = 'objectif_atteint';
UPDATE badges SET requirement = 'Programme complété' WHERE badge_id = 'challenge_reussi';
UPDATE badges SET requirement = 'Badge légendaire' WHERE badge_id = 'esprit_fytli';

-- =====================================================
-- 2. CRÉATION DE LA TABLE BADGE_PROGRESS
-- =====================================================
CREATE TABLE IF NOT EXISTS badge_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id VARCHAR(50) NOT NULL,
  progress_percent INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge_progress (user_id, badge_id),
  INDEX idx_user (user_id),
  INDEX idx_badge (badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. AJOUT DE L'EXERCICE "MARCHE EN PENTE"
-- =====================================================
INSERT INTO exercises (
  name, 
  description, 
  category_id, 
  difficulty_level, 
  equipment, 
  muscle_groups,
  created_at,
  updated_at
) VALUES (
  'Marche en pente',
  'Marche sur tapis avec inclinaison pour renforcer les jambes et améliorer l''endurance cardiovasculaire',
  1,  -- Cardio
  'beginner',
  'Tapis de course',
  'Jambes, Fessiers, Cardio',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE name = name;

-- =====================================================
-- 4. RENOMMAGE DES COLONNES ORDER EN ORDER_INDEX
-- =====================================================
-- Ces colonnes utilisaient le mot-clé réservé SQL `order` ce qui cause des problèmes

-- 4.1. Table SESSIONS - Renommer order en order_index
-- Vérifier d'abord si la colonne order_index n'existe pas déjà
SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'sessions' 
                   AND column_name = 'order_index');

-- Si order_index n'existe pas, renommer order en order_index
SET @alter_sessions = IF(@col_exists = 0, 
  'ALTER TABLE sessions CHANGE COLUMN `order` order_index INT DEFAULT 0;',
  'SELECT "La colonne order_index existe déjà dans sessions";'
);
PREPARE stmt FROM @alter_sessions;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4.2. Table SESSION_EXERCISES - Renommer order en order_index  
-- Vérifier d'abord si la colonne order_index n'existe pas déjà
SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                   WHERE table_schema = DATABASE() 
                   AND table_name = 'session_exercises' 
                   AND column_name = 'order_index');

-- Si order_index n'existe pas, renommer order en order_index
SET @alter_session_exercises = IF(@col_exists = 0,
  'ALTER TABLE session_exercises CHANGE COLUMN `order` order_index INT DEFAULT 0;',
  'SELECT "La colonne order_index existe déjà dans session_exercises";'
);
PREPARE stmt FROM @alter_session_exercises;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 5. VÉRIFICATIONS
-- =====================================================
-- Vérifier la structure des badges
SELECT 'Structure badges:' as Info;
DESCRIBE badges;

-- Vérifier que badge_progress existe
SELECT 'Structure badge_progress:' as Info;
DESCRIBE badge_progress;

-- Vérifier la structure des sessions (order_index)
SELECT 'Structure sessions:' as Info;
DESCRIBE sessions;

-- Vérifier la structure des session_exercises (order_index)
SELECT 'Structure session_exercises:' as Info;
DESCRIBE session_exercises;

-- Vérifier les badges
SELECT 'Badges existants:' as Info;
SELECT id, badge_id, name, gradient FROM badges;

-- Vérifier l'exercice Marche en pente
SELECT 'Exercice Marche en pente:' as Info;
SELECT * FROM exercises WHERE name = 'Marche en pente';

