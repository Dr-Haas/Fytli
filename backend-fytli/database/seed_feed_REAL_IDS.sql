-- Script avec les VRAIS IDs qui existent dans ta base
USE lyfti;

-- ✅ IDs confirmés :
-- Users : 3, 4, 5, 7, 8
-- Programs : 5, 7, 20
-- Sessions : 6 (program 5), 8, 9, 10 (program 7), 227, 228 (program 20)

-- Nettoyer les anciennes tentatives (optionnel)
DELETE FROM session_completions WHERE user_id IN (3,4,5,7,8);

-- Insertions avec les VRAIS IDs
-- Gary (user_id = 3) - Programme 5
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (3, 5, 6, 45, 'great', 'Super séance ! 💪', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (3, 5, 6, 50, 'good', 'Bonne progression', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (3, 5, 6, 42, 'great', 'Excellente forme !', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Gary (user_id = 3) - Programme 7
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (3, 7, 8, 55, 'great', 'Session jambes intense 🔥', DATE_SUB(NOW(), INTERVAL 4 DAY)),
  (3, 7, 9, 40, 'good', 'Bonne séance bras', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Gachal (user_id = 4) - Programme 7
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (4, 7, 8, 40, 'okay', 'Séance correcte', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (4, 7, 10, 55, 'great', 'Excellent workout dos !', DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Ben (user_id = 5) - Programme 20
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (5, 20, 227, 38, 'good', 'Cardio HIIT 🔥', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (5, 20, 228, 45, 'great', 'Cardio endurance au top !', DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- Pascale (user_id = 7) - Programme 5
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (7, 5, 6, 35, 'good', 'Session agréable', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Gerard (user_id = 8) - Programme 20
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (8, 20, 227, 42, 'great', 'HIIT intense ! 💪', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

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
ORDER BY sc.completed_at DESC
LIMIT 20;

-- Vérifier le feed unlock
SELECT 
  fu.id,
  u.first_name,
  u.last_name,
  fu.unlocked_at
FROM feed_unlocks fu
JOIN users u ON fu.user_id = u.id
ORDER BY fu.unlocked_at DESC;

