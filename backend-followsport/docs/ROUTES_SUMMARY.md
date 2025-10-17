# 🗺️ Résumé des Routes API - FollowSport Backend

## Base URL: `http://localhost:9001`

---

## 📊 Toutes les routes disponibles

### ✅ Users
```
GET    /users              → Liste tous les utilisateurs
GET    /users/:id          → Récupère un utilisateur
POST   /users              → Crée un utilisateur
PUT    /users/:id          → Modifie un utilisateur
DELETE /users/:id          → Supprime un utilisateur
```

### ✅ Programs
```
GET    /programs           → Liste tous les programmes
GET    /programs/:id       → Récupère un programme
POST   /programs           → Crée un programme
PUT    /programs/:id       → Modifie un programme
DELETE /programs/:id       → Supprime un programme
```

### ✅ Sessions
```
GET    /sessions           → Liste toutes les sessions
GET    /sessions/:id       → Récupère une session
POST   /sessions           → Crée une session
PUT    /sessions/:id       → Modifie une session
DELETE /sessions/:id       → Supprime une session

Query params: ?program_id=X
```

### ✅ Categories
```
GET    /categories         → Liste toutes les catégories
GET    /categories/:id     → Récupère une catégorie
POST   /categories         → Crée une catégorie
PUT    /categories/:id     → Modifie une catégorie
DELETE /categories/:id     → Supprime une catégorie
```

### ✅ Exercises
```
GET    /exercises          → Liste tous les exercices
GET    /exercises/:id      → Récupère un exercice
POST   /exercises          → Crée un exercice
PUT    /exercises/:id      → Modifie un exercice
DELETE /exercises/:id      → Supprime un exercice

Query params: ?category_id=X
```

### ✅ Session-Exercises
```
GET    /session-exercises     → Liste toutes les associations
GET    /session-exercises/:id → Récupère une association
POST   /session-exercises     → Crée une association
PUT    /session-exercises/:id → Modifie une association
DELETE /session-exercises/:id → Supprime une association

Query params: ?session_id=X
```

### ✅ Progress
```
GET    /progress           → Liste toutes les progressions
GET    /progress/:id       → Récupère une progression
POST   /progress           → Crée une progression
PUT    /progress/:id       → Modifie une progression
DELETE /progress/:id       → Supprime une progression

Query params: ?user_id=X
```

---

## 📝 Convention des méthodes

| Fonction | Méthode | Description |
|----------|---------|-------------|
| `findAll` / `getAll` | GET | Récupère toutes les ressources |
| `findById` / `getById` | GET | Récupère une ressource par ID |
| `create` | POST | Crée une nouvelle ressource |
| `update` | PUT | Modifie une ressource existante |
| `deleteById` | DELETE | Supprime une ressource |

---

## 🧪 Tests rapides

### Vérifier que le serveur fonctionne
```bash
curl http://localhost:9001
```

### Créer une catégorie
```bash
curl -X POST http://localhost:9001/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Cardio", "description": "Exercices cardiovasculaires"}'
```

### Créer un programme
```bash
curl -X POST http://localhost:9001/programs \
  -H "Content-Type: application/json" \
  -d '{"name": "Programme Débutant", "difficulty_level": "beginner", "duration_weeks": 8}'
```

### Lister toutes les sessions d'un programme
```bash
curl http://localhost:9001/sessions?program_id=1
```

---

## 📊 Statistiques

- **7 ressources** implémentées
- **35 endpoints** disponibles
- **5 méthodes CRUD** par ressource
- **Architecture MVC** complète

---

**Tous les endpoints sont fonctionnels et prêts à l'emploi !** 🚀

