-- =====================================================
-- SYSTÈME D'INSCRIPTION AUX PROGRAMMES
-- =====================================================
-- Ce fichier crée les tables nécessaires pour :
-- 1. Inscription des utilisateurs aux programmes
-- 2. Suivi des sessions complétées avec photos
-- =====================================================

-- Table : program_enrollments
-- Description : Gère les inscriptions des utilisateurs aux programmes
CREATE TABLE IF NOT EXISTS program_enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'paused', 'completed', 'abandoned') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, program_id),
  INDEX idx_user_id (user_id),
  INDEX idx_program_id (program_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : session_completions
-- Description : Enregistre chaque session complétée par un utilisateur avec photo optionnelle
CREATE TABLE IF NOT EXISTS session_completions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  session_id INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_minutes INT,
  photo_url VARCHAR(500),
  notes TEXT,
  feeling ENUM('terrible', 'bad', 'okay', 'good', 'excellent'),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_program_id (program_id),
  INDEX idx_session_id (session_id),
  INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DONNÉES DE TEST
-- =====================================================

-- Inscriptions des utilisateurs 1, 2, 3 aux programmes
INSERT INTO program_enrollments (user_id, program_id, enrolled_at, status) VALUES
  (1, 1, DATE_SUB(NOW(), INTERVAL 15 DAY), 'active'),
  (1, 2, DATE_SUB(NOW(), INTERVAL 10 DAY), 'active'),
  (2, 1, DATE_SUB(NOW(), INTERVAL 20 DAY), 'active'),
  (2, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 'active'),
  (3, 1, DATE_SUB(NOW(), INTERVAL 12 DAY), 'active'),
  (3, 2, DATE_SUB(NOW(), INTERVAL 8 DAY), 'active'),
  (3, 3, DATE_SUB(NOW(), INTERVAL 3 DAY), 'active')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Sessions complétées avec des données variées
-- User 1 : très actif sur programme 1
INSERT INTO session_completions (user_id, program_id, session_id, completed_at, duration_minutes, feeling, notes) VALUES
  (1, 1, 1, DATE_SUB(NOW(), INTERVAL 14 DAY), 45, 'good', 'Première session, bon début !'),
  (1, 1, 2, DATE_SUB(NOW(), INTERVAL 12 DAY), 50, 'excellent', 'Super motivé aujourd\'hui'),
  (1, 1, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), 42, 'good', 'Deuxième fois sur cette session'),
  (1, 1, 3, DATE_SUB(NOW(), INTERVAL 8 DAY), 55, 'excellent', 'Record personnel !'),
  (1, 1, 2, DATE_SUB(NOW(), INTERVAL 6 DAY), 48, 'good', 'Bonne progression'),
  (1, 1, 4, DATE_SUB(NOW(), INTERVAL 4 DAY), 52, 'excellent', 'Top forme'),
  (1, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), 40, 'okay', 'Un peu fatigué'),
  (1, 2, 3, DATE_SUB(NOW(), INTERVAL 7 DAY), 35, 'good', 'Nouveau programme'),
  (1, 2, 3, DATE_SUB(NOW(), INTERVAL 3 DAY), 38, 'excellent', 'Ça devient plus facile');

-- User 2 : régulier sur programme 1
INSERT INTO session_completions (user_id, program_id, session_id, completed_at, duration_minutes, feeling, notes) VALUES
  (2, 1, 1, DATE_SUB(NOW(), INTERVAL 19 DAY), 50, 'good', 'Bon démarrage'),
  (2, 1, 2, DATE_SUB(NOW(), INTERVAL 16 DAY), 48, 'good', 'Je progresse'),
  (2, 1, 1, DATE_SUB(NOW(), INTERVAL 13 DAY), 45, 'okay', 'Dur aujourd\'hui'),
  (2, 1, 3, DATE_SUB(NOW(), INTERVAL 10 DAY), 52, 'excellent', 'Super séance !'),
  (2, 1, 2, DATE_SUB(NOW(), INTERVAL 7 DAY), 47, 'good', 'Régularité importante'),
  (2, 3, 4, DATE_SUB(NOW(), INTERVAL 4 DAY), 40, 'good', 'Nouveau challenge');

-- User 3 : super actif sur tous ses programmes
INSERT INTO session_completions (user_id, program_id, session_id, completed_at, duration_minutes, feeling, notes) VALUES
  (3, 1, 1, DATE_SUB(NOW(), INTERVAL 11 DAY), 48, 'excellent', 'Let\'s go !'),
  (3, 1, 2, DATE_SUB(NOW(), INTERVAL 9 DAY), 50, 'excellent', 'Au top'),
  (3, 1, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), 46, 'good', 'Bon rythme'),
  (3, 1, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), 53, 'excellent', 'Record battu'),
  (3, 1, 2, DATE_SUB(NOW(), INTERVAL 3 DAY), 49, 'excellent', 'Motivation max'),
  (3, 1, 4, DATE_SUB(NOW(), INTERVAL 1 DAY), 51, 'excellent', 'Best session ever'),
  (3, 2, 3, DATE_SUB(NOW(), INTERVAL 6 DAY), 42, 'good', 'Programme 2 commence bien'),
  (3, 2, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 44, 'excellent', 'De mieux en mieux'),
  (3, 3, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), 38, 'good', 'Programme 3 lancé');

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher les statistiques par utilisateur
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT pe.program_id) as programs_enrolled,
  COUNT(sc.id) as total_sessions_completed
FROM users u
LEFT JOIN program_enrollments pe ON u.id = pe.user_id
LEFT JOIN session_completions sc ON u.id = sc.user_id
WHERE u.id IN (1, 2, 3)
GROUP BY u.id;

-- Afficher les inscriptions par programme
SELECT 
  p.id,
  p.title,
  COUNT(pe.user_id) as enrolled_users,
  COUNT(sc.id) as total_completions
FROM programs p
LEFT JOIN program_enrollments pe ON p.id = pe.program_id
LEFT JOIN session_completions sc ON p.id = sc.program_id
GROUP BY p.id;

