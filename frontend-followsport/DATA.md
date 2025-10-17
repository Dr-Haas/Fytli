# 🧱 Structure de la Base de Données – Fytli

Documentation complète de la structure de données backend pour assurer la cohérence avec le frontend.

---

## 🧍‍♂️ `users`

Contient les informations de base des utilisateurs (athlètes / coachs).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant unique de l'utilisateur |
| `email` | varchar | Email de connexion |
| `password_hash` | varchar | Hash du mot de passe |
| `firstname` | varchar | Prénom |
| `lastname` | varchar | Nom |
| `gender` | enum('male','female','other') | Sexe |
| `birthdate` | date | Date de naissance |
| `height_cm` | int | Taille en cm |
| `weight_kg` | float | Poids actuel |
| `goal` | text | Objectif principal (ex. perte de poids, prise de masse, etc.) |
| `created_at` | timestamp | Date d'inscription |
| `updated_at` | timestamp | Dernière mise à jour |

### 📝 Notes Frontend
- ⚠️ **Attention** : Les colonnes sont `firstname` et `lastname` (pas `first_name`/`last_name`)
- Utiliser pour : AuthContext, Profile page
- Champs optionnels à afficher : gender, birthdate, height_cm, weight_kg, goal

---

## 🏋️ `programs`

Un programme correspond à un plan d'entraînement complet (ex. "Full Body 6 semaines").

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant du programme |
| `user_id` | int (FK → users.id) | Créateur ou propriétaire du programme |
| `title` | varchar | Nom du programme |
| `description` | text | Détails et objectifs |
| `duration_weeks` | int | Durée du programme en semaines |
| `level` | enum('beginner','intermediate','advanced') | Niveau |
| `created_at` | timestamp | Date de création |
| `updated_at` | timestamp | Dernière mise à jour |

### 📝 Notes Frontend
- ⚠️ **Attention** : Le nom est dans `title` (pas `name`)
- ⚠️ **Attention** : Le niveau est dans `level` avec valeurs : 'beginner', 'intermediate', 'advanced'
- Utiliser pour : Programs page, Dashboard, ProgramCard
- Badge difficulté : beginner=vert, intermediate=bleu, advanced=violet

---

## 🗓️ `sessions`

Chaque session représente un jour d'entraînement spécifique du programme.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant de la session |
| `program_id` | int (FK → programs.id) | Lien vers le programme |
| `title` | varchar | Nom de la session (ex. "Pectoraux & triceps") |
| `day_number` | int | Jour du programme (1, 2, 3, etc.) |
| `notes` | text | Conseils ou rappels spécifiques |
| `created_at` | timestamp | Date de création |

### 📝 Notes Frontend
- Utiliser pour : Page détail programme, planning des sessions
- Afficher par ordre de `day_number`

---

## 🏋️‍♀️ `exercises`

Table des exercices génériques disponibles dans la base (bibliothèque commune).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant de l'exercice |
| `name` | varchar | Nom (ex. "Développé couché") |
| `type` | enum('strength','cardio','stretch') | Type d'exercice |
| `muscle_group` | varchar | Groupe musculaire principal |
| `description` | text | Instructions ou détails |
| `video_url` | varchar | Lien vers une démo vidéo |
| `equipment` | varchar | Matériel requis (haltères, barre, etc.) |
| `created_at` | timestamp | Date d'ajout |

### 📝 Notes Frontend
- Utiliser pour : Bibliothèque d'exercices, sélection exercices
- Afficher vidéo si `video_url` existe
- Filtrer par `type` ou `muscle_group`

---

## 🧾 `session_exercises`

Table pivot reliant une session à plusieurs exercices.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant |
| `session_id` | int (FK → sessions.id) | Lien vers la session |
| `exercise_id` | int (FK → exercises.id) | Lien vers l'exercice |
| `sets` | int | Nombre de séries |
| `reps` | int | Nombre de répétitions |
| `rest_time_sec` | int | Temps de repos entre séries |
| `order_index` | int | Ordre d'affichage |

### 📝 Notes Frontend
- Utiliser pour : Détail d'une session, vue workout
- Afficher par ordre de `order_index`
- Format : "3 × 12 reps" (sets × reps)
- Timer de repos : `rest_time_sec`

---

## 📈 `user_progress`

Stocke les performances et mesures dans le temps.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant |
| `user_id` | int (FK → users.id) | Utilisateur |
| `date` | date | Date de la mesure |
| `weight_kg` | float | Poids |
| `body_fat_percent` | float | Masse grasse |
| `muscle_mass_kg` | float | Masse musculaire |
| `notes` | text | Commentaires de progression |

### 📝 Notes Frontend
- Utiliser pour : Graphiques de progression, Dashboard stats
- Afficher évolution temporelle (courbes)
- Permettre ajout de nouvelles mesures

---

## 💓 `pulse_tracking`

Pour les données santé / rythme cardiaque et bien-être (via app connectée).

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant |
| `user_id` | int (FK → users.id) | Lien utilisateur |
| `bpm` | int | Battements par minute |
| `recorded_at` | timestamp | Date/heure de la mesure |
| `mood` | enum('energized','tired','neutral') | État perçu |
| `activity_context` | enum('rest','training','recovery') | Contexte de la mesure |

### 📝 Notes Frontend
- Utiliser pour : Widget santé, suivi cardio
- Afficher graphique BPM
- Icônes selon mood (😊 energized, 😴 tired, 😐 neutral)

---

## 🍎 `nutrition_logs` (optionnel)

Journal alimentaire si tu veux élargir la portée de Fytli plus tard.

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | int (PK) | Identifiant |
| `user_id` | int (FK → users.id) | Lien utilisateur |
| `date` | date | Jour du log |
| `calories` | int | Apport total estimé |
| `protein_g` | float | Protéines |
| `carbs_g` | float | Glucides |
| `fat_g` | float | Lipides |
| `notes` | text | Commentaires (repas, ressenti, etc.) |

### 📝 Notes Frontend
- Utiliser pour : Journal nutrition (future feature)
- Graphiques macros (protéines/glucides/lipides)
- Suivi calorique quotidien

---

## 🔗 Relations entre tables

```
users
  ├── programs (user_id)
  ├── user_progress (user_id)
  ├── pulse_tracking (user_id)
  └── nutrition_logs (user_id)

programs
  └── sessions (program_id)
      └── session_exercises (session_id)
          └── exercises (exercise_id)
```

---

## ⚠️ Différences importantes avec le code actuel

### À mettre à jour dans `/src/types/index.ts` :

```typescript
// ❌ ANCIEN (à corriger)
export interface User {
  first_name: string;
  last_name: string;
}

export interface Program {
  name: string;
  difficulty_level?: string;
}

// ✅ NOUVEAU (correct selon DB)
export interface User {
  firstname: string;  // pas first_name
  lastname: string;   // pas last_name
  gender?: 'male' | 'female' | 'other';
  birthdate?: string;
  height_cm?: number;
  weight_kg?: number;
  goal?: string;
}

export interface Program {
  title: string;      // pas name
  level?: 'beginner' | 'intermediate' | 'advanced';  // pas difficulty_level
  duration_weeks?: number;
}
```

---

## 📋 Checklist de mise à jour Frontend

- [ ] Mettre à jour `/src/types/index.ts` avec les bons noms de colonnes
- [ ] Corriger `AuthContext.tsx` (firstname/lastname)
- [ ] Corriger `Profile.tsx` (firstname/lastname)
- [ ] Corriger `ProgramCard.tsx` (title au lieu de name, level au lieu de difficulty_level)
- [ ] Mettre à jour les services API si nécessaire
- [ ] Ajouter les nouveaux types (Session, Exercise, SessionExercise, Progress, etc.)

---

## 🎯 Endpoints Backend (à vérifier)

Vérifier que ces endpoints utilisent bien les noms de colonnes ci-dessus :

- `POST /auth/register` → utilise `firstname`, `lastname`
- `POST /auth/login` → retourne user avec `firstname`, `lastname`
- `GET /programs` → retourne `title`, `level`, `duration_weeks`
- `GET /users/:id` → retourne toutes les colonnes user

---

**Date de création** : Octobre 2025  
**Dernière mise à jour** : Octobre 2025

