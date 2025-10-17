# 🚀 Améliorations du Backend - Documentation Complète

Toutes les améliorations professionnelles ajoutées au backend FollowSport.

---

## 📦 Nouvelles dépendances installées

| Package | Version | Usage |
|---------|---------|-------|
| `express-validator` | ^7.0.1 | Validation des données entrantes |
| `morgan` | ^1.10.0 | Logger HTTP des requêtes |
| `winston` | ^3.11.0 | Logger avancé avec rotation |
| `winston-daily-rotate-file` | ^4.7.1 | Rotation quotidienne des logs |
| `multer` | ^1.4.5-lts.1 | Upload de fichiers |
| `nodemailer` | ^6.9.7 | Envoi d'emails |

---

## 1️⃣ Validation des données (express-validator)

### 📁 Fichier créé : `middleware/validation.js`

Middleware complet de validation pour toutes les ressources.

### ✨ Fonctionnalités

✅ Validation des champs obligatoires  
✅ Validation des formats (email, URL, dates)  
✅ Validation des ENUM (gender, difficulty, rating)  
✅ Validation des longueurs de chaînes  
✅ Validation des valeurs numériques  
✅ Messages d'erreur clairs et structurés  

### 📝 Utilisation

```javascript
// Dans routes/auth.js
const { validateRegister, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
```

### 🧪 Exemple de réponse d'erreur

```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Le mot de passe doit contenir au moins 6 caractères",
      "value": "123"
    }
  ]
}
```

### 📋 Validations disponibles

- `validateRegister` - Inscription utilisateur
- `validateLogin` - Connexion
- `validateUserId` - Validation ID utilisateur
- `validateCreateProgram` - Création programme
- `validateCreateSession` - Création session
- `validateCreateCategory` - Création catégorie
- `validateCreateExercise` - Création exercice
- `validateCreateProgress` - Création progression
- `validatePagination` - Validation pagination
- `validateId` - Validation ID générique

---

## 2️⃣ Système de logs (Morgan + Winston)

### 📁 Fichiers créés

- `config/logger.js` - Configuration Winston
- Logs stockés dans `logs/` (créé automatiquement)

### ✨ Fonctionnalités

✅ **Morgan** - Logs HTTP en temps réel  
✅ **Winston** - Logs structurés avec niveaux  
✅ **Rotation quotidienne** - Nouveaux fichiers chaque jour  
✅ **Conservation** - 14 jours de logs  
✅ **Fichiers séparés** - `error-YYYY-MM-DD.log` et `combined-YYYY-MM-DD.log`  
✅ **Console colorée** en développement  

### 📝 Utilisation

```javascript
const { logger, logError } = require('./config/logger');

// Log simple
logger.info('Message d\'info');
logger.warn('Message d\'avertissement');
logger.error('Message d\'erreur');

// Log d'erreur avec contexte
logError(new Error('Erreur détaillée'), 'Contexte supplémentaire');
```

### 📂 Structure des logs

```
logs/
├── error-2025-10-17.log       # Erreurs uniquement
├── error-2025-10-18.log
├── combined-2025-10-17.log    # Tous les logs
└── combined-2025-10-18.log
```

### 📋 Format des logs

```
2025-10-17 14:30:45 [INFO]: GET /programs - IP: ::1 - User: 1
2025-10-17 14:30:50 [ERROR]: Database connection failed
Error: Connection timeout
    at Connection.connect (/path/to/file.js:10:15)
```

---

## 3️⃣ Pagination

### 📁 Fichier créé : `utils/pagination.js`

Utilitaires pour paginer les résultats de requêtes.

### ✨ Fonctionnalités

✅ Calcul automatique de `page`, `limit`, `offset`  
✅ Format de réponse standardisé  
✅ Métadonnées complètes (total, pages, next, prev)  
✅ Helpers SQL pour LIMIT/OFFSET  

### 📝 Utilisation dans un controller

```javascript
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const { pool } = require('../db');

const getAllPaginated = async (req, res) => {
  const { page, limit, offset } = getPaginationParams(req.query);
  
  // Compter le total
  const [countResult] = await pool.query('SELECT COUNT(*) as total FROM programs');
  const total = countResult[0].total;
  
  // Récupérer les données paginées
  const [programs] = await pool.query(
    'SELECT * FROM programs LIMIT ? OFFSET ?',
    [limit, offset]
  );
  
  // Formater la réponse
  const response = formatPaginatedResponse(programs, total, page, limit);
  res.json(response);
};
```

### 🔗 Requête avec pagination

```bash
GET /programs?page=2&limit=20
```

### 📋 Réponse paginée

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 95,
    "itemsPerPage": 20,
    "itemsOnPage": 20,
    "hasNextPage": true,
    "hasPrevPage": true,
    "nextPage": 3,
    "prevPage": 1
  }
}
```

---

## 4️⃣ Upload de fichiers (Multer)

### 📁 Fichiers créés

- `config/multer.js` - Configuration Multer
- `routes/uploads.js` - Routes d'upload
- Dossiers : `uploads/images/`, `uploads/videos/`, `uploads/documents/`

### ✨ Fonctionnalités

✅ **Images** - jpg, png, gif, webp (max 5MB)  
✅ **Vidéos** - mp4, avi, mov, mkv, webm (max 100MB)  
✅ **Documents** - pdf, doc, docx, txt, md (max 10MB)  
✅ **Upload multiple** - Jusqu'à 10 fichiers  
✅ **Noms uniques** - Timestamp + random  
✅ **Validation** - Type MIME et extensions  
✅ **URLs générées** - Accès direct aux fichiers  

### 📝 Endpoints disponibles

```
POST /uploads/image          - Upload une image
POST /uploads/video          - Upload une vidéo
POST /uploads/document       - Upload un document
POST /uploads/images         - Upload plusieurs images (max 10)
```

### 🧪 Exemple avec cURL

```bash
# Upload d'une image
curl -X POST http://localhost:9001/uploads/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### 📋 Réponse d'upload

```json
{
  "success": true,
  "message": "Image uploadée avec succès",
  "data": {
    "filename": "image-1697750400000-123456789.jpg",
    "originalName": "photo.jpg",
    "size": 245678,
    "url": "http://localhost:9001/uploads/images/image-1697750400000-123456789.jpg"
  }
}
```

### 🔒 Protection

Toutes les routes d'upload sont **protégées par JWT** (authMiddleware).

---

## 5️⃣ Envoi d'emails (Nodemailer)

### 📁 Fichier créé : `config/email.js`

Templates d'emails prêts à l'emploi.

### ✨ Fonctionnalités

✅ **Email de bienvenue** - Après inscription  
✅ **Reset password** - Réinitialisation mot de passe  
✅ **Notifications** - Progression, achievements  
✅ **Templates HTML** - Design professionnel  
✅ **Mode test** - Ethereal en développement  

### 📝 Utilisation

```javascript
const { sendWelcomeEmail, sendPasswordResetEmail } = require('./config/email');

// Email de bienvenue
await sendWelcomeEmail('user@example.com', 'Jean');

// Email de reset password
await sendPasswordResetEmail('user@example.com', 'RESET_TOKEN_123');

// Notification de progression
await sendProgressNotification('user@example.com', 'Marie', [
  '10 sessions complétées',
  'Objectif hebdomadaire atteint'
]);
```

### ⚙️ Configuration .env

```env
# Configuration email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@followsport.com
FRONTEND_URL=http://localhost:3000
```

### 📧 Templates disponibles

#### 1. Email de bienvenue
```javascript
sendWelcomeEmail(email, userName)
```
- Envoyé après inscription
- Présente les fonctionnalités
- Design professionnel

#### 2. Reset password
```javascript
sendPasswordResetEmail(email, resetToken)
```
- Lien de réinitialisation
- Valable 1 heure
- Bouton CTA

#### 3. Notification progression
```javascript
sendProgressNotification(email, userName, achievements)
```
- Liste des achievements
- Encouragements
- Statistiques

---

## 📊 Résumé des améliorations

| Amélioration | Fichiers créés | Protection JWT | Status |
|--------------|----------------|----------------|--------|
| **Validation** | 1 middleware | Non | ✅ |
| **Logs** | 1 config | Non | ✅ |
| **Pagination** | 1 utility | Non | ✅ |
| **Uploads** | 2 fichiers + routes | Oui | ✅ |
| **Emails** | 1 config | Non | ✅ |

---

## 🔧 Configuration requise

### 1. Installer les dépendances

```bash
npm install
```

### 2. Mettre à jour le .env

```env
# Variables existantes...

# Base URL pour les fichiers uploadés
BASE_URL=http://localhost:9001

# Configuration email (optionnel en dev)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@followsport.com
FRONTEND_URL=http://localhost:3000
```

### 3. Redémarrer le serveur

```bash
npm run dev
```

---

## 📝 Exemples d'intégration

### Ajouter la validation à une route

```javascript
// routes/programs.js
const { validateCreateProgram, validateProgramId } = require('../middleware/validation');

router.post('/', validateCreateProgram, programsController.create);
router.put('/:id', validateProgramId, validateCreateProgram, programsController.update);
```

### Ajouter la pagination

```javascript
// routes/programs.js
const { validatePagination } = require('../middleware/validation');

router.get('/', validatePagination, programsController.getAllPaginated);
```

### Utiliser les logs

```javascript
// Dans n'importe quel fichier
const { logger, logError } = require('./config/logger');

try {
  // Code...
  logger.info('Opération réussie');
} catch (error) {
  logError(error, 'Contexte: création programme');
  throw error;
}
```

---

## 🎯 Prochaines étapes

### Court terme
- [ ] Ajouter la validation sur toutes les routes
- [ ] Implémenter la pagination sur tous les GET
- [ ] Tester les uploads avec Postman

### Moyen terme
- [ ] Configurer Nodemailer en production
- [ ] Ajouter des templates d'emails supplémentaires
- [ ] Mettre en place un système de resize d'images

### Long terme
- [ ] Dashboard de visualisation des logs
- [ ] Compression des vidéos après upload
- [ ] Système de queue pour les emails (Bull, BeeQueue)

---

**Version** : 1.0.0  
**Dernière mise à jour** : 17 octobre 2025

