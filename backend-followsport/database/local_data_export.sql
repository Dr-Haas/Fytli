mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.3.0, for macos14.2 (arm64)
--
-- Host: localhost    Database: followSport_app
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `badge_progress`
--

LOCK TABLES `badge_progress` WRITE;
/*!40000 ALTER TABLE `badge_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `badge_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `badges`
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
INSERT INTO `badges` (`id`, `badge_id`, `name`, `description`, `icon`, `color`, `gradient`, `requirement`, `category`, `points`, `is_secret`, `created_at`) VALUES (21,'constance','Constance','Enchaîne 7 jours d\'entraînement sans interruption','🔥','#FF4D3A','from-fytli-red to-fytli-orange','7 jours consécutifs','routine',100,0,'2025-10-17 23:16:56'),(22,'progression','Progression','Améliore tes performances de 20%','💪','#FF8A3D','from-fytli-orange to-amber-500','+20% de performances','performance',150,0,'2025-10-17 23:16:56'),(23,'serenite','Sérénité','Complète 5 séances de stretching ou yoga','🧘','#FBFAF7','from-fytli-cream to-fytli-orange','5 séances zen','health',80,0,'2025-10-17 23:16:56'),(24,'niveau_superieur','Niveau Supérieur','Passe du niveau débutant à intermédiaire','🚀','#FF6B3D','from-fytli-red via-fytli-orange to-amber-400','Level up','achievement',200,0,'2025-10-17 23:16:56'),(25,'sante_cardiaque','Santé Cardiaque','Maintiens ton pouls dans la zone optimale pendant 30 min','❤️','#FF4D3A','from-red-500 to-fytli-red','30 min zone optimale','health',120,0,'2025-10-17 23:16:56'),(26,'routine_matinale','Routine Matinale','Entraîne-toi avant 9h pendant 5 jours','🌅','#FFB84D','from-amber-400 to-fytli-orange','5 matins actifs','routine',90,0,'2025-10-17 23:16:56'),(27,'routine_soir','Routine du Soir','Entraîne-toi après 18h pendant 5 jours','🌙','#8B7355','from-amber-600 to-fytli-orange','5 soirs actifs','routine',90,0,'2025-10-17 23:16:56'),(28,'objectif_atteint','Objectif Atteint','Atteins ton objectif de la semaine','🎯','#2BB673','from-fytli-success to-green-600','Objectif hebdo','achievement',100,0,'2025-10-17 23:16:56'),(29,'challenge_reussi','Challenge Réussi','Complète un programme d\'entraînement du début à la fin','🏆','#FFD700','from-yellow-400 to-amber-600','Programme complété','achievement',250,0,'2025-10-17 23:16:56'),(30,'esprit_fytli','Esprit Fytli','Incarne la philosophie Fytli : régularité, bienveillance, progression','💫','#FF6B3D','from-fytli-red via-fytli-orange to-amber-400','Badge légendaire','achievement',500,0,'2025-10-17 23:16:56');
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`, `label`) VALUES (6,'AUTRES'),(1,'CARDIO'),(4,'HALTERES'),(5,'LIBRE'),(2,'MACHINES'),(3,'POULIE');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `exercise_categories`
--

LOCK TABLES `exercise_categories` WRITE;
/*!40000 ALTER TABLE `exercise_categories` DISABLE KEYS */;
INSERT INTO `exercise_categories` (`id`, `name`, `requires_weight`, `requires_time`, `requires_speed`, `requires_inclination`, `is_bodyweight`, `has_machine`) VALUES (1,'Cardio – Tapis de course',0,1,1,1,0,1),(2,'Cardio – Vélo',0,1,1,0,0,1),(3,'Cardio – Rameur',0,1,1,0,0,1),(4,'Poids de corps',0,0,0,0,1,0),(5,'Renfo – Machine guidée',1,0,0,0,0,1),(6,'Renfo – Haltères',1,0,0,0,0,0);
/*!40000 ALTER TABLE `exercise_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` (`id`, `name`, `category_id`, `machine_name`, `is_bodyweight`) VALUES (1,'Tapis de marche',1,'Tapis de marche',0),(2,'Presse à cuisse',2,'Presse à cuisse',0),(3,'Développé couché',4,'Développé couché',0),(4,'Pompes',5,NULL,1),(5,'Triceps à la poulie',3,'Poulie haute',0),(6,'Tractions assistées',3,'Poulie haute',0),(7,'Gainage abdominal',5,NULL,1),(8,'Rameur',1,'Rameur',0),(9,'Squats',5,NULL,1),(10,'Fentes avec haltères',4,'Haltères',0);
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `program_enrollments`
--

LOCK TABLES `program_enrollments` WRITE;
/*!40000 ALTER TABLE `program_enrollments` DISABLE KEYS */;
INSERT INTO `program_enrollments` (`id`, `user_id`, `program_id`, `enrolled_at`, `status`) VALUES (1,1,1,'2025-10-03 00:38:40','active'),(2,1,2,'2025-10-08 00:38:40','active'),(3,2,1,'2025-09-28 00:38:40','active'),(4,2,3,'2025-10-13 00:38:40','active'),(5,3,1,'2025-10-06 00:38:40','active'),(6,3,2,'2025-10-10 00:38:40','active'),(7,3,3,'2025-10-15 00:38:40','active');
/*!40000 ALTER TABLE `program_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` (`id`, `user_id`, `title`, `description`, `level`, `duration_weeks`, `goal`, `created_at`, `updated_at`) VALUES (1,1,'Programme Débutant','Programme pour bien démarrer.','beginner',4,NULL,'2025-10-17 09:57:07','2025-10-17 09:57:07'),(2,2,'Programme Musculation','Entraînement orienté prise de masse.','beginner',4,NULL,'2025-10-17 09:57:07','2025-10-17 09:57:07'),(3,NULL,'test','','beginner',4,NULL,'2025-10-17 23:39:37','2025-10-17 23:39:37');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
INSERT INTO `progress` (`id`, `user_id`, `session_exercise_id`, `done_at`, `notes`) VALUES (1,1,1,'2025-10-17 11:57:07','Bonne séance'),(2,2,3,'2025-10-17 11:57:07','Fatigué à la fin');
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `session_completions`
--

LOCK TABLES `session_completions` WRITE;
/*!40000 ALTER TABLE `session_completions` DISABLE KEYS */;
INSERT INTO `session_completions` (`id`, `user_id`, `program_id`, `session_id`, `completed_at`, `duration_minutes`, `photo_url`, `notes`, `feeling`) VALUES (1,1,1,1,'2025-10-04 00:38:40',45,NULL,'Première session, bon début !','good'),(2,1,1,2,'2025-10-06 00:38:40',50,NULL,'Super motivé aujourd\'hui','excellent'),(3,1,1,1,'2025-10-08 00:38:40',42,NULL,'Deuxième fois sur cette session','good'),(4,1,1,3,'2025-10-10 00:38:40',55,NULL,'Record personnel !','excellent'),(5,1,1,2,'2025-10-12 00:38:40',48,NULL,'Bonne progression','good'),(6,1,1,4,'2025-10-14 00:38:40',52,NULL,'Top forme','excellent'),(7,1,1,1,'2025-10-16 00:38:40',40,NULL,'Un peu fatigué','okay'),(8,1,2,3,'2025-10-11 00:38:40',35,NULL,'Nouveau programme','good'),(9,1,2,3,'2025-10-15 00:38:40',38,NULL,'Ça devient plus facile','excellent'),(10,2,1,1,'2025-09-29 00:38:40',50,NULL,'Bon démarrage','good'),(11,2,1,2,'2025-10-02 00:38:40',48,NULL,'Je progresse','good'),(12,2,1,1,'2025-10-05 00:38:40',45,NULL,'Dur aujourd\'hui','okay'),(13,2,1,3,'2025-10-08 00:38:40',52,NULL,'Super séance !','excellent'),(14,2,1,2,'2025-10-11 00:38:40',47,NULL,'Régularité importante','good'),(15,2,3,4,'2025-10-14 00:38:40',40,NULL,'Nouveau challenge','good'),(16,3,1,1,'2025-10-07 00:38:40',48,NULL,'Let\'s go !','excellent'),(17,3,1,2,'2025-10-09 00:38:40',50,NULL,'Au top','excellent'),(18,3,1,1,'2025-10-11 00:38:40',46,NULL,'Bon rythme','good'),(19,3,1,3,'2025-10-13 00:38:40',53,NULL,'Record battu','excellent'),(20,3,1,2,'2025-10-15 00:38:40',49,NULL,'Motivation max','excellent'),(21,3,1,4,'2025-10-17 00:38:40',51,NULL,'Best session ever','excellent'),(22,3,2,3,'2025-10-12 00:38:40',42,NULL,'Programme 2 commence bien','good'),(23,3,2,3,'2025-10-16 00:38:40',44,NULL,'De mieux en mieux','excellent'),(24,3,3,4,'2025-10-16 00:38:40',38,NULL,'Programme 3 lancé','good'),(25,3,3,4,'2025-10-18 01:17:05',0,NULL,NULL,'good'),(26,3,3,4,'2025-10-18 01:17:05',0,NULL,NULL,'good'),(27,3,2,3,'2025-10-18 01:28:41',0,NULL,NULL,'good'),(28,3,2,3,'2025-10-18 01:28:41',0,NULL,NULL,'good'),(29,3,2,3,'2025-10-18 09:21:37',1,NULL,NULL,'good'),(30,3,2,3,'2025-10-18 09:21:37',1,NULL,NULL,'good'),(31,3,1,1,'2025-10-18 13:22:53',0,NULL,NULL,'good'),(32,3,1,1,'2025-10-18 13:22:53',0,NULL,NULL,'good');
/*!40000 ALTER TABLE `session_completions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `session_exercises`
--

LOCK TABLES `session_exercises` WRITE;
/*!40000 ALTER TABLE `session_exercises` DISABLE KEYS */;
INSERT INTO `session_exercises` (`id`, `session_id`, `exercise_id`, `order`, `sets`, `reps`, `weight_kg`, `tempo`, `rest_sec`) VALUES (1,1,1,1,1,15,5,'1-1-1',60),(2,2,2,1,4,10,80,'2-0-2',90),(3,3,3,1,4,12,70,'2-1-2',120),(4,3,5,2,3,15,25,'2-1-2',60),(5,4,4,1,3,12,NULL,'2-1-2',60),(6,4,9,2,4,15,NULL,'2-1-2',60),(7,4,7,3,3,30,NULL,'3-0-1',45);
/*!40000 ALTER TABLE `session_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`id`, `program_id`, `title`, `order`, `created_at`, `updated_at`) VALUES (1,1,'Séance 1 - Cardio',1,'2025-10-17 09:57:07','2025-10-17 09:57:07'),(2,1,'Séance 2 - Renforcement',2,'2025-10-17 09:57:07','2025-10-17 09:57:07'),(3,2,'Séance 1 - Pecs & Triceps',1,'2025-10-17 09:57:07','2025-10-17 09:57:07'),(4,3,'Session principale',1,'2025-10-18 00:13:52','2025-10-18 00:13:52');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_badges`
--

LOCK TABLES `user_badges` WRITE;
/*!40000 ALTER TABLE `user_badges` DISABLE KEYS */;
INSERT INTO `user_badges` (`id`, `user_id`, `badge_id`, `earned_at`, `progress`) VALUES (1,1,'constance','2025-10-15 01:04:33',100),(2,1,'progression','2025-10-17 01:04:33',100),(3,2,'constance','2025-10-13 01:04:33',100),(4,3,'constance','2025-10-16 01:04:33',100),(5,3,'progression','2025-10-17 01:04:33',100),(6,3,'niveau_superieur','2025-10-18 01:04:33',100);
/*!40000 ALTER TABLE `user_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_stats`
--

LOCK TABLES `user_stats` WRITE;
/*!40000 ALTER TABLE `user_stats` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `role`, `password_hash`, `first_name`, `last_name`, `birth_date`, `is_female`, `height_cm`, `weight_kg`, `body_fat_pct`, `muscle_mass_kg`, `objective`, `created_at`, `updated_at`) VALUES (1,'john@example.com','user','hashedpassword456','John','Smith','1988-10-25',0,180,85,18,65,'Gagner en muscle','2025-10-17 09:57:07','2025-10-17 09:57:07'),(2,'test@example.com','user','hashedpassword123','Alice','Durand','1990-05-12',1,165,60,22.5,45,'Perdre du poids','2025-10-17 09:57:07','2025-10-17 09:57:07'),(3,'garysaah@gmail.com','admin','$2b$10$jvK2Ym0Bd56VjjRRD5r9POSGn8PHCXzs7WPPM6Rva3WWsa3k/qNEe','gary','haas',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-17 21:25:59','2025-10-18 00:51:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `workout_history`
--

LOCK TABLES `workout_history` WRITE;
/*!40000 ALTER TABLE `workout_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `workout_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-18 16:48:14
