
USE lyfti;
-- =====================================================
-- MIGRATION: Ajout des time slots pour les programmes
-- Date: 2025-10-19
-- Description: Ajoute des créneaux horaires aux programmes
--              pour les notifications et rappels d'entraînement
-- =====================================================

-- Ajouter les colonnes pour les time slots
ALTER TABLE programs 
ADD COLUMN time_slot_start TIME DEFAULT NULL,
ADD COLUMN time_slot_end TIME DEFAULT NULL,
ADD COLUMN is_time_specific BOOLEAN DEFAULT FALSE;

-- Mise à jour du programme WakeUp avec son créneau horaire
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

-- Vérification
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

