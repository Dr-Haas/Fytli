# 🎯 Fytli Admin Panel

Panel d'administration pour la plateforme Fytli - Gérez votre application de fitness en toute simplicité.

## 📋 Fonctionnalités

### 🏠 Dashboard
- Vue d'ensemble des statistiques principales
- Utilisateurs récents
- Programmes populaires
- Dernières complétions de sessions

### 👥 Gestion des utilisateurs
- Liste complète des utilisateurs
- Filtrage par rôle (admin/user)
- Recherche par nom ou email
- Modification des rôles
- Suppression d'utilisateurs
- Statistiques par utilisateur

### 📚 Gestion des programmes
- Liste de tous les programmes
- Filtrage par difficulté
- Recherche par titre
- Suppression de programmes
- Statistiques d'inscription

### 📅 Gestion des sessions
- Vue de toutes les sessions complétées
- Détails des complétions
- Photos des sessions
- Notes des utilisateurs
- Statistiques de durée

### 🎓 Gestion des inscriptions
- Suivi des inscriptions actives
- Filtrage par statut (active/completed/paused)
- Progression des utilisateurs
- Suppression d'inscriptions

### 🏆 Gestion des badges
- Liste des badges disponibles
- Badges gagnés par les utilisateurs
- Création et suppression de badges
- Suivi des récompenses

### 📊 Statistiques avancées
- Métriques détaillées de la plateforme
- Taux d'engagement
- Moyennes par utilisateur
- Activité quotidienne

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- npm ou yarn
- Backend Fytli en cours d'exécution

### Installation

```bash
# Naviguer dans le dossier
cd admin-panel

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer l'URL de l'API dans .env
# VITE_API_URL=http://localhost:9001/api
```

## 🎮 Utilisation

### Démarrage en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5174`

### Build de production

```bash
npm run build
```

### Preview du build

```bash
npm run preview
```

## 🔐 Authentification

Seuls les utilisateurs avec le rôle **admin** peuvent accéder au panel d'administration.

### Créer un compte admin

Utilisez le script backend pour créer un administrateur :

```bash
cd ../backend-followsport
node createAdmin.js
```

Suivez les instructions pour créer votre compte administrateur.

## 📦 Structure du projet

```
admin-panel/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── StatCard.tsx
│   │   └── Table.tsx
│   ├── pages/              # Pages de l'application
│   │   ├── Badges.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Enrollments.tsx
│   │   ├── Login.tsx
│   │   ├── Programs.tsx
│   │   ├── Sessions.tsx
│   │   ├── Stats.tsx
│   │   └── Users.tsx
│   ├── services/           # Services API
│   │   ├── admin.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── badges.ts
│   │   ├── enrollments.ts
│   │   ├── programs.ts
│   │   └── sessions.ts
│   ├── types/              # Types TypeScript
│   │   └── index.ts
│   ├── utils/              # Utilitaires
│   │   ├── cn.ts
│   │   └── format.ts
│   ├── App.tsx             # Composant principal
│   ├── main.tsx            # Point d'entrée
│   └── index.css           # Styles globaux
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Technologies utilisées

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Navigation
- **Axios** - Client HTTP
- **React Hot Toast** - Notifications
- **Lucide React** - Icônes
- **Framer Motion** - Animations

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:9001/api
```

### Proxy API

Le proxy Vite est configuré pour rediriger les requêtes `/api` vers le backend :

```typescript
// vite.config.ts
server: {
  port: 5174,
  proxy: {
    '/api': {
      target: 'http://localhost:9001',
      changeOrigin: true,
    },
  },
}
```

## 📱 Responsive Design

L'admin panel est entièrement responsive et optimisé pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔒 Sécurité

- Authentification JWT
- Routes protégées
- Vérification du rôle admin
- Tokens stockés en localStorage
- Déconnexion automatique en cas d'erreur 401

## 🐛 Dépannage

### L'application ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`

### Erreurs d'API
- Vérifiez que le backend est en cours d'exécution sur le port 9001
- Vérifiez l'URL dans `.env`

### Problèmes d'authentification
- Videz le localStorage du navigateur
- Vérifiez que votre compte a le rôle admin
- Créez un nouveau compte admin si nécessaire

## 📄 License

Ce projet fait partie de la plateforme Fytli.

## 👥 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

Fait avec ❤️ pour Fytli

