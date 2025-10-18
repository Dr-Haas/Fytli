-- =====================================================
-- MIGRATION : Mise à jour de la table weekly_goals
-- =====================================================
-- Ajout des colonnes pour gérer tous les types d'objectifs
-- =====================================================

USE lyfti;

-- Ajouter la colonne pour la description personnalisée
ALTER TABLE weekly_goals 
ADD COLUMN description TEXT NULL AFTER goal_achieved;

-- Ajouter la colonne pour les programmes cibles (stocké en JSON)
ALTER TABLE weekly_goals 
ADD COLUMN target_programs JSON NULL AFTER description;

-- Ajouter la colonne pour les sessions cibles (stocké en JSON)
ALTER TABLE weekly_goals 
ADD COLUMN target_sessions JSON NULL AFTER target_programs;

-- Mettre à jour le type ENUM pour inclure tous les types d'objectifs
ALTER TABLE weekly_goals 
MODIFY COLUMN goal_type ENUM('workouts', 'duration', 'exercises', 'streak', 'programs', 'sessions') DEFAULT 'workouts';

-- Vérification
DESC weekly_goals;

-- =====================================================
-- ROLLBACK (si nécessaire)
-- =====================================================
-- Pour annuler cette migration :
/*
ALTER TABLE weekly_goals DROP COLUMN description;
ALTER TABLE weekly_goals DROP COLUMN target_programs;
ALTER TABLE weekly_goals DROP COLUMN target_sessions;
ALTER TABLE weekly_goals MODIFY COLUMN goal_type ENUM('workouts', 'duration', 'exercises') DEFAULT 'workouts';
*/

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
-- ✅ Colonnes ajoutées avec succès !
-- 
-- Nouvelles colonnes :
-- - description (TEXT) - Description personnalisée
-- - target_programs (JSON) - IDs des programmes ciblés
-- - target_sessions (JSON) - IDs des sessions ciblées
-- 
-- Types d'objectifs supportés :
-- - workouts (séances)
-- - duration (durée en minutes)
-- - exercises (nombre d'exercices)
-- - streak (jours consécutifs)
-- - programs (programmes à compléter)
-- - sessions (sessions à compléter)
-- =====================================================

