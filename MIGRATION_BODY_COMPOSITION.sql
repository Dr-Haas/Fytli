-- =====================================================
-- MIGRATION : SUIVI DE COMPOSITION CORPORELLE
-- =====================================================
-- Ajoute le suivi du poids, taille, masse grasse/maigre, IMC
-- avec statistiques et badges associés
-- Date : 19 Octobre 2025
-- =====================================================

-- =====================================================
-- TABLE 1 : BODY_MEASUREMENTS (Mesures corporelles)
-- =====================================================
CREATE TABLE IF NOT EXISTS body_measurements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  
  -- Données de base
  weight_kg DECIMAL(5, 2) NOT NULL COMMENT 'Poids en kilogrammes',
  height_cm DECIMAL(5, 2) NOT NULL COMMENT 'Taille en centimètres',
  
  -- Composition corporelle
  body_fat_percent DECIMAL(4, 2) NULL COMMENT 'Pourcentage de masse grasse',
  lean_mass_percent DECIMAL(4, 2) NULL COMMENT 'Pourcentage de masse maigre',
  muscle_mass_kg DECIMAL(5, 2) NULL COMMENT 'Masse musculaire en kg',
  
  -- Métriques calculées
  bmi DECIMAL(4, 2) GENERATED ALWAYS AS (weight_kg / POWER(height_cm / 100, 2)) STORED COMMENT 'IMC calculé automatiquement',
  
  -- Mesures complémentaires
  waist_cm DECIMAL(5, 2) NULL COMMENT 'Tour de taille en cm',
  chest_cm DECIMAL(5, 2) NULL COMMENT 'Tour de poitrine en cm',
  hips_cm DECIMAL(5, 2) NULL COMMENT 'Tour de hanches en cm',
  arms_cm DECIMAL(5, 2) NULL COMMENT 'Tour de bras en cm',
  thighs_cm DECIMAL(5, 2) NULL COMMENT 'Tour de cuisses en cm',
  
  -- Notes et contexte
  notes TEXT NULL COMMENT 'Notes de l\'utilisateur',
  measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de la mesure',
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, measurement_date),
  INDEX idx_measurement_date (measurement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2 : BODY_GOALS (Objectifs corporels)
-- =====================================================
CREATE TABLE IF NOT EXISTS body_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  
  -- Type d'objectif
  goal_type ENUM(
    'weight_loss',        -- Perte de poids
    'weight_gain',        -- Prise de poids
    'muscle_gain',        -- Prise de masse musculaire
    'fat_loss',           -- Perte de masse grasse
    'body_recomposition', -- Recomposition corporelle
    'maintenance'         -- Maintien
  ) NOT NULL,
  
  -- Objectifs chiffrés
  target_weight_kg DECIMAL(5, 2) NULL,
  target_body_fat_percent DECIMAL(4, 2) NULL,
  target_muscle_mass_kg DECIMAL(5, 2) NULL,
  
  -- Dates
  start_date DATE NOT NULL,
  target_date DATE NOT NULL,
  completed_date DATE NULL,
  
  -- Status
  status ENUM('active', 'completed', 'abandoned', 'paused') DEFAULT 'active',
  
  -- Description
  description TEXT NULL,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_target_date (target_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3 : BODY_PROGRESS_PHOTOS (Photos de progression)
-- =====================================================
CREATE TABLE IF NOT EXISTS body_progress_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  measurement_id INT NULL COMMENT 'Lien vers une mesure spécifique',
  
  photo_url VARCHAR(500) NOT NULL,
  photo_type ENUM('front', 'side', 'back', 'other') DEFAULT 'front',
  
  notes TEXT NULL,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (measurement_id) REFERENCES body_measurements(id) ON DELETE SET NULL,
  INDEX idx_user_date (user_id, taken_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOUVEAUX BADGES : COMPOSITION CORPORELLE
-- =====================================================
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
-- Badges de suivi régulier
('Tracker Assidu', 'Enregistre tes mesures corporelles pendant 4 semaines consécutives', '📊', '#4F46E5', 'from-indigo-600 to-indigo-400', 'health', 75, '4 semaines de suivi'),
('Mesure Parfaite', 'Enregistre 12 mesures corporelles', '📏', '#8B5CF6', 'from-purple-600 to-purple-400', 'health', 50, '12 mesures enregistrées'),

-- Badges de perte de poids
('Première Victoire', 'Perds ton premier kilo', '🎯', '#10B981', 'from-green-600 to-emerald-400', 'achievement', 60, '-1 kg'),
('Transformation Débutante', 'Perds 5 kg', '🌟', '#10B981', 'from-green-600 to-emerald-500', 'achievement', 100, '-5 kg'),
('Grande Transformation', 'Perds 10 kg', '💫', '#059669', 'from-emerald-700 to-green-500', 'achievement', 150, '-10 kg'),
('Transformation Héroïque', 'Perds 15 kg ou plus', '👑', '#047857', 'from-emerald-800 to-green-600', 'achievement', 250, '-15 kg'),

-- Badges de prise de masse
('Muscle en Croissance', 'Gagne 2 kg de masse musculaire', '💪', '#EF4444', 'from-red-600 to-orange-400', 'performance', 100, '+2 kg muscle'),
('Constructeur', 'Gagne 5 kg de masse musculaire', '🏗️', '#DC2626', 'from-red-700 to-orange-500', 'performance', 150, '+5 kg muscle'),

-- Badges de composition corporelle
('Sculpteur', 'Réduis ta masse grasse de 5%', '🎨', '#F59E0B', 'from-amber-600 to-yellow-400', 'performance', 120, '-5% masse grasse'),
('Maître de la Composition', 'Réduis ta masse grasse de 10%', '🏆', '#D97706', 'from-amber-700 to-yellow-500', 'performance', 200, '-10% masse grasse'),
('Corps Équilibré', 'Atteins un IMC dans la zone santé (18.5-24.9)', '⚖️', '#06B6D4', 'from-cyan-600 to-blue-400', 'health', 100, 'IMC santé'),

-- Badges de maintien
('Stabilité', 'Maintiens ton poids cible pendant 4 semaines', '🎚️', '#8B5CF6', 'from-purple-600 to-pink-400', 'health', 80, '4 semaines stable'),
('Longue Durée', 'Maintiens ton objectif pendant 12 semaines', '⏰', '#7C3AED', 'from-purple-700 to-pink-500', 'achievement', 150, '12 semaines stable'),

-- Badge légendaire
('Phoenix', 'Accomplis une transformation corporelle complète et durable', '🔥', '#FF4D3A', 'from-fytli-red via-fytli-orange to-yellow-400', 'achievement', 300, 'Transformation totale')

ON DUPLICATE KEY UPDATE 
  description = VALUES(description),
  icon = VALUES(icon),
  color = VALUES(color),
  gradient = VALUES(gradient),
  criteria = VALUES(criteria),
  points = VALUES(points);

-- =====================================================
-- VUE : BODY_STATS (Statistiques corporelles)
-- =====================================================
CREATE OR REPLACE VIEW body_stats AS
SELECT 
  user_id,
  
  -- Mesure la plus récente
  (SELECT weight_kg FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) as current_weight,
  
  (SELECT height_cm FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) as current_height,
  
  (SELECT body_fat_percent FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) as current_body_fat,
  
  (SELECT bmi FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) as current_bmi,
  
  -- Première mesure
  (SELECT weight_kg FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date ASC LIMIT 1) as starting_weight,
  
  (SELECT body_fat_percent FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date ASC LIMIT 1) as starting_body_fat,
  
  -- Progression
  (SELECT weight_kg FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) - 
  (SELECT weight_kg FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date ASC LIMIT 1) as total_weight_change,
  
  (SELECT body_fat_percent FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date DESC LIMIT 1) - 
  (SELECT body_fat_percent FROM body_measurements bm2 
   WHERE bm2.user_id = bm.user_id 
   ORDER BY measurement_date ASC LIMIT 1) as total_body_fat_change,
  
  -- Nombre de mesures
  COUNT(*) as total_measurements,
  
  -- Dates
  MIN(measurement_date) as first_measurement_date,
  MAX(measurement_date) as last_measurement_date,
  
  -- Nombre de jours de suivi
  DATEDIFF(MAX(measurement_date), MIN(measurement_date)) as tracking_days

FROM body_measurements bm
GROUP BY user_id;

-- =====================================================
-- VUE : GOAL_PROGRESS (Progression des objectifs)
-- =====================================================
CREATE OR REPLACE VIEW goal_progress AS
SELECT 
  bg.id as goal_id,
  bg.user_id,
  bg.goal_type,
  bg.status,
  bg.start_date,
  bg.target_date,
  
  -- Valeurs de départ
  (SELECT weight_kg FROM body_measurements bm 
   WHERE bm.user_id = bg.user_id 
   AND DATE(bm.measurement_date) <= bg.start_date
   ORDER BY bm.measurement_date DESC LIMIT 1) as start_weight,
  
  (SELECT body_fat_percent FROM body_measurements bm 
   WHERE bm.user_id = bg.user_id 
   AND DATE(bm.measurement_date) <= bg.start_date
   ORDER BY bm.measurement_date DESC LIMIT 1) as start_body_fat,
  
  -- Valeurs actuelles
  (SELECT weight_kg FROM body_measurements bm 
   WHERE bm.user_id = bg.user_id 
   ORDER BY bm.measurement_date DESC LIMIT 1) as current_weight,
  
  (SELECT body_fat_percent FROM body_measurements bm 
   WHERE bm.user_id = bg.user_id 
   ORDER BY bm.measurement_date DESC LIMIT 1) as current_body_fat,
  
  -- Objectifs
  bg.target_weight_kg,
  bg.target_body_fat_percent,
  bg.target_muscle_mass_kg,
  
  -- Progression en %
  CASE 
    WHEN bg.target_weight_kg IS NOT NULL THEN
      ROUND((ABS((SELECT weight_kg FROM body_measurements bm 
                  WHERE bm.user_id = bg.user_id 
                  ORDER BY bm.measurement_date DESC LIMIT 1) - 
                 (SELECT weight_kg FROM body_measurements bm 
                  WHERE bm.user_id = bg.user_id 
                  AND DATE(bm.measurement_date) <= bg.start_date
                  ORDER BY bm.measurement_date DESC LIMIT 1)) / 
            ABS(bg.target_weight_kg - 
                (SELECT weight_kg FROM body_measurements bm 
                 WHERE bm.user_id = bg.user_id 
                 AND DATE(bm.measurement_date) <= bg.start_date
                 ORDER BY bm.measurement_date DESC LIMIT 1))) * 100, 1)
    ELSE NULL
  END as progress_percent,
  
  -- Jours restants
  DATEDIFF(bg.target_date, CURDATE()) as days_remaining,
  
  -- Jours écoulés
  DATEDIFF(CURDATE(), bg.start_date) as days_elapsed

FROM body_goals bg;

-- =====================================================
-- STORED PROCEDURES : VÉRIFICATION DES BADGES
-- =====================================================

-- Badge "Tracker Assidu" : 4 semaines de suivi
DELIMITER //
DROP PROCEDURE IF EXISTS check_tracker_assidu_badge//
CREATE PROCEDURE check_tracker_assidu_badge(IN p_user_id INT)
BEGIN
  DECLARE v_badge_id INT;
  DECLARE v_weeks_tracked INT;
  
  -- ID du badge
  SELECT id INTO v_badge_id FROM badges WHERE name = 'Tracker Assidu' LIMIT 1;
  
  -- Vérifier si l'utilisateur a déjà ce badge
  IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge_id) THEN
    
    -- Compter les semaines avec au moins une mesure
    SELECT COUNT(DISTINCT YEARWEEK(measurement_date)) INTO v_weeks_tracked
    FROM body_measurements
    WHERE user_id = p_user_id
    AND measurement_date >= DATE_SUB(NOW(), INTERVAL 4 WEEK);
    
    -- Débloquer si 4 semaines ou plus
    IF v_weeks_tracked >= 4 THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge_id);
    END IF;
  END IF;
END//

-- Badge "Première Victoire" : -1 kg
DROP PROCEDURE IF EXISTS check_weight_loss_badges//
CREATE PROCEDURE check_weight_loss_badges(IN p_user_id INT)
BEGIN
  DECLARE v_weight_change DECIMAL(5,2);
  
  -- Calculer la différence de poids
  SELECT 
    (SELECT weight_kg FROM body_measurements 
     WHERE user_id = p_user_id 
     ORDER BY measurement_date DESC LIMIT 1) -
    (SELECT weight_kg FROM body_measurements 
     WHERE user_id = p_user_id 
     ORDER BY measurement_date ASC LIMIT 1)
  INTO v_weight_change;
  
  -- Première Victoire : -1 kg
  IF v_weight_change <= -1 THEN
    INSERT IGNORE INTO user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM badges WHERE name = 'Première Victoire';
  END IF;
  
  -- Transformation Débutante : -5 kg
  IF v_weight_change <= -5 THEN
    INSERT IGNORE INTO user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM badges WHERE name = 'Transformation Débutante';
  END IF;
  
  -- Grande Transformation : -10 kg
  IF v_weight_change <= -10 THEN
    INSERT IGNORE INTO user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM badges WHERE name = 'Grande Transformation';
  END IF;
  
  -- Transformation Héroïque : -15 kg
  IF v_weight_change <= -15 THEN
    INSERT IGNORE INTO user_badges (user_id, badge_id)
    SELECT p_user_id, id FROM badges WHERE name = 'Transformation Héroïque';
  END IF;
END//

-- Badge "Corps Équilibré" : IMC dans zone santé
DROP PROCEDURE IF EXISTS check_bmi_badge//
CREATE PROCEDURE check_bmi_badge(IN p_user_id INT)
BEGIN
  DECLARE v_badge_id INT;
  DECLARE v_current_bmi DECIMAL(4,2);
  
  SELECT id INTO v_badge_id FROM badges WHERE name = 'Corps Équilibré' LIMIT 1;
  
  IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge_id) THEN
    SELECT bmi INTO v_current_bmi
    FROM body_measurements
    WHERE user_id = p_user_id
    ORDER BY measurement_date DESC LIMIT 1;
    
    IF v_current_bmi >= 18.5 AND v_current_bmi <= 24.9 THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge_id);
    END IF;
  END IF;
END//

-- Procédure principale pour vérifier tous les badges corporels
DROP PROCEDURE IF EXISTS check_body_badges//
CREATE PROCEDURE check_body_badges(IN p_user_id INT)
BEGIN
  CALL check_tracker_assidu_badge(p_user_id);
  CALL check_weight_loss_badges(p_user_id);
  CALL check_bmi_badge(p_user_id);
END//

DELIMITER ;

-- =====================================================
-- TRIGGER : Vérification automatique des badges
-- =====================================================
DELIMITER //

DROP TRIGGER IF EXISTS after_body_measurement_insert//
CREATE TRIGGER after_body_measurement_insert
AFTER INSERT ON body_measurements
FOR EACH ROW
BEGIN
  -- Vérifier les badges automatiquement après chaque mesure
  CALL check_body_badges(NEW.user_id);
END//

DELIMITER ;

-- =====================================================
-- INDICES DE PERFORMANCE
-- =====================================================
CREATE INDEX idx_body_measurements_user_weight ON body_measurements(user_id, weight_kg);
CREATE INDEX idx_body_measurements_user_fat ON body_measurements(user_id, body_fat_percent);
CREATE INDEX idx_body_goals_user_active ON body_goals(user_id, status) WHERE status = 'active';

-- =====================================================
-- DONNÉES DE TEST (optionnel, décommenter si besoin)
-- =====================================================
/*
-- Exemple de mesures pour l'utilisateur 1
INSERT INTO body_measurements (user_id, weight_kg, height_cm, body_fat_percent, lean_mass_percent, measurement_date)
VALUES 
  (1, 85.5, 175, 22.5, 77.5, DATE_SUB(NOW(), INTERVAL 12 WEEK)),
  (1, 84.2, 175, 21.8, 78.2, DATE_SUB(NOW(), INTERVAL 8 WEEK)),
  (1, 82.8, 175, 20.5, 79.5, DATE_SUB(NOW(), INTERVAL 4 WEEK)),
  (1, 81.5, 175, 19.8, 80.2, NOW());

-- Exemple d'objectif
INSERT INTO body_goals (user_id, goal_type, target_weight_kg, target_body_fat_percent, start_date, target_date, description)
VALUES 
  (1, 'fat_loss', 78.0, 15.0, DATE_SUB(NOW(), INTERVAL 12 WEEK), DATE_ADD(NOW(), INTERVAL 12 WEEK), 'Objectif de recomposition corporelle');
*/

-- =====================================================
-- VÉRIFICATION
-- =====================================================
SELECT '✅ Migration de composition corporelle terminée !' as status;
SELECT COUNT(*) as nouvelles_tables FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name IN ('body_measurements', 'body_goals', 'body_progress_photos');

SELECT COUNT(*) as nouveaux_badges FROM badges 
WHERE name IN ('Tracker Assidu', 'Mesure Parfaite', 'Première Victoire', 'Transformation Débutante', 
               'Grande Transformation', 'Transformation Héroïque', 'Muscle en Croissance', 
               'Constructeur', 'Sculpteur', 'Maître de la Composition', 'Corps Équilibré', 
               'Stabilité', 'Longue Durée', 'Phoenix');

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

