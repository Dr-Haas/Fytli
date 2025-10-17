# 📋 CONTEXT.md - Documentation Technique du Projet

> Ce fichier sert de référence centrale pour comprendre l'architecture, la structure de la base de données, et les décisions techniques du projet FollowSport.

---

## 🗄️ Structure de la base de données

### Base de données : `followSport_app`

---

### 📊 Table : `users`

**Description** : Stocke les informations des utilisateurs de l'application.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | Nom de famille |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email (login) |
| `password` | VARCHAR(255) | NOT NULL | Mot de passe (⚠️ à hasher avec bcrypt) |
| `birthdate` | DATE | NULL | Date de naissance |
| `gender` | ENUM | NULL | Sexe : 'male', 'female', 'other' |
| `fitness_level` | ENUM | NULL | Niveau : 'beginner', 'intermediate', 'advanced' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Date de mise à jour |

**Index** :
- PRIMARY KEY sur `id`
- UNIQUE sur `email`

**Statut** : ✅ Implémenté dans le backend (CRUD complet)

---

### 📊 Table : `programs` (à implémenter)

**Description** : Programmes d'entraînement disponibles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(255) | NOT NULL | Nom du programme |
| `description` | TEXT | NULL | Description détaillée |
| `difficulty_level` | ENUM | NULL | Difficulté : 'beginner', 'intermediate', 'advanced' |
| `duration_weeks` | INT | NULL | Durée en semaines |
| `goal` | VARCHAR(255) | NULL | Objectif (perte de poids, prise de masse, etc.) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Date de mise à jour |

**Statut** : ⏳ À implémenter

---

### 📊 Table : `user_programs` (à implémenter)

**Description** : Relation N:N entre utilisateurs et programmes (programmes assignés/suivis).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `user_id` | INT | FOREIGN KEY → users(id) | Référence utilisateur |
| `program_id` | INT | FOREIGN KEY → programs(id) | Référence programme |
| `start_date` | DATE | NOT NULL | Date de début |
| `end_date` | DATE | NULL | Date de fin (si terminé) |
| `status` | ENUM | DEFAULT 'active' | Statut : 'active', 'completed', 'paused' |
| `progress` | INT | DEFAULT 0 | Progression en % (0-100) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'assignation |

**Relations** :
- `user_id` → `users.id` (CASCADE on DELETE)
- `program_id` → `programs.id` (CASCADE on DELETE)

**Statut** : ⏳ À implémenter

---

### 📊 Table : `sessions` (à implémenter)

**Description** : Sessions d'entraînement liées à un programme.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `program_id` | INT | FOREIGN KEY → programs(id) | Référence programme |
| `session_number` | INT | NOT NULL | Numéro de la session (ordre) |
| `name` | VARCHAR(255) | NOT NULL | Nom de la session |
| `description` | TEXT | NULL | Description |
| `duration_minutes` | INT | NULL | Durée estimée en minutes |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Relations** :
- `program_id` → `programs.id` (CASCADE on DELETE)

**Statut** : ⏳ À implémenter

---

### 📊 Table : `exercises` (à implémenter)

**Description** : Bibliothèque d'exercices disponibles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(255) | NOT NULL | Nom de l'exercice |
| `description` | TEXT | NULL | Description détaillée |
| `category` | VARCHAR(100) | NULL | Catégorie (cardio, strength, flexibility, etc.) |
| `difficulty` | ENUM | NULL | Difficulté : 'beginner', 'intermediate', 'advanced' |
| `video_url` | VARCHAR(500) | NULL | URL de la vidéo de démonstration |
| `image_url` | VARCHAR(500) | NULL | URL de l'image |
| `instructions` | TEXT | NULL | Instructions détaillées |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date de création |

**Statut** : ⏳ À implémenter

---

### 📊 Table : `session_exercises` (à implémenter)

**Description** : Relation N:N entre sessions et exercices (exercices dans une session).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `session_id` | INT | FOREIGN KEY → sessions(id) | Référence session |
| `exercise_id` | INT | FOREIGN KEY → exercises(id) | Référence exercice |
| `order_index` | INT | NOT NULL | Ordre dans la session |
| `sets` | INT | NULL | Nombre de séries |
| `reps` | INT | NULL | Nombre de répétitions |
| `duration_seconds` | INT | NULL | Durée en secondes (pour cardio) |
| `rest_seconds` | INT | NULL | Temps de repos entre séries |
| `notes` | TEXT | NULL | Notes spécifiques |

**Relations** :
- `session_id` → `sessions.id` (CASCADE on DELETE)
- `exercise_id` → `exercises.id` (CASCADE on DELETE)

**Statut** : ⏳ À implémenter

---

### 📊 Table : `user_session_logs` (à implémenter - optionnel)

**Description** : Historique des sessions effectuées par les utilisateurs.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `user_id` | INT | FOREIGN KEY → users(id) | Référence utilisateur |
| `session_id` | INT | FOREIGN KEY → sessions(id) | Référence session |
| `completed_at` | TIMESTAMP | NOT NULL | Date de complétion |
| `duration_minutes` | INT | NULL | Durée réelle |
| `notes` | TEXT | NULL | Notes de l'utilisateur |
| `rating` | INT | NULL | Note de 1 à 5 |

**Relations** :
- `user_id` → `users.id` (CASCADE on DELETE)
- `session_id` → `sessions.id` (CASCADE on DELETE)

**Statut** : ⏳ À implémenter

---

## 🏗️ Architecture Backend

### Structure des dossiers

```
backend-followsport/
├── index.js                    # Point d'entrée + config Express
├── db.js                       # Configuration MySQL (pool de connexions)
├── .env                        # Variables d'environnement (ignoré par git)
├── .env.example                # Template des variables
├── package.json                # Dépendances npm
├── .gitignore                  # Fichiers ignorés par git
│
├── routes/                     # Définition des routes Express
│   ├── users.js                ✅ Implémenté
│   ├── programs.js             ⏳ À créer
│   ├── sessions.js             ⏳ À créer
│   ├── exercises.js            ⏳ À créer
│   └── userPrograms.js         ⏳ À créer
│
├── controllers/                # Logique métier + validation
│   ├── usersController.js      ✅ Implémenté
│   ├── programsController.js   ⏳ À créer
│   ├── sessionsController.js   ⏳ À créer
│   ├── exercisesController.js  ⏳ À créer
│   └── userProgramsController.js ⏳ À créer
│
├── models/                     # Requêtes SQL (CRUD)
│   ├── usersModel.js           ✅ Implémenté
│   ├── programsModel.js        ⏳ À créer
│   ├── sessionsModel.js        ⏳ À créer
│   ├── exercisesModel.js       ⏳ À créer
│   └── userProgramsModel.js    ⏳ À créer
│
└── docs/                       # Documentation
    ├── endpoints.md            ✅ Documentation API
    └── database-schema.sql     ⏳ À créer (export SQL des tables)
```

---

## 🔧 Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Node.js** | v16+ | Runtime JavaScript |
| **Express** | ^5.1.0 | Framework web |
| **MySQL** | v8+ | Base de données relationnelle |
| **mysql2** | ^3.15.2 | Driver MySQL avec async/await |
| **dotenv** | ^17.2.3 | Variables d'environnement |
| **cors** | ^2.8.5 | Gestion CORS |
| **nodemon** | ^3.1.10 | Auto-reload en dev |

---

## 📐 Conventions de code

### Naming Conventions

- **Fichiers** : camelCase (ex: `usersController.js`)
- **Variables/Fonctions** : camelCase (ex: `getUserById`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `DB_HOST`)
- **Classes** : PascalCase (si nécessaire)
- **Tables DB** : snake_case (ex: `user_programs`)

### Structure des réponses API

**Succès**
```javascript
{
  success: true,
  message: "Message descriptif",
  data: { /* ... */ },
  count: 10  // Pour les listes
}
```

**Erreur**
```javascript
{
  success: false,
  message: "Description de l'erreur",
  error: "Détails techniques (en dev seulement)"
}
```

### Codes HTTP utilisés

- `200` : OK (GET, PUT, DELETE réussis)
- `201` : Created (POST réussi)
- `400` : Bad Request (données invalides)
- `404` : Not Found (ressource non trouvée)
- `409` : Conflict (duplicate, ex: email existant)
- `500` : Internal Server Error (erreur serveur)

---

## 🔐 Sécurité (à améliorer)

### ⚠️ Points critiques à implémenter

1. **Hashing des mots de passe**
   - [ ] Installer `bcrypt`
   - [ ] Hasher les mots de passe avant insertion
   - [ ] Comparer les hash lors du login

2. **Authentification JWT**
   - [ ] Installer `jsonwebtoken`
   - [ ] Créer un endpoint `/auth/login`
   - [ ] Générer et vérifier les tokens JWT
   - [ ] Middleware d'authentification

3. **Validation des données**
   - [ ] Installer `express-validator` ou `joi`
   - [ ] Valider tous les inputs
   - [ ] Sanitiser les données

4. **Rate Limiting**
   - [ ] Installer `express-rate-limit`
   - [ ] Limiter les requêtes par IP

5. **HTTPS**
   - [ ] Configurer SSL/TLS en production

---

## 🔄 Relations entre tables

```
users (1) ──< user_programs >── (N) programs
                                      │
                                      │ (1)
                                      │
                                      ▼
                                  sessions (N)
                                      │
                                      │ (1)
                                      │
                                      ▼
                              session_exercises (N)
                                      │
                                      │ (N)
                                      │
                                      ▼
                                  exercises (1)

users (1) ──< user_session_logs >── (N) sessions
```

**Légende** :
- `(1)` : Relation un
- `(N)` : Relation plusieurs
- `──<` : Relation un-à-plusieurs
- `>──<` : Relation plusieurs-à-plusieurs (table de liaison)

---

## 🎯 Roadmap de développement

### Phase 1 : Base ✅ TERMINÉ
- [x] Configuration projet (Express, MySQL, dotenv)
- [x] Connexion base de données
- [x] CRUD Users complet
- [x] Documentation API

### Phase 2 : Programmes d'entraînement 🔄 EN COURS
- [ ] CRUD Programs
- [ ] Relation User-Programs
- [ ] Assignation de programmes aux utilisateurs

### Phase 3 : Sessions et exercices
- [ ] CRUD Sessions
- [ ] CRUD Exercises
- [ ] Relation Sessions-Exercises
- [ ] Détails des exercices dans une session

### Phase 4 : Suivi et historique
- [ ] Logs des sessions effectuées
- [ ] Statistiques utilisateur
- [ ] Progression dans les programmes

### Phase 5 : Sécurité
- [ ] Hashing mots de passe (bcrypt)
- [ ] Authentication JWT
- [ ] Middleware de protection des routes

### Phase 6 : Features avancées
- [ ] Upload d'images/vidéos (exercices)
- [ ] Recherche et filtres
- [ ] Pagination
- [ ] WebSocket pour notifications temps réel

---

## 📝 Notes techniques importantes

### Pool de connexions MySQL

Le fichier `db.js` utilise un pool de connexions pour optimiser les performances :
```javascript
connectionLimit: 10  // Max 10 connexions simultanées
```

### Variables d'environnement requises

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=followSport_app
DB_PORT=3306
PORT=9001
NODE_ENV=development
```

### Démarrage du serveur

```bash
# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

---

## 🐛 Debug et troubleshooting

### Erreur de connexion MySQL

```
❌ Erreur de connexion MySQL: Access denied
```

**Solution** : Vérifier les credentials dans `.env`

### Port déjà utilisé

```
Error: listen EADDRINUSE: address already in use :::9001
```

**Solution** : 
```bash
# Trouver le process
lsof -i :9001

# Tuer le process
kill -9 <PID>

# Ou changer le port dans .env
PORT=9002
```

---

## 📚 Ressources utiles

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Dernière mise à jour** : 17 octobre 2025  
**Maintenu par** : Équipe FollowSport

