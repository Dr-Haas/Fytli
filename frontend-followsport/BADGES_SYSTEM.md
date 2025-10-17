# 🏅 Système de Badges Fytli

## 🎯 Vue d'ensemble

Un système de gamification douce avec **10 badges** pour encourager la progression, la régularité et l'engagement.

---

## 🏆 Les 10 Badges

### 1️⃣ 🔥 **Constance**
- **Description** : Enchaîne 7 jours d'entraînement sans interruption
- **Couleur** : Rouge-orange (flamme)
- **Catégorie** : Routine
- **Requirement** : 7 jours consécutifs

### 2️⃣ 💪 **Progression**
- **Description** : Améliore tes performances de 20%
- **Couleur** : Orange-ambre
- **Catégorie** : Performance
- **Requirement** : +20% de performances

### 3️⃣ 🧘 **Sérénité**
- **Description** : Complète 5 séances de stretching ou yoga
- **Couleur** : Crème-orange pastel
- **Catégorie** : Santé
- **Requirement** : 5 séances zen

### 4️⃣ 🚀 **Niveau Supérieur**
- **Description** : Passe du niveau débutant à intermédiaire
- **Couleur** : Dégradé rouge→orange→ambre
- **Catégorie** : Accomplissement
- **Requirement** : Level up

### 5️⃣ ❤️ **Santé Cardiaque**
- **Description** : Maintiens ton pouls dans la zone optimale pendant 30 min
- **Couleur** : Rouge vif
- **Catégorie** : Santé
- **Requirement** : 30 min zone optimale

### 6️⃣ 🌅 **Routine Matinale**
- **Description** : Entraîne-toi avant 9h pendant 5 jours
- **Couleur** : Ambre-orange (soleil levant)
- **Catégorie** : Routine
- **Requirement** : 5 matins actifs

### 7️⃣ 🌙 **Routine du Soir**
- **Description** : Entraîne-toi après 18h pendant 5 jours
- **Couleur** : Ambre foncé (lune)
- **Catégorie** : Routine
- **Requirement** : 5 soirs actifs

### 8️⃣ 🎯 **Objectif Atteint**
- **Description** : Atteins ton objectif de la semaine
- **Couleur** : Vert (cible)
- **Catégorie** : Accomplissement
- **Requirement** : Objectif hebdo

### 9️⃣ 🏆 **Challenge Réussi**
- **Description** : Complète un programme d'entraînement du début à la fin
- **Couleur** : Or-ambre (trophée)
- **Catégorie** : Accomplissement
- **Requirement** : Programme complété

### 🔟 💫 **Esprit Fytli** (Badge Légendaire)
- **Description** : Incarne la philosophie Fytli : régularité, bienveillance, progression
- **Couleur** : Dégradé signature rouge→orange→ambre
- **Catégorie** : Accomplissement
- **Requirement** : Badge légendaire

---

## 🎨 Design

### États des badges

#### ✅ **Débloqué (Earned)**
- Fond : dégradé de couleurs vives
- Icon : emoji visible en grand
- Check mark vert en haut à droite
- Border : orange léger
- Shadow : ombre douce Fytli
- Animation : effet de brillance périodique
- Date d'obtention affichée

#### 🔒 **Verrouillé (Locked)**
- Fond : gris clair (#F3F4F6)
- Icon : cadenas gris
- Opacité réduite (75%)
- Pas d'ombre
- Barre de progression si en cours

#### 📊 **En cours (In Progress)**
- Même style que verrouillé
- Barre de progression (0-100%)
- Pourcentage affiché

### Composants

#### BadgeCard
```tsx
<BadgeCard
  badge={badge}
  earned={true}
  earnedAt="2025-10-10T10:00:00Z"
  progress={65}
  onClick={() => console.log('clicked')}
/>
```

#### Props
- `badge`: Badge - données du badge
- `earned`: boolean - débloqué ou non
- `earnedAt?`: string - date d'obtention (ISO)
- `progress?`: number - progression 0-100
- `onClick?`: () => void - callback

---

## 📁 Structure des Fichiers

### Types (`src/types/badges.ts`)
```typescript
// BadgeId : 10 IDs uniques
type BadgeId = 'constance' | 'progression' | ...

// Badge : données complètes d'un badge
interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string; // emoji
  color: string; // hex
  gradient: string; // Tailwind classes
  requirement: string;
  category: 'routine' | 'performance' | 'health' | 'achievement';
}

// UserBadge : badge obtenu par un utilisateur
interface UserBadge {
  badge_id: BadgeId;
  earned_at: string; // ISO date
  progress?: number;
}

// BADGES : constante avec tous les badges
const BADGES: Record<BadgeId, Badge>

// BADGE_CATEGORIES : métadonnées des catégories
const BADGE_CATEGORIES
```

### Composant (`src/components/BadgeCard.tsx`)
- Card animée (Framer Motion)
- 3 états : earned, locked, in progress
- Hover effects
- Progress bar
- Check mark

### Page (`src/pages/Badges.tsx`)
- Layout complet avec Header + Sidebar
- Stats cards (débloqués, complétion, ce mois-ci)
- Progress bar globale
- Filtres par catégorie
- Grille de badges responsive
- Messages de motivation

---

## 🎯 Catégories

### 📅 **Routine** (3 badges)
- Constance 🔥
- Routine Matinale 🌅
- Routine du Soir 🌙

### 💪 **Performance** (1 badge)
- Progression 💪

### ❤️ **Santé** (2 badges)
- Sérénité 🧘
- Santé Cardiaque ❤️

### 🏆 **Accomplissement** (4 badges)
- Niveau Supérieur 🚀
- Objectif Atteint 🎯
- Challenge Réussi 🏆
- Esprit Fytli 💫

---

## 🔧 Intégration

### Routes (`App.tsx`)
```tsx
<Route path="/badges" element={
  <PrivateRoute><Badges /></PrivateRoute>
} />
```

### Navigation (Sidebar)
```tsx
{ to: '/badges', icon: Trophy, label: 'Badges' }
```

### Accès
- URL : http://localhost:5173/badges
- Menu : icône Trophy 🏆 dans la sidebar

---

## 📊 Données de Test

### Badges débloqués (3)
```typescript
{ badge_id: 'constance', earned_at: '2025-10-10T10:00:00Z' }
{ badge_id: 'routine_matinale', earned_at: '2025-10-15T08:30:00Z' }
{ badge_id: 'objectif_atteint', earned_at: '2025-10-16T20:00:00Z' }
```

### Badges en cours (3)
```typescript
progression: 65%
sante_cardiaque: 40%
challenge_reussi: 80%
```

---

## 🚀 Prochaines Étapes

### Backend (TODO)
- [ ] Table `badges` en DB
- [ ] Table `user_badges` (many-to-many)
- [ ] Endpoints :
  - `GET /badges` - liste des badges
  - `GET /users/:id/badges` - badges d'un user
  - `POST /users/:id/badges` - débloquer un badge
- [ ] Logique de déblocage automatique
- [ ] Calcul de progression en temps réel

### Frontend
- [ ] Remplacer les données de test par appels API
- [ ] Modal de détails du badge au clic
- [ ] Animation lors du déblocage
- [ ] Notification toast lors du déblocage
- [ ] Partage sur réseaux sociaux

### Gamification avancée
- [ ] Points par badge (ex: +50 pts)
- [ ] Classement entre utilisateurs
- [ ] Badges secrets à découvrir
- [ ] Badges temporaires (saisonniers)
- [ ] Niveaux de badges (bronze, argent, or)

---

## 🎨 Animations

### Au chargement
- Fade in + scale des cards
- Stagger delay (0.05s entre chaque)
- Progress bar animée

### Au hover
- Scale 1.05 si earned
- Scale 1.02 si locked
- Transition douce 200ms

### Badges earned
- Effet de brillance périodique
- Check mark qui apparaît avec spring
- Icon qui pop avec spring

---

## 💡 Messages de Motivation

Selon le nombre de badges :
- **0 badges** : "Commence ton aventure et débloque ton premier badge"
- **1-4 badges** : "Tu es sur la bonne voie ! Continue d'avancer"
- **5-7 badges** : "Excellente progression ! Plus que quelques badges"
- **8-9 badges** : "Presque tous débloqués ! Tu assures"
- **10 badges** : "Incroyable ! Tu as tous les badges ! Tu incarnes l'esprit Fytli 💫"

---

## 📈 Statistiques

### Fichiers créés
- `src/types/badges.ts` (~150 lignes)
- `src/components/BadgeCard.tsx` (~130 lignes)
- `src/pages/Badges.tsx` (~260 lignes)
- Total : **~540 lignes**

### Features
- **10 badges** uniques
- **4 catégories**
- **3 états** (earned, locked, progress)
- **Filtres** par catégorie
- **Stats** globales
- **Progress** bars

---

## 🧪 Comment Tester

### 1. Accéder à la page
```
http://localhost:5173/badges
```

### 2. Voir les badges débloqués
- 3 badges avec check mark vert ✅
- Date d'obtention affichée
- Effet de brillance

### 3. Voir les badges verrouillés
- 4 badges avec cadenas 🔒
- Opacité réduite

### 4. Voir les badges en cours
- 3 badges avec barre de progression 📊
- Pourcentage affiché

### 5. Filtrer par catégorie
- Cliquer sur "Routine", "Performance", etc.
- Voir seulement les badges de cette catégorie

### 6. Voir les stats
- Badges débloqués : 3/10
- Complétion : 30%
- Ce mois-ci : +3

---

## ✅ Checklist

- [x] Types TypeScript créés
- [x] Composant BadgeCard créé
- [x] Page Badges créée
- [x] Route ajoutée
- [x] Navigation sidebar ajoutée
- [x] 10 badges définis
- [x] 4 catégories définies
- [x] États earned/locked/progress
- [x] Animations Framer Motion
- [x] Design Fytli appliqué
- [x] Filtres par catégorie
- [x] Stats globales
- [x] Build sans erreurs
- [ ] Intégration backend (à venir)
- [ ] Modal de détails (à venir)
- [ ] Notifications déblocage (à venir)

---

**Statut** : ✅ Opérationnel (données de test)  
**Build** : ✅ Compilé  
**Design** : ✅ Fytli  
**Gamification** : ⭐⭐⭐⭐⭐

**Va sur `/badges` et découvre tes succès ! 🏆**

---

**Bouge mieux, progresse mieux. 🏅**

