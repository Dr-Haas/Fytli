# 🔧 Guide de Configuration de la Base de Données

## 🚨 Problème actuel

**Erreur :** `Access denied for user 'admin'@'176.148.94.73' (using password: YES)`

Cela signifie que la connexion à la base de données OVH échoue. Voici comment résoudre le problème.

---

## ✅ Solution 1 : Utiliser la base de données locale (Recommandé pour le développement)

### Étape 1 : Modifier le fichier `.env`

Ouvrez `backend-fytli/.env` et modifiez ces lignes :

```env
# Base de données LOCALE
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # Laissez vide si pas de mot de passe
DB_NAME=followSport_app
DB_PORT=3306

NODE_ENV=development
```

### Étape 2 : Vérifier que MySQL est démarré en local

```bash
# Sur macOS (Homebrew)
brew services start mysql

# Ou vérifier le statut
brew services list | grep mysql
```

### Étape 3 : Créer la base de données locale si elle n'existe pas

```bash
mysql -u root -p
```

Puis dans MySQL :

```sql
CREATE DATABASE IF NOT EXISTS followSport_app;
USE followSport_app;

-- Les tables seront créées automatiquement par les migrations au démarrage
```

### Étape 4 : Redémarrer le backend

```bash
cd backend-fytli
npm start
```

Les migrations s'exécuteront automatiquement et créeront toutes les tables (y compris les tables sociales du Cercle Fytli).

---

## ✅ Solution 2 : Corriger la connexion à la base OVH (Pour la production)

Si vous voulez absolument utiliser la base OVH, suivez ces étapes :

### Étape 1 : Vérifier les credentials OVH

Connectez-vous au **panneau OVH Cloud** :
1. Allez sur https://www.ovh.com/manager/
2. Section "Web Cloud" → "Cloud Databases"
3. Sélectionnez votre instance `hg101756-001`
4. Vérifiez :
   - **Nom d'utilisateur** : `admin` (ou un autre ?)
   - **Mot de passe** : Réinitialisez-le si nécessaire
   - **IP autorisées** : Vérifiez que votre IP `176.148.94.73` est autorisée

### Étape 2 : Autoriser votre IP

Dans le panneau OVH, section "IP autorisées" :
- Ajoutez votre IP actuelle : `176.148.94.73`
- Ou autorisez toutes les IPs temporairement : `0.0.0.0/0` (⚠️ non recommandé en production)

### Étape 3 : Vérifier le nom de la base

Dans votre `.env`, vérifiez que le nom de la base est correct :
```env
DB_NAME=lyfti   # Ou followSport_app ?
```

### Étape 4 : Tester la connexion manuellement

```bash
mysql -h hg101756-001.eu.clouddb.ovh.net \
      -P 35419 \
      -u admin \
      -p \
      lyfti
```

Si ça fonctionne, le problème vient du mot de passe dans le `.env`.

---

## ✅ Solution 3 : Créer un fichier .env.local pour le dev

Gardez `.env` pour la production OVH et créez `.env.local` pour le développement local :

```bash
cd backend-fytli
cp .env .env.backup

# Créer .env.local
cat > .env.local << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=followSport_app
DB_PORT=3306
NODE_ENV=development
JWT_SECRET=dev_secret_123
FRONTEND_URL=http://localhost:5173
EOF
```

Puis modifiez `index.js` pour charger `.env.local` en priorité :

```javascript
// Au début du fichier index.js
require('dotenv').config({ path: '.env.local' });  // Dev en priorité
require('dotenv').config();                         // Fallback sur .env
```

---

## 🧪 Tester la connexion

Après avoir modifié votre configuration, testez :

```bash
cd backend-fytli
node test-db-connection.js
```

Vous devriez voir :

```
✅ Connexion réussie !
✓ Nombre d'utilisateurs: X
✓ Nombre de programmes: X
✓ Tables sociales trouvées: 3 / 3
  - user_connections
  - user_feed
  - social_unlocks

🎉 Tous les tests sont réussis !
```

---

## 📋 Checklist de vérification

- [ ] MySQL est démarré en local (si local)
- [ ] Le fichier `.env` a les bonnes valeurs
- [ ] L'IP est autorisée sur OVH (si OVH)
- [ ] Le mot de passe est correct
- [ ] La base de données existe
- [ ] `node test-db-connection.js` réussit
- [ ] `npm start` démarre sans erreur

---

## 🆘 Toujours des problèmes ?

### Erreur : `Unknown database 'followSport_app'`

Créez la base :
```sql
CREATE DATABASE followSport_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erreur : `Access denied`

- Vérifiez le mot de passe dans `.env`
- Sur OVH : réinitialisez le mot de passe et autorisez votre IP

### Erreur : `Can't connect to MySQL server`

- Vérifiez que MySQL est démarré : `brew services list`
- Démarrez MySQL : `brew services start mysql`

### Les migrations ne s'exécutent pas

Les migrations s'exécutent automatiquement au démarrage (uniquement en mode `development`).

Si vous êtes en `production`, exécutez manuellement :
```bash
mysql -u root -p followSport_app < database/migration_social_features.sql
```

---

## 💡 Recommandation

**Pour le développement local**, utilisez une base de données locale. C'est plus rapide, plus stable et vous évite les problèmes de connexion à distance.

**Pour la production**, utilisez OVH avec un `.env` de production différent.

---

**Besoin d'aide ?** Vérifiez les logs dans `backend-fytli/logs/error-*.log`

