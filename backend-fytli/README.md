# 🏋️ Backend FollowSport

Backend Node.js + Express + MySQL pour une application de suivi de programmes sportifs personnalisés.

## 📋 Prérequis

- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

## 🚀 Installation

1. **Cloner le projet** (si applicable)
   ```bash
   cd backend-followsport
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Dupliquer le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
   
   Puis modifier les valeurs dans `.env` :
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=followSport_app
   DB_PORT=3306
   PORT=9001
   NODE_ENV=development
   ```

4. **Vérifier que la base de données MySQL existe**
   
   Connectez-vous à MySQL et créez la base si nécessaire :
   ```sql
   CREATE DATABASE IF NOT EXISTS followSport_app;
   ```

## ▶️ Démarrage

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:9001`

## 📁 Structure du projet

```
backend-followsport/
├── index.js              # Point d'entrée du serveur
├── db.js                 # Configuration MySQL
├── .env                  # Variables d'environnement (non versionné)
├── .env.example          # Template des variables d'environnement
├── package.json          # Dépendances npm
├── routes/               # Définition des routes Express
│   └── users.js
├── controllers/          # Logique métier
│   └── usersController.js
├── models/               # Requêtes SQL
│   └── usersModel.js
└── docs/                 # Documentation
    └── endpoints.md      # Documentation API complète
```

## 🔌 API Endpoints

### Utilisateurs (Users)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Récupère tous les utilisateurs |
| GET | `/users/:id` | Récupère un utilisateur spécifique |
| POST | `/users` | Crée un nouvel utilisateur |
| PUT | `/users/:id` | Modifie un utilisateur |
| DELETE | `/users/:id` | Supprime un utilisateur |

📘 **Documentation complète** : Voir [docs/endpoints.md](docs/endpoints.md)

## 🧪 Tester l'API

### Avec cURL

**Créer un utilisateur**
```bash
curl -X POST http://localhost:9001/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "birthdate": "1990-05-15",
    "gender": "male",
    "fitness_level": "intermediate"
  }'
```

**Récupérer tous les utilisateurs**
```bash
curl http://localhost:9001/users
```

### Avec Postman

Importez la collection depuis `docs/endpoints.md` ou créez manuellement les requêtes.

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver MySQL avec support async/await
- **dotenv** - Gestion des variables d'environnement
- **cors** - Gestion des requêtes cross-origin
- **nodemon** - Auto-reload en développement

## 📦 Scripts disponibles

```bash
npm start       # Démarre le serveur en production
npm run dev     # Démarre le serveur en développement avec nodemon
npm test        # Lance les tests (à implémenter)
```

## 🔐 Sécurité

⚠️ **Points à améliorer pour la production** :
- Implémenter le hashage des mots de passe (bcrypt)
- Ajouter l'authentification JWT
- Ajouter des middlewares de validation (joi, express-validator)
- Implémenter un rate limiting
- Ajouter des logs structurés

## 🚧 Prochaines étapes

- [ ] Implémenter les ressources `programs`, `sessions`, `exercises`
- [ ] Ajouter l'authentification JWT
- [ ] Hasher les mots de passe avec bcrypt
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Mettre en place une documentation Swagger/OpenAPI
- [ ] Ajouter la pagination pour les listes

## 📄 Licence

ISC

## 👤 Auteur

FollowSport Team

