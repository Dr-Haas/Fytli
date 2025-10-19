# 🔐 Configuration des Variables d'Environnement - Fytli

Guide pour configurer les variables d'environnement en local et en production.

---

## 📋 Variables nécessaires

### Backend (`backend-fytli`)

```env
NODE_ENV=development|production
PORT=9001
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

---

## 💻 Configuration LOCALE (Développement)

### Créer le fichier `.env` local

```bash
cd backend-fytli
touch .env
```

### Contenu du `.env` pour développement local :

```env
# Configuration Serveur
NODE_ENV=development
PORT=9001

# Base de données locale
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql_local
DB_NAME=fytli_local
DB_PORT=3306

# JWT Secret (générer avec la commande ci-dessous)
JWT_SECRET=01af8cee94dfbbb8f55d3391090ebb4a5be1c182620cc84b1eeba3ed3aa522a9
```

### Générer un JWT_SECRET :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Configuration PRODUCTION (Render + OVH)

### ⚠️ IMPORTANT : Sur Render, NE PAS utiliser de fichier `.env`

Les variables doivent être définies dans **Render Dashboard → Environment**.

### Étapes sur Render :

1. **Aller sur Render Dashboard**
   - https://dashboard.render.com

2. **Sélectionner votre service backend**

3. **Aller dans "Environment"**
   - Dans le menu de gauche

4. **Ajouter les variables suivantes** :

```env
NODE_ENV=production
DB_HOST=recovvkfytli.mysql.db
DB_PORT=3306
DB_USER=recovvkfytli
DB_PASSWORD=FytliApp2025
DB_NAME=recovvkfytli
JWT_SECRET=01af8cee94dfbbb8f55d3391090ebb4a5be1c182620cc84b1eeba3ed3aa522a9
```

5. **Cliquer sur "Save Changes"**

6. **Redéployer** :
   - Manual Deploy → "Deploy latest commit"

---

## 🔍 Vérification

### En local :

```bash
cd backend-fytli
npm run dev
```

**Vous devriez voir** :
```
🔄 Tentative de connexion à MySQL...
   Host: localhost
   User: root
   Database: fytli_local
   Port: 3306
✅ Connexion MySQL établie avec succès
Server running on port 9001
```

### Sur Render :

Dans les logs Render, vous devriez voir :
```
🔄 Tentative de connexion à MySQL...
   Host: recovvkfytli.mysql.db
   User: recovvkfytli
   Database: recovvkfytli
   Port: 3306
✅ Connexion MySQL établie avec succès
Server running on port 10000
```

---

## ❌ Résolution des erreurs

### Erreur : "Variables d'environnement manquantes"

**Cause** : Les variables ne sont pas définies

**Solution** :
- **Local** : Créer le fichier `.env` dans `backend-fytli/`
- **Render** : Définir les variables dans Dashboard → Environment

### Erreur : "[dotenv] injecting env (0) from .env"

**Sur Render** : C'est NORMAL ! Render n'utilise pas de fichier `.env`.
Les variables doivent être dans le Dashboard.

### Erreur : "ENOTFOUND recovvkfytli.mysql.db"

**Cause** : Le serveur MySQL n'est pas trouvé

**Solution** :
- Vérifier que `DB_HOST=recovvkfytli.mysql.db` (pas d'erreur de frappe)
- Vérifier que la base de données est bien créée sur OVH

### Erreur : "ER_ACCESS_DENIED_ERROR"

**Cause** : Mauvais identifiants

**Solution** :
- Vérifier `DB_USER=recovvkfytli`
- Vérifier `DB_PASSWORD=FytliApp2025`
- Vérifier que l'utilisateur a accès à la base

### Erreur : "ECONNREFUSED"

**Cause** : Connexion refusée par MySQL

**Solution OVH** :
1. OVH Manager → Bases de données → recovvkfytli
2. Configuration → Autoriser l'accès depuis
3. Ajouter : `0.0.0.0/0` (toutes les IPs)
4. Sauvegarder

---

## 📊 Configuration Frontend

### Frontend (`frontend-fytli/.env`)

```env
VITE_API_URL=http://localhost:9001
```

### Production (Vercel/Netlify/Render)

```env
VITE_API_URL=https://votre-backend.onrender.com
```

### Admin Panel (`admin-panel/.env`)

```env
VITE_API_URL=http://localhost:9001
```

### Production

```env
VITE_API_URL=https://votre-backend.onrender.com
```

---

## 🔐 Sécurité

### ⚠️ Ne JAMAIS commit les fichiers `.env`

Le `.gitignore` doit contenir :
```
.env
.env.local
.env.production
*.env
```

### ✅ Bonnes pratiques

- ✅ Utiliser des secrets différents pour dev et prod
- ✅ Générer un nouveau JWT_SECRET pour chaque environnement
- ✅ Ne jamais partager les mots de passe
- ✅ Utiliser des variables d'environnement sur les plateformes cloud

---

## 📋 Checklist de déploiement

### Local

- [ ] Fichier `.env` créé dans `backend-fytli/`
- [ ] Toutes les variables définies
- [ ] MySQL local installé et démarré
- [ ] Base de données créée
- [ ] `npm run dev` fonctionne
- [ ] Connexion MySQL réussie

### Render

- [ ] Variables définies dans Dashboard → Environment
- [ ] `DB_HOST=recovvkfytli.mysql.db`
- [ ] `DB_USER=recovvkfytli`
- [ ] `DB_PASSWORD=FytliApp2025`
- [ ] `DB_NAME=recovvkfytli`
- [ ] `JWT_SECRET` défini
- [ ] `NODE_ENV=production`
- [ ] Accès autorisé depuis toutes les IPs sur OVH
- [ ] Service redéployé
- [ ] Logs confirment la connexion MySQL

---

## 🆘 Besoin d'aide ?

1. Vérifier les logs Render pour voir les erreurs exactes
2. Vérifier que toutes les variables sont définies (pas de ✗ MANQUANT)
3. Tester la connexion MySQL depuis votre machine :
   ```bash
   mysql -h recovvkfytli.mysql.db -P 3306 -u recovvkfytli -pFytliApp2025 recovvkfytli
   ```

---

**✨ Une fois configuré, votre backend se connectera automatiquement à la base OVH !**

