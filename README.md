# 🏋️ Fytli - Bouge mieux, vis mieux

<div align="center">

![Fytli Logo](frontend-fytli/public/favicon-Fytli.png)

**Ton compagnon sport & bien-être**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[⚡ Quick Start](QUICK_START.md) • [🚀 Déployer](RENDER_CONFIG.md) • [Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📖 À Propos

**Fytli** est une Progressive Web App (PWA) moderne dédiée au sport et au bien-être. Conçue avec une approche **mobile-first**, elle offre une expérience fluide et motivante pour suivre tes entraînements, créer des programmes personnalisés et atteindre tes objectifs fitness.

### 🎯 Philosophie

> **"Chaleureux, moderne, accessible"**  
> Encourage sans intimider. Bienveillant et motivant.

### 💡 Tagline

> **"Bouge mieux, vis mieux."**

---

## ✨ Features

### 🔐 **Authentication**
- Inscription / Connexion sécurisée (JWT)
- Protection des routes privées
- Auto-login avec token persistant
- Session management

### 💪 **Programmes d'Entraînement**
- Créer des programmes personnalisés
- Ajouter des exercices depuis la bibliothèque
- Configurer sets, reps et temps de repos
- Recherche et filtres
- Vue détaillée avec sessions

### 🏋️ **Séances d'Entraînement**
- Mode workout étape par étape
- Timer de repos interactif
- Navigation fluide entre exercices
- Suivi en temps réel
- Résumé post-séance avec statistiques
- Commentaires AI (beta)

### 🏅 **Gamification**
- **10 badges** à débloquer
- 4 catégories : Routine, Performance, Santé, Accomplissement
- Système de progression
- Suivi des achievements
- Badges : 🔥 Constance, 💪 Progression, 🧘 Sérénité, 🚀 Niveau Supérieur, ❤️ Santé Cardiaque, 🌅 Routine Matinale, 🌙 Routine du Soir, 🎯 Objectif Atteint, 🏆 Challenge Réussi, 💫 Esprit Fytli

### 🎨 **Notifications**
- Toast system élégant
- Messages de succès, erreur, info
- Feedback temps réel
- Design cohérent Fytli

### 📱 **Mobile-First**
- Interface responsive optimisée mobile
- Burger menu natif
- Modals fullscreen sur mobile
- Boutons retour intelligents
- Touch-optimized (44px+ tap targets)

### ⚡ **PWA (Progressive Web App)**
- Installable sur mobile et desktop
- Fonctionne offline (Service Worker)
- Mode standalone (sans barre d'URL)
- Auto-update
- Cache intelligent (Workbox)

---

## 🖼️ Screenshots

<div align="center">

| Desktop | Mobile | PWA |
|---------|--------|-----|
| ![Dashboard](docs/screenshots/desktop-dashboard.png) | ![Mobile Menu](docs/screenshots/mobile-menu.png) | ![PWA Install](docs/screenshots/pwa-install.png) |

</div>

---

## 🚀 Installation

### Prérequis

- **Node.js** 20.19+ ou 22.12+
- **npm** 10+
- **MySQL** 8.0+

### 1. Clone le repository

```bash
git clone https://github.com/yourusername/fytli.git
cd fytli
```

### 2. Installation des dépendances

Chaque projet a son propre `package.json` et doit être installé séparément :

```bash
# Frontend
cd frontend-fytli
npm install

# Admin Panel
cd ../admin-panel
npm install

# Landing Page 🆕
cd ../website
npm install

# Backend
cd ../backend-fytli
npm install
```

### 3. Backend Setup

```bash
cd backend-fytli
npm install

# Créer le fichier .env
cp .env.example .env
# Configurer les variables (DB, JWT_SECRET, etc.)

# Créer la base de données
mysql -u root -p < database/schema.sql

# Lancer le backend
npm start
```

Le backend démarre sur **http://localhost:9001**

### 4. Frontend Setup

```bash
cd frontend-fytli
npm install

# Créer le fichier .env
cp .env.example .env
# Configurer VITE_API_URL=http://localhost:9001

# Lancer le frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

### 5. Lancer les applications

Chaque application se lance depuis son propre dossier :

```bash
# Frontend (port 5173)
cd frontend-fytli
npm run dev

# Admin Panel (port 5174)
cd admin-panel
npm run dev

# Backend (port 9001)
cd backend-fytli
npm run dev

# Landing Page (port 3000) 🆕
cd website
npm run dev
```

### 6. Accéder aux applications

- **Application principale** : http://localhost:5173
- **Admin Panel** : http://localhost:5174
- **Landing Page** : http://localhost:3000
- **Backend API** : http://localhost:9001

---

## 🏗️ Architecture

```
fytli_db/
├── backend-fytli/          # Backend Node.js + Express
│   ├── controllers/              # Logique métier
│   ├── models/                   # Modèles base de données
│   ├── routes/                   # Routes API
│   ├── middleware/               # Middlewares (auth, etc.)
│   └── server.js                 # Point d'entrée
│
├── frontend-fytli/         # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/               # Pages de l'application
│   │   ├── components/          # Composants réutilisables
│   │   ├── services/            # Services API (Axios)
│   │   ├── contexts/            # Contexts React (Auth)
│   │   ├── hooks/               # Custom hooks
│   │   ├── types/               # Types TypeScript
│   │   └── styles/              # Styles globaux
│   ├── public/                  # Assets statiques
│   └── vite.config.ts           # Configuration Vite + PWA
│
├── admin-panel/                  # Panel d'administration
│   ├── src/
│   │   ├── pages/               # Pages admin
│   │   ├── components/          # Composants admin
│   │   ├── services/            # Services API
│   │   └── types/               # Types TypeScript
│   └── vite.config.ts           # Configuration Vite
│
├── website/                      # Landing Page Next.js 🆕
│   ├── app/                     # Next.js App Router
│   ├── components/              # Composants de la landing
│   ├── lib/                     # Services API
│   └── README.md                # Documentation
│
└── docs/                        # Documentation complète
```

---

## 🛠️ Technologies

### Frontend

- **React 18** - UI Library
- **TypeScript 5** - Type Safety
- **Vite 7** - Build Tool & Dev Server
- **TailwindCSS 3** - Utility-First CSS
- **Framer Motion 11** - Animations
- **React Router 6** - Navigation
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Vite PWA Plugin** - Progressive Web App

### Backend

- **Node.js** - Runtime
- **Express 4** - Web Framework
- **MySQL 2** - Database
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

### DevOps

- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Vite** - Development & Build
- **Workbox** - Service Worker

---

## 🎨 Design System

### Couleurs Fytli

```css
--fytli-red: #FF4D3A      /* Primary */
--fytli-orange: #FF8A3D   /* Secondary */
--fytli-cream: #FBFAF7    /* Background */
--fytli-dark: #0E0E10     /* Foreground */
--fytli-gray: #3A3A3E     /* Muted */
--fytli-line: #D7D7DB     /* Borders */
--fytli-success: #2BB673  /* Success */
--fytli-warning: #FFCA55  /* Warning */
--fytli-info: #2D7FF9     /* Info */
```

### Typography

- **UI** : Inter, system-ui, sans-serif
- **Brand** : Poppins, Inter, sans-serif

### Border Radius

- SM: 12px
- MD: 16px (default)
- LG: 20px
- XL: 28px

---

## 📱 PWA Features

- ✅ **Installable** : Ajouter à l'écran d'accueil
- ✅ **Offline-ready** : Fonctionne sans connexion
- ✅ **Auto-update** : Mise à jour automatique
- ✅ **Standalone** : Lance comme une app native
- ✅ **Fast** : Cache intelligent (Service Worker)
- ✅ **Responsive** : S'adapte à tous les écrans

### Installation PWA

#### Android
1. Ouvrir dans Chrome
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône apparaît sur le launcher

#### iOS
1. Ouvrir dans Safari
2. Partager → "Sur l'écran d'accueil"
3. L'icône apparaît sur le Springboard

#### Desktop
1. Ouvrir dans Chrome/Edge
2. Icône "Installer" dans la barre d'URL
3. L'app s'installe comme une application native

---

## 📚 Documentation

### Guides Essentiels

- [🔧 Fix Render](RENDER_FIX.md) - Résoudre "Cannot find module" sur Render
- [🚀 Guide de Déploiement](DEPLOY.md) - Déployer sur Render, Vercel, VPS
- [🏗️ Guide de Build](BUILD.md) - Builder pour production
- [⚡ Commandes Rapides](COMMANDS.md) - Aide-mémoire des commandes
- [🗄️ Base de Données](DATABASE.md) - Schéma et structure

### Documentation Complète

- [Features - Session Workout](docs/FEATURE_SESSION_WORKOUT.md)
- [Features - Création Programmes](docs/FEATURE_CREATION_PROGRAMMES.md)
- [Système de Badges](docs/BADGES_SYSTEM.md)
- [Système de Toasts](docs/TOAST_SYSTEM.md)
- [Mobile-First & PWA](docs/MOBILE_FIRST_PWA.md)
- [Branding Guide](docs/BRAND.md)
- [Summary](docs/FINAL_SUMMARY.md)

### API Documentation

#### Authentication
```bash
POST /auth/register
POST /auth/login
GET /auth/profile
```

#### Programs
```bash
GET /programs
GET /programs/:id
POST /programs
PUT /programs/:id
DELETE /programs/:id
```

#### Sessions
```bash
GET /programs/:id/sessions
GET /sessions/:id
POST /sessions
PUT /sessions/:id
DELETE /sessions/:id
```

#### Exercises
```bash
GET /exercises
GET /exercises/:id
GET /exercises/category/:id
```

---

## 🧪 Tests

### Frontend

```bash
cd frontend-fytli
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Backend

```bash
cd backend-fytli
npm run test          # Run tests
npm run test:watch    # Watch mode
```

---

## 🏗️ Build

### Production Build

Chaque projet se build indépendamment :

```bash
# Frontend
cd frontend-fytli
npm run build         # Build pour production
npm run preview       # Preview du build

# Admin Panel
cd admin-panel
npm run build         # Build pour production
npm run preview       # Preview du build

# Backend
cd backend-fytli
npm run build         # Vérifie que tout est prêt
```

Les builds génèrent :
- `frontend-fytli/dist/` - Application frontend
  - index.html
  - assets/
  - sw.js (Service Worker)
  - manifest.webmanifest
- `admin-panel/dist/` - Panel d'administration
  - index.html
  - assets/

### Deploy

Les dossiers `dist/` peuvent être déployés sur :
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **Nginx**
- **Apache**

---

## 🤝 Contributing

Les contributions sont les bienvenues ! 🎉

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

### Guidelines

- Code en **TypeScript** (frontend)
- Suivre le **design system Fytli**
- Ajouter des **tests** si nécessaire
- Documenter les nouvelles **features**
- Respecter l'**architecture** existante

---

## 🐛 Bug Reports

Trouvé un bug ? Ouvre une [issue](https://github.com/yourusername/fytli/issues) avec :

- 📝 Description détaillée
- 🔄 Steps to reproduce
- 📱 Device & Browser
- 📸 Screenshots si possible

---

## 📝 License

Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus d'informations.

---

## 👥 Authors

- **Gary Haas** - *Initial work* - [@garyhaas](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Design inspiré de **Revolut** et **Stripe Dashboard**
- Icons par **Lucide Icons**
- Fonts : **Inter** & **Poppins** (Google Fonts)
- Service Worker : **Workbox**

---

## 📞 Contact

- **Email** : contact@fytli.app
- **Twitter** : [@fytli_app](https://twitter.com/fytli_app)
- **Website** : [fytli.app](https://fytli.app)

---

## 🗺️ Roadmap

### V1.1 (Court terme)
- [ ] Icons PWA (192x192, 512x512)
- [ ] Intégration OpenAI pour commentaires
- [ ] Historique des séances
- [ ] Graphiques de progression

### V1.2 (Moyen terme)
- [ ] Push notifications
- [ ] Partage de programmes
- [ ] Social features (amis)
- [ ] Vidéos d'exercices

### V2.0 (Long terme)
- [ ] Coach AI personnalisé
- [ ] Wearables integration (Apple Watch, Fitbit)
- [ ] Nutrition tracking
- [ ] Challenges communautaires

---

<div align="center">

**Fytli - Bouge mieux, vis mieux. 💪**

Made with ❤️ and 🔥

[⬆ Retour en haut](#-fytli---bouge-mieux-vis-mieux)

</div>

