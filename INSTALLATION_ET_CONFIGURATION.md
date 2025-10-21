# ⚙️ Installation et Configuration - Projet Fytli

Ce document centralise toutes les informations d'installation et de configuration pour le projet Fytli.

---

## 📋 Table des Matières

- [Configuration Locale](#configuration-locale)
- [Configuration de la Base de Données](#configuration-de-la-base-de-données)
- [Installation du Feed Social](#installation-du-feed-social)
- [Installation sur OVH](#installation-sur-ovh)
- [Quick Start](#quick-start)

---

## Configuration Locale

### Backend

#### 1. Créer le fichier `.env`

Dans `backend-fytli/.env` :

```env
# Configuration de la base de données (locale)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=followSport_app
DB_PORT=3306

# Configuration JWT
JWT_SECRET=55dcd7551dddcf4300a37f9e053e4cd2fd046b0e3fd7db5cc9e5cac8300747e8edb0d87495fa63c5d320af33337c5876b55294947bc86ce4083b3e4372cdc292

# Configuration du serveur
PORT=9001
NODE_ENV=development
BASE_URL=http://localhost:9001

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Email (optionnel pour tests locaux)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=Fytli <noreply@fytli.app>

# Web Push Notifications (optionnel)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@example.com
```

#### 2. Installer les dépendances

```bash
cd backend-fytli
npm install
```

#### 3. Démarrer le backend

```bash
npm run dev
```

Vous devriez voir :
```
✅ Connexion MySQL établie avec succès
🚀 Backend Fytli démarré sur http://localhost:9001
```

### Frontend

#### 1. Créer le fichier `.env`

Dans `frontend-fytli/.env` :

```env
# Configuration de l'API Backend
VITE_API_URL=http://localhost:9001
```

#### 2. Créer le fichier `.env.example`

Dans `frontend-fytli/.env.example` :

```env
# Configuration de l'API Backend
# En développement local
VITE_API_URL=http://localhost:9001

# En production (exemple)
# VITE_API_URL=https://api.fytli.fr
```

#### 3. Installer les dépendances

```bash
cd frontend-fytli
npm install
```

#### 4. Démarrer le frontend

```bash
npm run dev
```

Le frontend devrait démarrer sur : `http://localhost:5173`

### Admin Panel

#### 1. Créer le fichier `.env`

Dans `admin-panel/.env` :

```env
# Configuration de l'API Backend
VITE_API_URL=http://localhost:9001
```

#### 2. Créer le fichier `.env.example`

Dans `admin-panel/.env.example` :

```env
# Configuration de l'API Backend
# En développement local
VITE_API_URL=http://localhost:9001

# En production (exemple)
# VITE_API_URL=https://api.fytli.fr
```

#### 3. Installer les dépendances

```bash
cd admin-panel
npm install
```

#### 4. Démarrer l'admin panel

```bash
npm run dev
```

L'admin panel devrait démarrer sur : `http://localhost:5174`

### Ports Utilisés

| Service      | Port  | URL                     |
|-------------|-------|-------------------------|
| Backend     | 9001  | http://localhost:9001   |
| Frontend    | 5173  | http://localhost:5173   |
| Admin Panel | 5174  | http://localhost:5174   |

---

## Configuration de la Base de Données

### Solution 1 : Base de Données Locale (Recommandé pour le développement)

#### Étape 1 : Vérifier que MySQL est démarré

```bash
# Sur macOS (Homebrew)
brew services start mysql

# Ou vérifier le statut
brew services list | grep mysql
```

#### Étape 2 : Créer la base de données

```bash
mysql -u root -p
```

Puis dans MySQL :

```sql
CREATE DATABASE IF NOT EXISTS followSport_app;
USE followSport_app;

-- Les tables seront créées automatiquement par les migrations au démarrage
```

#### Étape 3 : Redémarrer le backend

```bash
cd backend-fytli
npm start
```

Les migrations s'exécuteront automatiquement et créeront toutes les tables.

### Solution 2 : Base de Données OVH (Pour la production)

#### Étape 1 : Vérifier les credentials OVH

1. Connectez-vous au **panneau OVH Cloud** : https://www.ovh.com/manager/
2. Section "Web Cloud" → "Cloud Databases"
3. Sélectionnez votre instance
4. Vérifiez :
   - **Nom d'utilisateur** : `admin` (ou un autre)
   - **Mot de passe** : Réinitialisez-le si nécessaire
   - **IP autorisées** : Vérifiez que votre IP est autorisée

#### Étape 2 : Modifier le `.env`

Dans `backend-fytli/.env` :

```env
# Base de données OVH
DB_HOST=hg101756-001.eu.clouddb.ovh.net
DB_USER=admin
DB_PASSWORD=votre_mot_de_passe
DB_NAME=lyfti
DB_PORT=35419

NODE_ENV=production
```

#### Étape 3 : Tester la connexion

```bash
mysql -h hg101756-001.eu.clouddb.ovh.net \
      -P 35419 \
      -u admin \
      -p \
      lyfti
```

Si ça fonctionne, le problème vient du mot de passe dans le `.env`.

### Où trouver vos informations MySQL ?

#### Si vous utilisez OVH :
1. Connectez-vous à [https://www.ovh.com/manager/](https://www.ovh.com/manager/)
2. Web Cloud → Bases de données
3. Sélectionnez votre base
4. Notez : Serveur, Utilisateur, Nom de la base

#### Si vous utilisez Render MySQL :
1. Dans le dashboard Render
2. Sélectionnez votre base MySQL
3. Copiez les "Internal Connection String" ou les détails individuels

### Dépannage

#### Erreur : `Unknown database 'followSport_app'`

Créez la base :
```sql
CREATE DATABASE followSport_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Erreur : `Access denied`

- Vérifiez le mot de passe dans `.env`
- Sur OVH : réinitialisez le mot de passe et autorisez votre IP

#### Erreur : `Can't connect to MySQL server`

- Vérifiez que MySQL est démarré : `brew services list`
- Démarrez MySQL : `brew services start mysql`

---

## Installation du Feed Social

### Méthode Automatique (Recommandé)

```bash
cd backend-fytli
node database/installSocial.js
```

### Méthode Manuelle

#### Option A : Via phpMyAdmin

1. Connectez-vous à phpMyAdmin
2. Sélectionnez votre base de données
3. Onglet "SQL"
4. Copiez-collez le contenu de `backend-fytli/database/social_system.sql`
5. Cliquez sur "Exécuter"

#### Option B : Via ligne de commande

```bash
mysql -u [username] -p [database] < backend-fytli/database/social_system.sql
```

### Vérification

```sql
-- Vérifier les nouvelles tables
SHOW TABLES LIKE '%connection%';
SHOW TABLES LIKE '%feed%';

-- Compter les connexions (devrait être 0 au début)
SELECT COUNT(*) FROM connections;
SELECT COUNT(*) FROM feed_events;
SELECT COUNT(*) FROM feed_unlocks;
```

### Générer les usernames pour utilisateurs existants

Si vous avez déjà des utilisateurs dans la base :

```sql
UPDATE users 
SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
WHERE username IS NULL;
```

Exemple :
- Email : `gary@example.com` (id=1) → Username : `gary_1`
- Email : `marie@test.fr` (id=5) → Username : `marie_5`

---

## Installation sur OVH

### Installation du Feed Social sur OVH CloudDB

#### Via phpMyAdmin (Recommandé)

1. **Connectez-vous à phpMyAdmin OVH**
   - URL : https://phpmyadmin.hosting.ovh.net
   - Ou via votre espace client OVH → Web Cloud → CloudDB

2. **Sélectionnez votre base de données**
   - Cliquez sur `lyfti` dans la colonne de gauche

3. **Onglet SQL**
   - Cliquez sur l'onglet "SQL" en haut

4. **Copier-coller le contenu**
   - Ouvrez le fichier `backend-fytli/database/social_system_ovh.sql`
   - Copiez TOUT le contenu
   - Collez dans la zone de texte phpMyAdmin

5. **Exécuter**
   - Cliquez sur "Exécuter" en bas à droite
   - ⚠️ **Important** : Si vous voyez des erreurs "Duplicate column", c'est NORMAL
   - Les colonnes existent déjà, continuez !

#### Via MySQL Workbench

1. **Ouvrir MySQL Workbench**
2. **Se connecter à OVH CloudDB**
   - Host : `hg101756-001.eu.clouddb.ovh.net`
   - Port : `35419`
   - User : `admin`
   - Database : `lyfti`

3. **Ouvrir un nouvel onglet SQL**
   - File → Open SQL Script
   - Sélectionner `backend-fytli/database/social_system_ovh.sql`

4. **Exécuter**
   - Cliquer sur l'icône ⚡ (Execute)

#### Via ligne de commande

```bash
mysql -h hg101756-001.eu.clouddb.ovh.net \
      -P 35419 \
      -u admin \
      -p lyfti < backend-fytli/database/social_system_ovh.sql
```

### Gestion des erreurs

#### Erreur "Duplicate column name"
```
ERROR 1060 (42S21): Duplicate column name 'username'
```
**✅ C'est normal !** Cela signifie que la colonne existe déjà. Continuez l'exécution.

#### Erreur "Table already exists"
```
ERROR 1050 (42S01): Table 'connections' already exists
```
**✅ C'est normal !** Le script utilise `IF NOT EXISTS` donc les tables existantes sont conservées.

#### Erreur "Cannot add foreign key constraint"
```
ERROR 1215 (HY000): Cannot add foreign key constraint
```
**❌ Problème !** Assurez-vous que :
- La table `users` existe
- La table `session_completions` existe
- Les colonnes référencées existent

### Vérification de l'installation OVH

```sql
-- Vérifier les nouvelles tables
SHOW TABLES LIKE '%connection%';
SHOW TABLES LIKE '%feed%';

-- Vérifier les colonnes de users
DESCRIBE users;

-- Compter les connexions
SELECT COUNT(*) FROM connections;
SELECT COUNT(*) FROM feed_events;
SELECT COUNT(*) FROM feed_unlocks;
```

### Rollback (Annuler les modifications)

Si vous voulez tout supprimer :

```sql
-- ⚠️ ATTENTION : Cela supprime TOUTES les données sociales !
DROP TABLE IF EXISTS feed_unlocks;
DROP TABLE IF EXISTS feed_events;
DROP TABLE IF EXISTS connections;

-- Supprimer les colonnes ajoutées à users
ALTER TABLE users DROP COLUMN username;
ALTER TABLE users DROP COLUMN avatar_url;
ALTER TABLE users DROP COLUMN profile_visibility;
```

---

## Quick Start

### 🚀 Démarrage Rapide (5 minutes)

#### 1️⃣ Installer les dépendances

```bash
# Backend
cd backend-fytli
npm install

# Frontend
cd ../frontend-fytli
npm install

# Admin Panel
cd ../admin-panel
npm install
```

#### 2️⃣ Créer les fichiers .env

**Backend** (`backend-fytli/.env`) :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=followSport_app
DB_PORT=3306
PORT=9001
NODE_ENV=development
JWT_SECRET=55dcd7551dddcf4300a37f9e053e4cd2fd046b0e3fd7db5cc9e5cac8300747e8edb0d87495fa63c5d320af33337c5876b55294947bc86ce4083b3e4372cdc292
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend-fytli/.env`) :
```env
VITE_API_URL=http://localhost:9001
```

**Admin Panel** (`admin-panel/.env`) :
```env
VITE_API_URL=http://localhost:9001
```

#### 3️⃣ Créer la base de données

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS followSport_app;
EXIT;
```

#### 4️⃣ Démarrer les services

```bash
# Terminal 1 - Backend
cd backend-fytli
npm run dev

# Terminal 2 - Frontend
cd frontend-fytli
npm run dev

# Terminal 3 - Admin Panel (optionnel)
cd admin-panel
npm run dev
```

#### 5️⃣ Vérification

- Backend : http://localhost:9001
- Frontend : http://localhost:5173
- Admin Panel : http://localhost:5174

---

## 📋 Checklist de Vérification

### Backend
- [ ] Variables d'environnement configurées (`.env` existe)
- [ ] Base de données MySQL accessible
- [ ] Backend démarre sans erreur
- [ ] Route `/` retourne `{"success":true}`
- [ ] Route `/auth/login` est accessible

### Frontend
- [ ] `.env` existe avec `VITE_API_URL`
- [ ] Frontend démarre sans erreur
- [ ] Le frontend peut faire des requêtes au backend
- [ ] Pas d'erreur CORS dans la console

### Admin Panel
- [ ] `.env` existe avec `VITE_API_URL`
- [ ] Admin panel démarre sans erreur
- [ ] Connexion au backend fonctionnelle

### Base de Données
- [ ] Tables créées
- [ ] Tables sociales créées (si feed social installé)
- [ ] Données de test ajoutées (optionnel)

---

## 🔧 Tests

### Test Backend

```bash
# Test de la route racine
curl http://localhost:9001/

# Test du login (devrait retourner une erreur mais pas 404)
curl -X POST http://localhost:9001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Test Frontend

1. Ouvrez la console du navigateur (F12)
2. Allez sur la page de login
3. Essayez de vous connecter
4. Vérifiez qu'il n'y a pas d'erreur "Network Error"

### Test Connexion BDD

```bash
cd backend-fytli
node test-db-connection.js
```

Vous devriez voir :

```
✅ Connexion réussie !
✓ Nombre d'utilisateurs: X
✓ Nombre de programmes: X
```

---

## 🆘 Problèmes Fréquents

### "Network Error" persiste
- Vérifiez que le backend est démarré
- Vérifiez que VITE_API_URL est correct
- Vérifiez qu'il n'y a pas d'erreur CORS

### "Cannot connect to MySQL"
- Vérifiez les identifiants de la base de données
- Vérifiez que la base est accessible depuis votre réseau/Render
- Pour OVH, vérifiez que l'IP de Render est autorisée

### "JWT_SECRET is not defined"
- Ajoutez JWT_SECRET dans les variables d'environnement
- Redéployez le backend

### Les migrations ne s'exécutent pas
Les migrations s'exécutent automatiquement au démarrage (uniquement en mode `development`).

Si vous êtes en `production`, exécutez manuellement :
```bash
mysql -u root -p followSport_app < database/migration_social_features.sql
```

---

## 📞 Support

**Logs à vérifier :**
1. Backend : `backend-fytli/logs/error-*.log`
2. Frontend : Console navigateur (F12 → Console)
3. Base de données : Logs MySQL de votre hébergeur

**Commandes de diagnostic :**
```bash
# Vérifier l'installation complète
cd backend-fytli && mysql -u user -p -e "USE db; SHOW TABLES LIKE '%social%';" && cd ../frontend-fytli && npm list framer-motion html-to-image
```

---

**✅ Configuration complète !**

**Dernière mise à jour : 21 octobre 2025**

