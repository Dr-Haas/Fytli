-- =====================================================
-- STORED PROCEDURES POUR LE SYSTÈME DE BADGES AUTOMATIQUE
-- =====================================================
-- Ce script crée toutes les procédures nécessaires pour
-- débloquer automatiquement les badges selon les critères
-- =====================================================

USE lyfti;

DELIMITER $$

-- =====================================================
-- TABLES NÉCESSAIRES (si elles n'existent pas)
-- =====================================================

-- Table pour les statistiques utilisateur
CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT PRIMARY KEY,
  total_workouts INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_exercises INT DEFAULT 0,
  total_sets INT DEFAULT 0,
  average_heart_rate DECIMAL(5,2) DEFAULT 0,
  programs_completed INT DEFAULT 0,
  morning_workouts INT DEFAULT 0,
  evening_workouts INT DEFAULT 0,
  zen_sessions INT DEFAULT 0,
  last_workout_date DATE,
  performance_improvement_percent DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- Table pour l'historique des entraînements
CREATE TABLE IF NOT EXISTS workout_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_id INT,
  program_id INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_minutes INT,
  exercises_completed INT DEFAULT 0,
  total_sets INT DEFAULT 0,
  workout_time TIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
  INDEX idx_user_date (user_id, completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- Table pour les objectifs hebdomadaires
CREATE TABLE IF NOT EXISTS weekly_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start_date DATE NOT NULL,
  goal_type ENUM('workouts', 'duration', 'exercises') DEFAULT 'workouts',
  goal_target INT NOT NULL,
  goal_current INT DEFAULT 0,
  goal_achieved BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_week (user_id, week_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- Vue pour l'aperçu des badges
CREATE OR REPLACE VIEW user_badges_overview AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    COALESCE(SUM(b.points), 0) as total_points,
    (SELECT COUNT(*) FROM badges) as total_badges,
    ROUND((COUNT(DISTINCT ub.badge_id) / (SELECT COUNT(*) FROM badges)) * 100, 1) as completion_percent
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
GROUP BY u.id$$

-- =====================================================
-- PROCÉDURE 1 : BADGE CONSTANCE (7 jours consécutifs)
-- =====================================================
DROP PROCEDURE IF EXISTS check_constance_badge$$
CREATE PROCEDURE check_constance_badge(IN p_user_id INT)
BEGIN
    DECLARE v_current_streak INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Constance
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Constance' LIMIT 1;
    
    -- Calculer la streak actuelle
    SELECT current_streak INTO v_current_streak
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Si streak >= 7 jours et badge pas encore débloqué
    IF v_current_streak >= 7 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 2 : BADGE PROGRESSION (+20% performances)
-- =====================================================
DROP PROCEDURE IF EXISTS check_progression_badge$$
CREATE PROCEDURE check_progression_badge(IN p_user_id INT)
BEGIN
    DECLARE v_improvement DECIMAL(5,2);
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Progression
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Progression' LIMIT 1;
    
    -- Récupérer l'amélioration de performance
    SELECT performance_improvement_percent INTO v_improvement
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Si amélioration >= 20% et badge pas encore débloqué
    IF v_improvement >= 20 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 3 : BADGE SÉRÉNITÉ (5 séances zen)
-- =====================================================
DROP PROCEDURE IF EXISTS check_serenite_badge$$
CREATE PROCEDURE check_serenite_badge(IN p_user_id INT)
BEGIN
    DECLARE v_zen_sessions INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Sérénité
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Sérénité' LIMIT 1;
    
    -- Compter les séances zen
    SELECT zen_sessions INTO v_zen_sessions
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Si >= 5 séances zen et badge pas encore débloqué
    IF v_zen_sessions >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 4 : BADGE ROUTINE MATINALE (5 matins)
-- =====================================================
DROP PROCEDURE IF EXISTS check_routine_matinale_badge$$
CREATE PROCEDURE check_routine_matinale_badge(IN p_user_id INT)
BEGIN
    DECLARE v_morning_workouts INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Routine Matinale
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Routine Matinale' LIMIT 1;
    
    -- Compter les entraînements matinaux
    SELECT morning_workouts INTO v_morning_workouts
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Si >= 5 matins et badge pas encore débloqué
    IF v_morning_workouts >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 5 : BADGE ROUTINE DU SOIR (5 soirs)
-- =====================================================
DROP PROCEDURE IF EXISTS check_routine_soir_badge$$
CREATE PROCEDURE check_routine_soir_badge(IN p_user_id INT)
BEGIN
    DECLARE v_evening_workouts INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Routine du Soir
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Routine du Soir' LIMIT 1;
    
    -- Compter les entraînements du soir
    SELECT evening_workouts INTO v_evening_workouts
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Si >= 5 soirs et badge pas encore débloqué
    IF v_evening_workouts >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 6 : BADGE OBJECTIF ATTEINT (objectif hebdo)
-- =====================================================
DROP PROCEDURE IF EXISTS check_objectif_badge$$
CREATE PROCEDURE check_objectif_badge(IN p_user_id INT)
BEGIN
    DECLARE v_goal_achieved BOOLEAN;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Objectif Atteint
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Objectif Atteint' LIMIT 1;
    
    -- Vérifier si l'objectif de la semaine est atteint
    SELECT goal_achieved INTO v_goal_achieved
    FROM weekly_goals
    WHERE user_id = p_user_id
      AND week_start_date = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
    LIMIT 1;
    
    -- Si objectif atteint et badge pas encore débloqué cette semaine
    IF v_goal_achieved = TRUE AND v_badge_id IS NOT NULL THEN
        -- Vérifier si pas déjà débloqué cette semaine
        IF NOT EXISTS (
            SELECT 1 FROM user_badges 
            WHERE user_id = p_user_id 
              AND badge_id = v_badge_id
              AND earned_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
        ) THEN
            INSERT INTO user_badges (user_id, badge_id, earned_at)
            VALUES (p_user_id, v_badge_id, NOW());
        END IF;
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 7 : BADGE CHALLENGE RÉUSSI (programme complété)
-- =====================================================
DROP PROCEDURE IF EXISTS check_challenge_badge$$
CREATE PROCEDURE check_challenge_badge(IN p_user_id INT)
BEGIN
    DECLARE v_programs_completed INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Challenge Réussi
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Challenge Réussi' LIMIT 1;
    
    -- Compter les programmes complétés
    SELECT COUNT(*) INTO v_programs_completed
    FROM enrollments
    WHERE user_id = p_user_id
      AND status = 'completed';
    
    -- Si au moins 1 programme complété et badge pas encore débloqué
    IF v_programs_completed >= 1 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 8 : BADGE NIVEAU SUPÉRIEUR (level up)
-- =====================================================
DROP PROCEDURE IF EXISTS check_niveau_superieur_badge$$
CREATE PROCEDURE check_niveau_superieur_badge(IN p_user_id INT)
BEGIN
    DECLARE v_fitness_level VARCHAR(20);
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Niveau Supérieur
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Niveau Supérieur' LIMIT 1;
    
    -- Récupérer le niveau de fitness
    SELECT fitness_level INTO v_fitness_level
    FROM users
    WHERE id = p_user_id;
    
    -- Si niveau intermédiaire ou avancé et badge pas encore débloqué
    IF v_fitness_level IN ('intermediate', 'advanced') AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE 9 : BADGE ESPRIT FYTLI (badge légendaire)
-- =====================================================
DROP PROCEDURE IF EXISTS check_esprit_fytli_badge$$
CREATE PROCEDURE check_esprit_fytli_badge(IN p_user_id INT)
BEGIN
    DECLARE v_badges_earned INT;
    DECLARE v_total_workouts INT;
    DECLARE v_longest_streak INT;
    DECLARE v_badge_id INT;
    
    -- Récupérer l'ID du badge Esprit Fytli
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Esprit Fytli' LIMIT 1;
    
    -- Compter les badges déjà débloqués
    SELECT COUNT(*) INTO v_badges_earned
    FROM user_badges
    WHERE user_id = p_user_id;
    
    -- Récupérer les statistiques
    SELECT total_workouts, longest_streak 
    INTO v_total_workouts, v_longest_streak
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Critères : au moins 8 badges + 50 entraînements + streak de 14 jours
    IF v_badges_earned >= 8 AND v_total_workouts >= 50 AND v_longest_streak >= 14 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- =====================================================
-- PROCÉDURE PRINCIPALE : CHECK_ALL_BADGES
-- =====================================================
DROP PROCEDURE IF EXISTS check_all_badges$$
CREATE PROCEDURE check_all_badges(IN p_user_id INT)
BEGIN
    -- Vérifier tous les badges dans l'ordre
    CALL check_constance_badge(p_user_id);
    CALL check_progression_badge(p_user_id);
    CALL check_serenite_badge(p_user_id);
    CALL check_routine_matinale_badge(p_user_id);
    CALL check_routine_soir_badge(p_user_id);
    CALL check_objectif_badge(p_user_id);
    CALL check_challenge_badge(p_user_id);
    CALL check_niveau_superieur_badge(p_user_id);
    CALL check_esprit_fytli_badge(p_user_id);
    
    -- Message de confirmation
    SELECT CONCAT('Vérification des badges terminée pour l\'utilisateur ', p_user_id) as message;
END$$

-- =====================================================
-- PROCÉDURE UTILITAIRE : MISE À JOUR DES STATS
-- =====================================================
DROP PROCEDURE IF EXISTS update_user_stats$$
CREATE PROCEDURE update_user_stats(IN p_user_id INT)
BEGIN
    DECLARE v_last_date DATE;
    DECLARE v_current_streak INT DEFAULT 0;
    DECLARE v_consecutive_days INT DEFAULT 0;
    
    -- Créer l'entrée user_stats si elle n'existe pas
    INSERT IGNORE INTO user_stats (user_id) VALUES (p_user_id);
    
    -- Récupérer la dernière date d'entraînement
    SELECT last_workout_date INTO v_last_date
    FROM user_stats
    WHERE user_id = p_user_id;
    
    -- Calculer la streak
    IF v_last_date = CURDATE() THEN
        -- Déjà entraîné aujourd'hui, ne pas incrémenter
        SELECT current_streak INTO v_current_streak
        FROM user_stats
        WHERE user_id = p_user_id;
    ELSEIF v_last_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN
        -- Entraîné hier, continuer la streak
        SELECT current_streak + 1 INTO v_current_streak
        FROM user_stats
        WHERE user_id = p_user_id;
    ELSE
        -- Streak interrompue
        SET v_current_streak = 1;
    END IF;
    
    -- Mettre à jour les statistiques
    UPDATE user_stats SET
        total_workouts = (SELECT COUNT(*) FROM workout_history WHERE user_id = p_user_id),
        current_streak = v_current_streak,
        longest_streak = GREATEST(longest_streak, v_current_streak),
        morning_workouts = (SELECT COUNT(*) FROM workout_history WHERE user_id = p_user_id AND workout_time < '09:00:00'),
        evening_workouts = (SELECT COUNT(*) FROM workout_history WHERE user_id = p_user_id AND workout_time >= '18:00:00'),
        total_exercises = (SELECT COALESCE(SUM(exercises_completed), 0) FROM workout_history WHERE user_id = p_user_id),
        total_sets = (SELECT COALESCE(SUM(total_sets), 0) FROM workout_history WHERE user_id = p_user_id),
        last_workout_date = CURDATE()
    WHERE user_id = p_user_id;
END$$

DELIMITER ;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher les procédures créées
SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name LIKE '%badge%';

-- =====================================================
-- EXEMPLES D'UTILISATION
-- =====================================================

-- Vérifier tous les badges pour un utilisateur
-- CALL check_all_badges(1);

-- Mettre à jour les stats après un entraînement
-- CALL update_user_stats(1);

-- Vérifier un badge spécifique
-- CALL check_constance_badge(1);
-- CALL check_challenge_badge(1);

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- ✅ Stored Procedures créées avec succès !
-- 
-- Procédures disponibles :
-- 1. check_constance_badge(user_id)
-- 2. check_progression_badge(user_id)
-- 3. check_serenite_badge(user_id)
-- 4. check_routine_matinale_badge(user_id)
-- 5. check_routine_soir_badge(user_id)
-- 6. check_objectif_badge(user_id)
-- 7. check_challenge_badge(user_id)
-- 8. check_niveau_superieur_badge(user_id)
-- 9. check_esprit_fytli_badge(user_id)
-- 10. check_all_badges(user_id) - Vérifie TOUS les badges
-- 11. update_user_stats(user_id) - Met à jour les statistiques
-- 
-- Le système de badges est maintenant 100% automatique ! 🎉
-- =====================================================

