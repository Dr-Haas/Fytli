# 📄 Pages de l'application

## 🎯 Vue d'ensemble

Les pages sont les composants de niveau supérieur qui orchestrent la logique métier, les appels API et l'assemblage des composants UI.

## 📱 Pages disponibles

### `/pages/Login.tsx`

**Rôle** : Page d'authentification (login + register)

**Fonctionnalités** :
- Formulaire centrée avec fond gradient
- Switch entre mode login/register
- Appel aux services auth
- Redirection vers `/dashboard` après connexion
- Animation d'entrée avec Framer Motion

**UX** :
- Background gradient élégant
- Logo et tagline au centre
- AuthForm réutilisable
- Transitions douces

---

### `/pages/Dashboard.tsx`

**Rôle** : Page d'accueil après connexion

**Sections** :
1. **Message de bienvenue** personnalisé
2. **Stats cards** : Programmes actifs, Progression, Jours consécutifs
3. **Programmes récents** : Aperçu des 3 derniers programmes

**Layout** :
- Header sticky + Sidebar
- Grille responsive (1/2/3 colonnes)
- Animations staggered (effet cascade)

**Data** :
- Fetch programs via `programsService.getAll()`
- Affiche user via `useAuth()`
- Loading states avec skeleton

**Navigation** :
- Bouton "Voir tout" → `/programs`
- Cards cliquables → `/programs`

---

### `/pages/Programs.tsx`

**Rôle** : Liste complète des programmes d'entraînement

**Fonctionnalités** :
- Affichage de tous les programmes
- Barre de recherche en temps réel
- Filtrage par nom et description
- Grille responsive de ProgramCards

**Layout** :
- Header + Sidebar
- Search bar en haut
- Grid de cards avec stagger animation

**Data** :
- Fetch tous les programmes
- Filtrage local (useState)
- Loading spinner centrée

---

### `/pages/Profile.tsx`

**Rôle** : Page de profil utilisateur

**Sections** :
1. **Card profil** : Avatar (initiales), nom, email
2. **Info cards** : Nom, Email, Date d'inscription, ID
3. **Paramètres** : Actions de gestion du compte

**Layout** :
- Header + Sidebar
- Max-width 4xl pour lisibilité
- Grille 2 colonnes (desktop)

**Data** :
- Affiche user via `useAuth()`
- Pas d'appel API (data déjà en contexte)

**Actions (à implémenter)** :
- Modifier informations
- Changer mot de passe
- Supprimer compte

---

## 🎨 Design patterns communs

### Layout
Toutes les pages protégées utilisent :
```tsx
<Header />
<div className="flex">
  <Sidebar />
  <main className="flex-1 p-6 lg:p-8">
    {/* Contenu */}
  </main>
</div>
```

### Animations
- **Entrée de page** : opacity 0→1 + translateY 20→0
- **Stagger children** : délai progressif (0.1s)
- **Hover effects** : elevation + border highlight

### Responsive
- Mobile : 1 colonne, sidebar cachée
- Tablet : 2 colonnes
- Desktop : 3 colonnes, sidebar visible

### Loading states
- Spinner centré pendant fetch
- Messages explicites si vide
- Gestion d'erreurs (console.error)

---

## 🔗 Dépendances

- **React Router** : Navigation
- **Framer Motion** : Animations
- **Services** : Appels API
- **Hooks** : useAuth, useState, useEffect
- **Components** : Header, Sidebar, Cards, etc.

---

## ❌ Ce qui n'est PAS géré ici

- Logique d'auth (dans AuthContext)
- Composants UI (dans /components)
- Appels API (dans /services)
- Types (dans /types)

---

## 🚀 Évolutions futures

### Court terme
- Page détail programme
- Page sessions
- Page exercices

### Moyen terme
- Page statistiques/analytics
- Page historique
- Page paramètres avancés

### Long terme
- Chat avec coach
- Social feed
- Gamification/badges

---

**Architecture** : Chaque page est autonome et peut être lazy-loadée pour optimiser les performances.

