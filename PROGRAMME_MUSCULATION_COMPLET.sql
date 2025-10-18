-- =====================================================
-- PROGRAMME DE MUSCULATION COMPLET - 3 SESSIONS
-- =====================================================
-- Programme full-body sur 3 jours : Jambes, Bras, Dos
-- Chaque session se termine par Abdos + Planche
-- =====================================================

USE lyfti;

-- =====================================================
-- ÉTAPE 1 : AJOUTER LES EXERCICES MANQUANTS
-- =====================================================

-- Exercice Abdominaux (Crunch)
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Abdominaux', 'Crunch classique pour renforcer les abdominaux', 1, 'beginner', 'Tapis', 'Abdominaux, Core');

-- Exercice Soulevé de terre (Deadlift)
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Soulevé de terre', 'Exercice complet pour les jambes et le dos', 1, 'intermediate', 'Haltères/Barre', 'Jambes, Dos, Fessiers');

-- Exercice Tractions
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Tractions', 'Pull-ups pour développer le dos et les biceps', 1, 'intermediate', 'Barre de traction', 'Dos, Biceps');

-- Exercice Rowing
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Rowing', 'Tirage horizontal pour le dos', 1, 'intermediate', 'Haltères', 'Dos, Biceps');

-- Exercice Superman
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Superman', 'Extension lombaires pour renforcer le bas du dos', 1, 'beginner', 'Aucun', 'Lombaires, Dos');

-- Exercice Curl Biceps
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Curl Biceps', 'Flexion des bras pour développer les biceps', 1, 'beginner', 'Haltères', 'Biceps');

-- Exercice Extension Triceps
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Extension Triceps', 'Extension des bras pour développer les triceps', 1, 'beginner', 'Haltères', 'Triceps');

-- Exercice Mollets
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups) 
VALUES ('Élévation Mollets', 'Montées sur pointes pour développer les mollets', 1, 'beginner', 'Aucun', 'Mollets');

-- =====================================================
-- ÉTAPE 2 : CRÉER LE PROGRAMME
-- =====================================================

INSERT INTO programs (title, description, level, duration_weeks, sessions_per_week, is_public) 
VALUES (
    'Programme Musculation Full Body',
    'Programme complet sur 3 jours alternés : Jambes, Bras, Dos. Chaque session se termine par du gainage pour renforcer le core.',
    'intermediate',
    8,
    3,
    1
);

-- Récupérer l'ID du programme créé (remplacer @program_id par le vrai ID après création)
SET @program_id = LAST_INSERT_ID();

-- =====================================================
-- ÉTAPE 3 : CRÉER LES SESSIONS
-- =====================================================

-- SESSION 1 : JAMBES
INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) 
VALUES (
    @program_id,
    'Session 1 - Jambes',
    'Renforcement complet des jambes : quadriceps, ischio-jambiers, fessiers et mollets',
    1,
    45
);
SET @session_jambes = LAST_INSERT_ID();

-- SESSION 2 : BRAS
INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) 
VALUES (
    @program_id,
    'Session 2 - Bras',
    'Développement complet des bras : biceps, triceps et avant-bras',
    2,
    40
);
SET @session_bras = LAST_INSERT_ID();

-- SESSION 3 : DOS
INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) 
VALUES (
    @program_id,
    'Session 3 - Dos',
    'Renforcement complet du dos : grand dorsal, trapèzes et lombaires',
    3,
    45
);
SET @session_dos = LAST_INSERT_ID();

-- =====================================================
-- ÉTAPE 4 : AJOUTER LES EXERCICES AUX SESSIONS
-- =====================================================

-- =====================================================
-- SESSION 1 : JAMBES
-- =====================================================

-- Exercice 1 : Squats
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_jambes, id, 1, 4, 12, 90, 'Gardez le dos droit et descendez jusqu\'à avoir les cuisses parallèles au sol'
FROM exercises WHERE name = 'Squats';

-- Exercice 2 : Fentes
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_jambes, id, 2, 3, 10, 60, 'Alternez chaque jambe - 10 reps par jambe'
FROM exercises WHERE name = 'Fentes';

-- Exercice 3 : Soulevé de terre
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_jambes, id, 3, 4, 10, 90, 'Gardez le dos bien droit pendant toute l\'exécution'
FROM exercises WHERE name = 'Soulevé de terre';

-- Exercice 4 : Élévation Mollets
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_jambes, id, 4, 3, 15, 45, 'Montez sur la pointe des pieds, contraction maximale en haut'
FROM exercises WHERE name = 'Élévation Mollets';

-- Exercice 5 : Abdominaux
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_jambes, id, 5, 3, 15, 30, 'Crunch classique - contractez bien les abdos en montant'
FROM exercises WHERE name = 'Abdominaux';

-- Exercice 6 : Planche (Gainage final)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes)
SELECT @session_jambes, id, 6, 3, 60, 30, 'Maintenez la position le plus longtemps possible - 60 sec minimum'
FROM exercises WHERE name = 'Planche';

-- =====================================================
-- SESSION 2 : BRAS
-- =====================================================

-- Exercice 1 : Pompes
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_bras, id, 1, 4, 12, 60, 'Descendez jusqu\'à ce que votre poitrine touche presque le sol'
FROM exercises WHERE name = 'Pompes';

-- Exercice 2 : Dips
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_bras, id, 2, 3, 10, 60, 'Sur une chaise ou un banc - descendez bien bas'
FROM exercises WHERE name = 'Dips';

-- Exercice 3 : Curl Biceps
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_bras, id, 3, 3, 12, 45, 'Gardez les coudes fixes le long du corps'
FROM exercises WHERE name = 'Curl Biceps';

-- Exercice 4 : Extension Triceps
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_bras, id, 4, 3, 12, 45, 'Extension complète des bras - contrôlez la descente'
FROM exercises WHERE name = 'Extension Triceps';

-- Exercice 5 : Abdominaux
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_bras, id, 5, 3, 20, 30, 'Augmentation du volume - 20 répétitions'
FROM exercises WHERE name = 'Abdominaux';

-- Exercice 6 : Planche (Gainage final)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes)
SELECT @session_bras, id, 6, 3, 60, 30, 'Gainage statique - gardez le corps bien aligné'
FROM exercises WHERE name = 'Planche';

-- =====================================================
-- SESSION 3 : DOS
-- =====================================================

-- Exercice 1 : Tractions
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_dos, id, 1, 4, 8, 90, 'Si trop difficile, utilisez un élastique ou faites des tractions australiennes'
FROM exercises WHERE name = 'Tractions';

-- Exercice 2 : Rowing
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_dos, id, 2, 4, 12, 60, 'Tirez vers la hanche en serrant les omoplates'
FROM exercises WHERE name = 'Rowing';

-- Exercice 3 : Superman
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes)
SELECT @session_dos, id, 3, 3, 30, 45, 'Extension complète bras et jambes - renforcement lombaires'
FROM exercises WHERE name = 'Superman';

-- Exercice 4 : Mountain Climbers
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes)
SELECT @session_dos, id, 4, 3, 30, 45, 'Cardio intense pour finir le dos'
FROM exercises WHERE name = 'Mountain Climbers';

-- Exercice 5 : Abdominaux
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, rest_seconds, notes)
SELECT @session_dos, id, 5, 3, 20, 30, 'Finition abdos - concentration maximale'
FROM exercises WHERE name = 'Abdominaux';

-- Exercice 6 : Planche (Gainage final)
INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, duration_seconds, rest_seconds, notes)
SELECT @session_dos, id, 6, 3, 60, 30, 'Gainage final - maintenez bien la position'
FROM exercises WHERE name = 'Planche';

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher le programme créé
SELECT id, title, description, level, duration_weeks, sessions_per_week 
FROM programs 
WHERE title = 'Programme Musculation Full Body';

-- Afficher les sessions créées
SELECT s.id, s.title, s.description, s.order_index, s.target_duration_minutes,
       COUNT(se.id) as nb_exercices
FROM sessions s
LEFT JOIN session_exercises se ON s.id = se.session_id
WHERE s.program_id = @program_id
GROUP BY s.id
ORDER BY s.order_index;

-- Afficher tous les exercices de chaque session
SELECT 
    s.title as session,
    se.order_index,
    e.name as exercice,
    se.sets as series,
    se.reps as repetitions,
    se.duration_seconds as duree_sec,
    se.rest_seconds as repos_sec,
    se.notes
FROM sessions s
JOIN session_exercises se ON s.id = se.session_id
JOIN exercises e ON se.exercise_id = e.id
WHERE s.program_id = @program_id
ORDER BY s.order_index, se.order_index;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- ✅ Programme créé avec succès !
-- 
-- Structure :
-- 📋 1 Programme : "Programme Musculation Full Body"
-- 📅 3 Sessions : Jambes, Bras, Dos
-- 💪 18 Exercices au total (6 par session)
-- ⏱️ Durée : 40-45 minutes par session
-- 🔄 3 sessions par semaine sur 8 semaines
-- 
-- Chaque session se termine par :
-- - Abdominaux (3x15-20 reps)
-- - Planche (3x60 sec)
-- =====================================================

