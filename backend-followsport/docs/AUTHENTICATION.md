# 🔐 Documentation Authentification - Backend FollowSport

## 📋 Vue d'ensemble

Le système d'authentification utilise :
- **bcrypt** pour le hashage des mots de passe
- **JWT (JSON Web Token)** pour l'authentification sans état
- **Middleware de protection** pour les routes privées

---

## 🔑 Endpoints d'authentification

### Base URL: `http://localhost:9001/auth`

---

## 1. Inscription (Register)

### POST `/auth/register`

Crée un nouveau compte utilisateur avec un mot de passe hashé.

**Body (JSON)**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123",
  "first_name": "Jean",
  "last_name": "Dupont",
  "birthdate": "1990-05-15",
  "gender": "male",
  "fitness_level": "beginner"
}
```

**Champs obligatoires**
- `email` (string) - Email valide
- `password` (string) - Minimum 6 caractères
- `first_name` (string) - Prénom
- `last_name` (string) - Nom de famille

**Champs optionnels**
- `birthdate` (date) - Date de naissance (YYYY-MM-DD)
- `gender` (enum) - male, female, other
- `fitness_level` (enum) - beginner, intermediate, advanced

**Réponse réussie (201)**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "birthdate": "1990-05-15",
    "gender": "male",
    "fitness_level": "beginner"
  }
}
```

**Erreurs possibles**
- `400` - Champs obligatoires manquants ou invalides
- `409` - Email déjà utilisé
- `500` - Erreur serveur

---

## 2. Connexion (Login)

### POST `/auth/login`

Authentifie un utilisateur et retourne un token JWT.

**Body (JSON)**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Champs obligatoires**
- `email` (string) - Email du compte
- `password` (string) - Mot de passe

**Réponse réussie (200)**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "created_at": "2025-10-17T10:00:00.000Z"
  }
}
```

**Erreurs possibles**
- `400` - Champs manquants
- `401` - Email ou mot de passe incorrect
- `500` - Erreur serveur

---

## 3. Profil utilisateur (Me)

### GET `/auth/me`

Récupère les informations de l'utilisateur connecté. **Route protégée**.

**Headers requis**
```
Authorization: Bearer <token>
```

**Réponse réussie (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "birthdate": "1990-05-15",
    "gender": "male",
    "fitness_level": "beginner",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T10:00:00.000Z"
  }
}
```

**Erreurs possibles**
- `401` - Token manquant
- `403` - Token invalide ou expiré
- `404` - Utilisateur non trouvé
- `500` - Erreur serveur

---

## 🔒 Utilisation du middleware d'authentification

Pour protéger une route, ajoutez le middleware `authMiddleware` :

```javascript
const authMiddleware = require('../middleware/auth');

// Route protégée
router.get('/protected', authMiddleware, controller.method);
```

Le middleware :
1. Vérifie la présence du token dans le header `Authorization`
2. Valide le token JWT
3. Ajoute `req.user` avec les données décodées
4. Bloque l'accès si le token est invalide/expiré

---

## 📝 Format du token

**Header Authorization**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY5Nzc1MDQwMCwiZXhwIjoxNjk4MzU1MjAwfQ.xyz
```

**Contenu décodé du token**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1697750400,
  "exp": 1698355200
}
```

**Durée de validité** : 7 jours

---

## 🧪 Tests avec cURL

### Inscription
```bash
curl -X POST http://localhost:9001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:9001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Récupérer le profil (avec token)
```bash
curl -X GET http://localhost:9001/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Tests avec Postman

### 1. Inscription

**Méthode** : `POST`  
**URL** : `http://localhost:9001/auth/register`  
**Headers** :
```
Content-Type: application/json
```
**Body (raw JSON)** :
```json
{
  "email": "postman@example.com",
  "password": "secure123",
  "first_name": "Postman",
  "last_name": "Test",
  "gender": "other",
  "fitness_level": "intermediate"
}
```

### 2. Connexion

**Méthode** : `POST`  
**URL** : `http://localhost:9001/auth/login`  
**Headers** :
```
Content-Type: application/json
```
**Body (raw JSON)** :
```json
{
  "email": "postman@example.com",
  "password": "secure123"
}
```

**Sauvegardez le token** de la réponse pour les requêtes suivantes.

### 3. Profil utilisateur

**Méthode** : `GET`  
**URL** : `http://localhost:9001/auth/me`  
**Headers** :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Configuration

### Variables d'environnement (.env)

Ajoutez cette variable dans votre fichier `.env` :

```env
JWT_SECRET=votre_secret_jwt_tres_securise_ici
```

**Important** : Utilisez une chaîne aléatoire longue et sécurisée en production.

Exemple de génération :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔐 Sécurité

### Bonnes pratiques implémentées :
✅ Hashage des mots de passe avec bcrypt (10 rounds)  
✅ Token JWT avec expiration (7 jours)  
✅ Validation des entrées (email, longueur du mot de passe)  
✅ Messages d'erreur génériques pour éviter l'énumération  
✅ Mot de passe jamais retourné dans les réponses API  

### À améliorer en production :
- [ ] Rate limiting sur les endpoints d'auth
- [ ] Refresh tokens pour renouveler l'accès
- [ ] Vérification d'email
- [ ] Récupération de mot de passe
- [ ] Logs des tentatives de connexion
- [ ] Blacklist de tokens révoqués
- [ ] 2FA (authentification à deux facteurs)

---

## 📊 Exemple de flux complet

```mermaid
sequenceDiagram
    Client->>API: POST /auth/register
    API->>DB: Créer utilisateur (password hashé)
    DB-->>API: Utilisateur créé
    API-->>Client: Token JWT + user

    Client->>API: POST /auth/login
    API->>DB: Vérifier email
    DB-->>API: Utilisateur trouvé
    API->>API: bcrypt.compare(password)
    API-->>Client: Token JWT + user

    Client->>API: GET /auth/me (avec token)
    API->>Middleware: Vérifier token
    Middleware->>API: Token valide (req.user)
    API->>DB: getUserById
    DB-->>API: Données utilisateur
    API-->>Client: Profil utilisateur
```

---

## 🚨 Gestion des erreurs

| Code | Erreur | Signification |
|------|--------|---------------|
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou credentials invalides |
| 403 | Forbidden | Token invalide ou expiré |
| 404 | Not Found | Utilisateur non trouvé |
| 409 | Conflict | Email déjà utilisé |
| 500 | Internal Server Error | Erreur serveur |

---

## 🔄 Routes protégées (exemple)

Pour protéger d'autres routes de votre API :

```javascript
// routes/programs.js
const authMiddleware = require('../middleware/auth');

// Route publique
router.get('/', programsController.getAll);

// Route protégée
router.post('/', authMiddleware, programsController.create);
router.put('/:id', authMiddleware, programsController.update);
router.delete('/:id', authMiddleware, programsController.deleteById);
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : 17 octobre 2025

