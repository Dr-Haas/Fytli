# 🏗️ Guide de Build - Fytli

Ce guide explique comment builder et déployer l'application Fytli (frontend + admin panel).

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Development](#development)
- [Build Production](#build-production)
- [Preview](#preview)
- [Déploiement](#déploiement)
- [Troubleshooting](#troubleshooting)

---

## Prérequis

- **Node.js** 20.19+ ou 22.12+
- **npm** 10+
- **MySQL** 8.0+ (pour le backend)

---

## Installation

Chaque projet a son propre `package.json` et doit être installé séparément :

```bash
# Cloner le repository
git clone https://github.com/yourusername/fytli.git
cd fytli

# Frontend
cd frontend-fytli
npm install

# Admin Panel
cd ../admin-panel
npm install

# Backend
cd ../backend-fytli
npm install
```

---

## Development

Chaque application se lance depuis son propre dossier :

```bash
# Frontend (port 5173)
cd frontend-fytli
npm run dev

# Admin Panel (port 5174)
cd admin-panel
npm run dev

# Backend (port 9001)
cd backend-fytli
npm run dev
```

---

## Build Production

Chaque projet se build indépendamment :

### Frontend

```bash
cd frontend-fytli
npm run build
```

**Output** : `frontend-fytli/dist/`
- ✅ Application React compilée
- ✅ Service Worker (sw.js)
- ✅ PWA Manifest (manifest.webmanifest)
- ✅ Assets optimisés (CSS, JS, images)

#### Admin Panel

```bash
cd admin-panel
npm run build
```

**Output** : `admin-panel/dist/`
- ✅ Application React compilée
- ✅ Assets optimisés (CSS, JS)

---

## Preview

Tester les builds en local avant de déployer :

```bash
# Frontend
cd frontend-fytli
npm run preview   # Port 4173

# Admin Panel
cd admin-panel
npm run preview   # Port 4173
```

---

## Déploiement

### 🌐 Frontend (Application PWA)

Le dossier `frontend-fytli/dist/` peut être déployé sur :

#### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
cd frontend-fytli
vercel --prod
```

**Configuration** :
- Framework : Vite
- Build Command : `npm run build`
- Output Directory : `dist`
- Install Command : `npm install`

#### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
cd frontend-fytli
netlify deploy --prod --dir=dist
```

**Configuration** :
- Build command : `npm run build`
- Publish directory : `dist`

#### Nginx

```nginx
server {
    listen 80;
    server_name fytli.app;
    root /var/www/fytli/frontend-fytli/dist;
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

    # Manifest
    location /manifest.webmanifest {
        add_header Content-Type application/manifest+json;
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName fytli.app
    DocumentRoot /var/www/fytli/frontend-fytli/dist

    <Directory /var/www/fytli/frontend-fytli/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA Routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### 🔐 Admin Panel

Le dossier `admin-panel/dist/` peut être déployé de la même manière que le frontend.

**Recommandations** :
- Déployer sur un sous-domaine : `admin.fytli.app`
- Activer l'authentification basique si pas de login
- Limiter l'accès par IP si possible

```nginx
server {
    listen 80;
    server_name admin.fytli.app;
    root /var/www/fytli/admin-panel/dist;
    index index.html;

    # Authentification basique (optionnel)
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 🔙 Backend

Le backend Node.js peut être déployé sur :

#### PM2 (recommandé pour VPS)

```bash
# Installer PM2
npm install -g pm2

# Démarrer le backend
cd backend-fytli
pm2 start index.js --name fytli-backend

# Sauvegarder
pm2 save
pm2 startup
```

#### Docker

```dockerfile
# backend-fytli/Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 9001
CMD ["npm", "start"]
```

```bash
# Build et run
docker build -t fytli-backend .
docker run -p 9001:9001 --env-file .env fytli-backend
```

#### Heroku

```bash
# Depuis backend-fytli/
heroku login
heroku create fytli-backend
git push heroku main
```

---

## Variables d'environnement

### Frontend (.env)

```env
VITE_API_URL=https://api.fytli.app
```

### Admin Panel (.env)

```env
VITE_API_URL=https://api.fytli.app
```

### Backend (.env)

```env
PORT=9001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fytli
JWT_SECRET=your_super_secret_key_here
NODE_ENV=production
```

---

## Troubleshooting

### ❌ Erreur : "Missing script: build"

**Problème** : Vous devez exécuter les commandes depuis le dossier du projet concerné.

**Solution** :
```bash
# Pour le frontend
cd frontend-fytli
npm run build

# Pour l'admin panel
cd admin-panel
npm run build

# Pour le backend
cd backend-fytli
npm run build
```

### ❌ Erreur : "Cannot find module"

**Problème** : Dépendances non installées.

**Solution** :
```bash
# Installer les dépendances du projet concerné
cd frontend-fytli   # ou admin-panel ou backend-fytli
npm install
```

### ❌ Build qui échoue avec TypeScript

**Problème** : Erreurs TypeScript.

**Solution** :
```bash
# Vérifier les erreurs
npm run lint

# Build sans vérification stricte (déconseillé)
tsc --noEmit false && vite build
```

### ❌ Service Worker qui ne se met pas à jour

**Problème** : Cache du Service Worker.

**Solution** :
1. Ouvrir DevTools (F12)
2. Application → Service Workers
3. Cliquer "Unregister"
4. Rafraîchir la page (Ctrl+F5)

### ❌ PWA qui ne s'installe pas

**Problème** : Configuration manifest incorrecte.

**Solution** :
1. Vérifier `manifest.webmanifest`
2. Vérifier les icônes (192x192, 512x512)
3. Servir en HTTPS (requis pour PWA)

---

## Checklist de déploiement

### Avant le build

- [ ] Variables d'environnement configurées (`.env`)
- [ ] Base de données migrée
- [ ] Dépendances installées (`npm install`)
- [ ] Tests passent (`npm run test`)
- [ ] Pas d'erreurs de lint (`npm run lint`)

### Après le build

- [ ] Build réussi sans erreurs
- [ ] Preview testé localement (`npm run preview`)
- [ ] Service Worker fonctionne (mode offline)
- [ ] PWA installable
- [ ] Images optimisées
- [ ] Performance testée (Lighthouse)

### Après le déploiement

- [ ] URLs de production fonctionnent
- [ ] API accessible depuis le frontend
- [ ] CORS configuré correctement
- [ ] SSL/HTTPS activé
- [ ] PWA installable en production
- [ ] Service Worker fonctionne
- [ ] Backup de la base de données

---

## Performance

### Optimisations appliquées

✅ **Code Splitting** : Vite le fait automatiquement
✅ **Tree Shaking** : Supprime le code inutilisé
✅ **Minification** : JS/CSS minifiés
✅ **Compression** : Gzip/Brotli activable sur le serveur
✅ **Lazy Loading** : Routes chargées à la demande
✅ **Service Worker** : Cache intelligent (Workbox)

### Scores Lighthouse cibles

- 🟢 Performance : 90+
- 🟢 Accessibility : 90+
- 🟢 Best Practices : 90+
- 🟢 SEO : 90+
- 🟢 PWA : 100

---

## Monitoring

### Logs Backend

```bash
# Logs en temps réel
pm2 logs fytli-backend

# Monitoring
pm2 monit
```

### Logs Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Ressources

- [Documentation Vite](https://vitejs.dev/guide/build.html)
- [Documentation PWA](https://vite-pwa-org.netlify.app/)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)

---

**🎉 Votre application Fytli est maintenant prête pour la production !**

Pour toute question : contact@fytli.app

