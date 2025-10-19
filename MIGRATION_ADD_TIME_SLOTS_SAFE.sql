-- =====================================================
-- MIGRATION: Ajout des time slots pour les programmes (VERSION SÉCURISÉE)
-- Date: 2025-10-19
-- Description: Ajoute des créneaux horaires aux programmes
--              pour les notifications et rappels d'entraînement
--              Cette version vérifie si les colonnes existent déjà
-- =====================================================

USE lyfti;

-- Procédure pour ajouter une colonne seulement si elle n'existe pas
DELIMITER $$

CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(100),
    IN columnName VARCHAR(100),
    IN columnDefinition TEXT
)
BEGIN
    DECLARE columnExists INT;
    
    SELECT COUNT(*) INTO columnExists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = tableName
      AND COLUMN_NAME = columnName;
    
    IF columnExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', columnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('✅ Colonne ', columnName, ' ajoutée à ', tableName) AS message;
    ELSE
        SELECT CONCAT('ℹ️  Colonne ', columnName, ' existe déjà dans ', tableName) AS message;
    END IF;
END$$

DELIMITER ;

-- Ajouter les colonnes une par une de manière sécurisée
CALL AddColumnIfNotExists('programs', 'time_slot_start', 'TIME DEFAULT NULL');
CALL AddColumnIfNotExists('programs', 'time_slot_end', 'TIME DEFAULT NULL');
CALL AddColumnIfNotExists('programs', 'is_time_specific', 'BOOLEAN DEFAULT FALSE');

-- Supprimer la procédure temporaire
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- Mise à jour du programme WakeUp avec son créneau horaire (sans erreur si déjà fait)
UPDATE programs 
SET 
  time_slot_start = '07:00:00',
  time_slot_end = '09:30:00',
  is_time_specific = TRUE
WHERE title LIKE '%Wake%' OR title LIKE '%Réveil%' OR title LIKE '%Matin%';

-- Si vous avez d'autres programmes avec des créneaux spécifiques
-- Exemple : Programme du soir (18h-21h)
-- UPDATE programs 
-- SET 
--   time_slot_start = '18:00:00',
--   time_slot_end = '21:00:00',
--   is_time_specific = TRUE
-- WHERE title LIKE '%Evening%' OR title LIKE '%Soir%';

-- Exemple : Programme midi (12h-14h)
-- UPDATE programs 
-- SET 
--   time_slot_start = '12:00:00',
--   time_slot_end = '14:00:00',
--   is_time_specific = TRUE
-- WHERE title LIKE '%Lunch%' OR title LIKE '%Midi%';

-- Vérification finale
SELECT '✅ Migration time_slots terminée avec succès' AS status;

SELECT 
  id as program_id,
  title,
  time_slot_start,
  time_slot_end,
  is_time_specific,
  CASE 
    WHEN is_time_specific THEN 
      CONCAT('Créneau: ', time_slot_start, ' - ', time_slot_end)
    ELSE 
      'Flexible - À faire dans la journée'
  END as schedule_info
FROM programs
ORDER BY is_time_specific DESC, time_slot_start;

