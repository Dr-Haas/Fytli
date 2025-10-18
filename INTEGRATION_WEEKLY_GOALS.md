# 🎯 Module Objectifs Hebdomadaires - Guide d'intégration

## ✅ Fichiers créés

### 1. Types TypeScript
- **Fichier** : `frontend-fytli/src/types/index.ts`
- **Ajouts** : 
  - `WeeklyGoalType` - Types d'objectifs possibles
  - `WeeklyGoal` - Structure d'un objectif
  - `WeeklyGoalProgress` - Progression d'un objectif
  - `CreateWeeklyGoalData` - Données pour créer un objectif

### 2. Service API
- **Fichier** : `frontend-fytli/src/services/weeklyGoals.ts`
- **Fonctions** :
  - `getCurrentWeeklyGoal()` - Récupérer l'objectif actuel
  - `createWeeklyGoal()` - Créer un nouvel objectif
  - `updateWeeklyGoal()` - Modifier un objectif
  - `deleteWeeklyGoal()` - Supprimer un objectif
  - `suggestWeeklyGoal()` - Suggestion basée sur l'historique
- **Helpers** :
  - `getGoalTypeLabel()` - Libellé du type
  - `getGoalTypeIcon()` - Icône du type
  - `formatGoalDescription()` - Description formatée
  - `getProgressMessage()` - Message de progression
  - `getProgressColor()` - Couleur de la barre

### 3. Composant d'affichage
- **Fichier** : `frontend-fytli/src/components/WeeklyGoalCard.tsx`
- **Affiche** :
  - Progression visuelle avec barre
  - Statistiques (%, restant, jours)
  - Messages motivants
  - État complété avec animation

### 4. Modal de création/modification
- **Fichier** : `frontend-fytli/src/components/WeeklyGoalModal.tsx`
- **Permet** :
  - Choisir le type d'objectif
  - Définir la cible
  - Sélectionner des programmes (si applicable)
  - Ajouter une description personnalisée
  - Suggestion automatique basée sur l'historique

## 🎨 Types d'objectifs disponibles

| Type | Icon | Description | Exemple |
|------|------|-------------|---------|
| `workouts` | 🏋️ | Nombre de séances | "Complète 3 séances cette semaine" |
| `streak` | 🔥 | Jours consécutifs | "Enchaîne 5 jours d'entraînement" |
| `duration` | ⏱️ | Minutes totales | "Entraîne-toi 150 minutes cette semaine" |
| `exercises` | 💪 | Nombre d'exercices | "Complète 50 exercices" |
| `programs` | 📋 | Programmes spécifiques | "Termine le programme Full Body" |
| `sessions` | ✅ | Sessions spécifiques | "Complète 5 sessions" |

## 🚀 Intégration dans le Dashboard

### Étape 1 : Importer les composants

Dans `frontend-fytli/src/pages/Dashboard.tsx`, ajoutez :

```typescript
import { useState } from 'react';
import WeeklyGoalCard from '../components/WeeklyGoalCard';
import WeeklyGoalModal from '../components/WeeklyGoalModal';
```

### Étape 2 : Ajouter l'état du modal

```typescript
const [showWeeklyGoalModal, setShowWeeklyGoalModal] = useState(false);
const [refreshKey, setRefreshKey] = useState(0);
```

### Étape 3 : Ajouter les handlers

```typescript
const handleOpenGoalModal = () => {
  setShowWeeklyGoalModal(true);
};

const handleCloseGoalModal = () => {
  setShowWeeklyGoalModal(false);
};

const handleGoalSuccess = () => {
  setRefreshKey(prev => prev + 1);
};
```

### Étape 4 : Ajouter le composant dans le JSX

Option A - En haut du Dashboard :

```tsx
{/* Dashboard */}
<div className="p-6">
  {/* Objectif de la semaine */}
  <div className="mb-8">
    <WeeklyGoalCard 
      key={refreshKey}
      onCreateGoal={handleOpenGoalModal} 
    />
  </div>

  {/* Reste du Dashboard */}
  {/* ... */}
</div>
```

Option B - Dans une grille avec d'autres widgets :

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  {/* Objectif de la semaine */}
  <WeeklyGoalCard 
    key={refreshKey}
    onCreateGoal={handleOpenGoalModal} 
  />
  
  {/* Autres widgets */}
  {/* ... */}
</div>
```

### Étape 5 : Ajouter le modal

À la fin du composant Dashboard, avant la fermeture :

```tsx
{/* Modal d'objectif hebdomadaire */}
<WeeklyGoalModal
  isOpen={showWeeklyGoalModal}
  onClose={handleCloseGoalModal}
  onSuccess={handleGoalSuccess}
/>
```

## 📊 Exemple complet d'intégration

```tsx
// frontend-fytli/src/pages/Dashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WeeklyGoalCard from '../components/WeeklyGoalCard';
import WeeklyGoalModal from '../components/WeeklyGoalModal';
// ... autres imports

export default function Dashboard() {
  const { user } = useAuth();
  const [showWeeklyGoalModal, setShowWeeklyGoalModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ... autres states et useEffects

  const handleOpenGoalModal = () => {
    setShowWeeklyGoalModal(true);
  };

  const handleGoalSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {user?.firstname} ! 👋
          </h1>
          <p className="text-gray-600 mt-2">Voici ton tableau de bord</p>
        </div>

        {/* Objectif de la semaine */}
        <div className="mb-8">
          <WeeklyGoalCard 
            key={refreshKey}
            onCreateGoal={handleOpenGoalModal} 
          />
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vos autres composants */}
        </div>
      </div>

      {/* Modal */}
      <WeeklyGoalModal
        isOpen={showWeeklyGoalModal}
        onClose={() => setShowWeeklyGoalModal(false)}
        onSuccess={handleGoalSuccess}
      />
    </Layout>
  );
}
```

## 🔧 Backend nécessaire

Le backend doit exposer ces endpoints (déjà présents dans `badgesController.js`) :

```javascript
GET    /api/badges/user/:userId/weekly-goal          // Objectif actuel
POST   /api/badges/user/:userId/weekly-goal          // Créer objectif
PUT    /api/badges/user/:userId/weekly-goal          // Modifier objectif
DELETE /api/badges/user/:userId/weekly-goal          // Supprimer objectif
GET    /api/badges/user/:userId/weekly-goals         // Historique
POST   /api/badges/user/:userId/weekly-goal/complete // Marquer complété
GET    /api/badges/user/:userId/suggest-goal         // Suggestion (optionnel)
```

## ✨ Fonctionnalités

### Affichage automatique
- ✅ Progression en temps réel
- ✅ Barre de progression colorée selon avancement
- ✅ Stats détaillées (%, restant, jours)
- ✅ Messages motivants contextuels
- ✅ Animation quand objectif complété

### Création d'objectifs
- ✅ 6 types d'objectifs différents
- ✅ Sélection de programmes multiples
- ✅ Description personnalisée
- ✅ Suggestions basées sur l'historique
- ✅ Validation des données

### UX/UI
- ✅ Design moderne avec Tailwind CSS
- ✅ Responsive (mobile + desktop)
- ✅ Animations fluides
- ✅ Toast notifications
- ✅ Loading states
- ✅ États vides élégants

## 🎨 Personnalisation

### Modifier les couleurs

Dans `WeeklyGoalCard.tsx`, ligne 113-118 :

```typescript
const progressColor = weeklyGoalHelpers.getProgressColor(progress_percent);
// Personnalisez dans weeklyGoals.ts, fonction getProgressColor()
```

### Ajouter des types d'objectifs

Dans `weeklyGoals.ts`, modifiez l'array `goalTypes` du modal.

### Changer le design

Les classes Tailwind peuvent être modifiées dans les composants pour s'adapter à votre charte graphique.

## 🔄 Mise à jour automatique

L'objectif se met à jour automatiquement quand :
- ✅ Une séance est complétée
- ✅ Un programme est terminé
- ✅ L'utilisateur s'entraîne

Le backend appelle `checkAllBadges()` qui vérifie aussi les objectifs hebdomadaires.

## 📱 Responsive

Le module est entièrement responsive :
- Mobile : Carte pleine largeur
- Tablet : 2 colonnes possible
- Desktop : Intégration flexible

## 🐛 Debug

Si l'objectif ne s'affiche pas :

1. Vérifier que l'utilisateur est connecté : `console.log(user)`
2. Vérifier l'API : Ouvrir DevTools > Network
3. Vérifier le backend : Les endpoints sont-ils accessibles ?
4. Vérifier la base de données : La table `weekly_goals` existe ?

## 🎉 Résultat

Vous aurez un module complet d'objectifs hebdomadaires avec :
- 🎯 6 types d'objectifs différents
- 📊 Suivi en temps réel de la progression
- 🏆 Gamification et motivation
- ✨ UI/UX moderne et engageante
- 🔄 Mise à jour automatique
- 📱 Responsive sur tous appareils

Félicitations ! Le module est prêt à être utilisé ! 🚀

