# 📁 Structure du Projet - Fytli

Documentation de l'architecture et de l'organisation du projet.

---

## 🎯 Vue d'ensemble

Le projet Fytli est composé de **3 applications indépendantes** :

```
followSport_app/
├── frontend-followsport/    # Application PWA (React + TypeScript)
├── admin-panel/              # Panel d'administration (React + TypeScript)
├── backend-followsport/      # API REST (Node.js + Express)
└── [fichiers de configuration]
```

Chaque application a son propre `package.json` et se build/déploie **indépendamment**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEURS                          │
└─────────────────────────────────────────────────────────┘
           │                            │
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Frontend PWA       │    │   Admin Panel        │
│   (Port 5173)        │    │   (Port 5174)        │
│                      │    │                      │
│   React 19           │    │   React 19           │
│   TypeScript         │    │   TypeScript         │
│   TailwindCSS        │    │   TailwindCSS        │
│   Vite               │    │   Recharts           │
│   Service Worker     │    │                      │
└──────────────────────┘    └──────────────────────┘
           │                            │
           │         HTTP/REST          │
           └────────────┬───────────────┘
                        │
                        ▼
           ┌─────────────────────────┐
           │   Backend API           │
           │   (Port 9001)           │
           │                         │
           │   Node.js + Express     │
           │   JWT Auth              │
           │   Multer (uploads)      │
           │   Winston (logs)        │
           └─────────────────────────┘
                        │
                        │ MySQL
                        ▼
           ┌─────────────────────────┐
           │   Base de données       │
           │   MySQL 8.0+            │
           │                         │
           │   followsport DB        │
           └─────────────────────────┘
```

---

## 📦 Frontend (`frontend-followsport/`)

### Structure

```
frontend-followsport/
├── src/
│   ├── pages/              # Pages principales
│   │   ├── Dashboard.tsx
│   │   ├── Programs.tsx
│   │   ├── ProgramDetail.tsx
│   │   ├── SessionWorkout.tsx
│   │   ├── SessionSummary.tsx
│   │   ├── CompletionDetail.tsx
│   │   ├── Badges.tsx
│   │   ├── Profile.tsx
│   │   └── Login.tsx
│   │
│   ├── components/         # Composants réutilisables
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Layout.tsx
│   │   ├── ProgramCard.tsx
│   │   ├── BadgeCard.tsx
│   │   └── ui/
│   │
│   ├── services/           # Services API
│   │   ├── api.ts          # Configuration Axios
│   │   ├── auth.ts
│   │   ├── programs.ts
│   │   ├── sessions.ts
│   │   ├── badges.ts
│   │   └── ...
│   │
│   ├── contexts/           # Contexts React
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.ts
│   │
│   ├── types/              # Types TypeScript
│   │   └── index.ts
│   │
│   ├── styles/             # Styles CSS
│   │   └── index.css
│   │
│   ├── App.tsx             # Composant racine
│   └── main.tsx            # Point d'entrée
│
├── public/                 # Assets statiques
│   ├── manifest.json       # PWA manifest
│   └── favicon-Fytli.png
│
├── dist/                   # Build de production
├── package.json
├── vite.config.ts          # Config Vite + PWA
├── tailwind.config.js
└── tsconfig.json
```

### Technologies

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite 7** - Build Tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **Vite PWA Plugin** - Progressive Web App

### Scripts

```bash
npm run dev      # Dev server (port 5173)
npm run build    # Build production
npm run preview  # Preview build
npm run lint     # Linter
npm run clean    # Clean dist/
```

---

## 🔐 Admin Panel (`admin-panel/`)

### Structure

```
admin-panel/
├── src/
│   ├── pages/              # Pages d'administration
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Programs.tsx
│   │   ├── Sessions.tsx
│   │   ├── Enrollments.tsx
│   │   ├── Badges.tsx
│   │   ├── Stats.tsx
│   │   └── Login.tsx
│   │
│   ├── components/         # Composants UI
│   │   ├── Layout.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── StatCard.tsx
│   │   └── ...
│   │
│   ├── services/           # Services API
│   │   ├── api.ts
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   └── ...
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── App.tsx
│
├── dist/
├── package.json
└── vite.config.ts
```

### Technologies

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite 7** - Build Tool
- **TailwindCSS** - Styling
- **Recharts** - Graphiques
- **Axios** - HTTP Client

### Scripts

```bash
npm run dev      # Dev server (port 5174)
npm run build    # Build production
npm run preview  # Preview build
npm run lint     # Linter
npm run clean    # Clean dist/
```

---

## 🔙 Backend (`backend-followsport/`)

### Structure

```
backend-followsport/
├── controllers/            # Logique métier
│   ├── authController.js
│   ├── usersController.js
│   ├── programsController.js
│   ├── sessionsController.js
│   ├── exercisesController.js
│   ├── enrollmentsController.js
│   ├── badgesController.js
│   ├── progressController.js
│   └── adminController.js
│
├── models/                 # Modèles de données
│   ├── usersModel.js
│   ├── programsModel.js
│   ├── sessionsModel.js
│   ├── exercisesModel.js
│   ├── enrollmentsModel.js
│   └── badgesModel.js
│
├── routes/                 # Routes API
│   ├── auth.js
│   ├── users.js
│   ├── programs.js
│   ├── sessions.js
│   ├── exercises.js
│   ├── enrollments.js
│   ├── badges.js
│   └── admin.js
│
├── middleware/             # Middlewares
│   ├── auth.js             # Authentification JWT
│   ├── checkAdmin.js       # Vérification admin
│   ├── validation.js       # Validation des données
│   └── upload.js           # Upload de fichiers
│
├── config/                 # Configuration
│   ├── email.js
│   ├── logger.js
│   └── multer.js
│
├── database/               # Schémas SQL
│   └── enrollment_system.sql
│
├── uploads/                # Fichiers uploadés
│   ├── images/
│   ├── videos/
│   └── documents/
│
├── logs/                   # Logs Winston
│
├── db.js                   # Connexion MySQL
├── index.js                # Point d'entrée
└── package.json
```

### Technologies

- **Node.js 22** - Runtime
- **Express 5** - Web Framework
- **MySQL2** - Database Driver
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **Winston** - Logging
- **Nodemailer** - Email

### Scripts

```bash
npm start        # Production
npm run dev      # Development (nodemon)
npm run build    # Vérification
npm test         # Tests
```

---

## 📄 Fichiers de configuration racine

```
followSport_app/
├── .gitignore              # Fichiers à ignorer par Git
├── .renderignore           # Fichiers à ignorer par Render
├── render.yaml             # Configuration Render (Blueprint)
├── install.sh              # Script d'installation automatique
│
├── README.md               # Documentation principale
├── COMMANDS.md             # Commandes rapides
├── BUILD.md                # Guide de build
├── DEPLOY.md               # Guide de déploiement complet
├── RENDER_CONFIG.md        # Config Render simplifiée
├── PROJECT_STRUCTURE.md    # Ce fichier
├── DATABASE.md             # Documentation base de données
└── DOCUMENTATION.md        # Documentation complète
```

---

## 🔄 Flux de données

### Authentification

```
1. User → Frontend/Admin : Login (email/password)
2. Frontend/Admin → Backend : POST /auth/login
3. Backend → MySQL : Vérifier credentials
4. Backend → Frontend/Admin : JWT token
5. Frontend/Admin : Stocker token (localStorage)
6. Frontend/Admin : Inclure token dans headers (toutes les requêtes)
```

### Création de programme

```
1. User → Frontend : Créer programme
2. Frontend → Backend : POST /programs (avec JWT)
3. Backend : Vérifier JWT
4. Backend → MySQL : Insérer programme
5. Backend → Frontend : Programme créé
6. Frontend : Afficher message de succès
```

### Séance d'entraînement

```
1. User → Frontend : Démarrer séance
2. Frontend : Mode workout interactif
3. User : Compléter exercices
4. Frontend → Backend : POST /completions
5. Backend → MySQL : Enregistrer progression
6. Backend : Calculer badges
7. Backend → Frontend : Résumé + badges débloqués
```

---

## 🗄️ Base de données

### Tables principales

- **users** - Utilisateurs
- **programs** - Programmes d'entraînement
- **sessions** - Séances d'un programme
- **exercises** - Bibliothèque d'exercices
- **categories** - Catégories d'exercices
- **session_exercises** - Exercices d'une séance
- **enrollments** - Inscriptions aux programmes
- **session_completions** - Séances complétées
- **user_badges** - Badges des utilisateurs
- **badges** - Définition des badges
- **progress** - Historique de progression

Voir [DATABASE.md](DATABASE.md) pour le schéma complet.

---

## 🔐 Sécurité

### Frontend/Admin
- ✅ Routes protégées (PrivateRoute)
- ✅ Token JWT dans localStorage
- ✅ Auto-refresh token
- ✅ Logout automatique si token invalide

### Backend
- ✅ JWT pour authentification
- ✅ Bcrypt pour hasher les mots de passe
- ✅ Middleware d'authentification
- ✅ Validation des données (express-validator)
- ✅ CORS configuré
- ✅ Protection des routes admin

---

## 📱 Progressive Web App

### Fonctionnalités PWA

- ✅ **Installable** : Sur mobile et desktop
- ✅ **Offline** : Service Worker + Cache
- ✅ **Standalone** : Lance comme app native
- ✅ **Auto-update** : Mise à jour automatique
- ✅ **Fast** : Cache intelligent (Workbox)

### Fichiers PWA

```
frontend-followsport/
├── public/
│   └── manifest.json          # PWA manifest
├── dist/ (après build)
│   ├── sw.js                  # Service Worker
│   ├── manifest.webmanifest   # Manifest compilé
│   └── workbox-*.js           # Workbox runtime
└── vite.config.ts             # Config Vite PWA
```

---

## 🚀 Déploiement

### Option 1 : Render (Recommandé)

- **Backend** : Web Service (Node)
- **Frontend** : Static Site
- **Admin** : Static Site
- **Config** : `render.yaml`

Voir [RENDER_CONFIG.md](RENDER_CONFIG.md)

### Option 2 : Vercel + Railway

- **Frontend/Admin** : Vercel
- **Backend** : Railway
- **DB** : Railway MySQL

Voir [DEPLOY.md](DEPLOY.md)

### Option 3 : VPS

- **Frontend/Admin** : Nginx (fichiers statiques)
- **Backend** : PM2 + Node.js
- **DB** : MySQL

Voir [DEPLOY.md](DEPLOY.md)

---

## 🔧 Développement

### Setup complet

```bash
# Installation automatique
bash install.sh

# OU manuellement
cd frontend-followsport && npm install
cd ../admin-panel && npm install
cd ../backend-followsport && npm install
```

### Lancer en développement

```bash
# Terminal 1 - Backend
cd backend-followsport
npm run dev

# Terminal 2 - Frontend
cd frontend-followsport
npm run dev

# Terminal 3 - Admin (optionnel)
cd admin-panel
npm run dev
```

### URLs locales

- Frontend : http://localhost:5173
- Admin : http://localhost:5174
- Backend : http://localhost:9001

---

## 📊 Monitoring

### Développement

- **Frontend** : Vite DevTools
- **Backend** : Winston logs → `logs/`

### Production

- **Render** : Dashboard avec logs en temps réel
- **VPS** : PM2 logs + Monitoring

---

## 📚 Ressources

- [README principal](README.md)
- [Commandes rapides](COMMANDS.md)
- [Guide de déploiement](DEPLOY.md)
- [Guide de build](BUILD.md)

---

**🎉 Vous avez maintenant une vision complète du projet Fytli !**

