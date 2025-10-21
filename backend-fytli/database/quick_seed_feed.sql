-- Script rapide pour créer des données de feed de test
-- ⚠️ Ajustez les IDs selon votre base de données

-- 1. Voir les programmes disponibles
SELECT id, title FROM programs ORDER BY id LIMIT 10;

-- 2. Voir les sessions disponibles  
SELECT id, program_id, title FROM sessions ORDER BY program_id LIMIT 10;

-- 3. Voir les utilisateurs
SELECT id, email, first_name, last_name FROM users ORDER BY id LIMIT 5;

-- 4. Créer des complétions de sessions de test
-- Remplacez USER_ID, PROGRAM_ID, SESSION_ID par vos valeurs réelles

-- Pour le programme ID 5 (exemple)
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (1, 5, 1, 45, 'great', 'Super séance ! 💪', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (1, 5, 2, 50, 'good', 'Bonne progression', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (2, 5, 1, 40, 'okay', 'Séance correcte', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (2, 5, 3, 55, 'great', 'Excellent workout !', DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Pour le programme ID 21 (celui qui pose problème)
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (1, 21, (SELECT MIN(id) FROM sessions WHERE program_id = 21), 45, 'great', 'Première séance du programme ! 🔥', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (1, 21, (SELECT MIN(id) FROM sessions WHERE program_id = 21), 50, 'good', 'En progrès !', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Vérifier les résultats
SELECT 
  sc.id,
  u.first_name,
  u.last_name,
  p.title as programme,
  s.title as session,
  sc.duration_minutes,
  sc.feeling,
  sc.notes,
  sc.completed_at
FROM session_completions sc
JOIN users u ON sc.user_id = u.id
JOIN programs p ON sc.program_id = p.id
JOIN sessions s ON sc.session_id = s.id
WHERE sc.program_id IN (5, 21)
ORDER BY sc.completed_at DESC;

