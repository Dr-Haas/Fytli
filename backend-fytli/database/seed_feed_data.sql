-- Script pour ajouter des données de feed de test
-- Ce script insère des complétions de sessions pour créer un feed d'activité

-- 1. Vérifier les utilisateurs existants
SELECT id, email, first_name, last_name FROM users LIMIT 5;

-- 2. Vérifier les programmes existants
SELECT id, title FROM programs LIMIT 10;

-- 3. Vérifier les sessions existantes
SELECT id, program_id, title FROM sessions LIMIT 10;

-- 4. Insérer des complétions de sessions de test
-- Remplacez les IDs selon vos données réelles

-- Exemple: Utilisateur 1 complète plusieurs sessions du programme 5
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (1, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1), 45, 'great', 'Super séance, je me sens en forme !', NOW() - INTERVAL 1 DAY),
  (1, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1 OFFSET 1), 50, 'good', 'Bonne progression sur les exercices', NOW() - INTERVAL 2 DAY),
  (1, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1), 40, 'tired', 'Un peu fatigué mais content d avoir terminé', NOW() - INTERVAL 3 DAY);

-- Exemple: Utilisateur 2 complète des sessions
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (2, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1), 55, 'great', 'Excellent workout !', NOW() - INTERVAL 1 HOUR),
  (2, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1 OFFSET 1), 48, 'good', 'En progrès constant', NOW() - INTERVAL 4 HOUR);

-- Exemple: Utilisateur 3 complète des sessions  
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (3, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1), 42, 'okay', 'Séance correcte', NOW() - INTERVAL 6 HOUR),
  (3, 5, (SELECT id FROM sessions WHERE program_id = 5 LIMIT 1 OFFSET 1), 52, 'great', 'Super motivé aujourd hui !', NOW() - INTERVAL 2 DAY);

-- Si vous voulez créer des données pour le programme 21 spécifiquement:
-- Vérifiez d'abord que le programme 21 et ses sessions existent
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
SELECT 
  1 as user_id,
  21 as program_id,
  id as session_id,
  FLOOR(30 + RAND() * 40) as duration_minutes,
  CASE FLOOR(RAND() * 4)
    WHEN 0 THEN 'great'
    WHEN 1 THEN 'good'
    WHEN 2 THEN 'okay'
    ELSE 'tired'
  END as feeling,
  'Session de test' as notes,
  NOW() - INTERVAL FLOOR(RAND() * 7) DAY as completed_at
FROM sessions 
WHERE program_id = 21 
LIMIT 5;

-- Vérifier les données insérées
SELECT 
  sc.id,
  sc.user_id,
  u.first_name,
  sc.program_id,
  p.title as program_title,
  sc.session_id,
  s.title as session_title,
  sc.duration_minutes,
  sc.feeling,
  sc.completed_at
FROM session_completions sc
JOIN users u ON sc.user_id = u.id
JOIN programs p ON sc.program_id = p.id
JOIN sessions s ON sc.session_id = s.id
ORDER BY sc.completed_at DESC
LIMIT 20;

-- Vérifier le feed pour un programme spécifique
SELECT 
  sc.*,
  u.first_name,
  u.last_name,
  s.title as session_title
FROM session_completions sc
JOIN users u ON sc.user_id = u.id
JOIN sessions s ON sc.session_id = s.id
WHERE sc.program_id = 21
ORDER BY sc.completed_at DESC;

