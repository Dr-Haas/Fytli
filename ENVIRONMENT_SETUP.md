# 🌍 Configuration des Environnements - Fytli

Ce document explique comment basculer entre l'environnement de **PRODUCTION** (Render) et **LOCAL** pour le développement.

---

## 📌 Configuration Actuelle : **PRODUCTION** ✅

Par défaut, le projet est configuré pour fonctionner avec l'API de production sur Render.

### Configuration active :
- **Frontend** : `http://localhost:5173` (local)
- **Backend API** : `https://fytli-backend.onrender.com` ⚡ **PRODUCTION**
- **Base de données** : Base de données OVH en production

---

## 🔄 Basculer entre les Environnements

### 🌐 Mode PRODUCTION (Défaut - Recommandé)

**Avantages** :
- ✅ Pas besoin de lancer le backend localement
- ✅ Travaille avec les vraies données de production
- ✅ Pas de configuration de base de données locale nécessaire

**Configuration** :

```bash
# Dans frontend-fytli/.env
echo "VITE_API_URL=https://fytli.onrender.com" > frontend-fytli/.env
```

**Lancer le frontend** :
```bash
cd frontend-fytli
npm run dev -- --port 5173
```

Votre application sera accessible sur `http://localhost:5173` et communiquera avec l'API de production.

---

### 💻 Mode LOCAL (Développement complet en local)

**Avantages** :
- ✅ Développement sans dépendre de la connexion internet
- ✅ Tests avec données locales
- ✅ Debugging plus facile du backend

**Prérequis** :
- MySQL installé localement
- Base de données `fytli_db` créée

**Configuration** :

#### 1️⃣ Configurer le backend local

Créer/modifier `backend-fytli/.env` :
```env
# Base de données locale
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=fytli_db
DB_PORT=3306

# JWT Secret (utilisez le même qu'en prod ou générez-en un nouveau)
JWT_SECRET=votre_secret_jwt_minimum_32_caracteres

# Port du serveur
PORT=9001

# Environnement
NODE_ENV=development
```

#### 2️⃣ Configurer le frontend pour le local

```bash
# Dans frontend-fytli/.env
echo "VITE_API_URL=http://localhost:9001" > frontend-fytli/.env
```

#### 3️⃣ Lancer le backend local

```bash
cd backend-fytli
npm start
```

Le backend devrait démarrer sur `http://localhost:9001`

#### 4️⃣ Lancer le frontend

```bash
cd frontend-fytli
npm run dev -- --port 5173
```

---

## 🎯 Commandes Rapides

### Basculer en PRODUCTION (Render)

```bash
# Modifier l'env du frontend
echo "VITE_API_URL=https://fytli-backend.onrender.com" > frontend-fytli/.env

# Arrêter le backend local si il tourne
lsof -ti:9001 | xargs kill -9 2>/dev/null

# Redémarrer le frontend pour charger le nouveau .env
lsof -ti:5173 | xargs kill -9 && cd frontend-fytli && npm run dev -- --port 5173
```

### Basculer en LOCAL

```bash
# Modifier l'env du frontend
echo "VITE_API_URL=http://localhost:9001" > frontend-fytli/.env

# Lancer le backend local
cd backend-fytli && npm start &

# Redémarrer le frontend
lsof -ti:5173 | xargs kill -9 && cd frontend-fytli && npm run dev -- --port 5173
```

---

## 🔧 Panel d'Administration

Le panel d'administration fonctionne de la même manière.

### Mode PRODUCTION

```bash
# Dans admin-panel/.env (si besoin)
echo "VITE_API_URL=https://fytli-backend.onrender.com" > admin-panel/.env

# Lancer l'admin panel
cd admin-panel
npm run dev
```

### Mode LOCAL

```bash
# Dans admin-panel/.env
echo "VITE_API_URL=http://localhost:9001" > admin-panel/.env

# Lancer l'admin panel
cd admin-panel
npm run dev
```

---

## ⚠️ Problèmes Courants

### CORS Errors en PRODUCTION

Si vous avez des erreurs CORS en mode production, vérifiez que `http://localhost:5173` est bien autorisé dans `backend-fytli/index.js` (ligne 40) et que le code est déployé sur Render.

### Le .env n'est pas pris en compte

Après modification du `.env`, vous devez **redémarrer Vite** :
```bash
# Arrêter le serveur avec Ctrl+C puis relancer
npm run dev -- --port 5173
```

Ou utiliser la commande de kill ci-dessus.

### Backend local ne se connecte pas à MySQL

Vérifiez :
1. MySQL est bien démarré : `mysql.server status`
2. Les identifiants dans `backend-fytli/.env` sont corrects
3. La base de données existe : `mysql -u root -p -e "SHOW DATABASES;"`

---

## 📚 Fichiers de Configuration

### Frontend
- `frontend-fytli/.env` → Configuration de l'URL de l'API
- Ne pas commit ce fichier (dans `.gitignore`)

### Backend
- `backend-fytli/.env` → Configuration MySQL, JWT, etc.
- Ne JAMAIS commit ce fichier (sécurité)

### Admin Panel
- `admin-panel/.env` → Configuration de l'URL de l'API
- Ne pas commit ce fichier

---

## 🚀 Déploiement

Pour déployer les changements en production sur Render :

```bash
git add .
git commit -m "Update: description des changements"
git push origin main
```

Render détectera automatiquement les changements et redéploiera l'application.

---

## 📞 Support

- Backend Render : https://dashboard.render.com
- Base de données OVH : https://www.ovh.com/manager
- Documentation projet : voir `README.md`, `DEPLOY.md`, `RENDER_CONFIG.md`

---

**Date de dernière mise à jour** : 19 Octobre 2025  
**Configuration recommandée** : PRODUCTION (Render)

