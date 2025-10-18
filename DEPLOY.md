# 🚀 Guide de Déploiement - Fytli

Guide complet pour déployer l'application Fytli sur différentes plateformes.

---

## 📋 Table des matières

- [Render.com (Recommandé)](#rendercom-recommandé)
- [Vercel + Railway](#vercel--railway)
- [VPS Manuel](#vps-manuel)
- [Variables d'environnement](#variables-denvironnement)

---

## Render.com (Recommandé)

Render permet de déployer facilement les 3 parties de l'application.

### 🎯 Prérequis

1. Compte sur [render.com](https://render.com)
2. Repository Git (GitHub, GitLab, etc.)
3. Base de données MySQL externe OU PostgreSQL sur Render

### 📝 Option 1 : Déploiement automatique avec render.yaml

Le fichier `render.yaml` à la racine du projet configure tout automatiquement.

**Étapes :**

1. **Push le code sur Git** :
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connecter à Render** :
   - Aller sur [render.com/dashboard](https://dashboard.render.com)
   - Cliquer sur "New" → "Blueprint"
   - Connecter votre repository
   - Render détectera automatiquement `render.yaml`

3. **Configurer les variables d'environnement** :
   - Pour le backend, ajouter :
     - `DB_HOST` - Hôte de votre base de données
     - `DB_USER` - Utilisateur MySQL
     - `DB_PASSWORD` - Mot de passe MySQL
     - `DB_NAME` - `followsport`
     - `JWT_SECRET` - Généré automatiquement
     - `PORT` - Laissé vide (Render le définit automatiquement)

4. **Déployer** :
   - Cliquer sur "Apply"
   - Render va déployer automatiquement les 3 services

### 📝 Option 2 : Déploiement manuel par service

#### Backend (Web Service)

1. **Créer un nouveau Web Service** :
   - New → Web Service
   - Connecter votre repository
   - Root Directory : `backend-followsport`

2. **Configuration** :
   ```
   Name: fytli-backend
   Runtime: Node
   Region: Oregon (ou le plus proche)
   Branch: main
   Root Directory: backend-followsport
   Build Command: npm install --production=false
   Start Command: npm start
   ```

3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=(laisser vide)
   DB_HOST=votre_host_mysql
   DB_USER=votre_user
   DB_PASSWORD=votre_password
   DB_NAME=followsport
   JWT_SECRET=votre_secret_super_securise_au_moins_32_caracteres
   ```

4. **Plan** : Free ou Starter

#### Frontend (Static Site)

1. **Créer un nouveau Static Site** :
   - New → Static Site
   - Connecter votre repository
   - Root Directory : `frontend-followsport`

2. **Configuration** :
   ```
   Name: fytli-frontend
   Branch: main
   Root Directory: frontend-followsport
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Variables d'environnement** :
   ```
   VITE_API_URL=https://fytli-backend.onrender.com
   ```
   ⚠️ Remplacer par l'URL réelle de votre backend Render

4. **Redirects/Rewrites** :
   Ajouter dans les settings :
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

#### Admin Panel (Static Site)

Même procédure que le Frontend :

1. **Configuration** :
   ```
   Name: fytli-admin
   Branch: main
   Root Directory: admin-panel
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

2. **Variables d'environnement** :
   ```
   VITE_API_URL=https://fytli-backend.onrender.com
   ```

3. **Redirects/Rewrites** :
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

### 🗄️ Base de données

#### Option A : MySQL externe (PlanetScale, AWS RDS)

1. Créer une base de données MySQL 8.0+
2. Importer le schéma :
   ```bash
   mysql -h HOST -u USER -p DB_NAME < backend-followsport/database/enrollment_system.sql
   ```
3. Utiliser les credentials dans les variables d'environnement

#### Option B : PostgreSQL sur Render

1. New → PostgreSQL
2. Nom : `fytli-mysql`
3. Plan : Free
4. Render fournira automatiquement `DATABASE_URL`

⚠️ **Note** : Si vous utilisez PostgreSQL, vous devrez adapter le code backend (remplacer mysql2 par pg).

### 🔄 Déploiement automatique

Une fois configuré, chaque `git push` déclenchera automatiquement un redéploiement.

---

## Vercel + Railway

### Frontend & Admin sur Vercel

**Frontend :**

1. **Importer le projet** :
   - Aller sur [vercel.com](https://vercel.com)
   - New Project → Import votre repository
   - Root Directory : `frontend-followsport`

2. **Configuration** :
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Root Directory: frontend-followsport
   ```

3. **Variables d'environnement** :
   ```
   VITE_API_URL=https://votre-backend.up.railway.app
   ```

4. **Déployer**

**Admin Panel :** Même procédure avec `Root Directory: admin-panel`

### Backend sur Railway

1. **Créer un projet Railway** :
   - Aller sur [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Sélectionner votre repository

2. **Configuration** :
   - Root Directory : `backend-followsport`
   - Build Command : `npm install`
   - Start Command : `npm start`

3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=followsport
   JWT_SECRET=
   ```

4. **Base de données** :
   - Add → MySQL
   - Railway créera automatiquement une instance MySQL
   - Les variables seront auto-injectées

---

## VPS Manuel (Ubuntu/Debian)

### 1. Prérequis serveur

```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Installer Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Installer MySQL
sudo apt install -y mysql-server

# Installer Nginx
sudo apt install -y nginx

# Installer PM2
sudo npm install -g pm2
```

### 2. Backend

```bash
# Cloner le projet
git clone https://github.com/yourusername/fytli.git
cd fytli/backend-followsport

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
# Copier les variables d'environnement (voir section Variables)

# Configurer la base de données
mysql -u root -p < database/enrollment_system.sql

# Lancer avec PM2
pm2 start index.js --name fytli-backend
pm2 save
pm2 startup
```

### 3. Frontend & Admin

```bash
# Build Frontend
cd ../frontend-followsport
npm install
npm run build

# Build Admin
cd ../admin-panel
npm install
npm run build
```

### 4. Nginx

```bash
sudo nano /etc/nginx/sites-available/fytli
```

**Configuration Nginx** :

```nginx
# Backend API
server {
    listen 80;
    server_name api.fytli.app;

    location / {
        proxy_pass http://localhost:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name fytli.app www.fytli.app;
    root /var/www/fytli/frontend-followsport/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
    }
}

# Admin Panel
server {
    listen 80;
    server_name admin.fytli.app;
    root /var/www/fytli/admin-panel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Activer la configuration** :

```bash
sudo ln -s /etc/nginx/sites-available/fytli /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL avec Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d fytli.app -d www.fytli.app -d api.fytli.app -d admin.fytli.app
```

---

## Variables d'environnement

### Backend (`.env`)

```env
# Serveur
NODE_ENV=production
PORT=9001

# Base de données
DB_HOST=votre_host
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=followsport

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_au_moins_32_caracteres_random

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_app_password
```

### Frontend (`.env`)

```env
VITE_API_URL=https://api.fytli.app
# ou
VITE_API_URL=https://fytli-backend.onrender.com
```

### Admin Panel (`.env`)

```env
VITE_API_URL=https://api.fytli.app
# ou
VITE_API_URL=https://fytli-backend.onrender.com
```

---

## 🔒 Sécurité

### Checklist de sécurité

- [ ] JWT_SECRET généré aléatoirement (min 32 caractères)
- [ ] HTTPS activé (SSL)
- [ ] CORS configuré correctement dans le backend
- [ ] Variables d'environnement sécurisées (pas dans Git)
- [ ] Mots de passe hashés (bcrypt)
- [ ] Rate limiting activé
- [ ] Headers de sécurité (helmet)

### Configuration CORS (Backend)

Vérifier dans `backend-followsport/index.js` :

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://fytli.app',
    'https://www.fytli.app',
    'https://admin.fytli.app',
    // Ajouter vos URLs Render/Vercel
  ],
  credentials: true
}));
```

---

## 📊 Monitoring

### Render

- Logs en temps réel dans le dashboard
- Métriques CPU/RAM/Réseau
- Alertes automatiques

### VPS avec PM2

```bash
# Logs
pm2 logs fytli-backend

# Monitoring
pm2 monit

# Status
pm2 status
```

---

## 🔄 Mise à jour

### Render

Automatique à chaque `git push` sur la branche configurée.

### VPS

```bash
cd /var/www/fytli

# Backend
cd backend-followsport
git pull
npm install
pm2 restart fytli-backend

# Frontend
cd ../frontend-followsport
git pull
npm install
npm run build

# Admin
cd ../admin-panel
git pull
npm install
npm run build
```

---

## 🐛 Troubleshooting

### Erreur "Cannot find module 'express'"

**Cause** : Dépendances non installées

**Solution** :
- Vérifier que `Root Directory` est bien configuré dans Render
- Vérifier que `Build Command` est `npm install`
- Vérifier que `package.json` est présent dans le bon dossier

### Erreur CORS

**Cause** : Frontend et Backend sur des domaines différents

**Solution** :
```javascript
// backend-followsport/index.js
app.use(cors({
  origin: ['https://votre-frontend.com'],
  credentials: true
}));
```

### Base de données inaccessible

**Cause** : Variables d'environnement incorrectes

**Solution** :
- Vérifier les credentials DB
- Vérifier que l'IP du serveur est autorisée (whitelist)
- Tester la connexion avec `mysql -h HOST -u USER -p`

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Railway](https://docs.railway.app)
- [PM2 Process Manager](https://pm2.keymetrics.io)

---

**✨ Votre application Fytli est maintenant en production !**

Pour toute question : contact@fytli.app

