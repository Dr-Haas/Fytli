# 📮 Exemples de requêtes Postman

Ce fichier contient des exemples de requêtes à importer dans Postman pour tester l'API.

---

## 🔧 Configuration globale

**Base URL** : `http://localhost:9001`

---

## 📬 Collection complète pour Postman

### 1️⃣ Créer un utilisateur (POST)

**URL** : `POST http://localhost:9001/users`

**Headers** :
```
Content-Type: application/json
```

**Body (raw JSON)** :
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

**Réponse attendue (201)** :
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 1,
    "first_name": "Sophie",
    "last_name": "Laurent",
    "email": "sophie.laurent@example.com",
    "birthdate": "1992-07-22",
    "gender": "female",
    "fitness_level": "intermediate"
  }
}
```

---

### 2️⃣ Récupérer tous les utilisateurs (GET)

**URL** : `GET http://localhost:9001/users`

**Headers** : Aucun

**Réponse attendue (200)** :
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "first_name": "Sophie",
      "last_name": "Laurent",
      "email": "sophie.laurent@example.com",
      "birthdate": "1992-07-22",
      "gender": "female",
      "fitness_level": "intermediate",
      "created_at": "2025-10-17T10:00:00.000Z",
      "updated_at": "2025-10-17T10:00:00.000Z"
    }
  ]
}
```

---

### 3️⃣ Récupérer un utilisateur spécifique (GET)

**URL** : `GET http://localhost:9001/users/1`

**Headers** : Aucun

**Réponse attendue (200)** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "Sophie",
    "last_name": "Laurent",
    "email": "sophie.laurent@example.com",
    "birthdate": "1992-07-22",
    "gender": "female",
    "fitness_level": "intermediate",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T10:00:00.000Z"
  }
}
```

---

### 4️⃣ Modifier un utilisateur (PUT)

**URL** : `PUT http://localhost:9001/users/1`

**Headers** :
```
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "fitness_level": "advanced",
  "email": "sophie.new@example.com"
}
```

**Réponse attendue (200)** :
```json
{
  "success": true,
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": 1,
    "first_name": "Sophie",
    "last_name": "Laurent",
    "email": "sophie.new@example.com",
    "birthdate": "1992-07-22",
    "gender": "female",
    "fitness_level": "advanced",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
}
```

---

### 5️⃣ Supprimer un utilisateur (DELETE)

**URL** : `DELETE http://localhost:9001/users/1`

**Headers** : Aucun

**Réponse attendue (200)** :
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

---

## 🧪 Scénarios de test

### Scénario 1 : Créer plusieurs utilisateurs

1. Créer utilisateur 1 :
```json
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean.dupont@example.com",
  "password": "password123",
  "gender": "male",
  "fitness_level": "beginner"
}
```

2. Créer utilisateur 2 :
```json
{
  "first_name": "Marie",
  "last_name": "Martin",
  "email": "marie.martin@example.com",
  "password": "password456",
  "gender": "female",
  "fitness_level": "advanced"
}
```

3. Récupérer tous les utilisateurs : `GET /users`

---

### Scénario 2 : Tester les erreurs

**Test 1 : Email invalide**
```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "invalid-email",
  "password": "password"
}
```
→ Attendu : `400 Bad Request`

**Test 2 : Champs manquants**
```json
{
  "first_name": "Test"
}
```
→ Attendu : `400 Bad Request`

**Test 3 : Email déjà existant**

1. Créer un utilisateur avec `test@example.com`
2. Tenter de créer un autre utilisateur avec le même email
→ Attendu : `409 Conflict`

**Test 4 : Utilisateur non trouvé**
```
GET /users/9999
```
→ Attendu : `404 Not Found`

---

## 📥 Import dans Postman

### Option 1 : Import manuel
Copiez chaque requête ci-dessus et créez-les manuellement dans Postman.

### Option 2 : Collection JSON
Créez une nouvelle collection dans Postman et ajoutez ces requêtes :

1. Cliquez sur "New Collection"
2. Nommez-la "FollowSport API"
3. Ajoutez les requêtes une par une

---

## 🎯 Variables d'environnement Postman (optionnel)

Créez un environnement avec ces variables :

| Variable | Valeur initiale | Valeur actuelle |
|----------|-----------------|-----------------|
| `base_url` | `http://localhost:9001` | `http://localhost:9001` |
| `user_id` | `1` | (mis à jour dynamiquement) |

Ensuite, utilisez `{{base_url}}` et `{{user_id}}` dans vos requêtes.

---

**Dernière mise à jour** : 17 octobre 2025

