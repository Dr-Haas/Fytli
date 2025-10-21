-- Script corrigé avec les VRAIS IDs de ta base de données
USE lyfti;

-- 1. D'abord, voir les données existantes
SELECT id, title FROM programs ORDER BY id LIMIT 10;
SELECT id, program_id, title FROM sessions ORDER BY program_id LIMIT 10;

-- 2. Nettoyer les anciennes tentatives (optionnel)
-- DELETE FROM session_completions WHERE user_id IN (3,4,5,7,8);

-- 3. Insertion avec les IDs corrects (utilisateurs 3, 4, 5, 7, 8)
-- ⚠️ Vérifie d'abord que ces program_id et session_id existent !

-- Pour Gary (user_id = 3)
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (3, 1, 1, 45, 'great', 'Super séance ! 💪', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (3, 1, 1, 50, 'good', 'Bonne progression', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (3, 1, 1, 42, 'great', 'Excellente forme !', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Pour Gachal (user_id = 4)
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (4, 1, 1, 40, 'okay', 'Séance correcte', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (4, 1, 1, 55, 'great', 'Excellent workout !', DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- Pour Ben (user_id = 5)
INSERT INTO session_completions (user_id, program_id, session_id, duration_minutes, feeling, notes, completed_at)
VALUES 
  (5, 1, 1, 38, 'good', 'Bon effort 🔥', DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- 4. Vérifier les résultats
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

-- 5. Vérifier que le feed est déverrouillé
SELECT 
  fu.id,
  u.first_name,
  u.last_name,
  fu.unlocked_at,
  fu.current_streak,
  fu.longest_streak
FROM feed_unlocks fu
JOIN users u ON fu.user_id = u.id
ORDER BY fu.unlocked_at DESC;

