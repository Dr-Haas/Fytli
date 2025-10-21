-- Vérifier toutes les structures importantes
USE lyfti;

-- 1. Structure de session_completions
SHOW COLUMNS FROM session_completions;

-- 2. Structure de feed_unlocks
SHOW COLUMNS FROM feed_unlocks;

-- 3. Structure de user_stats
SHOW COLUMNS FROM user_stats;

-- 4. Voir les données existantes dans feed_unlocks
SELECT * FROM feed_unlocks LIMIT 5;

-- 5. Voir les données existantes dans user_stats
SELECT * FROM user_stats WHERE user_id IN (3,4,5,7,8);

-- 6. Compter les completions par user
SELECT 
  user_id,
  COUNT(*) as total_completions,
  MAX(completed_at) as last_completion
FROM session_completions
GROUP BY user_id;

