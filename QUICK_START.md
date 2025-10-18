# ⚡ Quick Start - Fytli

Guide de démarrage rapide en 5 minutes.

---

## 🚨 Problème de déploiement sur Render ?

**Erreur** : `Cannot find module 'express'`

**Solution rapide** : 

Sur Render, configurez :
- **Root Directory** : `backend-followsport` ⚠️ (C'EST ESSENTIEL)
- **Build Command** : `npm install`
- **Start Command** : `npm start`

📖 **Guide complet** : [RENDER_CONFIG.md](RENDER_CONFIG.md)

---

## 🚀 Démarrage local en 3 étapes

### 1. Installation (une seule fois)

```bash
# Méthode automatique
bash install.sh

# OU méthode manuelle
cd frontend-followsport && npm install && cd ..
cd admin-panel && npm install && cd ..
cd backend-followsport && npm install && cd ..
```

### 2. Configurer la base de données

```bash
# Créer la base
mysql -u root -p < backend-followsport/database/enrollment_system.sql

# Créer un .env dans backend-followsport/
cat > backend-followsport/.env << EOF
NODE_ENV=development
PORT=9001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=followsport
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EOF

# Créer .env pour frontend et admin
echo "VITE_API_URL=http://localhost:9001" > frontend-followsport/.env
echo "VITE_API_URL=http://localhost:9001" > admin-panel/.env
```

### 3. Lancer les applications

```bash
# Terminal 1 - Backend (obligatoire)
cd backend-followsport
npm run dev

# Terminal 2 - Frontend (obligatoire)
cd frontend-followsport
npm run dev

# Terminal 3 - Admin (optionnel)
cd admin-panel
npm run dev
```

**✅ Ouvrir** : http://localhost:5173

---

## 📦 Build pour production

```bash
# Frontend
cd frontend-followsport
npm run build

# Admin
cd admin-panel
npm run build

# Backend
cd backend-followsport
npm run build
```

Les fichiers de build sont dans :
- `frontend-followsport/dist/`
- `admin-panel/dist/`

---

## 🚀 Déployer sur Render

### Option 1 : Automatique (Recommandé)

1. Push sur Git :
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. Sur [render.com](https://render.com) :
   - New → Blueprint
   - Connecter repository
   - `render.yaml` configure tout automatiquement

3. Configurer les variables d'environnement (seulement le backend) :
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME=followsport`

### Option 2 : Manuel

Pour chaque service (Backend, Frontend, Admin) :

**Backend - Web Service** :
- Root Directory : `backend-followsport` ⚠️
- Build Command : `npm install --production=false` ⚠️
- Start Command : `npm start`
- Variables d'environnement : voir ci-dessus

**Frontend - Static Site** :
- Root Directory : `frontend-followsport` ⚠️
- Build Command : `npm install && npm run build`
- Publish Directory : `dist`
- Variable : `VITE_API_URL=https://votre-backend.onrender.com`
- Rewrite : `/* → /index.html`

**Admin - Static Site** :
- Root Directory : `admin-panel` ⚠️
- Build Command : `npm install && npm run build`
- Publish Directory : `dist`
- Variable : `VITE_API_URL=https://votre-backend.onrender.com`
- Rewrite : `/* → /index.html`

📖 **Guide détaillé** : [RENDER_CONFIG.md](RENDER_CONFIG.md)

---

## 📁 Structure du projet

```
followSport_app/
├── frontend-followsport/    # App PWA utilisateur
├── admin-panel/              # Panel d'administration
├── backend-followsport/      # API REST
└── [docs & config]
```

Chaque projet est **indépendant** avec son propre `package.json`.

---

## 📚 Documentation

### 🔥 Guides essentiels

- [⚡ QUICK_START.md](QUICK_START.md) - Ce fichier
- [🚀 RENDER_CONFIG.md](RENDER_CONFIG.md) - Déployer sur Render
- [⌨️ COMMANDS.md](COMMANDS.md) - Commandes rapides

### 📖 Documentation complète

- [📘 README.md](README.md) - Vue d'ensemble
- [🚀 DEPLOY.md](DEPLOY.md) - Déploiement (Render, Vercel, VPS)
- [🏗️ BUILD.md](BUILD.md) - Guide de build
- [📁 PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture
- [🗄️ DATABASE.md](DATABASE.md) - Base de données

---

## ❓ Questions fréquentes

### Erreur "Cannot find module" ?

```bash
cd <projet_concerné>
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé ?

```bash
# Trouver le processus
lsof -i :5173  # ou 5174, 9001

# Tuer
kill -9 <PID>
```

### Base de données inaccessible ?

```bash
# Vérifier que MySQL tourne
brew services list  # macOS
sudo systemctl status mysql  # Linux

# Redémarrer
brew services restart mysql  # macOS
```

### Frontend ne se connecte pas au backend ?

1. Vérifier que le backend tourne (http://localhost:9001)
2. Vérifier `VITE_API_URL` dans `.env`
3. Vérifier la configuration CORS dans `backend-followsport/index.js`

---

## 🆘 Besoin d'aide ?

1. **Commandes** : [COMMANDS.md](COMMANDS.md)
2. **Déploiement Render** : [RENDER_CONFIG.md](RENDER_CONFIG.md)
3. **Déploiement complet** : [DEPLOY.md](DEPLOY.md)
4. **Architecture** : [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
5. **README** : [README.md](README.md)

---

## 🎯 Checklist

### Développement local

- [ ] Node.js 20+ installé
- [ ] MySQL 8+ installé
- [ ] Dépendances installées (`bash install.sh`)
- [ ] Base de données créée
- [ ] Fichiers `.env` créés
- [ ] Backend lancé (port 9001)
- [ ] Frontend lancé (port 5173)

### Déploiement Render

- [ ] Code sur Git (GitHub/GitLab)
- [ ] `render.yaml` à la racine
- [ ] Base de données MySQL externe créée
- [ ] Schéma importé
- [ ] Services créés sur Render
- [ ] Root Directory configuré pour chaque service ⚠️
- [ ] Variables d'environnement configurées
- [ ] `VITE_API_URL` mis à jour avec URL backend

---

**🎉 Vous êtes prêt ! Bon développement !**

**⚡ Pro tip** : Créer un alias dans votre `.bashrc` ou `.zshrc` :

```bash
alias fytli-start="cd ~/fytli && bash -c '
cd backend-followsport && npm run dev &
cd ../frontend-followsport && npm run dev
'"
```

