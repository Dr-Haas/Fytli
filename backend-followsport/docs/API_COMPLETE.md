# 📘 Documentation API Complète - Backend FollowSport

## 🌐 URL de base
```
http://localhost:9001
```

---

## 📋 Table des matières
- [Résumé des endpoints](#résumé-des-endpoints)
- [Users](#users)
- [Programs](#programs)
- [Sessions](#sessions)
- [Categories](#categories)
- [Exercises](#exercises)
- [Session-Exercises](#session-exercises)
- [Progress](#progress)

---

## Résumé des endpoints

| Ressource | Méthode | Endpoint | Description |
|-----------|---------|----------|-------------|
| **Users** | GET | `/users` | Liste tous les utilisateurs |
| | GET | `/users/:id` | Récupère un utilisateur |
| | POST | `/users` | Crée un utilisateur |
| | PUT | `/users/:id` | Modifie un utilisateur |
| | DELETE | `/users/:id` | Supprime un utilisateur |
| **Programs** | GET | `/programs` | Liste tous les programmes |
| | GET | `/programs/:id` | Récupère un programme |
| | POST | `/programs` | Crée un programme |
| | PUT | `/programs/:id` | Modifie un programme |
| | DELETE | `/programs/:id` | Supprime un programme |
| **Sessions** | GET | `/sessions` | Liste toutes les sessions |
| | GET | `/sessions?program_id=X` | Filtre par programme |
| | GET | `/sessions/:id` | Récupère une session |
| | POST | `/sessions` | Crée une session |
| | PUT | `/sessions/:id` | Modifie une session |
| | DELETE | `/sessions/:id` | Supprime une session |
| **Categories** | GET | `/categories` | Liste toutes les catégories |
| | GET | `/categories/:id` | Récupère une catégorie |
| | POST | `/categories` | Crée une catégorie |
| | PUT | `/categories/:id` | Modifie une catégorie |
| | DELETE | `/categories/:id` | Supprime une catégorie |
| **Exercises** | GET | `/exercises` | Liste tous les exercices |
| | GET | `/exercises?category_id=X` | Filtre par catégorie |
| | GET | `/exercises/:id` | Récupère un exercice |
| | POST | `/exercises` | Crée un exercice |
| | PUT | `/exercises/:id` | Modifie un exercice |
| | DELETE | `/exercises/:id` | Supprime un exercice |
| **Session-Exercises** | GET | `/session-exercises` | Liste toutes les associations |
| | GET | `/session-exercises?session_id=X` | Filtre par session |
| | GET | `/session-exercises/:id` | Récupère une association |
| | POST | `/session-exercises` | Crée une association |
| | PUT | `/session-exercises/:id` | Modifie une association |
| | DELETE | `/session-exercises/:id` | Supprime une association |
| **Progress** | GET | `/progress` | Liste toutes les progressions |
| | GET | `/progress?user_id=X` | Filtre par utilisateur |
| | GET | `/progress/:id` | Récupère une progression |
| | POST | `/progress` | Crée une progression |
| | PUT | `/progress/:id` | Modifie une progression |
| | DELETE | `/progress/:id` | Supprime une progression |

---

## Users

### GET /users
Récupère tous les utilisateurs.

**Réponse (200)**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

### POST /users
Crée un nouvel utilisateur.

**Body requis**
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@example.com",
  "password": "password123"
}
```

**Champs optionnels**: `birthdate`, `gender` (male/female/other), `fitness_level` (beginner/intermediate/advanced)

---

## Programs

### GET /programs
Récupère tous les programmes d'entraînement.

**Réponse (200)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Programme Débutant",
      "description": "Programme pour débuter en musculation",
      "difficulty_level": "beginner",
      "duration_weeks": 8,
      "goal": "Prise de masse",
      "created_at": "2025-10-17T10:00:00.000Z"
    }
  ]
}
```

### POST /programs
Crée un nouveau programme.

**Body requis**
```json
{
  "name": "Programme Intermédiaire"
}
```

**Champs optionnels**: `description`, `difficulty_level` (beginner/intermediate/advanced), `duration_weeks`, `goal`

---

## Sessions

### GET /sessions
Récupère toutes les sessions.

**Query params**:
- `program_id` - Filtre par ID de programme

**Exemple**: `GET /sessions?program_id=1`

**Réponse (200)**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "program_id": 1,
      "session_number": 1,
      "name": "Session 1 - Pectoraux",
      "description": "Travail des pectoraux",
      "duration_minutes": 45,
      "created_at": "2025-10-17T10:00:00.000Z"
    }
  ]
}
```

### POST /sessions
Crée une nouvelle session.

**Body requis**
```json
{
  "program_id": 1,
  "session_number": 1,
  "name": "Session 1"
}
```

**Champs optionnels**: `description`, `duration_minutes`

---

## Categories

### GET /categories
Récupère toutes les catégories d'exercices.

**Réponse (200)**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "name": "Cardio",
      "description": "Exercices cardiovasculaires"
    },
    {
      "id": 2,
      "name": "Musculation",
      "description": "Exercices de renforcement musculaire"
    }
  ]
}
```

### POST /categories
Crée une nouvelle catégorie.

**Body requis**
```json
{
  "name": "Yoga"
}
```

**Champs optionnels**: `description`

---

## Exercises

### GET /exercises
Récupère tous les exercices.

**Query params**:
- `category_id` - Filtre par ID de catégorie

**Exemple**: `GET /exercises?category_id=1`

**Réponse (200)**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "Développé couché",
      "description": "Exercice pour les pectoraux",
      "category_id": 2,
      "difficulty": "intermediate",
      "video_url": "https://example.com/video.mp4",
      "image_url": "https://example.com/image.jpg",
      "instructions": "Allongez-vous sur un banc...",
      "created_at": "2025-10-17T10:00:00.000Z"
    }
  ]
}
```

### POST /exercises
Crée un nouvel exercice.

**Body requis**
```json
{
  "name": "Squat",
  "category_id": 2
}
```

**Champs optionnels**: `description`, `difficulty` (beginner/intermediate/advanced), `video_url`, `image_url`, `instructions`

---

## Session-Exercises

### GET /session-exercises
Récupère toutes les associations session-exercice.

**Query params**:
- `session_id` - Filtre par ID de session

**Exemple**: `GET /session-exercises?session_id=1`

**Réponse (200)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "session_id": 1,
      "exercise_id": 1,
      "exercise_name": "Développé couché",
      "exercise_description": "Exercice pour les pectoraux",
      "order_index": 1,
      "sets": 3,
      "reps": 12,
      "duration_seconds": null,
      "rest_seconds": 90,
      "notes": "Augmenter la charge progressivement"
    }
  ]
}
```

### POST /session-exercises
Crée une nouvelle association.

**Body requis**
```json
{
  "session_id": 1,
  "exercise_id": 1,
  "order_index": 1
}
```

**Champs optionnels**: `sets`, `reps`, `duration_seconds`, `rest_seconds`, `notes`

---

## Progress

### GET /progress
Récupère tous les enregistrements de progression.

**Query params**:
- `user_id` - Filtre par ID d'utilisateur

**Exemple**: `GET /progress?user_id=1`

**Réponse (200)**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "session_id": 1,
      "date": "2025-10-17",
      "duration_minutes": 45,
      "notes": "Bonne séance, bien récupéré",
      "rating": 4
    }
  ]
}
```

### POST /progress
Crée un nouvel enregistrement de progression.

**Body requis**
```json
{
  "user_id": 1,
  "session_id": 1,
  "date": "2025-10-17"
}
```

**Champs optionnels**: `duration_minutes`, `notes`, `rating` (1-5)

---

## Codes de statut HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Requête réussie (GET, PUT, DELETE) |
| 201 | Created | Ressource créée avec succès (POST) |
| 400 | Bad Request | Données invalides ou manquantes |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: doublon) |
| 500 | Internal Server Error | Erreur serveur |

---

## Format des réponses

**Succès**
```json
{
  "success": true,
  "message": "Message descriptif",
  "data": { /* ... */ },
  "count": 10
}
```

**Erreur**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (en dev seulement)"
}
```

---

**Version**: 1.0.0  
**Dernière mise à jour**: 17 octobre 2025

