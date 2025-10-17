# 🔥 Fytli - Webapp Front-End

**Bouge mieux, vis mieux.**

## 🎯 Vision du projet

Fytli est une application web moderne, chaleureuse et inclusive dédiée au sport et au bien-être. Elle permet aux utilisateurs de consulter des programmes d'entraînement, suivre leur progression et gérer leur profil de manière intuitive et élégante.

## 👥 Public cible

- Sportifs amateurs et professionnels
- Coachs sportifs
- Personnes souhaitant améliorer leur condition physique
- Utilisateurs recherchant une expérience digitale premium

## 🎨 Philosophie UX/UI

### Inspiration : Revolut / Stripe Dashboard

- **Minimalisme** : Chaque élément a un but, pas de surcharge visuelle
- **Élégance** : Design sobre avec palette neutre (bleu, gris, blanc)
- **Fluidité** : Animations subtiles et transitions douces
- **Clarté** : Hiérarchie visuelle claire, typographie lisible
- **Modernité** : Cards avec ombres douces, effets de flou (backdrop-blur)

### Principes de design

1. **Mobile-first** : Responsive sur tous les écrans
2. **Performance** : Chargement rapide, optimisation images
3. **Accessibilité** : Contraste, navigation clavier, ARIA
4. **Feedback visuel** : États hover, active, loading clairs
5. **Cohérence** : Système de design unifié avec shadcn/ui

## 🏗️ Architecture technique

### Stack

- **Framework** : React 18 + Vite
- **Langage** : TypeScript (strict mode)
- **Styling** : TailwindCSS + shadcn/ui
- **Icons** : Lucide React
- **Animations** : Framer Motion
- **HTTP Client** : Axios
- **Routing** : React Router v6
- **State Management** : React Context API (AuthContext)
- **Storage** : localStorage (JWT token)

### Structure des dossiers

```
/src
  /pages          → Pages principales (Login, Register, Dashboard, Programs, Profile)
  /components     → Composants réutilisables UI
  /contexts       → Contextes React (AuthContext)
  /services       → Services API (axios)
  /hooks          → Custom hooks
  /types          → Types TypeScript globaux
  /lib            → Utilitaires (cn pour classes)
  /styles         → Configuration Tailwind
```

## 🔐 Sécurité & Authentification

- JWT stocké en localStorage
- Token injecté automatiquement dans headers Axios
- Routes protégées avec wrapper PrivateRoute
- Expiration token gérée (redirection login)
- Validation des inputs côté client

## 🔗 Connexion Backend

- Base URL : `http://localhost:3001`
- Endpoints principaux :
  - `POST /auth/login` - Connexion utilisateur
  - `POST /auth/register` - Inscription utilisateur
  - `GET /programs` - Liste des programmes
  - `GET /users/:id` - Profil utilisateur

## 📱 Pages & Features

### Login / Register
- Formulaire centré, élégant
- Validation en temps réel
- Messages d'erreur clairs
- Animation d'entrée

### Dashboard
- Vue d'ensemble des programmes actifs
- Statistiques de progression
- Accès rapide aux fonctionnalités
- Layout avec sidebar

### Programs
- Grille de cards interactives
- Filtres et recherche
- Détails programme au clic
- États hover/active

### Profile
- Informations utilisateur
- Modification profil
- Historique d'activité

## 🚀 Évolutivité

### Court terme
- Ajout de plus de pages (Sessions, Exercices)
- Dark mode
- Notifications
- Upload d'avatar

### Moyen terme
- Progressive Web App (PWA)
- Mode offline
- Graphiques de progression
- Chat coach

### Long terme
- Multi-langues (i18n)
- Social features
- Gamification
- IA recommendations

## 📦 Ce que ce projet gère

✅ Authentification complète (JWT)
✅ Interface utilisateur moderne et responsive
✅ Navigation entre pages
✅ Appels API sécurisés
✅ Gestion d'état global (auth)
✅ Expérience utilisateur premium

## ❌ Ce que ce projet NE gère PAS

❌ Backend / API (déjà existant)
❌ Base de données
❌ Paiements en ligne
❌ Envoi d'emails
❌ Analytics serveur

## 🎯 Objectifs de qualité

- Code TypeScript strict (pas de `any`)
- Composants réutilisables et découplés
- Props typées avec interfaces
- Gestion d'erreurs robuste
- Comments uniquement si nécessaire (code auto-documenté)
- Tests unitaires (à venir)

---

**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025

