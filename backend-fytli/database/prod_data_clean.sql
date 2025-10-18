-- =====================================================
-- DONNÉES PRODUCTION POUR BASE OVH
-- =====================================================
-- Données réelles de votre application Fytli
-- Sans le programme "test"
-- À importer dans la base "lyfti" sur OVH Web Cloud Database
-- =====================================================

SET FOREIGN_KEY_CHECKS=0;

-- =====================================================
-- BADGES
-- =====================================================
INSERT INTO `badges` (`id`, `name`, `description`, `icon`, `category`, `points`, `criteria`, `created_at`) VALUES 
(21,'Constance','Enchaîne 7 jours d\'entraînement sans interruption','🔥','routine',100,'7 jours consécutifs','2025-10-17 23:16:56'),
(22,'Progression','Améliore tes performances de 20%','💪','performance',150,'+20% de performances','2025-10-17 23:16:56'),
(23,'Sérénité','Complète 5 séances de stretching ou yoga','🧘','health',80,'5 séances zen','2025-10-17 23:16:56'),
(24,'Niveau Supérieur','Passe du niveau débutant à intermédiaire','🚀','achievement',200,'Level up','2025-10-17 23:16:56'),
(25,'Santé Cardiaque','Maintiens ton pouls dans la zone optimale pendant 30 min','❤️','health',120,'30 min zone optimale','2025-10-17 23:16:56'),
(26,'Routine Matinale','Entraîne-toi avant 9h pendant 5 jours','🌅','routine',90,'5 matins actifs','2025-10-17 23:16:56'),
(27,'Routine du Soir','Entraîne-toi après 18h pendant 5 jours','🌙','routine',90,'5 soirs actifs','2025-10-17 23:16:56'),
(28,'Objectif Atteint','Atteins ton objectif de la semaine','🎯','achievement',100,'Objectif hebdo','2025-10-17 23:16:56'),
(29,'Challenge Réussi','Complète un programme d\'entraînement du début à la fin','🏆','achievement',250,'Programme complété','2025-10-17 23:16:56'),
(30,'Esprit Fytli','Incarne la philosophie Fytli : régularité, bienveillance, progression','💫','achievement',500,'Badge légendaire','2025-10-17 23:16:56')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- CATÉGORIES
-- =====================================================
INSERT INTO `categories` (`id`, `name`, `description`) VALUES 
(1,'Cardio','Exercices cardiovasculaires'),
(2,'Force','Exercices de musculation et renforcement'),
(3,'Flexibilité','Étirements et mobilité'),
(4,'Équilibre','Exercices d\'équilibre et stabilité'),
(5,'Récupération','Exercices de récupération active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- EXERCICES
-- =====================================================
INSERT INTO `exercises` (`id`, `name`, `description`, `category_id`, `difficulty_level`, `equipment`, `muscle_groups`) VALUES 
(1,'Tapis de marche','Marche ou course sur tapis',1,'beginner','Tapis de course','Jambes, Cardio'),
(2,'Presse à cuisse','Presse guidée pour les cuisses',2,'beginner','Machine guidée','Quadriceps, Fessiers'),
(3,'Développé couché','Développé couché aux haltères',2,'intermediate','Haltères, Banc','Pectoraux, Triceps, Épaules'),
(4,'Pompes','Exercice au poids du corps',2,'beginner','Aucun','Pectoraux, Triceps, Core'),
(5,'Triceps à la poulie','Extension triceps à la poulie haute',2,'beginner','Poulie haute','Triceps'),
(6,'Tractions assistées','Tractions avec assistance',2,'intermediate','Poulie haute','Dos, Biceps'),
(7,'Gainage abdominal','Planche abdominale',2,'beginner','Tapis','Abdominaux, Core'),
(8,'Rameur','Rameur cardio',1,'beginner','Rameur','Corps entier, Cardio'),
(9,'Squats','Squats au poids du corps',2,'beginner','Aucun','Quadriceps, Fessiers'),
(10,'Fentes avec haltères','Fentes alternées',2,'intermediate','Haltères','Quadriceps, Fessiers, Équilibre')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- =====================================================
-- PROGRAMMES (Sans le programme "test")
-- =====================================================
INSERT INTO `programs` (`id`, `title`, `description`, `level`, `duration_weeks`, `created_by`, `created_at`) VALUES 
(1,'Programme Débutant','Programme pour bien démarrer en douceur. Adapté aux personnes qui reprennent le sport.','beginner',4,1,'2025-10-17 09:57:07'),
(2,'Programme Musculation','Entraînement orienté prise de masse et renforcement musculaire.','intermediate',4,2,'2025-10-17 09:57:07')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- =====================================================
-- SESSIONS (Seulement pour programmes 1 et 2)
-- =====================================================
INSERT INTO `sessions` (`id`, `program_id`, `title`, `description`, `order_index`, `target_duration_minutes`, `created_at`) VALUES 
(1,1,'Séance 1 - Cardio','Séance d\'introduction avec cardio léger',1,30,'2025-10-17 09:57:07'),
(2,1,'Séance 2 - Renforcement','Renforcement musculaire au poids du corps',2,35,'2025-10-17 09:57:07'),
(3,2,'Séance 1 - Pecs & Triceps','Travail des pectoraux et triceps',1,45,'2025-10-17 09:57:07')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- =====================================================
-- EXERCICES DES SESSIONS
-- =====================================================
INSERT INTO `session_exercises` (`id`, `session_id`, `exercise_id`, `order_index`, `sets`, `reps`, `duration_seconds`, `rest_seconds`) VALUES 
(1,1,1,1,1,15,900,60),
(2,2,2,1,4,10,NULL,90),
(3,3,3,1,4,12,NULL,120),
(4,3,5,2,3,15,NULL,60),
(5,2,4,1,3,12,NULL,60),
(6,2,9,2,4,15,NULL,60),
(7,2,7,3,3,30,NULL,45)
ON DUPLICATE KEY UPDATE exercise_id=VALUES(exercise_id);

-- =====================================================
-- UTILISATEURS (Nettoyé pour production)
-- =====================================================
-- Note: Les utilisateurs seront créés lors de l'inscription
-- On ne garde que l'admin pour la gestion

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `created_at`) VALUES 
(3,'garysaah@gmail.com','$2b$10$jvK2Ym0Bd56VjjRRD5r9POSGn8PHCXzs7WPPM6Rva3WWsa3k/qNEe','Gary','Haas','admin','2025-10-17 21:25:59')
ON DUPLICATE KEY UPDATE email=VALUES(email);

SET FOREIGN_KEY_CHECKS=1;

-- =====================================================
-- FIN DE L'IMPORT
-- =====================================================
-- ✅ Données de production importées avec succès !
-- 
-- Contenu :
-- - 10 badges Fytli
-- - 5 catégories d'exercices
-- - 10 exercices variés
-- - 2 programmes (Débutant et Musculation)
-- - 3 sessions d'entraînement
-- - 7 exercices configurés dans les sessions
-- - 1 utilisateur admin
-- =====================================================

