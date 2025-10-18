-- =====================================================
-- ATTRIBUTION DE BADGES AUX UTILISATEURS
-- =====================================================
-- Ce script ajoute des badges aux utilisateurs 1, 2, 3
-- basé sur leurs activités
-- =====================================================

-- User 1 (John Smith) - 9 sessions, très actif
-- Badge constance (7 jours consécutifs) - débloquer
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (1, 'constance', DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- Badge progression (amélioration 20%)
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (1, 'progression', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- User 2 (Alice Durand) - 6 sessions, régulier
-- Badge constance
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (2, 'constance', DATE_SUB(NOW(), INTERVAL 5 DAY))
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- User 3 (gary haas) - 9 sessions, super actif sur tous programmes
-- Badge constance
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (3, 'constance', DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- Badge progression
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (3, 'progression', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- Badge niveau_superieur (programme complété)
INSERT INTO user_badges (user_id, badge_id, earned_at) 
VALUES (3, 'niveau_superieur', NOW())
ON DUPLICATE KEY UPDATE earned_at = earned_at;

-- Vérification
SELECT 
    u.id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) as name,
    COUNT(ub.badge_id) as badges_earned,
    GROUP_CONCAT(ub.badge_id ORDER BY ub.earned_at DESC SEPARATOR ', ') as badges
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
WHERE u.id IN (1, 2, 3)
GROUP BY u.id;

