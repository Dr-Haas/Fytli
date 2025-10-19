-- =====================================================
-- CORRECTION ET ATTRIBUTION DES BADGES
-- Date : 19 Octobre 2025
-- =====================================================

USE lyfti;

-- =====================================================
-- PARTIE 1 : VÉRIFICATION DE L'ÉTAT ACTUEL
-- =====================================================

SELECT '=== ÉTAT ACTUEL DES BADGES ===' as info;

-- Voir les badges disponibles
SELECT id, name, description, criteria
FROM badges
ORDER BY id;

-- Voir les utilisateurs et leurs complétions
SELECT 
    u.id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) as nom,
    COUNT(DISTINCT sc.id) as sessions_completees,
    COUNT(DISTINCT sc.program_id) as programmes_tentes,
    COUNT(DISTINCT e.id) as programmes_completes
FROM users u
LEFT JOIN session_completions sc ON sc.user_id = u.id
LEFT JOIN enrollments e ON e.user_id = u.id AND e.status = 'completed'
WHERE u.role = 'user'
GROUP BY u.id;

-- Voir les badges déjà attribués
SELECT 
    u.email,
    b.name as badge,
    ub.earned_at
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.id
ORDER BY u.email, ub.earned_at DESC;

-- =====================================================
-- PARTIE 2 : ATTRIBUTION MANUELLE DES BADGES
-- =====================================================

SELECT '=== ATTRIBUTION DES BADGES BASÉE SUR LES COMPLÉTIONS ===' as info;

-- Badge "Constance" : 7+ sessions complétées
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT 
    u.id,
    (SELECT id FROM badges WHERE name = 'Constance' LIMIT 1),
    NOW()
FROM users u
WHERE u.role = 'user'
  AND (SELECT COUNT(*) FROM session_completions WHERE user_id = u.id) >= 7
  AND NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = u.id 
      AND badge_id = (SELECT id FROM badges WHERE name = 'Constance' LIMIT 1)
  );

-- Badge "Challenge Réussi" : Au moins 1 programme complété
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT 
    u.id,
    (SELECT id FROM badges WHERE name = 'Challenge Réussi' LIMIT 1),
    NOW()
FROM users u
WHERE u.role = 'user'
  AND EXISTS (
    SELECT 1 FROM enrollments 
    WHERE user_id = u.id AND status = 'completed'
  )
  AND NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = u.id 
      AND badge_id = (SELECT id FROM badges WHERE name = 'Challenge Réussi' LIMIT 1)
  );

-- Badge "Niveau Supérieur" : Niveau intermédiaire ou avancé
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT 
    u.id,
    (SELECT id FROM badges WHERE name = 'Niveau Supérieur' LIMIT 1),
    NOW()
FROM users u
WHERE u.role = 'user'
  AND u.fitness_level IN ('intermediate', 'advanced')
  AND NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = u.id 
      AND badge_id = (SELECT id FROM badges WHERE name = 'Niveau Supérieur' LIMIT 1)
  );

-- Badge "Progression" : 10+ sessions complétées (critère simplifié)
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT 
    u.id,
    (SELECT id FROM badges WHERE name = 'Progression' LIMIT 1),
    NOW()
FROM users u
WHERE u.role = 'user'
  AND (SELECT COUNT(*) FROM session_completions WHERE user_id = u.id) >= 10
  AND NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = u.id 
      AND badge_id = (SELECT id FROM badges WHERE name = 'Progression' LIMIT 1)
  );

-- Badge "Sérénité" : Au moins 5 sessions (tous types)
INSERT INTO user_badges (user_id, badge_id, earned_at)
SELECT 
    u.id,
    (SELECT id FROM badges WHERE name = 'Sérénité' LIMIT 1),
    NOW()
FROM users u
WHERE u.role = 'user'
  AND (SELECT COUNT(*) FROM session_completions WHERE user_id = u.id) >= 5
  AND NOT EXISTS (
    SELECT 1 FROM user_badges 
    WHERE user_id = u.id 
      AND badge_id = (SELECT id FROM badges WHERE name = 'Sérénité' LIMIT 1)
  );

COMMIT;

-- =====================================================
-- PARTIE 3 : VÉRIFICATION APRÈS ATTRIBUTION
-- =====================================================

SELECT '=== RÉSULTATS APRÈS ATTRIBUTION ===' as info;

-- Badges attribués par utilisateur
SELECT 
    u.email,
    u.first_name,
    COUNT(ub.id) as badges_recus,
    GROUP_CONCAT(b.name SEPARATOR ', ') as liste_badges
FROM users u
LEFT JOIN user_badges ub ON ub.user_id = u.id
LEFT JOIN badges b ON ub.badge_id = b.id
WHERE u.role = 'user'
GROUP BY u.id
ORDER BY badges_recus DESC;

-- Détail des badges attribués aujourd'hui
SELECT 
    u.email,
    b.name as badge,
    b.description,
    ub.earned_at
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.id
WHERE DATE(ub.earned_at) = CURDATE()
ORDER BY ub.earned_at DESC;

-- =====================================================
-- PARTIE 4 : INSTALLATION DU SYSTÈME AUTOMATIQUE
-- =====================================================

-- Créer les tables nécessaires pour le système automatique

CREATE TABLE IF NOT EXISTS user_stats (
  user_id INT PRIMARY KEY,
  total_workouts INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_exercises INT DEFAULT 0,
  total_sets INT DEFAULT 0,
  programs_completed INT DEFAULT 0,
  morning_workouts INT DEFAULT 0,
  evening_workouts INT DEFAULT 0,
  zen_sessions INT DEFAULT 0,
  last_workout_date DATE,
  performance_improvement_percent DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialiser user_stats pour tous les utilisateurs existants
INSERT IGNORE INTO user_stats (user_id, total_workouts, programs_completed)
SELECT 
    u.id,
    COUNT(DISTINCT sc.id),
    COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END)
FROM users u
LEFT JOIN session_completions sc ON sc.user_id = u.id
LEFT JOIN enrollments e ON e.user_id = u.id
WHERE u.role = 'user'
GROUP BY u.id;

-- Migrer les session_completions vers workout_history
INSERT INTO workout_history (user_id, session_id, program_id, completed_at, duration_minutes)
SELECT 
    user_id,
    session_id,
    program_id,
    completed_at,
    duration_minutes
FROM session_completions
WHERE NOT EXISTS (
    SELECT 1 FROM workout_history wh 
    WHERE wh.user_id = session_completions.user_id 
      AND wh.session_id = session_completions.session_id
      AND wh.completed_at = session_completions.completed_at
);

COMMIT;

-- =====================================================
-- PARTIE 5 : MESSAGE FINAL
-- =====================================================

SELECT '✅ Attribution des badges terminée !' as status;
SELECT '📊 Consultez les résultats ci-dessus' as info;
SELECT '🔧 Les tables nécessaires pour le système automatique ont été créées' as info;
SELECT '📝 Pour activer le système complet, exécutez BADGES_STORED_PROCEDURES.sql' as info;

-- =====================================================
-- FIN
-- =====================================================

