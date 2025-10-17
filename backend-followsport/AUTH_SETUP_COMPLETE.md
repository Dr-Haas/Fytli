# 🔐 Système d'Authentification Intégré - Récapitulatif

## ✅ Installation terminée avec succès !

Le système d'authentification JWT + bcrypt a été intégré à votre backend FollowSport.

---

## 📦 Dépendances ajoutées

✅ `bcrypt` (v5.1.1) - Hashage des mots de passe  
✅ `jsonwebtoken` (v9.0.2) - Génération et vérification des tokens JWT

**Action requise** : Installez les nouvelles dépendances
```bash
npm install
```

---

## 🗂️ Fichiers créés

### Controllers
```
✅ controllers/authController.js
   - register() : Inscription avec hashage du mot de passe
   - login() : Connexion avec validation bcrypt
   - getProfile() : Récupération du profil de l'utilisateur connecté
```

### Middleware
```
✅ middleware/auth.js
   - Vérification du token JWT
   - Protection des routes privées
   - Ajout de req.user pour les routes protégées
```

### Routes
```
✅ routes/auth.js
   - POST /auth/register : Inscription
   - POST /auth/login : Connexion
   - GET /auth/me : Profil utilisateur (protégé)
```

### Documentation
```
✅ docs/AUTHENTICATION.md
   - Documentation complète de l'authentification
   - Exemples cURL et Postman
   - Guide d'utilisation du middleware
```

### Configuration
```
✅ .env.example (à copier en .env)
   - Variable JWT_SECRET ajoutée
```

---

## 🔑 Nouveaux endpoints disponibles

### Base URL: `http://localhost:9001/auth`

| Méthode | Endpoint | Description | Protection |
|---------|----------|-------------|------------|
| POST | `/auth/register` | Inscription d'un utilisateur | Public |
| POST | `/auth/login` | Connexion d'un utilisateur | Public |
| GET | `/auth/me` | Profil de l'utilisateur connecté | 🔒 Privé |

---

## ⚙️ Configuration requise

### 1. Installer les dépendances
```bash
cd backend-followsport
npm install
```

### 2. Configurer le JWT_SECRET dans .env

**Option 1** : Créer le fichier `.env` manuellement
```env
# Ajoutez cette ligne dans votre fichier .env
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
```

**Option 2** : Générer un secret sécurisé
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiez le résultat dans votre `.env` :
```env
JWT_SECRET=a7f3d9e2b8c4...
```

### 3. Redémarrer le serveur
```bash
npm run dev
```

---

## 🧪 Tester l'authentification

### 1. Inscription d'un utilisateur

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

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

### 2. Connexion

```bash
curl -X POST http://localhost:9001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Sauvegardez le token** de la réponse !

### 3. Accéder au profil (avec token)

```bash
curl -X GET http://localhost:9001/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 🔒 Protéger d'autres routes

Pour protéger n'importe quelle route de votre API :

```javascript
// Exemple dans routes/programs.js
const authMiddleware = require('../middleware/auth');

// Route publique
router.get('/', programsController.getAll);

// Routes protégées
router.post('/', authMiddleware, programsController.create);
router.put('/:id', authMiddleware, programsController.update);
router.delete('/:id', authMiddleware, programsController.deleteById);
```

---

## ✨ Fonctionnalités implémentées

### Sécurité
✅ **Hashage bcrypt** - Mots de passe hashés avec 10 rounds  
✅ **Token JWT** - Expiration après 7 jours  
✅ **Validation des entrées** - Email, longueur du mot de passe  
✅ **Messages sécurisés** - Pas d'énumération d'utilisateurs  
✅ **Mot de passe jamais exposé** - Supprimé des réponses API  

### Validation
✅ Champs obligatoires (email, password, first_name, last_name)  
✅ Format email valide  
✅ Minimum 6 caractères pour le mot de passe  
✅ Validation des ENUM (gender, fitness_level)  
✅ Vérification d'unicité de l'email  

### Middleware
✅ Vérification automatique du token JWT  
✅ Gestion des erreurs (token expiré, invalide, manquant)  
✅ Ajout de `req.user` pour les routes protégées  
✅ Messages d'erreur clairs  

---

## 📊 Architecture du système

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  POST /auth/register                │
│  - Validation des données           │
│  - Vérification email unique        │
│  - Hashage du mot de passe (bcrypt) │
│  - Création de l'utilisateur        │
│  - Génération du token JWT          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  POST /auth/login                   │
│  - Recherche utilisateur par email  │
│  - Comparaison mot de passe (bcrypt)│
│  - Génération du token JWT          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  GET /auth/me                       │
│  - Middleware vérifie le token      │
│  - Décode le token (req.user)       │
│  - Retourne les données utilisateur │
└─────────────────────────────────────┘
```

---

## 🎯 Exemple de flux complet

### 1. Inscription
```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "secure123",
  "first_name": "John",
  "last_name": "Doe"
}

→ Token JWT retourné
```

### 2. Utiliser le token pour accéder aux routes protégées
```bash
GET /auth/me
Headers: Authorization: Bearer eyJhbG...

→ Profil utilisateur retourné
```

### 3. Créer une ressource protégée
```bash
POST /programs
Headers: Authorization: Bearer eyJhbG...
Body: { "name": "Mon programme" }

→ Programme créé (si route protégée)
```

---

## 📚 Documentation complète

Consultez le fichier `docs/AUTHENTICATION.md` pour :
- Détails complets de chaque endpoint
- Exemples de requêtes cURL et Postman
- Guide de configuration
- Bonnes pratiques de sécurité
- Gestion des erreurs

---

## 🔧 Fichiers mis à jour

### `package.json`
```json
"dependencies": {
  "bcrypt": "^5.1.1",           // ✅ NOUVEAU
  "jsonwebtoken": "^9.0.2",     // ✅ NOUVEAU
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "mysql2": "^3.15.2"
}
```

### `index.js`
```javascript
// ✅ NOUVEAU
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
```

---

## 🚀 Prochaines étapes

### Court terme :
1. ✅ Installer les dépendances (`npm install`)
2. ✅ Configurer `JWT_SECRET` dans `.env`
3. ✅ Tester les endpoints d'authentification

### Moyen terme :
- [ ] Protéger les routes sensibles avec `authMiddleware`
- [ ] Implémenter la récupération de mot de passe
- [ ] Ajouter un système de refresh tokens

### Long terme :
- [ ] Rate limiting sur les endpoints d'auth
- [ ] Vérification d'email
- [ ] Authentification à deux facteurs (2FA)
- [ ] Logs des tentatives de connexion

---

## 🎉 Résultat

**Votre backend dispose maintenant d'un système d'authentification complet et sécurisé !**

- ✅ Inscription avec mot de passe hashé
- ✅ Connexion avec token JWT
- ✅ Protection des routes avec middleware
- ✅ Gestion complète des erreurs
- ✅ Documentation détaillée

---

## 📞 Utilisation dans Postman

### 1. Variables d'environnement
Créez ces variables dans Postman :
- `base_url` = `http://localhost:9001`
- `token` = (sera rempli automatiquement)

### 2. Script post-request pour login/register
Ajoutez ce script dans l'onglet "Tests" de vos requêtes login/register :
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### 3. Utiliser le token
Dans les requêtes protégées, ajoutez le header :
```
Authorization: Bearer {{token}}
```

---

**🔐 Système d'authentification opérationnel !**

*Généré le 17 octobre 2025*

