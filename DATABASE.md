# 🗄️ Fytli - Documentation Base de Données

> Guide complet pour installer, configurer et gérer la base de données MySQL de Fytli.

---

## 📋 Table des Matières

1. [Installation Rapide](#-installation-rapide)
2. [Schéma Complet](#-schéma-complet)
3. [Tables Détaillées](#-tables-détaillées)
4. [Relations](#-relations)
5. [Migrations](#-migrations)
6. [Données de Test](#-données-de-test)
7. [Requêtes Utiles](#-requêtes-utiles)
8. [Maintenance](#-maintenance)
9. [Backup & Restore](#-backup--restore)

---

## 🚀 Installation Rapide

### Prérequis

- MySQL 8.0+
- Accès root à MySQL

### Étapes d'Installation

```bash
# 1. Se connecter à MySQL
mysql -u root -p

# 2. Créer la base de données
CREATE DATABASE IF NOT EXISTS followsport_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE followsport_app;

# 3. Importer le schéma principal
source backend-followsport/database/enrollment_system.sql;

# 4. Importer le système de badges
source backend-followsport/database/addUserBadges.sql;

# 5. Vérifier l'installation
SHOW TABLES;
SELECT COUNT(*) as total_tables FROM information_schema.tables 
WHERE table_schema = 'followsport_app';
```

### Configuration Backend

```bash
# Fichier backend-followsport/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=followsport_app
DB_PORT=3306
```

---

## 🏗️ Schéma Complet

### Vue d'Ensemble

```
followsport_app
├── users                    (Utilisateurs)
├── categories               (Catégories d'exercices)
├── exercises                (Bibliothèque d'exercices)
├── programs                 (Programmes d'entraînement)
├── sessions                 (Sessions d'un programme)
├── session_exercises        (Exercices d'une session)
├── enrollments              (Inscriptions aux programmes)
├── session_completions      (Séances complétées)
├── badges                   (Badges disponibles)
└── user_badges              (Badges gagnés par utilisateur)
```

### Diagramme des Relations

```
users ──┬──< enrollments >── programs ──< sessions ──< session_exercises >── exercises
        │                                     │
        ├──< session_completions ────────────┘
        │
        └──< user_badges >── badges

categories ──< exercises
```

---

## 📊 Tables Détaillées

### Table `users`

Stocke les informations des utilisateurs de l'application.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
  fitness_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  goal TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `id` : Identifiant unique
- `first_name` : Prénom
- `last_name` : Nom de famille
- `email` : Email unique (utilisé pour la connexion)
- `password_hash` : Mot de passe hashé avec bcrypt
- `birthdate` : Date de naissance (optionnel)
- `gender` : Genre (male, female, other, prefer_not_to_say)
- `fitness_level` : Niveau de fitness (beginner, intermediate, advanced)
- `goal` : Objectif personnel (texte libre)
- `role` : Rôle (user, admin)
- `created_at` : Date de création
- `updated_at` : Date de dernière modification

**Indexes** :
- Index sur `email` pour les recherches et authentification
- Index sur `role` pour filtrer les admins

---

### Table `categories`

Catégories d'exercices (Force, Cardio, Flexibilité, etc.).

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Données Initiales** :
```sql
INSERT INTO categories (name, description) VALUES
('Force', 'Exercices de musculation et renforcement'),
('Cardio', 'Exercices cardiovasculaires'),
('Flexibilité', 'Étirements et mobilité'),
('Équilibre', 'Exercices d\'équilibre et stabilité'),
('Récupération', 'Exercices de récupération active');
```

---

### Table `exercises`

Bibliothèque d'exercices disponibles.

```sql
CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  equipment VARCHAR(255),
  muscle_groups TEXT,
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_difficulty (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `name` : Nom de l'exercice
- `description` : Description détaillée
- `category_id` : Référence à la catégorie
- `difficulty_level` : Niveau de difficulté
- `equipment` : Équipement nécessaire
- `muscle_groups` : Groupes musculaires sollicités
- `video_url` : URL de la vidéo démo
- `image_url` : URL de l'image

---

### Table `programs`

Programmes d'entraînement créés par les utilisateurs.

```sql
CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  duration_weeks INT,
  image_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_by (created_by),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `title` : Titre du programme
- `description` : Description du programme
- `level` : Niveau de difficulté
- `duration_weeks` : Durée en semaines
- `image_url` : Image du programme
- `created_by` : Utilisateur créateur

---

### Table `sessions`

Sessions individuelles d'un programme.

```sql
CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  target_duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_program (program_id),
  INDEX idx_order (program_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `program_id` : Référence au programme
- `title` : Titre de la session
- `description` : Description de la session
- `order_index` : Ordre dans le programme
- `target_duration_minutes` : Durée cible en minutes

---

### Table `session_exercises`

Exercices inclus dans une session avec leur configuration.

```sql
CREATE TABLE session_exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  exercise_id INT NOT NULL,
  order_index INT DEFAULT 0,
  sets INT DEFAULT 3,
  reps INT,
  duration_seconds INT,
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  INDEX idx_session (session_id),
  INDEX idx_order (session_id, order_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `session_id` : Référence à la session
- `exercise_id` : Référence à l'exercice
- `order_index` : Ordre dans la session
- `sets` : Nombre de séries
- `reps` : Répétitions par série
- `duration_seconds` : Durée en secondes (pour exercices temporisés)
- `rest_seconds` : Temps de repos entre séries
- `notes` : Notes spécifiques

---

### Table `enrollments`

Inscriptions des utilisateurs aux programmes.

```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  status ENUM('active', 'completed', 'paused') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_program (program_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_active_enrollment (user_id, program_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `user_id` : Référence à l'utilisateur
- `program_id` : Référence au programme
- `status` : Statut (active, completed, paused)
- `started_at` : Date de début
- `completed_at` : Date de complétion

**Contrainte** : Un utilisateur ne peut avoir qu'une seule inscription active par programme.

---

### Table `session_completions`

Historique des séances complétées par les utilisateurs.

```sql
CREATE TABLE session_completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  session_id INT NOT NULL,
  duration_minutes INT,
  notes TEXT,
  feeling ENUM('poor', 'okay', 'good', 'great', 'excellent'),
  photo_url VARCHAR(500),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_program (program_id),
  INDEX idx_session (session_id),
  INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Champs** :
- `user_id` : Référence à l'utilisateur
- `program_id` : Référence au programme
- `session_id` : Référence à la session
- `duration_minutes` : Durée réelle de la séance
- `notes` : Notes personnelles
- `feeling` : Ressenti (poor, okay, good, great, excellent)
- `photo_url` : URL de la photo uploadée
- `completed_at` : Date et heure de complétion

---

### Table `badges`

Badges disponibles dans le système de gamification.

```sql
CREATE TABLE badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category ENUM('routine', 'performance', 'health', 'achievement') DEFAULT 'achievement',
  points INT DEFAULT 0,
  criteria TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Données Initiales** :
```sql
INSERT INTO badges (name, description, icon, category, points, criteria) VALUES
('Constance', '5 séances en 7 jours', '🔥', 'routine', 50, '5 completions in 7 days'),
('Progression', 'Augmenter les charges', '💪', 'performance', 75, 'Increase weights by 10%'),
('Sérénité', '10 séances de yoga/stretching', '🧘', 'health', 60, '10 yoga/stretching sessions'),
('Niveau Supérieur', 'Terminer un programme complet', '🚀', 'achievement', 100, 'Complete a full program'),
('Santé Cardiaque', '20 séances de cardio', '❤️', 'health', 80, '20 cardio sessions'),
('Routine Matinale', '10 séances avant 10h', '🌅', 'routine', 50, '10 sessions before 10am'),
('Routine du Soir', '10 séances après 18h', '🌙', 'routine', 50, '10 sessions after 6pm'),
('Objectif Atteint', 'Atteindre un objectif personnel', '🎯', 'achievement', 100, 'Reach personal goal'),
('Challenge Réussi', 'Compléter un challenge', '🏆', 'achievement', 150, 'Complete a challenge'),
('Esprit Fytli', '30 jours consécutifs', '💫', 'achievement', 200, '30 consecutive days');
```

---

### Table `user_badges`

Badges gagnés par les utilisateurs.

```sql
CREATE TABLE user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id),
  INDEX idx_user (user_id),
  INDEX idx_badge (badge_id),
  INDEX idx_earned_at (earned_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Contrainte** : Un utilisateur ne peut gagner un badge qu'une seule fois.

---

## 🔗 Relations

### Diagramme Détaillé

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌─────────────┐                  ┌──────────────┐
│ enrollments │                  │ user_badges  │
└──────┬──────┘                  └──────┬───────┘
       │                                │
       ▼                                ▼
┌─────────────┐                  ┌──────────────┐
│  programs   │                  │    badges    │
└──────┬──────┘                  └──────────────┘
       │
       ├────────────┬──────────────┐
       │            │              │
       ▼            ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐
│  sessions   │ │ enrollments │ │ session_completions │
└──────┬──────┘ └─────────────┘ └─────────────────────┘
       │
       ▼
┌──────────────────┐
│ session_exercises│
└────────┬─────────┘
         │
         ▼
    ┌──────────┐
    │exercises │◄──────┐
    └──────────┘       │
                       │
                 ┌─────────────┐
                 │ categories  │
                 └─────────────┘
```

### Relations Clés

**1 utilisateur → N enrollments** : Un utilisateur peut s'inscrire à plusieurs programmes.

**1 utilisateur → N user_badges** : Un utilisateur peut gagner plusieurs badges.

**1 program → N sessions** : Un programme contient plusieurs sessions.

**1 program → N enrollments** : Un programme peut avoir plusieurs inscriptions.

**1 session → N session_exercises** : Une session contient plusieurs exercices.

**1 session → N session_completions** : Une session peut être complétée plusieurs fois.

**1 exercise → N session_exercises** : Un exercice peut être utilisé dans plusieurs sessions.

**1 category → N exercises** : Une catégorie contient plusieurs exercices.

**1 badge → N user_badges** : Un badge peut être gagné par plusieurs utilisateurs.

---

## 🔄 Migrations

### Historique des Migrations

#### Migration 1 : Schéma Initial (17 Oct 2025)
- Création des tables de base (users, programs, sessions, exercises)
- Relations fondamentales

#### Migration 2 : Système d'Inscription (17 Oct 2025)
- Ajout de la table `enrollments`
- Ajout de la table `session_completions`

#### Migration 3 : Système de Badges (17 Oct 2025)
- Ajout de la table `badges`
- Ajout de la table `user_badges`
- Insertion des 10 badges initiaux

#### Migration 4 : Correction Colonnes (17 Oct 2025)
- Renommage `password` → `password_hash`
- Renommage `name` → `title` (programs)
- Renommage `difficulty_level` → `level` (programs)

#### Migration 5 : Ajout Rôles (18 Oct 2025)
- Ajout colonne `role` dans `users`
- Valeurs : 'user' (défaut), 'admin'

#### Migration 6 : Upload Photos (18 Oct 2025)
- Ajout colonne `photo_url` dans `session_completions`

### Appliquer une Migration

```sql
-- Template de migration
USE followsport_app;

START TRANSACTION;

-- Vos changements ici
ALTER TABLE users ADD COLUMN new_column VARCHAR(255);

-- Vérification
SELECT * FROM users LIMIT 1;

-- Si OK
COMMIT;

-- Si erreur
ROLLBACK;
```

---

## 🧪 Données de Test

### Créer des Utilisateurs de Test

```sql
-- Utilisateur normal
INSERT INTO users (first_name, last_name, email, password_hash, fitness_level, role) VALUES
('Jean', 'Dupont', 'jean@example.com', '$2b$10$hashedpassword', 'beginner', 'user');

-- Utilisateur admin
INSERT INTO users (first_name, last_name, email, password_hash, fitness_level, role) VALUES
('Admin', 'Fytli', 'admin@fytli.app', '$2b$10$hashedpassword', 'advanced', 'admin');
```

### Créer des Programmes de Test

```sql
INSERT INTO programs (title, description, level, duration_weeks, created_by) VALUES
('Programme Débutant', 'Programme pour débuter en douceur', 'beginner', 4, 1),
('Full Body Avancé', 'Programme complet pour niveau avancé', 'advanced', 8, 1);
```

### Créer des Sessions de Test

```sql
INSERT INTO sessions (program_id, title, description, order_index, target_duration_minutes) VALUES
(1, 'Session 1 - Découverte', 'Première session de découverte', 1, 30),
(1, 'Session 2 - Progression', 'Augmentation de l\'intensité', 2, 35);
```

---

## 📊 Requêtes Utiles

### Statistiques Générales

```sql
-- Nombre total d'utilisateurs
SELECT COUNT(*) as total_users FROM users;

-- Nombre de programmes par niveau
SELECT level, COUNT(*) as count 
FROM programs 
GROUP BY level;

-- Nombre de completions par utilisateur
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    COUNT(sc.id) as total_completions
FROM users u
LEFT JOIN session_completions sc ON u.id = sc.user_id
GROUP BY u.id
ORDER BY total_completions DESC;

-- Badges les plus gagnés
SELECT 
    b.name,
    b.icon,
    COUNT(ub.id) as times_earned
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id
ORDER BY times_earned DESC;
```

### Progression Utilisateur

```sql
-- Progression d'un utilisateur sur un programme
SELECT 
    p.title as program,
    COUNT(DISTINCT sc.session_id) as sessions_completed,
    COUNT(DISTINCT s.id) as total_sessions,
    ROUND((COUNT(DISTINCT sc.session_id) / COUNT(DISTINCT s.id)) * 100, 2) as progress_percent
FROM enrollments e
JOIN programs p ON e.program_id = p.id
LEFT JOIN sessions s ON p.id = s.program_id
LEFT JOIN session_completions sc ON e.user_id = sc.user_id AND s.id = sc.session_id
WHERE e.user_id = 1 AND e.program_id = 1
GROUP BY p.id;

-- Dernières activités d'un utilisateur
SELECT 
    sc.completed_at,
    p.title as program,
    s.title as session,
    sc.duration_minutes,
    sc.feeling
FROM session_completions sc
JOIN programs p ON sc.program_id = p.id
JOIN sessions s ON sc.session_id = s.id
WHERE sc.user_id = 1
ORDER BY sc.completed_at DESC
LIMIT 10;
```

### Badges et Gamification

```sql
-- Badges d'un utilisateur avec progression
SELECT 
    b.id,
    b.name,
    b.icon,
    b.description,
    b.category,
    b.points,
    ub.earned_at,
    CASE 
        WHEN ub.id IS NOT NULL THEN 'earned'
        ELSE 'locked'
    END as status
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = 1
ORDER BY b.category, b.id;

-- Points totaux d'un utilisateur
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    COUNT(ub.id) as badges_earned,
    SUM(b.points) as total_points
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
WHERE u.id = 1
GROUP BY u.id;
```

### Statistiques Admin

```sql
-- Dashboard admin
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM programs) as total_programs,
    (SELECT COUNT(*) FROM session_completions) as total_completions,
    (SELECT COUNT(*) FROM user_badges) as total_badges_earned,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'active') as active_enrollments;

-- Utilisateurs les plus actifs
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(sc.id) as completions,
    COUNT(ub.id) as badges,
    SUM(b.points) as points
FROM users u
LEFT JOIN session_completions sc ON u.id = sc.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
GROUP BY u.id
ORDER BY completions DESC
LIMIT 10;
```

---

## 🔧 Maintenance

### Optimisation

```sql
-- Analyser les tables
ANALYZE TABLE users, programs, sessions, exercises, session_completions;

-- Optimiser les tables
OPTIMIZE TABLE users, programs, sessions, exercises, session_completions;

-- Vérifier la santé des tables
CHECK TABLE users, programs, sessions, exercises, session_completions;

-- Reconstruire les index
ALTER TABLE session_completions DROP INDEX idx_user, ADD INDEX idx_user (user_id);
```

### Nettoyage

```sql
-- Supprimer les completions sans utilisateur (orphelins)
DELETE FROM session_completions 
WHERE user_id NOT IN (SELECT id FROM users);

-- Supprimer les enrollments terminés depuis plus d'un an
DELETE FROM enrollments 
WHERE status = 'completed' 
AND completed_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Supprimer les tokens expirés (si table de tokens existe)
-- DELETE FROM tokens WHERE expires_at < NOW();
```

### Monitoring

```sql
-- Taille des tables
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'followsport_app'
ORDER BY size_mb DESC;

-- Nombre de lignes par table
SELECT 
    table_name,
    table_rows
FROM information_schema.tables
WHERE table_schema = 'followsport_app'
ORDER BY table_rows DESC;

-- Performance des index
SELECT 
    table_name,
    index_name,
    cardinality,
    seq_in_index
FROM information_schema.statistics
WHERE table_schema = 'followsport_app'
ORDER BY table_name, seq_in_index;
```

---

## 💾 Backup & Restore

### Backup Complet

```bash
# Backup de la base complète
mysqldump -u root -p followsport_app > backup_$(date +%Y%m%d).sql

# Backup compressé
mysqldump -u root -p followsport_app | gzip > backup_$(date +%Y%m%d).sql.gz

# Backup d'une table spécifique
mysqldump -u root -p followsport_app users > backup_users_$(date +%Y%m%d).sql

# Backup sans les données (structure seulement)
mysqldump -u root -p --no-data followsport_app > schema_only.sql
```

### Restore

```bash
# Restore complet
mysql -u root -p followsport_app < backup_20251018.sql

# Restore depuis un fichier compressé
gunzip < backup_20251018.sql.gz | mysql -u root -p followsport_app

# Restore avec création de la base
mysql -u root -p < backup_20251018.sql
```

### Backup Automatique (Cron)

```bash
# Créer un script de backup
cat > /usr/local/bin/backup-fytli.sh << 'EOL'
#!/bin/bash
BACKUP_DIR="/var/backups/fytli"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mysqldump -u backup_user -p'backup_password' followsport_app | gzip > $BACKUP_DIR/fytli_$DATE.sql.gz
# Garder seulement les 30 derniers jours
find $BACKUP_DIR -name "fytli_*.sql.gz" -mtime +30 -delete
EOL

# Rendre exécutable
chmod +x /usr/local/bin/backup-fytli.sh

# Ajouter au cron (tous les jours à 3h du matin)
crontab -e
0 3 * * * /usr/local/bin/backup-fytli.sh
```

---

## 🚨 Dépannage

### Problèmes Courants

#### Erreur de connexion

```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Redémarrer MySQL
sudo systemctl restart mysql

# Vérifier les credentials
mysql -u root -p -e "SHOW DATABASES;"
```

#### Erreur "Too many connections"

```sql
-- Voir les connexions actuelles
SHOW PROCESSLIST;

-- Augmenter le nombre max de connexions
SET GLOBAL max_connections = 200;

-- Rendre permanent (dans /etc/mysql/my.cnf)
[mysqld]
max_connections = 200
```

#### Performances lentes

```sql
-- Activer le slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analyser les requêtes lentes
-- Voir le fichier : /var/log/mysql/slow-query.log

-- Vérifier les tables non indexées
SELECT * FROM information_schema.tables 
WHERE table_schema = 'followsport_app' 
AND engine = 'InnoDB' 
AND table_rows > 1000;
```

---

## 📞 Support

Pour toute question sur la base de données :

- 📖 Consulter cette documentation
- 🔍 Vérifier les logs MySQL : `/var/log/mysql/error.log`
- 💬 Contacter l'équipe : dev@fytli.app

---

**Version** : 1.0.0  
**Dernière mise à jour** : 18 Octobre 2025  
**MySQL** : 8.0+

---

<div align="center">

**Fytli Database - Propulsé par MySQL 🗄️**

</div>

