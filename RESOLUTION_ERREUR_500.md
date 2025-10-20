# 🔧 Résolution de l'erreur 500 - Frontend Fytli

## 🔍 Problème Identifié

Le frontend essaie de se connecter à `https://fytli-backend.onrender.com` mais le backend n'est pas accessible (erreur 404).

**Cause** : Les variables d'environnement du backend ne sont pas configurées sur Render.

---

## ✅ Solution 1 : Configurer Render (Recommandé pour la production)

### Étape 1 : Configurer les variables d'environnement sur Render

1. Allez sur [https://dashboard.render.com](https://dashboard.render.com)
2. Sélectionnez le service **fytli-backend**
3. Allez dans **Environment** → **Environment Variables**
4. Ajoutez ces variables :

```env
NODE_ENV=production
PORT=10000
DB_HOST=<votre-serveur-mysql>
DB_USER=<votre-utilisateur-mysql>
DB_PASSWORD=<votre-mot-de-passe-mysql>
DB_NAME=<votre-base-de-donnees>
DB_PORT=3306
JWT_SECRET=55dcd7551dddcf4300a37f9e053e4cd2fd046b0e3fd7db5cc9e5cac8300747e8edb0d87495fa63c5d320af33337c5876b55294947bc86ce4083b3e4372cdc292
FRONTEND_URL=https://fytli-frontend.onrender.com
```

### Étape 2 : Configurer la base de données

**Option A : Base MySQL Render (Recommandé)**
1. Dans Render, créez une nouvelle base MySQL
2. Copiez les identifiants de connexion
3. Utilisez-les dans les variables d'environnement ci-dessus

**Option B : Base MySQL externe (OVH, etc.)**
1. Récupérez vos identifiants MySQL existants
2. Utilisez-les dans les variables d'environnement ci-dessus

### Étape 3 : Redéployer

1. Le backend se redéploiera automatiquement
2. Attendez 5-10 minutes
3. Testez avec : `curl https://fytli-backend.onrender.com/`
4. Vous devriez voir : `{"success":true,"message":"Backend Fytli API - Serveur fonctionnel"}`

---

## 🏠 Solution 2 : Tester en local (Développement)

Si vous voulez tester immédiatement pendant que vous configurez Render :

### Étape 1 : Créer le fichier .env backend

Créez le fichier `backend-fytli/.env` :

```bash
cd /Users/garyhaas/Desktop/Fytli/backend-fytli
touch .env
```

Ajoutez ce contenu :

```env
# Configuration de la base de données
DB_HOST=votre-host-mysql
DB_USER=votre-utilisateur-mysql  
DB_PASSWORD=votre-mot-de-passe-mysql
DB_NAME=votre-base-de-donnees
DB_PORT=3306

# Configuration JWT
JWT_SECRET=55dcd7551dddcf4300a37f9e053e4cd2fd046b0e3fd7db5cc9e5cac8300747e8edb0d87495fa63c5d320af33337c5876b55294947bc86ce4083b3e4372cdc292

# Configuration du serveur
PORT=9001
NODE_ENV=development

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173
```

### Étape 2 : Démarrer le backend local

```bash
cd /Users/garyhaas/Desktop/Fytli/backend-fytli
npm install
npm run dev
```

Vous devriez voir :
```
✅ Connexion MySQL établie avec succès
🚀 Serveur démarré sur le port 9001
```

### Étape 3 : Créer le fichier .env frontend

Créez le fichier `frontend-fytli/.env.local` :

```bash
cd /Users/garyhaas/Desktop/Fytli/frontend-fytli
touch .env.local
```

Ajoutez ce contenu :

```env
# Configuration API Backend - Mode développement local
VITE_API_URL=http://localhost:9001
```

### Étape 4 : Démarrer le frontend

```bash
cd /Users/garyhaas/Desktop/Fytli/frontend-fytli
npm install
npm run dev
```

Le frontend se connectera maintenant au backend local (http://localhost:9001) au lieu du backend Render.

---

## 📋 Checklist de vérification

### Backend
- [ ] Variables d'environnement configurées (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET)
- [ ] Base de données MySQL accessible
- [ ] Backend démarre sans erreur
- [ ] Route `/` retourne `{"success":true}`
- [ ] Route `/auth/login` est accessible

### Frontend
- [ ] VITE_API_URL pointe vers le bon backend
- [ ] Le frontend peut faire des requêtes au backend
- [ ] Pas d'erreur CORS dans la console

---

## 🔐 Où trouver vos informations MySQL ?

### Si vous utilisez OVH :
1. Connectez-vous à [https://www.ovh.com/manager/](https://www.ovh.com/manager/)
2. Web Cloud → Bases de données
3. Sélectionnez votre base
4. Notez : Serveur, Utilisateur, Nom de la base

### Si vous utilisez Render MySQL :
1. Dans le dashboard Render
2. Sélectionnez votre base MySQL
3. Copiez les "Internal Connection String" ou les détails individuels

---

## 🧪 Tests

### Tester le backend :

```bash
# Test de la route racine
curl https://fytli-backend.onrender.com/

# Test du login (devrait retourner une erreur mais pas 404)
curl -X POST https://fytli-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Tester le frontend :

1. Ouvrez la console du navigateur (F12)
2. Allez sur la page de login
3. Essayez de vous connecter
4. Vérifiez qu'il n'y a pas d'erreur "Network Error"

---

## 🆘 Problèmes fréquents

### "Network Error" persiste
- Vérifiez que le backend est démarré
- Vérifiez que VITE_API_URL est correct
- Vérifiez qu'il n'y a pas d'erreur CORS

### "Cannot connect to MySQL"
- Vérifiez les identifiants de la base de données
- Vérifiez que la base est accessible depuis votre réseau/Render
- Pour OVH, vérifiez que l'IP de Render est autorisée

### "JWT_SECRET is not defined"
- Ajoutez JWT_SECRET dans les variables d'environnement
- Redéployez le backend

---

## 📞 Besoin d'aide ?

Si vous avez besoin d'aide pour :
- Récupérer vos identifiants MySQL
- Configurer Render
- Déboguer une erreur spécifique

N'hésitez pas à demander !

