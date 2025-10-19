-- =====================================================
-- FYTLI - NOUVEAUX PROGRAMMES 2025
-- =====================================================
-- 1. Programme Débutant à la Maison
-- 2. Programme Seniors Doux
-- 3. Programme Boxe (Cardio + Sculpt Body)
-- =====================================================
-- Date : 18 Octobre 2025
-- =====================================================
USE lyfti;
-- =====================================================
-- PARTIE 1 : NOUVEAUX EXERCICES
-- =====================================================

-- Exercices pour débutants à la maison (sans équipement)
INSERT INTO exercises (name, description, category_id, difficulty_level, equipment, muscle_groups, video_url, image_url) VALUES
('Squats au poids du corps', 'Fléchir les genoux en gardant le dos droit, descendre comme pour s''asseoir sur une chaise.', 2, 'beginner', 'Aucun', 'Quadriceps, Fessiers, Mollets', NULL, NULL),
('Pompes sur les genoux', 'Pompes modifiées avec les genoux au sol pour réduire la difficulté.', 2, 'beginner', 'Aucun', 'Pectoraux, Triceps, Épaules', NULL, NULL),
('Planche sur les genoux', 'Position de gainage modifiée avec appui sur les genoux.', 2, 'beginner', 'Aucun', 'Abdominaux, Core', NULL, NULL),
('Fentes statiques', 'Position de fente maintenue sans mouvement, alternance des jambes.', 2, 'beginner', 'Aucun', 'Quadriceps, Fessiers, Ischio-jambiers', NULL, NULL),
('Relevés de mollets', 'Montée sur la pointe des pieds, redescente contrôlée.', 2, 'beginner', 'Aucun', 'Mollets', NULL, NULL),
('Extensions triceps murales', 'Pompes contre le mur pour travailler les triceps en douceur.', 2, 'beginner', 'Mur', 'Triceps, Pectoraux', NULL, NULL),
('Crunch abdominaux', 'Enroulement du buste en position allongée pour travailler les abdominaux.', 2, 'beginner', 'Tapis', 'Abdominaux', NULL, NULL),
('Pont fessiers', 'Allongé sur le dos, soulever les hanches en contractant les fessiers.', 2, 'beginner', 'Tapis', 'Fessiers, Ischio-jambiers, Lombaires', NULL, NULL),
('Montées de genoux sur place', 'Marche sur place en montant les genoux à hauteur des hanches.', 1, 'beginner', 'Aucun', 'Quadriceps, Core', NULL, NULL),
('Rotation du tronc debout', 'Rotation du buste de gauche à droite, bras tendus.', 3, 'beginner', 'Aucun', 'Obliques, Core', NULL, NULL),

-- Exercices pour seniors (doux et sécurisés)
('Marche sur place douce', 'Marche lente sur place pour activer la circulation.', 1, 'beginner', 'Aucun', 'Jambes, Cardio', NULL, NULL),
('Élévation latérale des bras', 'Lever les bras sur les côtés jusqu''à hauteur des épaules.', 2, 'beginner', 'Aucun', 'Épaules, Deltoïdes', NULL, NULL),
('Flexion-extension des chevilles', 'Assis, pointer et fléchir les pieds alternativement.', 3, 'beginner', 'Chaise', 'Chevilles, Mollets', NULL, NULL),
('Rotation douce des épaules', 'Rotation circulaire des épaules pour assouplir l''articulation.', 3, 'beginner', 'Aucun', 'Épaules, Trapèzes', NULL, NULL),
('Squats avec chaise', 'Squats assistés avec une chaise derrière pour plus de sécurité.', 2, 'beginner', 'Chaise', 'Quadriceps, Fessiers', NULL, NULL),
('Équilibre sur une jambe', 'Tenir en équilibre sur une jambe avec appui mural au besoin.', 4, 'beginner', 'Mur (support)', 'Chevilles, Core, Équilibre', NULL, NULL),
('Étirement chat-vache', 'À quatre pattes, alterner dos rond et dos creux pour assouplir la colonne.', 3, 'beginner', 'Tapis', 'Colonne vertébrale, Dos', NULL, NULL),
('Respiration profonde assise', 'Exercice de respiration diaphragmatique en position assise.', 5, 'beginner', 'Chaise', 'Diaphragme, Relaxation', NULL, NULL),
('Cercles avec les bras', 'Petits cercles avec les bras tendus pour mobiliser les épaules.', 3, 'beginner', 'Aucun', 'Épaules, Mobilité', NULL, NULL),
('Marche talon-pointe', 'Marche en déroulant le pied du talon à la pointe.', 4, 'beginner', 'Aucun', 'Chevilles, Équilibre', NULL, NULL),

-- Exercices de boxe et cardio
('Shadow boxing', 'Simulation de coups de poing dans le vide en mouvement.', 1, 'intermediate', 'Aucun', 'Épaules, Bras, Core, Cardio', NULL, NULL),
('Burpees', 'Enchaînement planche, pompe, saut vertical complet.', 1, 'intermediate', 'Aucun', 'Corps entier, Cardio', NULL, NULL),
('Mountain climbers', 'En position de planche, ramener alternativement les genoux vers la poitrine.', 1, 'intermediate', 'Aucun', 'Core, Épaules, Cardio', NULL, NULL),
('Jumping jacks', 'Sauts avec écartement simultané des bras et des jambes.', 1, 'beginner', 'Aucun', 'Cardio, Corps entier', NULL, NULL),
('Coups de poing directs', 'Directs alternés (jab-cross) en position de garde.', 1, 'intermediate', 'Aucun', 'Épaules, Bras, Core', NULL, NULL),
('Esquives latérales', 'Déplacements latéraux rapides en position de garde.', 1, 'intermediate', 'Aucun', 'Jambes, Core, Cardio', NULL, NULL),
('Uppercuts alternés', 'Coups de poing remontants alternés.', 1, 'intermediate', 'Aucun', 'Épaules, Core, Obliques', NULL, NULL),
('Planche dynamique', 'Alterner position haute et basse de la planche.', 2, 'intermediate', 'Aucun', 'Core, Épaules, Triceps', NULL, NULL),
('High knees rapides', 'Montées de genoux rapides en course sur place.', 1, 'intermediate', 'Aucun', 'Quadriceps, Cardio', NULL, NULL),
('Corde à sauter (simulation)', 'Simulation de sauts à la corde avec rotation des poignets.', 1, 'beginner', 'Aucun', 'Mollets, Cardio, Coordination', NULL, NULL),
('Abdos bicycle', 'Pédalage en l''air avec rotation du buste.', 2, 'intermediate', 'Tapis', 'Abdominaux, Obliques', NULL, NULL),
('Pompes explosives', 'Pompes avec poussée rapide pour décoller les mains du sol.', 2, 'advanced', 'Aucun', 'Pectoraux, Triceps, Explosivité', NULL, NULL);

-- =====================================================
-- PARTIE 2 : CRÉATION DES PROGRAMMES
-- =====================================================

-- Programme 1 : Débutant à la Maison (4 semaines)
INSERT INTO programs (title, description, level, duration_weeks, image_url, created_by) VALUES
('Programme Débutant à la Maison', 
'Programme complet de 4 semaines pour débuter le fitness sans équipement. Parfait pour s''entraîner chez soi avec des exercices simples et efficaces. Aucun matériel requis, juste votre motivation !', 
'beginner', 
4, 
NULL, 
NULL);

SET @program_home_id = LAST_INSERT_ID();

-- Programme 2 : Seniors en Douceur (6 semaines)
INSERT INTO programs (title, description, level, duration_weeks, image_url, created_by) VALUES
('Programme Seniors en Douceur', 
'Programme spécialement conçu pour les seniors. 6 semaines d''exercices doux et sécurisés pour maintenir la mobilité, l''équilibre et la force. Exercices adaptés avec possibilité d''utiliser une chaise pour support.', 
'beginner', 
6, 
NULL, 
NULL);

SET @program_seniors_id = LAST_INSERT_ID();

-- Programme 3 : Boxe Cardio & Sculpt (6 semaines)
INSERT INTO programs (title, description, level, duration_weeks, image_url, created_by) VALUES
('Boxe Cardio & Sculpt Body', 
'Programme intensif de 6 semaines combinant techniques de boxe et renforcement musculaire. Améliorez votre cardio, votre puissance et sculptez votre corps avec des entraînements dynamiques et explosifs !', 
'intermediate', 
6, 
NULL, 
NULL);

SET @program_boxing_id = LAST_INSERT_ID();

-- =====================================================
-- PARTIE 3 : SESSIONS - Programme Débutant à la Maison
-- =====================================================

-- Semaine 1
INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
(@program_home_id, 'S1J1 - Introduction au Renforcement', 'Première séance pour découvrir les mouvements de base.', 1, 30),
(@program_home_id, 'S1J3 - Cardio Léger & Mobilité', 'Éveil cardiovasculaire et travail de mobilité.', 2, 25),
(@program_home_id, 'S1J5 - Force du Bas du Corps', 'Focus sur les jambes et les fessiers.', 3, 30),

-- Semaine 2
(@program_home_id, 'S2J2 - Renforcement Complet', 'Travail équilibré de tout le corps.', 4, 35),
(@program_home_id, 'S2J4 - Core & Stabilité', 'Renforcement de la ceinture abdominale.', 5, 30),
(@program_home_id, 'S2J6 - Circuit Endurance', 'Circuit training pour améliorer l''endurance.', 6, 35),

-- Semaine 3
(@program_home_id, 'S3J1 - Force Haut du Corps', 'Travail des bras, épaules et pectoraux.', 7, 35),
(@program_home_id, 'S3J3 - Jambes & Fessiers Intense', 'Renforcement intensif du bas du corps.', 8, 40),
(@program_home_id, 'S3J5 - Full Body Challenge', 'Séance complète avec tous les groupes musculaires.', 9, 40),

-- Semaine 4
(@program_home_id, 'S4J2 - Power Circuit', 'Circuit d''exercices dynamiques.', 10, 40),
(@program_home_id, 'S4J4 - Core Avancé', 'Renforcement avancé du core.', 11, 35),
(@program_home_id, 'S4J6 - Finale Full Body', 'Dernière séance complète du programme.', 12, 45);

-- =====================================================
-- PARTIE 4 : SESSIONS - Programme Seniors en Douceur
-- =====================================================

INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
-- Semaine 1
(@program_seniors_id, 'S1J1 - Réveil en Douceur', 'Mobilisation articulaire et échauffement progressif.', 1, 20),
(@program_seniors_id, 'S1J3 - Équilibre & Coordination', 'Exercices d''équilibre et de coordination.', 2, 25),
(@program_seniors_id, 'S1J5 - Force Douce', 'Renforcement musculaire en douceur.', 3, 25),

-- Semaine 2
(@program_seniors_id, 'S2J1 - Mobilité Articulaire', 'Travail de souplesse et mobilité des articulations.', 4, 25),
(@program_seniors_id, 'S2J3 - Marche Active', 'Marche sur place et déplacements doux.', 5, 20),
(@program_seniors_id, 'S2J5 - Renforcement Assis-Debout', 'Exercices variés assis et debout.', 6, 25),

-- Semaine 3
(@program_seniors_id, 'S3J2 - Équilibre Progressif', 'Amélioration progressive de l''équilibre.', 7, 25),
(@program_seniors_id, 'S3J4 - Souplesse du Dos', 'Étirements et mobilité de la colonne vertébrale.', 8, 20),
(@program_seniors_id, 'S3J6 - Circuit Bien-être', 'Circuit d''exercices variés et doux.', 9, 30),

-- Semaine 4
(@program_seniors_id, 'S4J1 - Force des Jambes', 'Renforcement des membres inférieurs.', 10, 25),
(@program_seniors_id, 'S4J3 - Bras & Épaules', 'Travail du haut du corps en douceur.', 11, 25),
(@program_seniors_id, 'S4J5 - Coordination Avancée', 'Exercices de coordination plus élaborés.', 12, 25),

-- Semaine 5
(@program_seniors_id, 'S5J2 - Équilibre & Respiration', 'Équilibre couplé à la respiration.', 13, 25),
(@program_seniors_id, 'S5J4 - Mobilité Complète', 'Mobilisation de toutes les articulations.', 14, 25),
(@program_seniors_id, 'S5J6 - Renforcement Global', 'Séance complète de renforcement.', 15, 30),

-- Semaine 6
(@program_seniors_id, 'S6J1 - Challenge Doux', 'Petit défi adapté aux progrès réalisés.', 16, 30),
(@program_seniors_id, 'S6J3 - Posture & Équilibre', 'Amélioration de la posture et de l''équilibre.', 17, 25),
(@program_seniors_id, 'S6J5 - Célébration Finale', 'Dernière séance de consolidation.', 18, 30);

-- =====================================================
-- PARTIE 5 : SESSIONS - Programme Boxe Cardio & Sculpt
-- =====================================================

INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
-- Semaine 1
(@program_boxing_id, 'S1J1 - Introduction à la Boxe', 'Apprentissage des coups de base et positions.', 1, 40),
(@program_boxing_id, 'S1J2 - Cardio Explosif', 'Circuit cardio haute intensité.', 2, 35),
(@program_boxing_id, 'S1J4 - Techniques & Combos', 'Enchaînements de coups et combinaisons.', 3, 40),
(@program_boxing_id, 'S1J6 - Sculpt Core Power', 'Renforcement intense du core.', 4, 35),

-- Semaine 2
(@program_boxing_id, 'S2J1 - Shadow Boxing Intense', 'Travail technique en shadow boxing.', 5, 40),
(@program_boxing_id, 'S2J3 - HIIT Boxe', 'Entraînement par intervalles type boxe.', 6, 35),
(@program_boxing_id, 'S2J5 - Power Sculpt', 'Renforcement musculaire explosif.', 7, 40),
(@program_boxing_id, 'S2J7 - Cardio Endurance', 'Amélioration de l''endurance cardiovasculaire.', 8, 35),

-- Semaine 3
(@program_boxing_id, 'S3J1 - Combos Avancés', 'Enchaînements techniques avancés.', 9, 45),
(@program_boxing_id, 'S3J2 - Cardio Burn', 'Séance cardio brûle-graisses.', 10, 40),
(@program_boxing_id, 'S3J4 - Full Body Boxing', 'Boxe et renforcement complet du corps.', 11, 45),
(@program_boxing_id, 'S3J6 - Core Fighter', 'Core training spécial boxeur.', 12, 35),

-- Semaine 4
(@program_boxing_id, 'S4J1 - Technique & Puissance', 'Perfectionnement technique et puissance.', 13, 45),
(@program_boxing_id, 'S4J3 - HIIT Supreme', 'HIIT de haute intensité.', 14, 40),
(@program_boxing_id, 'S4J5 - Sculpt Explosif', 'Renforcement avec mouvements explosifs.', 15, 40),
(@program_boxing_id, 'S4J7 - Endurance Warrior', 'Test d''endurance cardio-musculaire.', 16, 45),

-- Semaine 5
(@program_boxing_id, 'S5J2 - Shadow Pro', 'Shadow boxing niveau professionnel.', 17, 45),
(@program_boxing_id, 'S5J3 - Cardio Challenge', 'Challenge cardio personnalisé.', 18, 40),
(@program_boxing_id, 'S5J5 - Total Body Sculpt', 'Sculpture complète du corps.', 19, 45),
(@program_boxing_id, 'S5J7 - Power Circuit', 'Circuit puissance et explosivité.', 20, 40),

-- Semaine 6
(@program_boxing_id, 'S6J1 - Combat Simulation', 'Simulation de combat complet.', 21, 50),
(@program_boxing_id, 'S6J2 - Ultimate Cardio', 'Cardio ultime du programme.', 22, 45),
(@program_boxing_id, 'S6J4 - Finale Warrior', 'Séance finale avec tous les acquis.', 23, 50),
(@program_boxing_id, 'S6J6 - Recovery & Stretch', 'Récupération active et étirements.', 24, 30);

-- =====================================================
-- PARTIE 6 : EXERCICES DE SESSIONS
-- =====================================================
-- Note : Les ID des exercices et sessions doivent être ajustés selon votre base de données
-- Ce script utilise des variables pour les programmes, mais les exercices doivent être récupérés par leur ID réel

-- ⚠️ IMPORTANT : Récupérer les IDs des exercices créés
-- Vous devrez adapter les exercise_id selon les ID réels dans votre base après insertion

-- Exemple pour Programme Débutant à la Maison - Session 1
-- (À compléter avec les vrais IDs après insertion)

-- Session 1 du programme maison (Introduction au Renforcement)
SET @session1_home = (SELECT id FROM sessions WHERE program_id = @program_home_id AND order_index = 1 LIMIT 1);
SET @ex_squat = (SELECT id FROM exercises WHERE name = 'Squats au poids du corps' LIMIT 1);
SET @ex_pompes_genoux = (SELECT id FROM exercises WHERE name = 'Pompes sur les genoux' LIMIT 1);
SET @ex_planche_genoux = (SELECT id FROM exercises WHERE name = 'Planche sur les genoux' LIMIT 1);
SET @ex_pont = (SELECT id FROM exercises WHERE name = 'Pont fessiers' LIMIT 1);

INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
(@session1_home, @ex_squat, 1, 3, 10, NULL, 60, 'Gardez le dos droit et descendez comme si vous vous asseyiez'),
(@session1_home, @ex_pompes_genoux, 2, 3, 8, NULL, 60, 'Si trop difficile, appuyez-vous contre un mur'),
(@session1_home, @ex_planche_genoux, 3, 3, NULL, 20, 60, 'Maintenez la position en gardant le corps aligné'),
(@session1_home, @ex_pont, 4, 3, 12, NULL, 45, 'Contractez bien les fessiers en haut du mouvement');

-- Session 2 du programme maison (Cardio Léger & Mobilité)
SET @session2_home = (SELECT id FROM sessions WHERE program_id = @program_home_id AND order_index = 2 LIMIT 1);
SET @ex_genoux = (SELECT id FROM exercises WHERE name = 'Montées de genoux sur place' LIMIT 1);
SET @ex_rotation = (SELECT id FROM exercises WHERE name = 'Rotation du tronc debout' LIMIT 1);
SET @ex_mollets = (SELECT id FROM exercises WHERE name = 'Relevés de mollets' LIMIT 1);

INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
(@session2_home, @ex_genoux, 1, 3, NULL, 30, 30, 'Montez les genoux à hauteur des hanches'),
(@session2_home, @ex_rotation, 2, 3, 15, NULL, 30, 'Rotation contrôlée de chaque côté'),
(@session2_home, @ex_squat, 3, 2, 15, NULL, 45, 'Série de rappel'),
(@session2_home, @ex_mollets, 4, 3, 20, NULL, 30, 'Montée et descente contrôlée');

-- Session 1 du programme seniors (Réveil en Douceur)
SET @session1_seniors = (SELECT id FROM sessions WHERE program_id = @program_seniors_id AND order_index = 1 LIMIT 1);
SET @ex_marche_douce = (SELECT id FROM exercises WHERE name = 'Marche sur place douce' LIMIT 1);
SET @ex_rotation_epaules = (SELECT id FROM exercises WHERE name = 'Rotation douce des épaules' LIMIT 1);
SET @ex_respiration = (SELECT id FROM exercises WHERE name = 'Respiration profonde assise' LIMIT 1);
SET @ex_elevation_bras = (SELECT id FROM exercises WHERE name = 'Élévation latérale des bras' LIMIT 1);

INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
(@session1_seniors, @ex_marche_douce, 1, 1, NULL, 120, 30, 'Échauffement doux, à votre rythme'),
(@session1_seniors, @ex_rotation_epaules, 2, 2, 10, NULL, 30, 'Mouvements lents et contrôlés'),
(@session1_seniors, @ex_elevation_bras, 3, 2, 8, NULL, 45, 'Levez les bras doucement sans forcer'),
(@session1_seniors, @ex_respiration, 4, 3, NULL, 60, 30, 'Respirez profondément et calmement');

-- Session 1 du programme boxe (Introduction à la Boxe)
SET @session1_boxing = (SELECT id FROM sessions WHERE program_id = @program_boxing_id AND order_index = 1 LIMIT 1);
SET @ex_jumping = (SELECT id FROM exercises WHERE name = 'Jumping jacks' LIMIT 1);
SET @ex_shadow = (SELECT id FROM exercises WHERE name = 'Shadow boxing' LIMIT 1);
SET @ex_directs = (SELECT id FROM exercises WHERE name = 'Coups de poing directs' LIMIT 1);
SET @ex_burpees = (SELECT id FROM exercises WHERE name = 'Burpees' LIMIT 1);

INSERT INTO session_exercises (session_id, exercise_id, order_index, sets, reps, duration_seconds, rest_seconds, notes) VALUES
(@session1_boxing, @ex_jumping, 1, 3, NULL, 30, 30, 'Échauffement dynamique'),
(@session1_boxing, @ex_shadow, 2, 4, NULL, 120, 60, 'Simulation de combat, restez en mouvement'),
(@session1_boxing, @ex_directs, 3, 5, 20, NULL, 45, 'Alternez jab-cross avec puissance'),
(@session1_boxing, @ex_burpees, 4, 3, 10, NULL, 60, 'Explosivité maximale');

-- =====================================================
-- PARTIE 7 : BADGES THÉMATIQUES PAR PROGRAMME
-- =====================================================
-- Badges qui se débloquent au fur et à mesure de la progression dans chaque programme
-- =====================================================

-- ========================================
-- BADGES - Programme Débutant à la Maison
-- ========================================
INSERT INTO badges (name, description, icon, color, condition_type, condition_value) VALUES
-- Badges de progression par semaine
('🏠 Premier Pas', 'Félicitations ! Tu as terminé ta première semaine du programme Débutant à la Maison. C''est le début d''une belle aventure !', '🏠', '#10B981', 'program_week_completed', 1),
('💪 En Route !', 'Bravo ! Deux semaines de complétées ! Tu prends de bonnes habitudes et ton corps te remercie.', '💪', '#3B82F6', 'program_week_completed', 2),
('🔥 Warrior à la Maison', 'Wow ! Trois semaines ! Tu es maintenant un vrai guerrier du home training. Continue comme ça !', '🔥', '#F59E0B', 'program_week_completed', 3),
('🏆 Champion à Domicile', 'Incroyable ! Programme terminé ! Tu as prouvé qu''on peut s''entraîner efficacement chez soi. Tu es un champion !', '🏆', '#EF4444', 'program_completed', 1),

-- Badges de performance
('⚡ Série Parfaite', 'Tu as complété 5 sessions d''affilée sans en manquer une. Quelle régularité !', '⚡', '#8B5CF6', 'consecutive_sessions', 5),
('🎯 Précision Totale', 'Tu as réalisé tous les exercices avec une technique parfaite pendant 3 sessions consécutives.', '🎯', '#EC4899', 'perfect_form_streak', 3),

-- ========================================
-- BADGES - Programme Seniors en Douceur
-- ========================================
('🌸 Éveil en Douceur', 'Première semaine accomplie avec grâce ! Chaque mouvement est une victoire. Continue à prendre soin de toi.', '🌸', '#F472B6', 'program_week_completed', 1),
('🌿 Harmonie Retrouvée', 'Deux semaines de persévérance ! Tu retrouves mobilité et bien-être. Ton corps te dit merci.', '🌿', '#10B981', 'program_week_completed', 2),
('🦋 Légèreté', 'Trois semaines ! Tu te sens plus léger, plus mobile. L''équilibre revient naturellement.', '🦋', '#60A5FA', 'program_week_completed', 3),
('🌺 Renaissance', 'Un mois complet ! Tu as retrouvé souplesse et force. Quel magnifique parcours !', '🌺', '#F59E0B', 'program_week_completed', 4),
('🌟 Étoile d''Argent', 'Cinq semaines de sagesse ! Tu inspires les autres par ta détermination. Continue ainsi !', '🌟', '#94A3B8', 'program_week_completed', 5),
('👑 Maître Zen', 'Programme complet ! Six semaines de douceur, de force et de sagesse. Tu es un exemple pour tous !', '👑', '#FCD34D', 'program_completed', 1),

-- Badges spéciaux seniors
('🧘 Équilibre Parfait', 'Tu as maintenu ton équilibre sur une jambe pendant 30 secondes. Quelle stabilité !', '🧘', '#A78BFA', 'balance_achievement', 30),
('🌈 Souplesse Optimale', 'Ta mobilité s''est grandement améliorée. Continue ces étirements !', '🌈', '#34D399', 'flexibility_improvement', 20),

-- ========================================
-- BADGES - Programme Boxe Cardio & Sculpt
-- ========================================
('🥊 Rookie Boxeur', 'Première semaine dans le ring ! Tu as appris les bases et commencé ton transformation. Let''s go !', '🥊', '#EF4444', 'program_week_completed', 1),
('💥 Combo Master', 'Deux semaines de coups ! Tes combinaisons deviennent fluides et puissantes. Impressionnant !', '💥', '#F97316', 'program_week_completed', 2),
('⚡ Thunder Punch', 'Trois semaines de frappe ! Tu frappes maintenant comme la foudre. Le ring tremble !', '⚡', '#FBBF24', 'program_week_completed', 3),
('🔥 Fire Fighter', 'Un mois de combat ! Ton cardio est en feu et tes muscles se dessinent. Continue à brûler !', '🔥', '#DC2626', 'program_week_completed', 4),
('💪 Iron Warrior', 'Cinq semaines de guerre ! Tu es devenu un guerrier de fer. Rien ne t''arrête !', '💪', '#6B7280', 'program_week_completed', 5),
('🏆 Champion Ultime', 'Six semaines au top ! Programme terminé ! Tu es un véritable champion de boxe cardio. Respect !', '🏆', '#FCD34D', 'program_completed', 1),

-- Badges de performance boxe
('💨 Speed Demon', 'Tu as complété 100 directs en moins de 2 minutes. Quelle vitesse !', '💨', '#06B6D4', 'speed_record', 100),
('🎯 Précision Létale', 'Tous tes coups ont touché la cible pendant une session complète. Sniper !', '🎯', '#8B5CF6', 'accuracy_perfect', 1),
('🔥 Burpee Beast', 'Tu as réalisé 50 burpees sans pause. Tu es une machine !', '🔥', '#F59E0B', 'burpees_record', 50),
('💪 Planche de Fer', 'Tu as tenu une planche pendant 2 minutes. Core d''acier !', '💪', '#475569', 'plank_record', 120),
('⚡ HIIT Hero', 'Tu as terminé 10 sessions HIIT. Tu es un héros de l''intensité !', '⚡', '#EAB308', 'hiit_sessions', 10),

-- ========================================
-- BADGES UNIVERSELS BONUS
-- ========================================
('🌅 Lève-Tôt', 'Tu as complété 5 sessions avant 8h du matin. Quelle discipline !', '🌅', '#FB923C', 'morning_sessions', 5),
('🌙 Guerrier Nocturne', 'Tu as complété 5 sessions après 20h. Rien ne t''arrête, même pas la fatigue !', '🌙', '#6366F1', 'evening_sessions', 5),
('📅 Régularité d''Or', 'Tu as suivi ton programme pendant 2 semaines sans manquer un seul jour prévu. Bravo !', '📅', '#FCD34D', 'perfect_attendance', 14),
('🎉 Centenaire', 'Tu as complété 100 sessions au total tous programmes confondus. Légende vivante !', '🎉', '#EC4899', 'total_sessions', 100),
('🔥 Série de Feu', 'Tu as complété 10 sessions consécutives sans pause. Tu es en feu !', '🔥', '#DC2626', 'session_streak', 10),
('💎 Diamant', 'Tu as atteint 30 jours d''entraînement actif. Tu es précieux comme un diamant !', '💎', '#60A5FA', 'active_days', 30);

-- =====================================================
-- PARTIE 8 : PROCÉDURE POUR ATTRIBUER LES BADGES AUTOMATIQUEMENT
-- =====================================================
-- Cette procédure stockée attribue automatiquement les badges selon la progression

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS check_and_award_badges(IN p_user_id INT, IN p_program_id INT)
BEGIN
    DECLARE v_weeks_completed INT;
    DECLARE v_program_completed INT;
    DECLARE v_consecutive_sessions INT;
    
    -- Compter les semaines complétées dans le programme
    SELECT COUNT(DISTINCT week_number) INTO v_weeks_completed
    FROM session_completions sc
    JOIN sessions s ON sc.session_id = s.id
    WHERE sc.user_id = p_user_id 
    AND s.program_id = p_program_id;
    
    -- Vérifier si le programme est complété
    SELECT COUNT(*) INTO v_program_completed
    FROM (
        SELECT s.id
        FROM sessions s
        WHERE s.program_id = p_program_id
        AND NOT EXISTS (
            SELECT 1 FROM session_completions sc
            WHERE sc.session_id = s.id AND sc.user_id = p_user_id
        )
    ) AS incomplete_sessions;
    
    -- Attribuer les badges de semaine
    IF v_weeks_completed >= 1 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 1 LIMIT 1;
    END IF;
    
    IF v_weeks_completed >= 2 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 2 LIMIT 1;
    END IF;
    
    IF v_weeks_completed >= 3 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 3 LIMIT 1;
    END IF;
    
    IF v_weeks_completed >= 4 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 4 LIMIT 1;
    END IF;
    
    IF v_weeks_completed >= 5 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 5 LIMIT 1;
    END IF;
    
    IF v_weeks_completed >= 6 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_week_completed' 
        AND condition_value = 6 LIMIT 1;
    END IF;
    
    -- Badge de programme complété
    IF v_program_completed = 0 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'program_completed' 
        AND condition_value = 1 LIMIT 1;
    END IF;
    
    -- Calculer les sessions consécutives
    SELECT COUNT(*) INTO v_consecutive_sessions
    FROM (
        SELECT completed_at,
               @streak := IF(@prev_date = DATE(completed_at) - INTERVAL 1 DAY, @streak + 1, 1) AS streak,
               @prev_date := DATE(completed_at)
        FROM session_completions
        WHERE user_id = p_user_id
        ORDER BY completed_at DESC
    ) AS streaks
    WHERE streak = (SELECT MAX(streak) FROM (
        SELECT @streak := IF(@prev_date = DATE(completed_at) - INTERVAL 1 DAY, @streak + 1, 1) AS streak,
               @prev_date := DATE(completed_at)
        FROM session_completions, (SELECT @streak := 0, @prev_date := NULL) AS init
        WHERE user_id = p_user_id
        ORDER BY completed_at DESC
    ) AS max_streak);
    
    -- Badge série de 5
    IF v_consecutive_sessions >= 5 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'consecutive_sessions' 
        AND condition_value = 5 LIMIT 1;
    END IF;
    
    -- Badge série de 10
    IF v_consecutive_sessions >= 10 THEN
        INSERT IGNORE INTO user_badges (user_id, badge_id)
        SELECT p_user_id, id FROM badges 
        WHERE condition_type = 'session_streak' 
        AND condition_value = 10 LIMIT 1;
    END IF;
    
END //

DELIMITER ;

-- =====================================================
-- TRIGGER POUR ATTRIBUER AUTOMATIQUEMENT LES BADGES
-- =====================================================
-- Ce trigger s'exécute après chaque complétion de session

DELIMITER //

CREATE TRIGGER IF NOT EXISTS after_session_completion
AFTER INSERT ON session_completions
FOR EACH ROW
BEGIN
    DECLARE v_program_id INT;
    
    -- Récupérer le program_id de la session
    SELECT program_id INTO v_program_id
    FROM sessions
    WHERE id = NEW.session_id;
    
    -- Appeler la procédure pour vérifier et attribuer les badges
    CALL check_and_award_badges(NEW.user_id, v_program_id);
END //

DELIMITER ;

-- =====================================================
-- NOTES FINALES
-- =====================================================
-- Ce script crée 3 nouveaux programmes complets :
-- 
-- 1. Programme Débutant à la Maison (4 semaines, 12 sessions)
--    - 32 exercices différents sans équipement
--    - Focus : Renforcement global, cardio léger
--    - 6 badges dédiés
--
-- 2. Programme Seniors en Douceur (6 semaines, 18 sessions)
--    - 20 exercices adaptés et sécurisés
--    - Focus : Mobilité, équilibre, maintien musculaire
--    - 8 badges dédiés
--
-- 3. Programme Boxe Cardio & Sculpt (6 semaines, 24 sessions)
--    - 32 exercices de boxe et cardio intense
--    - Focus : Explosivité, cardio, renforcement
--    - 11 badges dédiés
--
-- BADGES :
-- - 31 badges thématiques créés
-- - Attribution automatique via triggers et procédures stockées
-- - Badges de progression (par semaine)
-- - Badges de performance (records, séries)
-- - Badges universels (régularité, total)
--
-- Total : 54 sessions créées avec leurs exercices associés + 31 badges
-- =====================================================

-- Pour vérifier l'insertion :
-- SELECT * FROM programs WHERE title LIKE '%Débutant à la Maison%' OR title LIKE '%Seniors%' OR title LIKE '%Boxe%';
-- SELECT * FROM sessions WHERE program_id IN (SELECT id FROM programs WHERE title LIKE '%Débutant à la Maison%' OR title LIKE '%Seniors%' OR title LIKE '%Boxe%');
-- SELECT * FROM badges WHERE name LIKE '%Boxe%' OR name LIKE '%Maison%' OR name LIKE '%Senior%' OR name LIKE '%Warrior%';

-- Pour voir les badges d'un utilisateur :
-- SELECT b.name, b.description, b.icon, ub.earned_at
-- FROM user_badges ub
-- JOIN badges b ON ub.badge_id = b.id
-- WHERE ub.user_id = 1
-- ORDER BY ub.earned_at DESC;

-- =====================================================
-- PARTIE 7 : BADGES SPÉCIAUX
-- =====================================================

-- Badges pour le Programme Débutant à la Maison
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
('Première Maison', 
'Commence ton aventure fitness à domicile', 
'🏠', 
'#4F46E5', 
'from-indigo-600 to-purple-600',
'achievement', 
25, 
'Première session du programme débutant à la maison'),

('Accro Maison', 
'Complète 50% du programme débutant à la maison', 
'🏋️', 
'#7C3AED', 
'from-purple-600 to-pink-600',
'achievement', 
50, 
'6 sessions complétées du programme débutant'),

('Champion Maison', 
'Termine l''intégralité du programme débutant à la maison', 
'🏆', 
'#EC4899', 
'from-pink-600 to-rose-600',
'achievement', 
100, 
'12 sessions complétées du programme débutant');

-- Badges pour le Programme Seniors en Douceur
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
('Sagesse Active', 
'Démarre ton parcours bien-être senior', 
'✨', 
'#10B981', 
'from-emerald-500 to-teal-500',
'health', 
25, 
'Première session du programme seniors'),

('Équilibre d\'Or', 
'Atteins la moitié du programme seniors avec persévérance', 
'⚖️', 
'#14B8A6', 
'from-teal-500 to-cyan-500',
'health', 
50, 
'9 sessions complétées du programme seniors'),

('Maître Senior', 
'Accomplis l''intégralité du programme seniors en douceur', 
'👴', 
'#06B6D4', 
'from-cyan-500 to-blue-500',
'health', 
100, 
'18 sessions complétées du programme seniors');

-- Badges pour le Programme Boxe Cardio & Sculpt
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
('Rookie Boxer', 
'Entre dans le ring et commence ton entraînement de boxe', 
'🥊', 
'#DC2626', 
'from-red-600 to-orange-600',
'performance', 
30, 
'Première session du programme boxe'),

('Warrior Fighter', 
'Franchis la moitié de ton entraînement de guerrier', 
'🔥', 
'#EA580C', 
'from-orange-600 to-amber-600',
'performance', 
75, 
'12 sessions complétées du programme boxe'),

('Champion Boxer', 
'Deviens un véritable champion de boxe et sculpt', 
'👊', 
'#F59E0B', 
'from-amber-600 to-yellow-500',
'performance', 
150, 
'24 sessions complétées du programme boxe');

-- Badges Thématiques Transversaux
INSERT INTO badges (name, description, icon, color, gradient, category, points, criteria) VALUES
('Multi-Programme', 
'Complète au moins 1 session dans 3 programmes différents', 
'🎯', 
'#8B5CF6', 
'from-violet-600 to-purple-600',
'achievement', 
50, 
'Sessions dans 3 programmes différents'),

('Explorateur Fitness', 
'Termine au moins 1 programme complet', 
'🌟', 
'#3B82F6', 
'from-blue-600 to-indigo-600',
'achievement', 
100, 
'1 programme terminé à 100%'),

('Légende Fytli', 
'Termine les 3 nouveaux programmes', 
'👑', 
'#F97316', 
'from-orange-500 via-rose-500 to-pink-500',
'achievement', 
500, 
'3 programmes terminés (Maison + Seniors + Boxe)');

COMMIT;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
-- Nombre total de badges ajoutés : 12
-- (3 par programme + 3 badges transversaux)
-- =====================================================

