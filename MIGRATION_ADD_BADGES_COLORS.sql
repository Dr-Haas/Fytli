-- =====================================================
-- MIGRATION : Ajout des colonnes color et gradient aux badges
-- =====================================================
-- À exécuter sur votre DB OVH via phpMyAdmin

-- 0. Sélectionner la base de données
USE lyfti;

-- 1. Ajouter les colonnes color et gradient à la table badges
-- Note : Si les colonnes existent déjà, commentez cette partie
ALTER TABLE badges 
ADD COLUMN color VARCHAR(20) AFTER icon,
ADD COLUMN gradient VARCHAR(100) AFTER color;

-- 2. Mettre à jour les badges existants avec les bonnes valeurs
UPDATE badges SET 
  name = 'Constance',
  description = 'Enchaîne 7 jours d\'entraînement sans interruption',
  icon = '🔥',
  color = '#FF4D3A',
  gradient = 'from-fytli-red to-fytli-orange',
  category = 'routine',
  points = 50,
  criteria = '7 jours consécutifs'
WHERE id = 1;

UPDATE badges SET 
  name = 'Progression',
  description = 'Améliore tes performances de 20%',
  icon = '💪',
  color = '#FF8A3D',
  gradient = 'from-fytli-orange to-amber-500',
  category = 'performance',
  points = 75,
  criteria = '+20% de performances'
WHERE id = 2;

UPDATE badges SET 
  name = 'Sérénité',
  description = 'Complète 5 séances de stretching ou yoga',
  icon = '🧘',
  color = '#FBFAF7',
  gradient = 'from-fytli-cream to-fytli-orange',
  category = 'health',
  points = 60,
  criteria = '5 séances zen'
WHERE id = 3;

UPDATE badges SET 
  name = 'Niveau Supérieur',
  description = 'Passe du niveau débutant à intermédiaire',
  icon = '🚀',
  color = '#FF6B3D',
  gradient = 'from-fytli-red via-fytli-orange to-amber-400',
  category = 'achievement',
  points = 100,
  criteria = 'Level up'
WHERE id = 4;

UPDATE badges SET 
  name = 'Santé Cardiaque',
  description = 'Maintiens ton pouls dans la zone optimale pendant 30 min',
  icon = '❤️',
  color = '#FF4D3A',
  gradient = 'from-red-500 to-fytli-red',
  category = 'health',
  points = 80,
  criteria = '30 min zone optimale'
WHERE id = 5;

UPDATE badges SET 
  name = 'Routine Matinale',
  description = 'Entraîne-toi avant 9h pendant 5 jours',
  icon = '🌅',
  color = '#FFB84D',
  gradient = 'from-amber-400 to-fytli-orange',
  category = 'routine',
  points = 50,
  criteria = '5 matins actifs'
WHERE id = 6;

UPDATE badges SET 
  name = 'Routine du Soir',
  description = 'Entraîne-toi après 18h pendant 5 jours',
  icon = '🌙',
  color = '#8B7355',
  gradient = 'from-amber-600 to-fytli-orange',
  category = 'routine',
  points = 50,
  criteria = '5 soirs actifs'
WHERE id = 7;

UPDATE badges SET 
  name = 'Objectif Atteint',
  description = 'Atteins ton objectif de la semaine',
  icon = '🎯',
  color = '#2BB673',
  gradient = 'from-fytli-success to-green-600',
  category = 'achievement',
  points = 100,
  criteria = 'Objectif hebdo'
WHERE id = 8;

UPDATE badges SET 
  name = 'Challenge Réussi',
  description = 'Complète un programme d\'entraînement du début à la fin',
  icon = '🏆',
  color = '#FFD700',
  gradient = 'from-yellow-400 to-amber-600',
  category = 'achievement',
  points = 150,
  criteria = 'Programme complété'
WHERE id = 9;

UPDATE badges SET 
  name = 'Esprit Fytli',
  description = 'Incarne la philosophie Fytli : régularité, bienveillance, progression',
  icon = '💫',
  color = '#FF6B3D',
  gradient = 'from-fytli-red via-fytli-orange to-amber-400',
  category = 'achievement',
  points = 200,
  criteria = 'Badge légendaire'
WHERE id = 10;

-- 3. Vérifier que tout est bien passé
SELECT id, name, icon, color, gradient, category, points FROM badges ORDER BY id;

