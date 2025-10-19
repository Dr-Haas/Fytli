# 📘 Documentation API - Backend Fytli

## 🌐 URL de base
```
http://localhost:9001
```

---

## 📋 Table des matières
- [Endpoints Généraux](#endpoints-généraux)
- [Endpoints Users](#endpoints-users)
- [Codes de statut HTTP](#codes-de-statut-http)
- [Exemples avec Postman](#exemples-avec-postman)

---

## Endpoints Généraux

### Vérifier le statut du serveur
**GET** `/`

Retourne l'état du serveur et les informations de version.

**Réponse réussie (200)**
```json
{
  "success": true,
  "message": "Backend Fytli API - Serveur fonctionnel",
  "version": "1.0.0",
  "timestamp": "2025-10-17T12:00:00.000Z"
}
```

---

## Endpoints Users

### 1. Récupérer tous les utilisateurs
**GET** `/users`

Retourne la liste de tous les utilisateurs enregistrés.

**Réponse réussie (200)**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "first_name": "Jean",
      "last_name": "Dupont",
      "email": "jean.dupont@example.com",
      "birthdate": "1990-05-15",
      "gender": "male",
      "fitness_level": "intermediate",
      "created_at": "2025-10-17T10:00:00.000Z",
      "updated_at": "2025-10-17T10:00:00.000Z"
    },
    {
      "id": 2,
      "first_name": "Marie",
      "last_name": "Martin",
      "email": "marie.martin@example.com",
      "birthdate": "1995-08-20",
      "gender": "female",
      "fitness_level": "beginner",
      "created_at": "2025-10-17T11:00:00.000Z",
      "updated_at": "2025-10-17T11:00:00.000Z"
    }
  ]
}
```

---

### 2. Récupérer un utilisateur spécifique
**GET** `/users/:id`

Retourne les détails d'un utilisateur spécifique.

**Paramètres URL**
- `id` (number) - L'identifiant de l'utilisateur

**Exemple de requête**
```
GET /users/1
```

**Réponse réussie (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "birthdate": "1990-05-15",
    "gender": "male",
    "fitness_level": "intermediate",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T10:00:00.000Z"
  }
}
```

**Réponse erreur (404)**
```json
{
  "success": false,
  "message": "Utilisateur avec l'ID 99 non trouvé"
}
```

---

### 3. Créer un nouvel utilisateur
**POST** `/users`

Crée un nouvel utilisateur dans la base de données.

**Corps de la requête (JSON)**
```json
{
  "first_name": "Paul",
  "last_name": "Bernard",
  "email": "paul.bernard@example.com",
  "password": "motdepasse123",
  "birthdate": "1988-03-12",
  "gender": "male",
  "fitness_level": "advanced"
}
```

**Champs obligatoires**
- `first_name` (string) - Prénom
- `last_name` (string) - Nom de famille
- `email` (string) - Email (format valide requis)
- `password` (string) - Mot de passe

**Champs optionnels**
- `birthdate` (date) - Date de naissance (format: YYYY-MM-DD)
- `gender` (enum) - Sexe : `male`, `female`, `other`
- `fitness_level` (enum) - Niveau de fitness : `beginner`, `intermediate`, `advanced`

**Réponse réussie (201)**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 3,
    "first_name": "Paul",
    "last_name": "Bernard",
    "email": "paul.bernard@example.com",
    "birthdate": "1988-03-12",
    "gender": "male",
    "fitness_level": "advanced"
  }
}
```

**Réponse erreur (400) - Champs manquants**
```json
{
  "success": false,
  "message": "Les champs first_name, last_name, email et password sont obligatoires"
}
```

**Réponse erreur (409) - Email déjà existant**
```json
{
  "success": false,
  "message": "Un utilisateur avec cet email existe déjà"
}
```

---

### 4. Modifier un utilisateur
**PUT** `/users/:id`

Met à jour les informations d'un utilisateur existant.

**Paramètres URL**
- `id` (number) - L'identifiant de l'utilisateur

**Corps de la requête (JSON)** - Tous les champs sont optionnels
```json
{
  "first_name": "Jean-Paul",
  "fitness_level": "advanced"
}
```

**Exemple de requête**
```
PUT /users/1
```

**Réponse réussie (200)**
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": 1,
    "first_name": "Jean-Paul",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "birthdate": "1990-05-15",
    "gender": "male",
    "fitness_level": "advanced",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T14:30:00.000Z"
  }
}
```

**Réponse erreur (404)**
```json
{
  "success": false,
  "message": "Utilisateur avec l'ID 99 non trouvé"
}
```

---

### 5. Supprimer un utilisateur
**DELETE** `/users/:id`

Supprime un utilisateur de la base de données.

**Paramètres URL**
- `id` (number) - L'identifiant de l'utilisateur

**Exemple de requête**
```
DELETE /users/1
```

**Réponse réussie (200)**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

**Réponse erreur (404)**
```json
{
  "success": false,
  "message": "Utilisateur avec l'ID 99 non trouvé"
}
```

---

## Codes de statut HTTP

| Code | Signification | Usage |
|------|---------------|-------|
| 200 | OK | Requête réussie (GET, PUT, DELETE) |
| 201 | Created | Ressource créée avec succès (POST) |
| 400 | Bad Request | Données invalides ou manquantes |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: email déjà existant) |
| 500 | Internal Server Error | Erreur serveur |

---

## Exemples avec Postman

### Configuration Postman pour POST /users

1. **Méthode**: `POST`
2. **URL**: `http://localhost:9001/users`
3. **Headers**:
   ```
   Content-Type: application/json
   ```
4. **Body** (raw JSON):
   ```json
   {
     "first_name": "Sophie",
     "last_name": "Laurent",
     "email": "sophie.laurent@example.com",
     "password": "SecurePass456!",
     "birthdate": "1992-07-22",
     "gender": "female",
     "fitness_level": "intermediate"
   }
   ```

### Configuration Postman pour PUT /users/:id

1. **Méthode**: `PUT`
2. **URL**: `http://localhost:9001/users/1`
3. **Headers**:
   ```
   Content-Type: application/json
   ```
4. **Body** (raw JSON):
   ```json
   {
     "fitness_level": "advanced",
     "email": "nouveau.email@example.com"
   }
   ```

### Configuration Postman pour GET /users

1. **Méthode**: `GET`
2. **URL**: `http://localhost:9001/users`
3. **Headers**: Aucun header nécessaire

---

## Structure des réponses

Toutes les réponses suivent un format cohérent :

**Succès**
```json
{
  "success": true,
  "message": "Message descriptif",
  "data": { /* ... */ }
}
```

**Erreur**
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (en mode développement)"
}
```

---

## 🔜 Prochaines ressources à implémenter

- `/programs` - Gestion des programmes d'entraînement
- `/sessions` - Gestion des sessions d'entraînement
- `/exercises` - Gestion des exercices
- `/user-programs` - Association utilisateurs-programmes
- `/session-exercises` - Association sessions-exercices

---

**Version**: 1.0.0  
**Dernière mise à jour**: 17 octobre 2025

