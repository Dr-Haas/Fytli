-- =====================================================
-- INSTALLATION / VÉRIFICATION DES STORED PROCEDURES POUR LES BADGES
-- Date : 19 Octobre 2025
-- =====================================================
-- Ce script vérifie et installe les procédures SQL nécessaires
-- pour le système automatique de badges
-- =====================================================

USE lyfti;

-- =====================================================
-- ÉTAPE 1 : VÉRIFIER LES PROCÉDURES EXISTANTES
-- =====================================================

SELECT '=== VÉRIFICATION DES PROCÉDURES EXISTANTES ===' as info;

-- Lister toutes les procédures liées aux badges
SELECT 
    ROUTINE_NAME as procedure_name,
    CREATED as created_at,
    LAST_ALTERED as last_modified
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND (ROUTINE_NAME LIKE '%badge%' OR ROUTINE_NAME LIKE '%user_stats%')
ORDER BY ROUTINE_NAME;

-- =====================================================
-- ÉTAPE 2 : CRÉER/RECRÉER LES PROCÉDURES
-- =====================================================

SELECT '=== CRÉATION DES PROCÉDURES ===' as info;

DELIMITER $$

-- Procédure pour mettre à jour les statistiques utilisateur
DROP PROCEDURE IF EXISTS update_user_stats$$
CREATE PROCEDURE update_user_stats(IN p_user_id INT)
BEGIN
    DECLARE v_last_date DATE;
    DECLARE v_current_streak INT DEFAULT 0;
    
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
        programs_completed = (SELECT COUNT(*) FROM enrollments WHERE user_id = p_user_id AND status = 'completed'),
        last_workout_date = CURDATE()
    WHERE user_id = p_user_id;
END$$

-- Procédure pour vérifier le badge Constance (7 jours consécutifs)
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

-- Procédure pour vérifier le badge Progression (+20% performances)
DROP PROCEDURE IF EXISTS check_progression_badge$$
CREATE PROCEDURE check_progression_badge(IN p_user_id INT)
BEGIN
    DECLARE v_improvement DECIMAL(5,2);
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Progression' LIMIT 1;
    
    SELECT performance_improvement_percent INTO v_improvement
    FROM user_stats
    WHERE user_id = p_user_id;
    
    IF v_improvement >= 20 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Sérénité (5 séances zen)
DROP PROCEDURE IF EXISTS check_serenite_badge$$
CREATE PROCEDURE check_serenite_badge(IN p_user_id INT)
BEGIN
    DECLARE v_zen_sessions INT;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Sérénité' LIMIT 1;
    
    SELECT zen_sessions INTO v_zen_sessions
    FROM user_stats
    WHERE user_id = p_user_id;
    
    IF v_zen_sessions >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Routine Matinale (5 matins)
DROP PROCEDURE IF EXISTS check_routine_matinale_badge$$
CREATE PROCEDURE check_routine_matinale_badge(IN p_user_id INT)
BEGIN
    DECLARE v_morning_workouts INT;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Routine Matinale' LIMIT 1;
    
    SELECT morning_workouts INTO v_morning_workouts
    FROM user_stats
    WHERE user_id = p_user_id;
    
    IF v_morning_workouts >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Routine du Soir (5 soirs)
DROP PROCEDURE IF EXISTS check_routine_soir_badge$$
CREATE PROCEDURE check_routine_soir_badge(IN p_user_id INT)
BEGIN
    DECLARE v_evening_workouts INT;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Routine du Soir' LIMIT 1;
    
    SELECT evening_workouts INTO v_evening_workouts
    FROM user_stats
    WHERE user_id = p_user_id;
    
    IF v_evening_workouts >= 5 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Objectif Atteint
DROP PROCEDURE IF EXISTS check_objectif_badge$$
CREATE PROCEDURE check_objectif_badge(IN p_user_id INT)
BEGIN
    DECLARE v_goal_achieved BOOLEAN;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Objectif Atteint' LIMIT 1;
    
    SELECT goal_achieved INTO v_goal_achieved
    FROM weekly_goals
    WHERE user_id = p_user_id
      AND week_start_date = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
    LIMIT 1;
    
    IF v_goal_achieved = TRUE AND v_badge_id IS NOT NULL THEN
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

-- Procédure pour vérifier le badge Challenge Réussi (programme complété)
DROP PROCEDURE IF EXISTS check_challenge_badge$$
CREATE PROCEDURE check_challenge_badge(IN p_user_id INT)
BEGIN
    DECLARE v_programs_completed INT;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Challenge Réussi' LIMIT 1;
    
    SELECT COUNT(*) INTO v_programs_completed
    FROM enrollments
    WHERE user_id = p_user_id
      AND status = 'completed';
    
    IF v_programs_completed >= 1 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Niveau Supérieur
DROP PROCEDURE IF EXISTS check_niveau_superieur_badge$$
CREATE PROCEDURE check_niveau_superieur_badge(IN p_user_id INT)
BEGIN
    DECLARE v_fitness_level VARCHAR(20);
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Niveau Supérieur' LIMIT 1;
    
    SELECT fitness_level INTO v_fitness_level
    FROM users
    WHERE id = p_user_id;
    
    IF v_fitness_level IN ('intermediate', 'advanced') AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure pour vérifier le badge Esprit Fytli (badge légendaire)
DROP PROCEDURE IF EXISTS check_esprit_fytli_badge$$
CREATE PROCEDURE check_esprit_fytli_badge(IN p_user_id INT)
BEGIN
    DECLARE v_badges_earned INT;
    DECLARE v_total_workouts INT;
    DECLARE v_longest_streak INT;
    DECLARE v_badge_id INT;
    
    SELECT id INTO v_badge_id FROM badges WHERE name = 'Esprit Fytli' LIMIT 1;
    
    SELECT COUNT(*) INTO v_badges_earned
    FROM user_badges
    WHERE user_id = p_user_id;
    
    SELECT total_workouts, longest_streak 
    INTO v_total_workouts, v_longest_streak
    FROM user_stats
    WHERE user_id = p_user_id;
    
    IF v_badges_earned >= 8 AND v_total_workouts >= 50 AND v_longest_streak >= 14 AND v_badge_id IS NOT NULL THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id, earned_at)
        VALUES (p_user_id, v_badge_id, NOW());
    END IF;
END$$

-- Procédure principale pour vérifier tous les badges
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
    
    SELECT CONCAT('Vérification des badges terminée pour l\'utilisateur ', p_user_id) as message;
END$$

DELIMITER ;

-- =====================================================
-- ÉTAPE 3 : VÉRIFICATION FINALE
-- =====================================================

SELECT '=== PROCÉDURES INSTALLÉES ===' as info;

SELECT 
    ROUTINE_NAME as procedure_name,
    CREATED as created_at
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND (ROUTINE_NAME LIKE '%badge%' OR ROUTINE_NAME LIKE '%user_stats%')
ORDER BY ROUTINE_NAME;

SELECT '✅ Installation des stored procedures terminée !' as info;
SELECT '💡 Les badges seront maintenant vérifiés automatiquement après chaque session complétée.' as info;

-- =====================================================
-- TEST (OPTIONNEL)
-- =====================================================
-- Pour tester avec votre utilisateur (remplacez 3 par votre user_id) :
-- CALL update_user_stats(3);
-- CALL check_all_badges(3);
-- 
-- Pour voir vos badges :
-- SELECT b.name, b.description, ub.earned_at 
-- FROM user_badges ub 
-- JOIN badges b ON ub.badge_id = b.id 
-- WHERE ub.user_id = 3;
-- =====================================================

