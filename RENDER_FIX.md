# 🔧 Fix : Erreur "Cannot find module 'express'" sur Render

## 🚨 Le problème

Lors du déploiement sur Render, vous obtenez :
```
Error: Cannot find module 'express'
```

Même si le build dit "successful", les dépendances ne sont pas installées.

---

## ✅ La solution

### Problème identifié

Render utilise la commande **`npm run build`** du `package.json` pour builder le projet. Si ce script ne fait qu'afficher un message (comme un simple `echo`), les dépendances ne sont **jamais installées**.

### Solution appliquée

Le script `build` dans `backend-followsport/package.json` a été modifié de :

```json
"build": "echo \"Backend build completed\""
```

À :

```json
"build": "npm install --production=false"
```

**Pourquoi `--production=false`** ?
- Installe toutes les dépendances (dev + production)
- Nécessaire pour certains modules qui ont des peer dependencies
- Sûr pour la production

---

## 🎯 Configuration Render correcte

### Option 1 : Utiliser render.yaml (Automatique)

Le fichier `render.yaml` à la racine est maintenant correctement configuré :

```yaml
services:
  - type: web
    name: fytli-backend
    runtime: node
    rootDir: backend-followsport
    buildCommand: npm install --production=false
    startCommand: npm start
```

**Déploiement** :
1. Push sur Git
2. Render → New → Blueprint
3. Connecter repository
4. Configurer variables d'environnement
5. Deploy

### Option 2 : Configuration manuelle

Sur Render Dashboard :

1. **New Web Service**
2. **Connecter repository**
3. **Configuration importante** :

```
Name: fytli-backend
Runtime: Node
Branch: main

⚠️ ESSENTIEL :
Root Directory: backend-followsport

Build Command: npm install --production=false
Start Command: npm start
```

4. **Variables d'environnement** :
```
NODE_ENV=production
DB_HOST=votre_host
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=followsport
JWT_SECRET=votre_secret_32_caracteres
```

---

## 🔍 Vérifications

### Dans les logs Render, vous devriez voir :

✅ **Build Phase** :
```
==> Running 'npm run build'
> backend-followsport@1.0.0 build
> npm install --production=false

added 150 packages, audited 151 packages
==> Build successful 🎉
```

✅ **Deploy Phase** :
```
==> Running 'npm start'
> backend-followsport@1.0.0 start
> node index.js

Server running on port 10000
✓ MySQL Connected
```

### Si vous voyez encore l'erreur :

❌ **Mauvaise configuration** :
- Vérifier que `Root Directory` = `backend-followsport`
- Vérifier que `Build Command` = `npm install --production=false`
- Re-déployer manuellement

---

## 🎯 Checklist de déploiement

Avant de déployer :

- [ ] Le fichier `backend-followsport/package.json` contient :
  ```json
  "build": "npm install --production=false"
  ```
- [ ] Code pushé sur Git
- [ ] Base de données MySQL créée et accessible

Sur Render :

- [ ] Service créé (Web Service)
- [ ] **Root Directory** : `backend-followsport` ⚠️
- [ ] **Build Command** : `npm install --production=false` ⚠️
- [ ] **Start Command** : `npm start`
- [ ] Variables d'environnement configurées
- [ ] Déploiement lancé

---

## 🔧 Alternative : Build Command dans Render

Au lieu de modifier `package.json`, vous pouvez aussi configurer directement dans Render :

**Build Command** : `npm install --production=false`

Render utilisera cette commande au lieu de `npm run build`. Cette méthode fonctionne aussi !

---

## 📚 Comprendre le flux

### Ancien flux (qui échouait) :

```
1. Render clone le repo
2. Render va dans backend-followsport/
3. Render exécute : npm run build
4. Script build : echo "Build completed" ❌ Aucune installation
5. Render exécute : npm start
6. Node cherche express → ERREUR : module not found
```

### Nouveau flux (qui fonctionne) :

```
1. Render clone le repo
2. Render va dans backend-followsport/
3. Render exécute : npm run build
4. Script build : npm install --production=false ✅ Installation des dépendances
5. node_modules/ créé avec toutes les dépendances
6. Render exécute : npm start
7. Node trouve express → ✅ Serveur démarre
```

---

## 🎉 Résultat attendu

Après le déploiement réussi :

- ✅ Backend accessible : `https://fytli-backend.onrender.com`
- ✅ API fonctionne : `https://fytli-backend.onrender.com/health`
- ✅ Logs sans erreurs

Mettre à jour `VITE_API_URL` dans le frontend et l'admin avec cette URL !

---

## 🆘 Toujours des problèmes ?

1. **Vérifier les logs Render** : Dashboard → Service → Logs
2. **Tester en local** :
   ```bash
   cd backend-followsport
   npm run build
   npm start
   ```
3. **Vérifier package.json** :
   ```bash
   cat backend-followsport/package.json | grep build
   ```

4. **Consulter** :
   - [RENDER_CONFIG.md](RENDER_CONFIG.md) - Guide Render complet
   - [DEPLOY.md](DEPLOY.md) - Guide de déploiement
   - [QUICK_START.md](QUICK_START.md) - Démarrage rapide

---

**✨ Votre backend devrait maintenant se déployer correctement sur Render !**

