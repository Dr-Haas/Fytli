# 🏋️ Séances d'Entraînement - Flux Complet

## 🎯 Vue d'ensemble

Un flux complet de A à Z pour :
1. **Consulter** un programme
2. **Démarrer** une session d'entraînement
3. **Faire** ses exercices étape par étape
4. **Voir** un résumé détaillé avec analyse AI

---

## 🛤️ Parcours Utilisateur

```
Page Programmes
    ↓ (clic sur un programme)
Détail du Programme
    ↓ (clic "Let's Go!")
Session d'Entraînement
    ↓ (fin des exercices)
Résumé de Séance
    ↓
Retour Dashboard / Programmes
```

---

## 📄 Pages Créées

### 1. **ProgramDetail** (`/programs/:id`)

Page de détail d'un programme montrant toutes ses sessions.

#### Features
- ✅ Affichage des informations du programme
  - Titre avec dégradé Fytli
  - Description
  - Badge de niveau (débutant/intermédiaire/avancé)
  - Durée en semaines
  - Nombre de sessions

- ✅ Liste des sessions d'entraînement
  - Numéro du jour (badge circulaire)
  - Titre de la session
  - Notes
  - Bouton "Let's Go!" pour démarrer

- ✅ Card de motivation
  - Message encourageant
  - Icon avec dégradé

- ✅ Navigation
  - Bouton retour vers /programs
  - Clic sur session → `/session/:id`

#### Design
- Layout avec Header + Sidebar
- Cards Fytli avec ombres douces
- Animations Framer Motion (stagger)
- Responsive

---

### 2. **SessionWorkout** (`/session/:id`)

Page immersive pour faire sa séance étape par étape.

#### Features
- ✅ **Header sticky**
  - Bouton quitter
  - Titre de la session
  - Indicateur de progression (exercice X/Y)
  - Barre de progression animée

- ✅ **Vue Exercice**
  - Nom de l'exercice (grand titre)
  - Groupe musculaire
  - Stats visuelles :
    - Série actuelle / totale
    - Répétitions
    - Temps de repos
  - Bouton "Série terminée"
  - Liste des exercices à venir

- ✅ **Écran de repos**
  - Compte à rebours (grande taille)
  - Icon Timer
  - Message "Temps de repos"
  - Bouton "Passer" le repos

- ✅ **Écran de fin**
  - Icon Trophy
  - Message "Bien joué ! 🎉"
  - Bouton vers le résumé

#### Logique
```typescript
Exercice 1 → Série 1 → Repos → Série 2 → Repos → Série 3
    ↓ (dernière série terminée)
Exercice 2 → Série 1 → ...
    ↓ (tous les exercices terminés)
Écran de fin → Résumé
```

#### État
- `currentExerciseIndex` : exercice actuel
- `currentSet` : série actuelle (1 à N)
- `isResting` : en pause ou pas
- `restTimeLeft` : secondes restantes
- `isCompleted` : séance terminée

#### Design
- Fond crème Fytli
- Layout fullscreen (pas de sidebar)
- Animations Framer Motion (slides, fade)
- Compte à rebours dynamique
- Barre de progression fluide

#### Données de test
Pour tester sans backend, 3 exercices sont créés par défaut :
1. Développé couché - 3×12 (60s)
2. Squat - 3×10 (90s)
3. Tractions - 4×8 (60s)

---

### 3. **SessionSummary** (`/session-summary`)

Page de résumé post-séance avec analyse AI (données statiques pour le moment).

#### Features
- ✅ **Hero section**
  - Fond dégradé rouge-orange
  - Icon Trophy animée
  - Titre "Séance terminée ! 🎉"
  - Nom de la session

- ✅ **Cards statistiques** (3 colonnes)
  - ⏱️ Durée (en minutes)
  - ⚡ Nombre d'exercices
  - 🏆 Séries totales

- ✅ **Analyse AI** (3 commentaires statiques)
  - **Belle régularité** : encouragement sur le rythme
  - **Intensité solide** : feedback sur les temps de repos
  - **Conseil du jour** : reminder hydratation

- ✅ **Liste des exercices réalisés**
  - Badge numéroté
  - Nom de l'exercice
  - Sets × Reps

- ✅ **Card motivation**
  - Citation inspirante
  - Message de fin

- ✅ **Actions**
  - Bouton "Retour au Dashboard" (principal)
  - Bouton "Voir les programmes" (secondaire)

#### Données AI (statiques)
```typescript
const aiComments = [
  {
    icon: TrendingUp,
    title: 'Belle régularité',
    message: 'Tu maintiens un bon rythme, continue comme ça ! 💪',
    color: 'from-fytli-success to-green-400',
  },
  {
    icon: Zap,
    title: 'Intensité solide',
    message: 'Tes temps de repos sont bien gérés, parfait pour la progression.',
    color: 'from-fytli-orange to-fytli-red',
  },
  {
    icon: MessageSquare,
    title: 'Conseil du jour',
    message: 'Pense à bien t\'hydrater après cette séance. 💧',
    color: 'from-fytli-info to-blue-400',
  },
];
```

#### Design
- Hero dégradé full-width
- Layout centré (max-w-2xl)
- Cards avec bordure colorée en haut
- Animations stagger
- Fond crème

---

## 🔗 Routes Ajoutées dans App.tsx

```tsx
// Détail d'un programme
<Route path="/programs/:id" element={<PrivateRoute><ProgramDetail /></PrivateRoute>} />

// Séance d'entraînement
<Route path="/session/:id" element={<PrivateRoute><SessionWorkout /></PrivateRoute>} />

// Résumé de séance
<Route path="/session-summary" element={<PrivateRoute><SessionSummary /></PrivateRoute>} />
```

---

## 🔧 Modifications Apportées

### Pages modifiées
- **`Programs.tsx`**
  - Ajout de `useNavigate`
  - Clic sur ProgramCard → `navigate(`/programs/${program.id}`)`

### Routes
- **`App.tsx`**
  - Import de 3 nouvelles pages
  - 3 nouvelles routes protégées

---

## 🧪 Comment tester

### 1. Lancer l'application
```bash
cd frontend-followsport
npm run dev
```

### 2. Aller sur Programmes
http://localhost:5173/programs

### 3. Cliquer sur un programme
→ Ouvre `/programs/:id`

### 4. Cliquer sur "Let's Go!" sur une session
→ Redirige vers `/session/:id`

### 5. Faire les exercices
- Cliquer sur "Série terminée" après chaque série
- Observer le compte à rebours de repos
- Cliquer sur "Passer" pour skip le repos
- Répéter jusqu'à la fin

### 6. Voir le résumé
- Écran "Bien joué ! 🎉"
- Cliquer sur "Voir le résumé"
- Observer les stats et commentaires AI

### 7. Retourner au Dashboard
- Cliquer sur "Retour au Dashboard"

---

## 🎨 Design Fytli

### Colors
- **Hero** : `bg-gradient-to-br from-fytli-red to-fytli-orange`
- **Backgrounds** : `bg-fytli-cream`
- **Text gradients** : `text-gradient` (rouge → orange)
- **Success** : `text-fytli-success`
- **Icons** : dégradés cohérents

### Components
- **Cards** : `card-fytli` (ombre douce)
- **Buttons** : `btn-brand` (dégradé avec hover)
- **Badges** : circulaires avec dégradé
- **Progress bar** : dégradé rouge-orange

### Animations
- **Page transitions** : fade + slide
- **Stagger** : 0.1s entre les éléments
- **Duration** : 200ms (fytli-base)
- **Easing** : cubic-bezier Fytli

---

## 🔄 Flux de données

### ProgramDetail
```typescript
// 1. Récupérer le programme
const program = await programsService.getById(id);

// 2. Récupérer ses sessions
const sessions = await sessionsService.getByProgramId(id);

// 3. Afficher
{sessions.map(session => (
  <SessionCard onClick={() => navigate(`/session/${session.id}`)} />
))}
```

### SessionWorkout
```typescript
// 1. Récupérer la session
const session = await sessionsService.getById(id);

// 2. Récupérer les exercices (TODO backend)
const exercises = await getSessionExercises(id);

// 3. Logique d'entraînement
if (currentSet < totalSets) {
  // Repos puis série suivante
} else if (currentExerciseIndex < totalExercises) {
  // Exercice suivant
} else {
  // Séance terminée
}

// 4. Redirection
navigate('/session-summary', { state: { session, exercises, duration } });
```

### SessionSummary
```typescript
// 1. Récupérer les données depuis location.state
const { session, exercises, duration } = location.state;

// 2. Calculer les stats
const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);

// 3. Afficher commentaires AI (statiques pour le moment)
{aiComments.map(comment => <AICommentCard {...comment} />)}
```

---

## ⚠️ Backend requis

### Endpoints nécessaires

#### Sessions
- ✅ `GET /programs/:id/sessions` - Sessions d'un programme
- ✅ `GET /sessions/:id` - Une session
- ✅ `POST /sessions` - Créer une session
- ✅ `PUT /sessions/:id` - Modifier une session
- ✅ `DELETE /sessions/:id` - Supprimer une session

#### Session-Exercices
- ❓ `GET /sessions/:id/exercises` - Exercices d'une session (TODO)
- ✅ `POST /session-exercises` - Ajouter un exercice
- ✅ `DELETE /session-exercises/:id` - Retirer un exercice

---

## 🚀 Prochaines étapes

### Court terme
- [ ] Implémenter `GET /sessions/:id/exercises` backend
- [ ] Récupérer les vrais exercices dans SessionWorkout
- [ ] Sauvegarder la séance terminée en DB
- [ ] Historique des séances

### Moyen terme
- [ ] Intégration OpenAI pour commentaires personnalisés
- [ ] Éditer sets/reps pendant la séance
- [ ] Timer audio avec notifications
- [ ] Mode hors-ligne (PWA)

### Long terme
- [ ] Vidéos des exercices
- [ ] Suivi de la charge (poids utilisé)
- [ ] Graphiques de progression
- [ ] Recommandations AI de programmes

---

## 💬 Messages utilisateur

### Motivants
- "Let's Go!" → Démarrer la session
- "Bien joué ! 🎉" → Fin de séance
- "Bouge mieux, vis mieux." → Tagline

### Encourageants
- "Le plus dur, c'est de commencer. Et tu l'as fait ! 🔥"
- "Tu maintiens un bon rythme, continue comme ça ! 💪"
- "20 minutes suffisent pour faire la différence."

### Informatifs
- "Prochaine : Série X"
- "Dernier exercice ! 💪"
- "Temps de repos"

---

## 📊 État de la feature

- [x] Page ProgramDetail créée
- [x] Page SessionWorkout créée
- [x] Page SessionSummary créée
- [x] Routes ajoutées dans App.tsx
- [x] Navigation depuis Programs
- [x] Logique d'entraînement étape par étape
- [x] Écran de repos avec timer
- [x] Écran de fin
- [x] Résumé avec stats
- [x] Commentaires AI statiques (3 cards)
- [x] Design Fytli appliqué partout
- [x] Animations Framer Motion
- [x] Build sans erreurs
- [ ] Intégration OpenAI (à venir)
- [ ] Récupération exercices depuis backend (à venir)

---

## 🎯 Résultat

**Un flux d'entraînement complet, fluide et motivant** qui guide l'utilisateur du choix du programme jusqu'au résumé de sa séance, avec des encouragements et une analyse (statique pour le moment).

**Statut** : ✅ Fonctionnel  
**Build** : ✅ Compilé  
**UI** : ✅ Design Fytli  
**Expérience** : ⭐⭐⭐⭐⭐

**Prêt à bouger ! 💪**

