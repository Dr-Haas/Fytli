# ⚡ Configuration Rapide Render - Fytli

Guide simplifié pour déployer sur Render.com

---

## 🚨 Solution à votre erreur

**Erreur** : `Cannot find module 'express'`

**Cause** : Render n'installe pas les dépendances dans le bon dossier

**Solution** : Utiliser une des configurations ci-dessous

---

## 🎯 Option 1 : Blueprint avec render.yaml (RECOMMANDÉ)

Le fichier `render.yaml` à la racine configure automatiquement tout.

### Étapes :

1. **Push sur Git** :
   ```bash
   git add .
   git commit -m "Add Render configuration"
   git push origin main
   ```

2. **Sur Render Dashboard** :
   - New → Blueprint
   - Connecter votre repository
   - Render détecte automatiquement `render.yaml`
   - Configurer les variables d'environnement :
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_NAME=fytli`
     - `JWT_SECRET` (généré auto)

3. **Déployer** :
   - Cliquer sur "Apply"
   - Attendre le déploiement

---

## 🎯 Option 2 : Configuration Manuelle

### Backend (Web Service)

**Settings** :
```
Name: fytli-backend
Runtime: Node
Region: Oregon
Branch: main

⚠️ IMPORTANT:
Root Directory: backend-fytli

Build Command: npm install --production=false
Start Command: npm start
```

**Variables d'environnement** :
```env
NODE_ENV=production
DB_HOST=votre_host
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=fytli
JWT_SECRET=votre_secret_32_caracteres_minimum
```

**Plan** : Free

### Frontend (Static Site)

**Settings** :
```
Name: fytli-frontend
Branch: main

⚠️ IMPORTANT:
Root Directory: frontend-fytli

Build Command: npm install && npm run build
Publish Directory: dist
```

**Variables d'environnement** :
```env
VITE_API_URL=https://votre-backend.onrender.com
```

**Redirects/Rewrites** :
```
Source: /*
Destination: /index.html
Action: Rewrite
```

### Admin Panel (Static Site)

**Settings** :
```
Name: fytli-admin
Branch: main

⚠️ IMPORTANT:
Root Directory: admin-panel

Build Command: npm install && npm run build
Publish Directory: dist
```

**Variables d'environnement** :
```env
VITE_API_URL=https://votre-backend.onrender.com
```

**Redirects/Rewrites** :
```
Source: /*
Destination: /index.html
Action: Rewrite
```

---

## 🗄️ Base de données

### Option A : Base MySQL externe

Utiliser PlanetScale (gratuit), Railway ou AWS RDS :

1. Créer une base MySQL 8.0+
2. Importer le schéma :
   ```bash
   mysql -h HOST -u USER -pPASSWORD DB_NAME < backend-fytli/database/enrollment_system.sql
   ```
3. Utiliser les credentials dans Render

### Option B : PostgreSQL sur Render

1. Sur Render : New → PostgreSQL
2. Plan : Free
3. Connecter au backend

⚠️ **Note** : Nécessite de modifier le code backend pour PostgreSQL (remplacer mysql2 par pg)

---

## ✅ Checklist de déploiement

Avant de déployer :

- [ ] Code pushé sur Git (GitHub/GitLab)
- [ ] Fichier `render.yaml` à la racine
- [ ] Base de données MySQL créée
- [ ] Schéma de base importé
- [ ] Variables d'environnement notées

Pour chaque service sur Render :

**Backend** :
- [ ] Root Directory : `backend-fytli` ⚠️
- [ ] Build Command : `npm install --production=false` ⚠️
- [ ] Start Command : `npm start`
- [ ] Variables d'environnement configurées

**Frontend** :
- [ ] Root Directory : `frontend-fytli` ⚠️
- [ ] Build Command : `npm install && npm run build`
- [ ] Publish Directory : `dist`
- [ ] `VITE_API_URL` configuré avec l'URL du backend
- [ ] Rewrite rule : `/* → /index.html`

**Admin** :
- [ ] Root Directory : `admin-panel` ⚠️
- [ ] Build Command : `npm install && npm run build`
- [ ] Publish Directory : `dist`
- [ ] `VITE_API_URL` configuré avec l'URL du backend
- [ ] Rewrite rule : `/* → /index.html`

---

## 🔧 Générer un JWT_SECRET

```bash
# Sur votre machine
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans la variable d'environnement `JWT_SECRET` sur Render.

---

## 🐛 Dépannage

### Erreur "Cannot find module"

**Problème** : Root Directory mal configuré

**Solution** :
- Vérifier que Root Directory = `backend-fytli` (ou `frontend-fytli`, `admin-panel`)
- Vérifier que `package.json` existe dans ce dossier
- Re-déployer

### Erreur "Build failed"

**Problème** : Dépendances manquantes ou erreurs TypeScript

**Solution** :
- Vérifier les logs de build sur Render
- Tester le build localement : `cd backend-fytli && npm install && npm run build`
- Vérifier que toutes les dépendances sont dans `package.json`

### Erreur de connexion à la DB

**Problème** : Variables d'environnement incorrectes

**Solution** :
- Vérifier `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Vérifier que l'IP de Render est whitelistée sur votre DB
- Tester la connexion depuis votre machine

### Frontend ne trouve pas l'API

**Problème** : `VITE_API_URL` incorrect ou CORS

**Solution** :
- Vérifier que `VITE_API_URL` pointe vers l'URL du backend Render
- Vérifier la configuration CORS dans `backend-fytli/index.js`
- Ajouter l'URL frontend dans la liste CORS du backend

---

## 📚 Ressources

- [Documentation complète](DEPLOY.md)
- [Commandes rapides](COMMANDS.md)
- [Guide de build](BUILD.md)
- [Documentation Render](https://render.com/docs)

---

## 🎉 URLs finales

Après déploiement, vous aurez :

- **Backend** : `https://fytli-backend.onrender.com`
- **Frontend** : `https://fytli-frontend.onrender.com`
- **Admin** : `https://fytli-admin.onrender.com`

N'oubliez pas de mettre à jour `VITE_API_URL` dans les variables d'environnement du frontend et de l'admin avec l'URL réelle du backend !

---

**✨ Besoin d'aide ?** Consultez [DEPLOY.md](DEPLOY.md) pour plus de détails.

