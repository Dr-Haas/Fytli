# ✨ Création de Programmes avec Exercices

## 🎯 Fonctionnalité

Permet aux utilisateurs de **créer des programmes d'entraînement personnalisés** avec une sélection d'exercices depuis la bibliothèque.

---

## 🏗️ Architecture

### Structure d'un programme
```
Programme
  └── Session (1 session par défaut)
       └── Exercices (multiple)
            ├── Sets (nombre de séries)
            ├── Reps (nombre de répétitions)
            └── Rest time (temps de repos en secondes)
```

---

## 🧩 Composants créés

### 1. **CreateProgramModal.tsx** 🎨
Modal complète pour créer un programme

#### Features
- ✅ Formulaire d'informations du programme
  - Titre (obligatoire)
  - Description
  - Niveau (débutant/intermédiaire/avancé)
  - Durée en semaines
  
- ✅ Sélection d'exercices
  - Liste scrollable de tous les exercices
  - Ajout facile avec bouton `+`
  - Pas de doublons
  
- ✅ Configuration des exercices
  - Nombre de séries (1-10)
  - Nombre de répétitions (1-100)
  - Temps de repos (0-300s par paliers de 15s)
  - Ordre des exercices
  
- ✅ UX Premium
  - Animations Framer Motion
  - Fond avec backdrop-blur
  - Design Fytli (crème, rouge-orange)
  - Messages d'erreur clairs

---

## 🔧 Services API créés

### 1. **exercises.ts** 📚
Service pour gérer les exercices

```typescript
exercisesService.getAll()           // Tous les exercices
exercisesService.getById(id)        // Un exercice spécifique
exercisesService.getByCategory(id)  // Exercices par catégorie
```

### 2. **sessions.ts** 🗓️
Service pour gérer les sessions

```typescript
sessionsService.getByProgramId(id)  // Sessions d'un programme
sessionsService.create(data)        // Créer une session
sessionsService.addExercise(data)   // Ajouter un exercice à une session
sessionsService.removeExercise(id)  // Retirer un exercice
```

### 3. **programs.ts** (mis à jour) 💪
Ajout des méthodes CRUD

```typescript
programsService.create(data)      // Créer un programme
programsService.update(id, data)  // Modifier un programme
programsService.delete(id)        // Supprimer un programme
```

---

## 📝 Page Programs mise à jour

### Nouvelles fonctionnalités
- ✅ Bouton "Nouveau programme" (haut à droite)
- ✅ Ouverture de la modal
- ✅ Chargement des exercices au mount
- ✅ Création du programme + session + exercices
- ✅ Rechargement automatique de la liste

### Flux de création
```
1. Utilisateur clique sur "Nouveau programme"
2. Modal s'ouvre avec animation
3. Utilisateur remplit les informations
4. Utilisateur ajoute des exercices
5. Utilisateur configure chaque exercice (sets, reps, repos)
6. Validation
   → Création du programme
   → Création de la session "Session principale"
   → Ajout des exercices à la session
   → Rechargement de la liste
   → Fermeture de la modal
```

---

## 🎨 Design Fytli appliqué

### Modal
- Fond crème (#FBFAF7)
- Titre avec dégradé rouge-orange
- Bordures arrondies 20px (`rounded-fytli-lg`)
- Ombres douces (`shadow-fytli-hover`)
- Transitions 200ms (`duration-fytli-base`)

### Boutons
- CTA principal : `btn-brand` (dégradé)
- Actions secondaires : `variant="outline"`
- Icône Plus pour ajouter

### Cards d'exercices
- Cards Fytli avec ombre
- Layout en grid responsive
- Inputs compacts pour sets/reps/repos

---

## 🔄 Mapping Backend ↔ Frontend

### Programme
```typescript
// Frontend → Backend
{
  title: "Mon programme"       → name: "Mon programme"
  level: "beginner"            → difficulty_level: "beginner"
  duration_weeks: 8            → duration_weeks: 8
}

// Backend → Frontend
{
  name: "Mon programme"        → title: "Mon programme"
  difficulty_level: "beginner" → level: "beginner"
}
```

### Session
```typescript
// Frontend (automatique)
{
  program_id: 1,
  title: "Session principale",
  day_number: 1,
  notes: "Description du programme"
}
```

### Exercices de session
```typescript
{
  session_id: 1,
  exercise_id: 5,
  sets: 3,
  reps: 12,
  rest_time_sec: 60,
  order_index: 1
}
```

---

## 🧪 Comment tester

### 1. Lancer l'application
```bash
cd frontend-followsport
npm run dev
```

### 2. Aller sur la page Programmes
http://localhost:5173/programs

### 3. Créer un programme
1. Cliquer sur "Nouveau programme" (bouton en haut à droite)
2. Remplir les informations :
   - Titre : "Programme Test"
   - Description : "Mon premier programme"
   - Niveau : Débutant
   - Durée : 8 semaines
3. Ajouter des exercices (cliquer sur les exercices disponibles)
4. Configurer chaque exercice :
   - Sets : 3
   - Reps : 12
   - Repos : 60s
5. Cliquer sur "Créer le programme"
6. ✅ Le programme apparaît dans la liste

---

## ⚠️ Prérequis Backend

### Endpoints nécessaires

#### Exercices
- `GET /exercises` → Liste des exercices
- `GET /exercises/:id` → Un exercice

#### Sessions
- `GET /programs/:id/sessions` → Sessions d'un programme
- `POST /sessions` → Créer une session
- `PUT /sessions/:id` → Modifier une session
- `DELETE /sessions/:id` → Supprimer une session

#### Session-Exercices
- `POST /session-exercises` → Ajouter un exercice
- `DELETE /session-exercises/:id` → Retirer un exercice

#### Programmes (déjà existants)
- ✅ `GET /programs`
- ✅ `POST /programs`
- ✅ `PUT /programs/:id`
- ✅ `DELETE /programs/:id`

---

## 🚀 Améliorations futures

### Court terme
- [ ] Page détail d'un programme (voir les exercices)
- [ ] Éditer un programme existant
- [ ] Supprimer un programme
- [ ] Filtrer exercices par type/muscle
- [ ] Recherche d'exercices

### Moyen terme
- [ ] Dupliquer un programme
- [ ] Ajouter plusieurs sessions (Jour 1, Jour 2, etc.)
- [ ] Drag & drop pour réorganiser les exercices
- [ ] Template de programmes prédéfinis
- [ ] Partager un programme

### Long terme
- [ ] Bibliothèque d'exercices avec vidéos
- [ ] Créer ses propres exercices
- [ ] Programme adaptatif selon les performances
- [ ] Progression automatique (surcharge progressive)

---

## 📊 Types TypeScript

### ProgramFormData
```typescript
interface ProgramFormData {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  exercises: SelectedExercise[];
}
```

### SelectedExercise
```typescript
interface SelectedExercise extends Exercise {
  sets: number;
  reps: number;
  rest_time_sec: number;
}
```

---

## 🎯 Messages utilisateur (Fytli)

### Succès
- "Programme créé ! On y va ? 💪"
- "Exercice ajouté à ta session"
- "Modification enregistrée"

### Erreurs
- "Le titre est obligatoire"
- "Ajoutez au moins un exercice"
- "Cet exercice est déjà ajouté"
- "Une erreur est survenue, réessaye"

---

## 📝 Code principal

### Créer un programme
```typescript
const handleCreateProgram = async (formData: ProgramFormData) => {
  // 1. Créer le programme
  const newProgram = await programsService.create({...});
  
  // 2. Créer une session
  const session = await sessionsService.create({...});
  
  // 3. Ajouter les exercices
  for (const exercise of formData.exercises) {
    await sessionsService.addExercise({...});
  }
  
  // 4. Recharger
  const updatedPrograms = await programsService.getAll();
  setPrograms(updatedPrograms);
};
```

---

## ✅ Checklist

- [x] Service exercices créé
- [x] Service sessions créé
- [x] Service programmes mis à jour (CRUD complet)
- [x] Modal de création avec design Fytli
- [x] Intégration dans la page Programs
- [x] Mapping backend ↔ frontend
- [x] Gestion d'erreurs
- [x] Build compilé sans erreurs
- [x] Documentation complète

---

**Statut** : ✅ Fonctionnel  
**Build** : ✅ Compilé  
**UI** : ✅ Design Fytli appliqué  
**Version** : Fytli 1.1

