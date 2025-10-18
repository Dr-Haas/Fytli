-- =====================================================
-- MIGRATION : Ajout de champs à la table programs
-- =====================================================
-- Date : 18 Octobre 2025
-- Description : Ajoute les colonnes sessions_per_week, category_id et is_public
-- =====================================================

-- 1. Ajouter la colonne sessions_per_week
ALTER TABLE programs 
ADD COLUMN sessions_per_week INT DEFAULT 3 
COMMENT 'Nombre de sessions par semaine';

-- 2. Ajouter la colonne category_id avec clé étrangère
ALTER TABLE programs 
ADD COLUMN category_id INT NULL,
ADD CONSTRAINT fk_programs_category 
  FOREIGN KEY (category_id) REFERENCES categories(id) 
  ON DELETE SET NULL;

-- 3. Ajouter un index sur category_id pour optimiser les requêtes
ALTER TABLE programs 
ADD INDEX idx_category_id (category_id);

-- 4. Ajouter la colonne is_public
ALTER TABLE programs 
ADD COLUMN is_public TINYINT(1) DEFAULT 1 
COMMENT 'Programme visible publiquement (1=oui, 0=non)';

-- 5. Ajouter un index sur is_public pour filtrer rapidement
ALTER TABLE programs 
ADD INDEX idx_is_public (is_public);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Afficher la structure de la table programs
DESC programs;

-- Vérifier les contraintes de clés étrangères
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'programs' 
  AND TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- =====================================================
-- ROLLBACK (si nécessaire)
-- =====================================================
-- Pour annuler cette migration, décommentez et exécutez :
/*
ALTER TABLE programs DROP FOREIGN KEY fk_programs_category;
ALTER TABLE programs DROP INDEX idx_category_id;
ALTER TABLE programs DROP COLUMN category_id;
ALTER TABLE programs DROP INDEX idx_is_public;
ALTER TABLE programs DROP COLUMN is_public;
ALTER TABLE programs DROP COLUMN sessions_per_week;
*/

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================
-- ✅ Colonnes ajoutées avec succès !
-- 
-- Nouveaux champs :
-- - sessions_per_week (INT, défaut: 3)
-- - category_id (INT, nullable, foreign key vers categories)
-- - is_public (TINYINT(1), défaut: 1)
-- 
-- Index créés :
-- - idx_category_id
-- - idx_is_public
-- =====================================================

