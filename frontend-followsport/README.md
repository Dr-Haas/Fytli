# 🔥 Fytli - Frontend

**Bouge mieux, vis mieux.**

Application React + TypeScript moderne pour le suivi sportif et le bien-être.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Stack technique

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling utility-first
- **shadcn/ui** - Composants UI pro
- **Framer Motion** - Animations fluides
- **React Router v6** - Routing
- **Axios** - Requêtes HTTP
- **Lucide Icons** - Icônes modernes

## 🏗️ Architecture

```
/src
  /components     → Composants réutilisables
    /ui           → Composants de base (Button, Card, Input...)
  /pages          → Pages de l'application
  /contexts       → Contextes React (AuthContext)
  /services       → Services API (axios)
  /hooks          → Custom hooks
  /types          → Types TypeScript
  /lib            → Utilitaires
  /styles         → Configuration CSS
```

## 🎨 Design System

Inspiré de **Revolut** et **Stripe Dashboard** :
- Palette sobre (bleu, gris, blanc)
- Cards arrondies avec ombres douces
- Backdrop blur effects
- Animations subtiles
- Responsive design

## 🔐 Authentification

- JWT stocké dans localStorage
- Token injecté automatiquement dans les headers Axios
- Routes protégées avec `PrivateRoute`
- Redirection automatique si non authentifié

## 📄 Pages disponibles

- **`/login`** - Connexion / Inscription
- **`/dashboard`** - Vue d'ensemble et stats
- **`/programs`** - Liste des programmes d'entraînement
- **`/profile`** - Profil utilisateur

## 🔧 Configuration

### Backend API

L'application se connecte au backend sur `http://localhost:9001`

Pour changer l'URL, modifiez `src/services/api.ts` :

```ts
const API_BASE_URL = 'http://localhost:9001';
```

### Variables d'environnement

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:9001
```

## 📝 Scripts disponibles

```bash
npm run dev        # Développement
npm run build      # Build production
npm run preview    # Preview du build
npm run lint       # Linter ESLint
```

## 🧩 Composants principaux

### UI Components (`/components/ui`)
- `Button` - Boutons avec variantes
- `Card` - Cards modulaires
- `Input` - Champs de saisie
- `Label` - Labels de formulaire

### Business Components (`/components`)
- `Header` - Barre de navigation
- `Sidebar` - Navigation latérale
- `AuthForm` - Formulaire d'authentification
- `ProgramCard` - Card de programme
- `PrivateRoute` - Protection de routes

## 🎯 Bonnes pratiques

- ✅ TypeScript strict mode
- ✅ Pas de `any`
- ✅ Props typées avec interfaces
- ✅ Composants fonctionnels
- ✅ Custom hooks pour la logique réutilisable
- ✅ Services séparés pour les appels API
- ✅ Context API pour l'état global

## 📚 Documentation

Chaque dossier contient un fichier `context.md` qui explique :
- Le rôle du dossier/fichier
- Ce qu'il gère
- Ce qu'il ne gère pas
- Les évolutions possibles

## 🚀 Prochaines étapes

- [ ] Dark mode
- [ ] Notifications toast
- [ ] Progressive Web App (PWA)
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Internationalisation (i18n)

## 🤝 Contribution

1. Respecter l'architecture existante
2. Typer toutes les fonctions et composants
3. Utiliser les composants UI existants
4. Suivre les conventions de nommage
5. Documenter les changements importants

## 📄 Licence

MIT

---

**Version** : 1.0.0  
**Auteur** : FollowSport Team
