-- =====================================================
-- ATTRIBUTION DES BADGES ET SESSIONS AUX UTILISATEURS
-- =====================================================
-- Date: 18 Octobre 2025
-- À exécuter sur la base de données OVH via phpMyAdmin

-- =====================================================
-- 1. ATTRIBUTION DE BADGES AUX UTILISATEURS
-- =====================================================

-- Attribuer des badges aux utilisateurs existants
-- Note: Assurez-vous que les badge_id existent dans la table badges

-- User ID 1 : Utilisateur actif avec plusieurs badges
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
  (1, 'constance', DATE_SUB(NOW(), INTERVAL 7 DAY)),
  (1, 'progression', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  (1, 'objectif_atteint', DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE earned_at = VALUES(earned_at);

-- User ID 2 : Utilisateur régulier
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
  (2, 'constance', DATE_SUB(NOW(), INTERVAL 10 DAY)),
  (2, 'serenite', DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE earned_at = VALUES(earned_at);

-- User ID 3 : Super utilisateur avec beaucoup de badges
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
  (3, 'constance', DATE_SUB(NOW(), INTERVAL 15 DAY)),
  (3, 'progression', DATE_SUB(NOW(), INTERVAL 12 DAY)),
  (3, 'serenite', DATE_SUB(NOW(), INTERVAL 9 DAY)),
  (3, 'niveau_superieur', DATE_SUB(NOW(), INTERVAL 6 DAY)),
  (3, 'routine_matinale', DATE_SUB(NOW(), INTERVAL 4 DAY)),
  (3, 'challenge_reussi', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE earned_at = VALUES(earned_at);

-- User ID 4 : Nouvel utilisateur avec son premier badge
INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
  (4, 'constance', NOW())
ON DUPLICATE KEY UPDATE earned_at = VALUES(earned_at);

-- =====================================================
-- 2. CRÉATION DE SESSIONS D'EXERCICES
-- =====================================================

-- Ajouter des exercices à la Session 1 (Programme 1 - Cardio)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
  (1, 1, 1, 1, NULL, 900, 60, 'Échauffement sur tapis de marche'),
  (1, 10, 2, 3, 20, NULL, 45, 'Cardio léger')
ON DUPLICATE KEY UPDATE 
  sets = VALUES(sets), 
  reps = VALUES(reps), 
  duration_seconds = VALUES(duration_seconds), 
  rest_seconds = VALUES(rest_seconds);

-- Ajouter des exercices à la Session 2 (Programme 1 - Renforcement)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
  (2, 2, 1, 4, 10, NULL, 90, 'Presse à cuisse - Force'),
  (2, 4, 2, 3, 12, NULL, 60, 'Pompes classiques'),
  (2, 9, 3, 4, 15, NULL, 60, 'Squats au poids du corps')
ON DUPLICATE KEY UPDATE 
  sets = VALUES(sets), 
  reps = VALUES(reps), 
  duration_seconds = VALUES(duration_seconds), 
  rest_seconds = VALUES(rest_seconds);

-- Ajouter des exercices à la Session 3 (si elle existe)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
  (3, 3, 1, 4, 12, NULL, 120, 'Curl biceps'),
  (3, 5, 2, 3, 15, NULL, 60, 'Triceps à la poulie'),
  (3, 11, 3, 3, 20, NULL, 45, 'Pompes inclinées')
ON DUPLICATE KEY UPDATE 
  sets = VALUES(sets), 
  reps = VALUES(reps), 
  duration_seconds = VALUES(duration_seconds), 
  rest_seconds = VALUES(rest_seconds);

-- Ajouter des exercices à la Session 4 (si elle existe - Programme 1)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
  (4, 7, 1, 3, 30, NULL, 60, 'Leg press'),
  (4, 9, 2, 4, 15, NULL, 60, 'Squats'),
  (4, 2, 3, 3, 12, NULL, 45, 'Presse à cuisse')
ON DUPLICATE KEY UPDATE 
  sets = VALUES(sets), 
  reps = VALUES(reps), 
  duration_seconds = VALUES(duration_seconds), 
  rest_seconds = VALUES(rest_seconds);

-- =====================================================
-- 3. AJOUT D'EXERCICES SPÉCIFIQUES
-- =====================================================

-- S'assurer que l'exercice "Marche en pente" existe
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
  1,
  'beginner',
  'Tapis de course',
  'Jambes, Fessiers, Cardio',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE 
  description = VALUES(description),
  difficulty_level = VALUES(difficulty_level),
  updated_at = NOW();

-- Récupérer l'ID de "Marche en pente" et l'ajouter à une session
SET @marche_pente_id = (SELECT id FROM exercises WHERE name = 'Marche en pente' LIMIT 1);

-- Ajouter "Marche en pente" à la Session 1 (si pas déjà présent)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes)
SELECT 1, @marche_pente_id, 3, 1, NULL, 600, 60, 'Marche en pente - 10 minutes'
WHERE @marche_pente_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM session_exercises 
    WHERE session_id = 1 AND exercise_id = @marche_pente_id
  );

-- =====================================================
-- 4. VÉRIFICATIONS
-- =====================================================

-- Compter les badges par utilisateur
SELECT 'Badges par utilisateur:' as Info;
SELECT 
  u.id,
  u.firstname,
  u.lastname,
  COUNT(ub.badge_id) as total_badges
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.firstname, u.lastname
ORDER BY total_badges DESC;

-- Voir les derniers badges attribués
SELECT 'Derniers badges attribués:' as Info;
SELECT 
  ub.user_id,
  u.firstname,
  u.lastname,
  b.name as badge_name,
  b.badge_id,
  ub.earned_at
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.badge_id
ORDER BY ub.earned_at DESC
LIMIT 10;

-- Compter les exercices par session
SELECT 'Exercices par session:' as Info;
SELECT 
  s.id,
  s.title as session_name,
  p.title as program_name,
  COUNT(se.id) as total_exercises
FROM sessions s
LEFT JOIN session_exercises se ON s.id = se.session_id
LEFT JOIN programs p ON s.program_id = p.id
GROUP BY s.id, s.title, p.title
ORDER BY s.id;

-- Voir les exercices de la Session 1
SELECT 'Exercices de la Session 1:' as Info;
SELECT 
  se.order_index,
  e.name as exercise_name,
  se.sets,
  se.reps,
  se.duration_seconds,
  se.rest_seconds,
  se.notes
FROM session_exercises se
JOIN exercises e ON se.exercise_id = e.id
WHERE se.session_id = 1
ORDER BY se.order_index;

-- Vérifier l'exercice "Marche en pente"
SELECT 'Exercice Marche en pente:' as Info;
SELECT * FROM exercises WHERE name = 'Marche en pente';

