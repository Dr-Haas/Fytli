-- =====================================================
-- CRÉATION SESSIONS CARDIO
-- Date : 19 Octobre 2025
-- =====================================================

USE lyfti;

-- =====================================================
-- PARTIE 1 : Créer le programme Cardio (si besoin)
-- =====================================================

-- Vérifier si un programme Cardio existe, sinon le créer
INSERT INTO programs (title, description, level, duration_weeks, image_url, created_by)
SELECT 'Programme Cardio Intensif', 
       'Programme complet de cardio training avec renforcement musculaire. Améliorez votre endurance et brûlez des calories efficacement !', 
       'intermediate', 
       4, 
       NULL, 
       NULL
WHERE NOT EXISTS (SELECT 1 FROM programs WHERE title = 'Programme Cardio Intensif');

-- Récupérer l'ID du programme Cardio
SET @program_cardio_id = (SELECT id FROM programs WHERE title = 'Programme Cardio Intensif' ORDER BY id DESC LIMIT 1);

-- =====================================================
-- PARTIE 2 : Session 1 - Cardio HIIT
-- =====================================================

INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
(@program_cardio_id, 
'Session 1 - Cardio HIIT', 
'Entraînement par intervalles à haute intensité pour brûler un maximum de calories', 
1, 
30);

SET @session1_id = LAST_INSERT_ID();

-- Exercices Session 1
-- Récupérer les IDs des exercices (en utilisant les premiers trouvés)
SET @ex_burpees = (SELECT id FROM exercises WHERE name LIKE '%Burpees%' LIMIT 1);
SET @ex_jumping = (SELECT id FROM exercises WHERE name LIKE '%Jumping%' OR name LIKE '%jack%' LIMIT 1);
SET @ex_corde = (SELECT id FROM exercises WHERE name LIKE '%Corde%' LIMIT 1);
SET @ex_mountain = (SELECT id FROM exercises WHERE name LIKE '%Mountain%' OR name LIKE '%montagne%' LIMIT 1);
SET @ex_abdos = (SELECT id FROM exercises WHERE name LIKE '%Abdos%' OR name LIKE '%Abdo%' LIMIT 1);
SET @ex_planche = (SELECT id FROM exercises WHERE name LIKE '%Planche%' LIMIT 1);
SET @ex_etirement = (SELECT id FROM exercises WHERE name LIKE '%Étirement%' OR name LIKE '%Etirement%' LIMIT 1);

-- Si certains exercices n'existent pas, utiliser des IDs génériques
SET @ex_burpees = IFNULL(@ex_burpees, 51);
SET @ex_jumping = IFNULL(@ex_jumping, 52);
SET @ex_corde = IFNULL(@ex_corde, 59);
SET @ex_mountain = IFNULL(@ex_mountain, 53);
SET @ex_abdos = IFNULL(@ex_abdos, 60);
SET @ex_planche = IFNULL(@ex_planche, 61);
SET @ex_etirement = IFNULL(@ex_etirement, 62);

-- Ajouter les exercices à la Session 1
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
-- Exercices cardio principaux
(@session1_id, @ex_burpees, 1, 4, 15, NULL, 45, 'Explosif et dynamique'),
(@session1_id, @ex_jumping, 2, 3, 30, NULL, 30, 'Échauffement cardiovasculaire'),
(@session1_id, @ex_corde, 3, 4, NULL, 60, 30, 'Simuler la corde à sauter si pas de matériel'),
(@session1_id, @ex_mountain, 4, 3, 20, NULL, 45, 'Montées de genoux explosives'),

-- Finition : Abdos + Planche + Étirements
(@session1_id, @ex_abdos, 5, 3, 20, NULL, 30, 'Abdos bicycle ou crunch'),
(@session1_id, @ex_planche, 6, 3, NULL, 30, 30, 'Gainage statique'),
(@session1_id, @ex_etirement, 7, 1, NULL, 300, 0, 'Étirements complets 5 minutes');

-- =====================================================
-- PARTIE 3 : Session 2 - Cardio Endurance
-- =====================================================

INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
(@program_cardio_id, 
'Session 2 - Cardio Endurance', 
'Travail d''endurance avec variations d''intensité pour améliorer votre capacité cardiovasculaire', 
2, 
35);

SET @session2_id = LAST_INSERT_ID();

-- Récupérer d'autres exercices pour varier
SET @ex_high_knees = (SELECT id FROM exercises WHERE name LIKE '%genou%' OR name LIKE '%knee%' LIMIT 1);
SET @ex_squats_jump = (SELECT id FROM exercises WHERE name LIKE '%squat%' AND name LIKE '%jump%' LIMIT 1);
SET @ex_fentes_saut = (SELECT id FROM exercises WHERE name LIKE '%fente%' AND name LIKE '%saut%' LIMIT 1);

-- Valeurs par défaut si non trouvés
SET @ex_high_knees = IFNULL(@ex_high_knees, 54);
SET @ex_squats_jump = IFNULL(@ex_squats_jump, 55);
SET @ex_fentes_saut = IFNULL(@ex_fentes_saut, 56);

-- Ajouter les exercices à la Session 2
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
-- Exercices cardio principaux
(@session2_id, @ex_high_knees, 1, 4, 30, NULL, 40, 'Montées de genoux à haute intensité'),
(@session2_id, @ex_burpees, 2, 3, 12, NULL, 45, 'Burpees avec pompe'),
(@session2_id, @ex_squats_jump, 3, 4, 15, NULL, 45, 'Squats sautés explosifs'),

-- Finition : Abdos + Planche + Étirements
(@session2_id, @ex_abdos, 4, 3, 25, NULL, 30, 'Crunch ou sit-ups'),
(@session2_id, @ex_planche, 5, 3, NULL, 40, 30, 'Gainage avec variations si possible'),
(@session2_id, @ex_etirement, 6, 1, NULL, 300, 0, 'Récupération et étirements');

COMMIT;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

SELECT '✅ Sessions créées avec succès !' as status;

SELECT 
    p.id as program_id,
    p.title as programme,
    s.id as session_id,
    s.title as session,
    COUNT(se.id) as nb_exercices
FROM programs p
JOIN sessions s ON s.program_id = p.id
LEFT JOIN session_exercises se ON se.session_id = s.id
WHERE p.id = @program_cardio_id
GROUP BY p.id, s.id
ORDER BY s.order_index;

-- =====================================================
-- FIN
-- =====================================================

