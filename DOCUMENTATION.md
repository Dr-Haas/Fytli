# 📖 Fytli - Documentation Complète

> **Bouge mieux, vis mieux.**

Cette documentation consolide toutes les informations nécessaires pour comprendre, développer et déployer l'application Fytli.

---

## 📑 Table des Matières

1. [🏗️ Architecture](#-architecture)
2. [🚀 Installation et Démarrage](#-installation-et-démarrage)
3. [✨ Fonctionnalités](#-fonctionnalités)
4. [🗄️ Base de Données](#️-base-de-données)
5. [🔐 Authentification & Sécurité](#-authentification--sécurité)
6. [📱 Mobile & PWA](#-mobile--pwa)
7. [🎨 Design System](#-design-system)
8. [🏆 Système de Gamification](#-système-de-gamification)
9. [📸 Upload de Photos](#-upload-de-photos)
10. [👥 Système d'Administration](#-système-dadministration)
11. [🔧 Configuration](#-configuration)
12. [🧪 Tests](#-tests)
13. [🚢 Déploiement](#-déploiement)
14. [🐛 Dépannage](#-dépannage)
15. [🗺️ Roadmap](#️-roadmap)

---

## 🏗️ Architecture

### Structure du Projet

```
followSport_app/
├── backend-followsport/          # Backend Node.js + Express + MySQL
│   ├── config/                   # Configuration (email, logger, multer)
│   ├── controllers/              # Logique métier
│   ├── middleware/               # Middlewares (auth, validation, upload)
│   ├── models/                   # Modèles base de données
│   ├── routes/                   # Routes API
│   ├── uploads/                  # Fichiers uploadés
│   ├── database/                 # Scripts SQL et migrations
│   ├── docs/                     # Documentation API
│   └── index.js                  # Point d'entrée
│
├── frontend-followsport/         # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/               # Pages de l'application
│   │   ├── components/          # Composants réutilisables
│   │   ├── services/            # Services API (Axios)
│   │   ├── contexts/            # Contexts React (Auth)
│   │   ├── hooks/               # Custom hooks
│   │   ├── types/               # Types TypeScript
│   │   └── styles/              # Styles globaux
│   ├── public/                  # Assets statiques + PWA manifests
│   └── vite.config.ts           # Configuration Vite + PWA
│
└── admin-panel/                  # Panel d'administration
    ├── src/
    │   ├── pages/               # Pages admin
    │   ├── components/          # Composants admin
    │   └── services/            # Services admin
    └── vite.config.ts

```

### Stack Technique

#### Frontend
- **React 18** - UI Library
- **TypeScript 5** - Type Safety
- **Vite 7** - Build Tool & Dev Server
- **TailwindCSS 3** - Utility-First CSS
- **Framer Motion 11** - Animations
- **React Router 6** - Navigation
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Vite PWA Plugin** - Progressive Web App

#### Backend
- **Node.js 22** - Runtime
- **Express 4** - Web Framework
- **MySQL 8** - Database
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP Logger

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** 20.19+ ou 22.12+
- **npm** 10+
- **MySQL** 8.0+

### Installation Complète

#### 1. Cloner le repository

```bash
git clone https://github.com/yourusername/fytli.git
cd followSport_app
```

#### 2. Configuration de la Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE IF NOT EXISTS followsport_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importer les tables
USE followsport_app;
source backend-followsport/database/enrollment_system.sql;
source backend-followsport/database/addUserBadges.sql;
```

#### 3. Configuration du Backend

```bash
cd backend-followsport

# Installer les dépendances
npm install

# Créer le fichier .env
cat > .env << EOL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=followsport_app
DB_PORT=3306
PORT=9001
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=development
EOL

# Créer un compte administrateur
node createAdmin.js

# Lancer le backend
npm start
```

Le backend démarre sur **http://localhost:9001**

#### 4. Configuration du Frontend

```bash
cd ../frontend-followsport

# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:9001" > .env

# Lancer le frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

#### 5. Configuration du Panel Admin (Optionnel)

```bash
cd ../admin-panel

# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:9001/api" > .env

# Lancer le panel admin
npm run dev
```

Le panel admin démarre sur **http://localhost:5174**

---

## ✨ Fonctionnalités

### 🔐 Authentication
- Inscription / Connexion sécurisée (JWT)
- Protection des routes privées
- Auto-login avec token persistant
- Session management
- Validation des inputs
- Gestion des erreurs

### 💪 Programmes d'Entraînement
- Créer des programmes personnalisés
- Ajouter des exercices depuis la bibliothèque
- Configurer sets, reps et temps de repos
- Recherche et filtres par difficulté
- Vue détaillée avec sessions
- Suppression et modification

### 🏋️ Séances d'Entraînement
- Mode workout étape par étape
- Timer de repos interactif avec sons
- Navigation fluide entre exercices
- Suivi en temps réel
- Résumé post-séance avec statistiques
- Upload de photos de progression
- Notes et ressenti

### 🏅 Gamification & Badges
- **10 badges** à débloquer
- 4 catégories : Routine, Performance, Santé, Accomplissement
- Système de progression avec barres
- Suivi des achievements
- Points et niveaux
- Badges disponibles :
  - 🔥 **Constance** - 5 séances en 7 jours
  - 💪 **Progression** - Augmenter les charges
  - 🧘 **Sérénité** - 10 séances de yoga/stretching
  - 🚀 **Niveau Supérieur** - Terminer un programme complet
  - ❤️ **Santé Cardiaque** - 20 séances cardio
  - 🌅 **Routine Matinale** - 10 séances avant 10h
  - 🌙 **Routine du Soir** - 10 séances après 18h
  - 🎯 **Objectif Atteint** - Atteindre un objectif personnel
  - 🏆 **Challenge Réussi** - Compléter un challenge
  - 💫 **Esprit Fytli** - Utiliser l'app 30 jours consécutifs

### 📊 Système d'Inscription (Enrollments)
- Inscription aux programmes
- Suivi de progression
- Statuts : active, completed, paused
- Dates de début et fin
- Statistiques par utilisateur

### 🎨 Notifications Toast
- Toast system élégant
- Types : success, error, warning, info
- Messages de succès/erreur automatiques
- Feedback temps réel
- Design cohérent Fytli

### 👤 Profil Utilisateur
- Édition des informations personnelles
- Affichage des badges gagnés
- Liste des programmes actifs avec progression
- Statistiques personnelles
- Upload de photo de profil

### 📱 Mobile-First & PWA
- Interface responsive optimisée mobile
- Burger menu natif
- Modals fullscreen sur mobile
- Boutons retour intelligents
- Touch-optimized (44px+ tap targets)
- Installable sur mobile et desktop
- Fonctionne offline (Service Worker)
- Mode standalone (sans barre d'URL)
- Auto-update
- Cache intelligent (Workbox)

---

## 🗄️ Base de Données

### Schéma Principal

#### Table `users`
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
  fitness_level ENUM('beginner', 'intermediate', 'advanced'),
  goal TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table `programs`
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
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

#### Table `sessions`
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
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);
```

#### Table `exercises`
```sql
CREATE TABLE exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
  equipment VARCHAR(255),
  muscle_groups TEXT,
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### Table `session_completions`
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
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
```

#### Table `badges`
```sql
CREATE TABLE badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category ENUM('routine', 'performance', 'health', 'achievement') DEFAULT 'achievement',
  points INT DEFAULT 0,
  criteria TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `user_badges`
```sql
CREATE TABLE user_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_badge (user_id, badge_id)
);
```

#### Table `enrollments`
```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  program_id INT NOT NULL,
  status ENUM('active', 'completed', 'paused') DEFAULT 'active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);
```

### Migrations et Données Initiales

Les scripts SQL sont disponibles dans `backend-followsport/database/`:
- `enrollment_system.sql` - Schéma complet
- `addUserBadges.sql` - Système de badges
- `GUIDE_INSTALLATION_RAPIDE.md` - Guide d'installation détaillé

---

## 🔐 Authentification & Sécurité

### JWT (JSON Web Tokens)

#### Génération du Token (Backend)
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { 
    userId: user.id,
    email: user.email,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### Vérification du Token (Middleware)
```javascript
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
```

#### Stockage du Token (Frontend)
```typescript
// Sauvegarder le token
localStorage.setItem('token', token);

// Récupérer le token
const token = localStorage.getItem('token');

// Supprimer le token
localStorage.removeItem('token');
```

### Hashage des Mots de Passe

```javascript
const bcrypt = require('bcrypt');

// Hasher le mot de passe
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Vérifier le mot de passe
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Protection des Routes

#### Backend
```javascript
// Route protégée
router.get('/profile', auth, userController.getProfile);

// Route admin uniquement
router.get('/admin/users', auth, checkAdmin, adminController.getUsers);
```

#### Frontend
```typescript
// Composant PrivateRoute
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Utilisation
<Route path="/dashboard" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

### Validation des Inputs

```javascript
// Middleware de validation
const validateRegistration = (req, res, next) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ 
      message: 'Le mot de passe doit contenir au moins 8 caractères' 
    });
  }

  if (!first_name || !last_name) {
    return res.status(400).json({ 
      message: 'Le prénom et le nom sont requis' 
    });
  }

  next();
};
```

---

## 📱 Mobile & PWA

### Configuration PWA

#### `vite.config.ts`
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-Fytli.png'],
      manifest: {
        name: 'Fytli - Bouge mieux, vis mieux',
        short_name: 'Fytli',
        description: 'Ton compagnon sport & bien-être',
        theme_color: '#FF4D3A',
        background_color: '#FBFAF7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon-Fytli.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon-Fytli.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 an
              }
            }
          }
        ]
      }
    })
  ]
});
```

### Responsive Design

#### Breakpoints TailwindCSS
- **sm** : 640px (mobile large)
- **md** : 768px (tablet)
- **lg** : 1024px (desktop)
- **xl** : 1280px (large desktop)

#### Exemples d'utilisation
```tsx
// Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Spacing responsive
<div className="p-4 lg:p-6">

// Typography responsive
<h1 className="text-2xl lg:text-4xl">

// Hidden/visible responsive
<div className="hidden lg:block">  {/* Visible desktop uniquement */}
<div className="lg:hidden">        {/* Visible mobile uniquement */}
```

### Touch Optimization

- **Taille minimum des boutons** : 44x44px
- **Espacement tactile** : 8px minimum entre éléments
- **Feedback visuel** : hover/active states
- **Scroll natif** : pas de JS scroll hijacking
- **Input optimization** : autocomplete, inputmode

---

## 🎨 Design System

### Couleurs Fytli

```css
/* Palette principale */
--fytli-red: #FF4D3A;        /* Primary - CTAs, accents */
--fytli-orange: #FF8A3D;     /* Secondary - gradients */
--fytli-cream: #FBFAF7;      /* Background - surface */
--fytli-dark: #0E0E10;       /* Foreground - text */
--fytli-gray: #3A3A3E;       /* Muted - disabled */
--fytli-line: #D7D7DB;       /* Borders - dividers */

/* États */
--fytli-success: #2BB673;    /* Success messages */
--fytli-warning: #FFCA55;    /* Warning messages */
--fytli-info: #2D7FF9;       /* Info messages */
--fytli-error: #DC2626;      /* Error messages */
```

### Typography

```css
/* Fonts */
font-family: 'Inter', system-ui, -apple-system, sans-serif;  /* UI */
font-family: 'Poppins', 'Inter', sans-serif;                 /* Brand */

/* Scale */
.text-xs     { font-size: 0.75rem; }    /* 12px */
.text-sm     { font-size: 0.875rem; }   /* 14px */
.text-base   { font-size: 1rem; }       /* 16px */
.text-lg     { font-size: 1.125rem; }   /* 18px */
.text-xl     { font-size: 1.25rem; }    /* 20px */
.text-2xl    { font-size: 1.5rem; }     /* 24px */
.text-3xl    { font-size: 1.875rem; }   /* 30px */
.text-4xl    { font-size: 2.25rem; }    /* 36px */
```

### Spacing

```css
/* Spacing scale (basé sur 4px) */
.p-0  { padding: 0; }
.p-1  { padding: 0.25rem; }   /* 4px */
.p-2  { padding: 0.5rem; }    /* 8px */
.p-3  { padding: 0.75rem; }   /* 12px */
.p-4  { padding: 1rem; }      /* 16px */
.p-5  { padding: 1.25rem; }   /* 20px */
.p-6  { padding: 1.5rem; }    /* 24px */
.p-8  { padding: 2rem; }      /* 32px */
```

### Border Radius

```css
/* Rounded corners */
.rounded-sm  { border-radius: 12px; }
.rounded     { border-radius: 16px; }    /* Default */
.rounded-lg  { border-radius: 20px; }
.rounded-xl  { border-radius: 28px; }
.rounded-full { border-radius: 9999px; } /* Circles */
```

### Shadows

```css
/* Box shadows */
.shadow-sm   { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.shadow      { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.shadow-md   { box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
.shadow-lg   { box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
```

### Composants UI

#### Button
```tsx
<button className="bg-fytli-red hover:bg-fytli-orange text-white px-6 py-3 rounded-lg font-medium transition-all">
  Commencer
</button>
```

#### Card
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-xl font-bold mb-2">Titre</h3>
  <p className="text-fytli-gray">Description</p>
</div>
```

#### Input
```tsx
<input 
  type="text"
  className="w-full px-4 py-3 border border-fytli-line rounded-lg focus:outline-none focus:ring-2 focus:ring-fytli-red"
  placeholder="Entrez votre texte"
/>
```

---

## 🏆 Système de Gamification

### Architecture

Le système de gamification est composé de :
- **Badges** : Récompenses débloquables
- **Points** : Système de scoring
- **Progression** : Barres de progression vers les badges
- **Catégories** : Organisation des badges

### Badges Disponibles

| Badge | Nom | Description | Catégorie | Points | Critères |
|-------|-----|-------------|-----------|--------|----------|
| 🔥 | Constance | 5 séances en 7 jours | Routine | 50 | 5 completions en 7 jours |
| 💪 | Progression | Augmenter les charges | Performance | 75 | Augmentation de 10% des charges |
| 🧘 | Sérénité | 10 séances yoga/stretching | Santé | 60 | 10 sessions de catégorie yoga |
| 🚀 | Niveau Supérieur | Programme complet | Achievement | 100 | Terminer un programme |
| ❤️ | Santé Cardiaque | 20 séances cardio | Santé | 80 | 20 sessions cardio |
| 🌅 | Routine Matinale | 10 séances avant 10h | Routine | 50 | 10 sessions avant 10h |
| 🌙 | Routine du Soir | 10 séances après 18h | Routine | 50 | 10 sessions après 18h |
| 🎯 | Objectif Atteint | Atteindre un objectif | Achievement | 100 | Goal personnel atteint |
| 🏆 | Challenge Réussi | Compléter un challenge | Achievement | 150 | Challenge terminé |
| 💫 | Esprit Fytli | 30 jours consécutifs | Achievement | 200 | 30 jours d'activité |

### API Endpoints Badges

```bash
# Récupérer tous les badges
GET /badges

# Récupérer les badges d'un utilisateur
GET /badges/user/:userId

# Attribution automatique des badges
# (Appelé automatiquement après chaque completion)
POST /badges/check/:userId
```

### Logique d'Attribution

Les badges sont attribués automatiquement après chaque completion de session. Le système vérifie :
1. Les critères de chaque badge
2. Si l'utilisateur a déjà le badge
3. Si les conditions sont remplies
4. Attribution et notification

---

## 📸 Upload de Photos

### Configuration Multer (Backend)

```javascript
// middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/session-photos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'session-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (JPEG, PNG, GIF, WebP)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

module.exports = upload;
```

### Service Upload (Frontend)

```typescript
// services/uploads.ts
import api from './api';

export const uploadSessionPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await api.post('/uploads/session-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data.url;
};

export const deleteSessionPhoto = async (filename: string): Promise<void> => {
  await api.delete(`/uploads/session-photo/${filename}`);
};
```

### Sécurité Upload

- ✅ Authentification JWT requise
- ✅ Types de fichiers validés (JPEG, PNG, GIF, WebP)
- ✅ Limite de taille : 5 MB
- ✅ Nommage unique anti-collision
- ✅ Path traversal protection
- ✅ Validation MIME type

---

## 👥 Système d'Administration

### Panel Admin

Le panel d'administration permet de gérer :
- 👥 Utilisateurs (liste, rôles, suppression)
- 📚 Programmes (liste, stats, suppression)
- 📅 Sessions (completions, photos, notes)
- 🎓 Inscriptions (status, progression)
- 🏆 Badges (attribution, statistiques)
- 📊 Statistiques globales

### Accès Admin

#### Créer un compte admin
```bash
cd backend-followsport
node createAdmin.js
```

#### Vérifier le rôle admin en base
```sql
SELECT id, email, role FROM users WHERE role = 'admin';

-- Modifier le rôle d'un utilisateur existant
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Routes Admin (Backend)

```javascript
// Routes protégées admin
router.get('/admin/users', auth, checkAdmin, adminController.getAllUsers);
router.put('/admin/users/:id/role', auth, checkAdmin, adminController.updateUserRole);
router.delete('/admin/users/:id', auth, checkAdmin, adminController.deleteUser);
router.get('/admin/stats', auth, checkAdmin, adminController.getStats);
```

### Middleware checkAdmin

```javascript
// middleware/checkAdmin.js
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};
```

---

## 🔧 Configuration

### Variables d'Environnement

#### Backend (`.env`)
```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=followsport_app
DB_PORT=3306

# Serveur
PORT=9001
NODE_ENV=development

# Sécurité
JWT_SECRET=votre_secret_jwt_tres_securise_et_aleatoire

# Email (optionnel, pour notifications futures)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@fytli.app
EMAIL_PASSWORD=votre_mot_de_passe_email
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:9001
```

#### Admin Panel (`.env`)
```env
VITE_API_URL=http://localhost:9001/api
```

### Ports Utilisés

- **Backend** : `9001`
- **Frontend** : `5173` (dev) / `4173` (preview)
- **Admin Panel** : `5174` (dev)
- **MySQL** : `3306`

---

## 🧪 Tests

### Backend Tests

```bash
cd backend-followsport

# Tests avec cURL
# Test authentication
curl -X POST http://localhost:9001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Test login
curl -X POST http://localhost:9001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test upload
curl -X POST http://localhost:9001/uploads/session-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/photo.jpg"
```

### Frontend Tests

```bash
cd frontend-followsport

# Lancer les tests (à implémenter)
npm run test

# Tests E2E (à implémenter)
npm run test:e2e
```

### Test Checklist

#### Authentication
- [ ] Inscription avec email/password
- [ ] Connexion avec email/password
- [ ] Token JWT généré et stocké
- [ ] Routes protégées redirigent vers login
- [ ] Déconnexion supprime le token

#### Programs
- [ ] Liste des programmes affichée
- [ ] Création de programme
- [ ] Ajout d'exercices à un programme
- [ ] Suppression de programme

#### Sessions
- [ ] Démarrage d'une session
- [ ] Navigation entre exercices
- [ ] Timer de repos fonctionne
- [ ] Completion de session enregistrée

#### Badges
- [ ] Badges affichés dans le profil
- [ ] Progression visible
- [ ] Attribution automatique

#### Upload
- [ ] Upload de photo fonctionne
- [ ] Photo visible dans la completion
- [ ] Validation des types de fichiers
- [ ] Limite de taille respectée

---

## 🚢 Déploiement

### Build de Production

#### Frontend
```bash
cd frontend-followsport
npm run build

# Le dossier dist/ contient :
# - index.html
# - assets/ (JS, CSS, images)
# - sw.js (Service Worker)
# - manifest.webmanifest
```

#### Admin Panel
```bash
cd admin-panel
npm run build
```

### Déploiement Backend

#### Option 1 : VPS (Ubuntu)

```bash
# Installer Node.js et MySQL
sudo apt update
sudo apt install nodejs npm mysql-server

# Cloner le repository
git clone https://github.com/yourusername/fytli.git
cd followSport_app/backend-followsport

# Installer les dépendances
npm install --production

# Configurer .env avec les bonnes valeurs

# Utiliser PM2 pour gérer le processus
npm install -g pm2
pm2 start index.js --name fytli-backend
pm2 save
pm2 startup
```

#### Option 2 : Heroku

```bash
# Créer l'application
heroku create fytli-backend

# Ajouter MySQL addon
heroku addons:create jawsdb:kitefin

# Configurer les variables d'environnement
heroku config:set JWT_SECRET=votre_secret
heroku config:set NODE_ENV=production

# Déployer
git push heroku main
```

#### Option 3 : Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login et init
railway login
railway init

# Ajouter MySQL plugin
railway add mysql

# Deploy
railway up
```

### Déploiement Frontend

#### Option 1 : Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
cd frontend-followsport
vercel

# Configurer les variables d'environnement dans le dashboard
# VITE_API_URL=https://votre-backend.com
```

#### Option 2 : Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Build et déploiement
cd frontend-followsport
npm run build
netlify deploy --prod --dir=dist

# Configurer VITE_API_URL dans le dashboard
```

#### Option 3 : Nginx (VPS)

```bash
# Copier le build sur le serveur
scp -r dist/* user@server:/var/www/fytli

# Configuration Nginx
sudo nano /etc/nginx/sites-available/fytli

# Contenu :
server {
    listen 80;
    server_name fytli.app www.fytli.app;
    root /var/www/fytli;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/fytli /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d fytli.app -d www.fytli.app
```

---

## 🐛 Dépannage

### Backend

#### Le serveur ne démarre pas

```bash
# Vérifier Node.js
node --version  # Doit être 20+

# Vérifier les dépendances
npm install

# Vérifier le fichier .env
cat .env

# Vérifier MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Logs détaillés
NODE_ENV=development npm start
```

#### Erreur de connexion MySQL

```bash
# Vérifier que MySQL est démarré
sudo systemctl status mysql

# Tester la connexion
mysql -u root -p -h localhost

# Vérifier les credentials dans .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=...
DB_NAME=followsport_app
```

#### Erreur JWT

```bash
# Vérifier que JWT_SECRET est défini
echo $JWT_SECRET

# Régénérer un secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend

#### Erreur de connexion API

```bash
# Vérifier VITE_API_URL
cat .env

# Tester l'API
curl http://localhost:9001/health

# Vérifier CORS
# Le backend doit avoir :
# app.use(cors({ origin: 'http://localhost:5173' }))
```

#### Build échoue

```bash
# Supprimer node_modules et reinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier TypeScript
npm run type-check

# Vérifier ESLint
npm run lint
```

#### PWA ne fonctionne pas

```bash
# Build de production requis
npm run build
npm run preview

# Vérifier manifest.webmanifest
# Doit être accessible sur /manifest.webmanifest

# Vérifier Service Worker
# Doit être accessible sur /sw.js

# Tester avec Lighthouse (Chrome DevTools)
```

### Base de Données

#### Reset complet de la base

```sql
-- ATTENTION: Supprime toutes les données !
DROP DATABASE IF EXISTS followsport_app;
CREATE DATABASE followsport_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE followsport_app;
SOURCE enrollment_system.sql;
SOURCE addUserBadges.sql;
```

#### Vérifier les données

```sql
-- Compter les utilisateurs
SELECT COUNT(*) FROM users;

-- Compter les programmes
SELECT COUNT(*) FROM programs;

-- Compter les completions
SELECT COUNT(*) FROM session_completions;

-- Derniers badges gagnés
SELECT u.first_name, u.last_name, b.name, ub.earned_at
FROM user_badges ub
JOIN users u ON ub.user_id = u.id
JOIN badges b ON ub.badge_id = b.id
ORDER BY ub.earned_at DESC
LIMIT 10;
```

---

## 🗺️ Roadmap

### V1.1 (Court terme - 1-2 semaines)
- [ ] Créer les icons PWA haute résolution (192x192, 512x512)
- [ ] Tester sur devices iOS et Android réels
- [ ] Implémenter endpoints sessions backend manquants
- [ ] Intégration OpenAI pour commentaires intelligents
- [ ] Compression automatique des photos uploadées
- [ ] Notifications toast améliorées

### V1.2 (Moyen terme - 1 mois)
- [ ] Push notifications (Web Push API)
- [ ] Historique complet des séances
- [ ] Graphiques de progression (Chart.js)
- [ ] Partage de programmes entre utilisateurs
- [ ] Export des données (PDF, CSV)
- [ ] Dark mode

### V1.3 (Moyen terme - 2 mois)
- [ ] Social features (amis, messages)
- [ ] Classements et leaderboards
- [ ] Vidéos d'exercices intégrées
- [ ] Chrono avancé avec intervalles
- [ ] Audio coaching
- [ ] Synchronisation multi-devices

### V2.0 (Long terme - 3-6 mois)
- [ ] Coach AI personnalisé
- [ ] Génération automatique de programmes
- [ ] Wearables integration (Apple Watch, Fitbit, Garmin)
- [ ] Nutrition tracking
- [ ] Challenges communautaires
- [ ] Analyses posturales par IA
- [ ] Marketplace de programmes

### Infrastructure
- [ ] Tests unitaires (Jest, Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] CDN pour les assets
- [ ] Migration uploads vers S3/Cloudinary

---

## 📞 Support et Contribution

### Obtenir de l'Aide

- 📚 Consulter cette documentation
- 🐛 Ouvrir une [issue GitHub](https://github.com/yourusername/fytli/issues)
- 💬 Rejoindre la communauté Discord
- 📧 Email : support@fytli.app

### Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines de Contribution

- ✅ Code en **TypeScript** (frontend)
- ✅ Suivre le **design system Fytli**
- ✅ Ajouter des **tests** si nécessaire
- ✅ Documenter les nouvelles **features**
- ✅ Respecter l'**architecture** existante
- ✅ Utiliser des **commits conventionnels**

---

## 📄 License

Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 🙏 Remerciements

- Design inspiré de **Revolut** et **Stripe Dashboard**
- Icons par **Lucide Icons**
- Fonts : **Inter** & **Poppins** (Google Fonts)
- Service Worker : **Workbox**
- Communauté React et Node.js

---

**Version** : 1.0.0  
**Dernière mise à jour** : 18 Octobre 2025  
**Statut** : ✅ Production Ready

---

<div align="center">

**Fytli - Bouge mieux, vis mieux. 💪✨**

Made with ❤️ and 🔥

</div>

