# 🎯 Module Objectifs Hebdomadaires - Setup Complet

## ✅ Ce qui a été créé

### 📊 Base de données
1. **Migration SQL** : `MIGRATION_WEEKLY_GOALS_UPDATE.sql`
   - ✅ Ajoute `description` (TEXT)
   - ✅ Ajoute `target_programs` (JSON)
   - ✅ Ajoute `target_sessions` (JSON)
   - ✅ Met à jour `goal_type` ENUM (6 types au lieu de 3)

### 🔧 Backend
1. **Controller** : `backend-fytli/controllers/badgesController.js`
   - ✅ Support des 6 types d'objectifs
   - ✅ Gestion des nouveaux champs
   - ✅ Validation améliorée
   - ✅ Support snake_case et camelCase

2. **Model** : `backend-fytli/models/badgesModel.js`
   - ✅ Récupération avec parsing JSON
   - ✅ Création/mise à jour avec tous les champs
   - ✅ Retourne les arrays parsés

### 🎨 Frontend
1. **Types** : `frontend-fytli/src/types/index.ts`
   - ✅ `WeeklyGoalType` - 6 types
   - ✅ `WeeklyGoal` - Structure complète
   - ✅ `WeeklyGoalProgress` - Progression
   - ✅ `CreateWeeklyGoalData` - Formulaire

2. **Service** : `frontend-fytli/src/services/weeklyGoals.ts`
   - ✅ CRUD complet
   - ✅ Helpers de formatage
   - ✅ Calcul de progression
   - ✅ Messages contextuels

3. **Composants** :
   - ✅ `WeeklyGoalCard.tsx` - Affichage
   - ✅ `WeeklyGoalModal.tsx` - Création/Modification

4. **Documentation** : `INTEGRATION_WEEKLY_GOALS.md`

## 🚀 Installation en 3 étapes

### Étape 1 : Migrer la base de données

```bash
# Dans MySQL Workbench, exécuter :
MIGRATION_WEEKLY_GOALS_UPDATE.sql
```

**Vérification** :
```sql
DESC weekly_goals;
-- Vous devriez voir les colonnes :
-- - description
-- - target_programs  
-- - target_sessions
```

### Étape 2 : Déployer le backend

```bash
cd backend-fytli

# Si en local, redémarrer
npm start

# Si sur Render, pousser les changements
git add controllers/badgesController.js models/badgesModel.js
git commit -m "feat: amélioration objectifs hebdomadaires - 6 types supportés"
git push origin main
```

### Étape 3 : Intégrer le frontend

Dans `frontend-fytli/src/pages/Dashboard.tsx` :

```tsx
import { useState } from 'react';
import WeeklyGoalCard from '../components/WeeklyGoalCard';
import WeeklyGoalModal from '../components/WeeklyGoalModal';

export default function Dashboard() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout>
      <div className="p-6">
        {/* Objectif de la semaine */}
        <div className="mb-8">
          <WeeklyGoalCard 
            key={refreshKey}
            onCreateGoal={() => setShowGoalModal(true)} 
          />
        </div>

        {/* ... reste du dashboard */}
      </div>

      {/* Modal */}
      <WeeklyGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </Layout>
  );
}
```

## 📋 Types d'objectifs disponibles

| Type | Icône | Description | Exemple |
|------|-------|-------------|---------|
| `workouts` | 🏋️ | Nombre de séances | "Complète 3 séances cette semaine" |
| `streak` | 🔥 | Jours consécutifs | "Enchaîne 5 jours d'entraînement" |
| `duration` | ⏱️ | Minutes totales | "150 minutes d'exercice cette semaine" |
| `exercises` | 💪 | Nombre d'exercices | "Complète 50 exercices" |
| `programs` | 📋 | Programmes spécifiques | "Termine 2 programmes" |
| `sessions` | ✅ | Sessions spécifiques | "Complète 5 sessions précises" |

## 🔗 Endpoints API

```javascript
// Récupérer l'objectif actuel
GET /api/badges/user/:userId/weekly-goal

// Créer/Modifier un objectif
POST /api/badges/user/:userId/weekly-goal
Body: {
  goal_type: 'workouts',
  goal_target: 3,
  description: 'Description optionnelle',
  target_programs: [1, 2],  // Optionnel
  target_sessions: [5, 6]   // Optionnel
}

// Supprimer l'objectif
DELETE /api/badges/user/:userId/weekly-goal

// Historique
GET /api/badges/user/:userId/weekly-goals?limit=10

// Marquer comme complété
POST /api/badges/user/:userId/weekly-goal/complete
```

## 🎨 Structure de la table weekly_goals

```sql
CREATE TABLE weekly_goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  week_start_date DATE NOT NULL,
  goal_type ENUM('workouts', 'duration', 'exercises', 'streak', 'programs', 'sessions'),
  goal_target INT NOT NULL,
  goal_current INT DEFAULT 0,
  goal_achieved BOOLEAN DEFAULT FALSE,
  description TEXT NULL,
  target_programs JSON NULL,
  target_sessions JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_week (user_id, week_start_date)
);
```

## 💡 Exemples d'utilisation

### Créer un objectif simple
```javascript
POST /api/badges/user/1/weekly-goal
{
  "goal_type": "workouts",
  "goal_target": 3
}
```

### Créer un objectif avec programmes spécifiques
```javascript
POST /api/badges/user/1/weekly-goal
{
  "goal_type": "programs",
  "goal_target": 2,
  "target_programs": [5, 8],
  "description": "Terminer les programmes Full Body et Cardio"
}
```

### Créer un objectif streak
```javascript
POST /api/badges/user/1/weekly-goal
{
  "goal_type": "streak",
  "goal_target": 5,
  "description": "Enchaîner 5 jours consécutifs d'entraînement"
}
```

## 🎯 Logique de mise à jour automatique

Le `goal_current` se met à jour automatiquement via :

1. **workouts** : Incrémenté à chaque session complétée
2. **duration** : Additionne les minutes d'exercice
3. **exercises** : Compte le nombre d'exercices complétés
4. **streak** : Calculé via `user_stats.current_streak`
5. **programs** : Incrémenté quand un programme passe en status 'completed'
6. **sessions** : Incrémenté quand une session des `target_sessions` est complétée

## 🐛 Dépannage

### L'objectif ne s'affiche pas
1. Vérifier que l'utilisateur est connecté
2. Ouvrir DevTools > Network > Voir la requête GET
3. Vérifier que la table `weekly_goals` a les nouvelles colonnes
4. Redémarrer le backend

### Erreur "goal_type invalide"
- Le backend attend maintenant 6 types : `workouts`, `duration`, `exercises`, `streak`, `programs`, `sessions`
- Vérifier que la migration SQL a bien été exécutée

### Les programmes ne s'affichent pas dans le modal
- Vérifier que l'utilisateur a des programmes disponibles
- Vérifier l'endpoint `/programs` dans DevTools

### Erreur JSON parse
- S'assurer que `target_programs` et `target_sessions` sont bien des arrays JSON en DB
- Le backend encode automatiquement en JSON

## ✨ Fonctionnalités

### Interface utilisateur
- ✅ Carte visuelle moderne
- ✅ Barre de progression animée
- ✅ 3 stats principales (%, restant, jours)
- ✅ Messages motivants contextuels
- ✅ Animation d'accomplissement
- ✅ État vide engageant

### Modal de création
- ✅ 6 types d'objectifs visuels
- ✅ Sélection multiple de programmes
- ✅ Description personnalisée
- ✅ Validation en temps réel
- ✅ Tips et conseils
- ✅ Responsive mobile/desktop

### Backend
- ✅ Validation robuste
- ✅ Support JSON pour arrays
- ✅ Gestion des erreurs
- ✅ Parsing automatique
- ✅ Compatibilité snake_case/camelCase

## 🎉 Résultat final

Vous avez maintenant un système complet d'objectifs hebdomadaires avec :

- 🎯 6 types d'objectifs différents
- 📊 Suivi en temps réel
- 🏆 Gamification
- ✨ UI/UX moderne
- 🔄 Mise à jour automatique
- 📱 Responsive
- 🛡️ Validation côté backend
- 💾 Stockage flexible (JSON)

**Le module est 100% fonctionnel et prêt à l'emploi !** 🚀

