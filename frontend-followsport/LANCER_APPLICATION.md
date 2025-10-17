# 🚀 Guide de Lancement - Application Fytli

## ⚡ Démarrage rapide

### 1️⃣ Backend (Port 9001)

```bash
cd /Users/garyhaas/Desktop/followSport_app/backend-followsport
node index.js
```

✅ Le backend doit tourner sur **http://localhost:9001**

---

### 2️⃣ Frontend (Port 5173)

```bash
cd /Users/garyhaas/Desktop/followSport_app/frontend-followsport
npm run dev
```

✅ Le frontend sera accessible sur **http://localhost:5173**

---

## 🌐 Accès à l'application

Ouvrez votre navigateur et allez sur :
**http://localhost:5173**

---

## 🔐 Premier test

### Créer un compte
1. Sur la page de login, cliquez sur **"S'inscrire"**
2. Remplissez le formulaire :
   - **Prénom** : Jean
   - **Nom** : Dupont
   - **Email** : jean.dupont@example.com
   - **Mot de passe** : VotreMotDePasse123
3. Cliquez sur **"S'inscrire"**
4. Vous serez automatiquement redirigé vers le Dashboard ✅

### Se connecter
Si vous avez déjà un compte :
1. Entrez votre **email** et **mot de passe**
2. Cliquez sur **"Se connecter"**
3. Accès au Dashboard ✅

---

## 📱 Pages disponibles

Une fois connecté, vous pouvez naviguer vers :

| Page | URL | Description |
|------|-----|-------------|
| 🏠 **Dashboard** | `/dashboard` | Vue d'ensemble, stats, programmes récents |
| 💪 **Programmes** | `/programs` | Liste complète avec recherche |
| 👤 **Profil** | `/profile` | Vos informations personnelles |

---

## 🔧 Configuration actuelle

### Backend
- **Port** : 9001
- **URL** : http://localhost:9001

### Frontend
- **Port** : 5173
- **URL** : http://localhost:5173
- **API URL** : http://localhost:9001 (configuré dans `.env`)

---

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

**Vérifiez que :**
1. ✅ Le backend tourne sur le port 9001
2. ✅ Le fichier `.env` contient : `VITE_API_URL=http://localhost:9001`
3. ✅ Vous avez redémarré le frontend après avoir modifié le `.env`

**Test rapide :**
```bash
# Dans un nouveau terminal
curl http://localhost:9001/programs
```
Si ça renvoie des données JSON, le backend fonctionne ✅

---

### Erreur 401 (Unauthorized)

Cela signifie que le token JWT est invalide ou expiré :
1. Cliquez sur **Déconnexion**
2. Reconnectez-vous
3. Le token sera régénéré ✅

---

### Les programmes ne s'affichent pas

**Vérifiez que :**
1. ✅ Des programmes existent dans votre base de données
2. ✅ Le backend répond correctement à `GET /programs`
3. ✅ Ouvrez la console du navigateur (F12) pour voir les erreurs

**Créer un programme de test :**
Utilisez Postman ou curl pour créer un programme :
```bash
curl -X POST http://localhost:9001/programs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "title": "Programme Full Body",
    "description": "Programme d'entraînement complet",
    "level": "beginner",
    "duration_weeks": 8
  }'
```

---

### Erreur de CORS

Si vous voyez des erreurs CORS dans la console :
- Vérifiez que le backend autorise les requêtes depuis `http://localhost:5173`
- Normalement déjà configuré dans le backend avec `cors()`

---

## 📊 Structure des données attendues

### User (retourné par `/auth/login` ou `/auth/register`)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstname": "Jean",
    "lastname": "Dupont",
    "created_at": "2025-10-17T10:00:00.000Z"
  }
}
```

### Programs (retourné par `/programs`)
```json
[
  {
    "id": 1,
    "title": "Programme Full Body",
    "description": "Programme complet pour débutants",
    "level": "beginner",
    "duration_weeks": 8,
    "user_id": 1,
    "created_at": "2025-10-17T10:00:00.000Z"
  }
]
```

---

## ✅ Checklist de démarrage

- [ ] Backend lancé sur port 9001
- [ ] Frontend lancé sur port 5173
- [ ] Fichier `.env` configuré avec `VITE_API_URL=http://localhost:9001`
- [ ] Base de données connectée au backend
- [ ] Compte utilisateur créé ou existant
- [ ] Au moins un programme dans la DB (pour tester)

---

## 🎯 Test complet

1. ✅ S'inscrire/Se connecter
2. ✅ Voir le Dashboard avec votre nom
3. ✅ Aller sur la page Programmes
4. ✅ Rechercher un programme
5. ✅ Aller sur votre Profil
6. ✅ Se déconnecter
7. ✅ Se reconnecter

Si tout fonctionne : 🎉 **Votre application est opérationnelle !**

---

## 📞 Support

En cas de problème :
1. Consultez `DATA.md` pour la structure de la DB
2. Consultez `CONFIG_ENV.md` pour la configuration
3. Consultez `CORRECTIONS_APPLIQUEES.md` pour les changements récents
4. Vérifiez les logs du backend et la console du navigateur (F12)

---

**Bonne utilisation ! 💪**

