# 🚀 Installation Rapide - Cercle Fytli

Guide d'installation en 5 minutes pour déployer l'écosystème social Cercle Fytli.

---

## ✅ Prérequis

- Node.js (v16+)
- MySQL (v8+)
- Base de données Fytli existante
- Frontend et Backend Fytli déjà fonctionnels

---

## 📦 Installation en 4 étapes

### Étape 1 : Migration de la base de données

```bash
cd backend-fytli
mysql -u votre_user -p votre_database < database/migration_social_features.sql
```

Ou via phpMyAdmin/MySQL Workbench : importez `database/migration_social_features.sql`

**Vérification :**
```sql
SHOW TABLES LIKE '%social%';
-- Doit afficher : user_connections, user_feed, social_unlocks
```

---

### Étape 2 : Backend - Vérifier les routes

Le backend est déjà configuré. Démarrez le serveur :

```bash
cd backend-fytli
npm start
```

**Vous devriez voir :**
```
✅ Routes enregistrées avec succès
🤝 Route social disponible sur /social (Cercle Fytli)
🚀 Serveur démarré sur le port 9001
```

**Test rapide :**
```bash
curl http://localhost:9001/
# Doit retourner : "Backend Fytli API - Serveur fonctionnel"
```

---

### Étape 3 : Frontend - Installer les dépendances

```bash
cd frontend-fytli
npm install framer-motion html-to-image
```

**Démarrer le frontend :**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5173`

---

### Étape 4 : Test complet

#### 1. Créer un compte ou se connecter
- Allez sur `http://localhost:5173/login`
- Connectez-vous avec un compte existant

#### 2. Tester le feed (verrouillé)
- Allez sur `http://localhost:5173/feed`
- Vous devriez voir le cercle avec le message "🔒 Bouge pour rallumer ton cercle"

#### 3. Compléter une séance
- Allez sur "Programmes" → Sélectionnez un programme
- Démarrez et complétez une session rapide
- Sur la page de résumé, vous devriez voir "Cercle Fytli déverrouillé !"

#### 4. Vérifier le feed déverrouillé
- Retournez sur `/feed`
- Le cercle devrait être actif ✨
- Ajoutez des amis via "Gérer mes amis"

#### 5. Tester le partage
- Allez sur `/share`
- Générez votre carte du jour
- Testez le téléchargement

---

## 🔧 Configuration optionnelle

### Ajouter un username aux utilisateurs existants

Si vos utilisateurs n'ont pas encore de username :

```sql
-- Générer des usernames automatiques
UPDATE users 
SET username = CONCAT('user_', id) 
WHERE username IS NULL;

-- Ou manuellement pour des utilisateurs spécifiques
UPDATE users 
SET username = 'marie_fit', profile_visibility = 'public' 
WHERE id = 1;
```

### Créer des connexions de test

```sql
-- Ajouter des connexions entre utilisateurs (pour le test)
INSERT INTO user_connections (user_id, friend_id, status) VALUES
(1, 2, 'accepted'),
(2, 1, 'accepted'),
(1, 3, 'accepted'),
(3, 1, 'accepted');
```

### Créer des événements de test

```sql
-- Créer quelques événements dans le feed
INSERT INTO user_feed (user_id, type, message, emoji) VALUES
(2, 'session_completed', 'Marie a terminé sa routine matinale', '🌅'),
(3, 'streak_achieved', 'Paul a atteint 7 jours consécutifs !', '🔥');
```

---

## 🐛 Dépannage

### Erreur "Table doesn't exist"

**Problème :** Les tables sociales n'ont pas été créées.

**Solution :**
```bash
mysql -u root -p
USE votre_database;
SOURCE /chemin/vers/backend-fytli/database/migration_social_features.sql;
```

### Erreur "Cannot find module 'framer-motion'"

**Problème :** Dépendances frontend non installées.

**Solution :**
```bash
cd frontend-fytli
rm -rf node_modules package-lock.json
npm install
npm install framer-motion html-to-image
```

### Feed ne se déverrouille pas

**Problème :** L'appel API échoue.

**Solution :**
1. Vérifiez les logs backend : `backend-fytli/logs/combined-*.log`
2. Vérifiez la console navigateur (F12)
3. Testez l'endpoint manuellement :

```bash
# Remplacez TOKEN par votre JWT
curl -X POST http://localhost:9001/social/feed/unlock \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionCompletionId": 1, "message": "Test", "emoji": "💪"}'
```

### Routes 404

**Problème :** Les routes ne sont pas enregistrées.

**Solution :**
1. Vérifiez que `routes/social.js` existe
2. Vérifiez `index.js` ligne 32 : `const socialRoutes = require('./routes/social');`
3. Vérifiez ligne 131 : `app.use('/social', socialRoutes);`
4. Redémarrez le serveur

---

## 📊 Vérification de l'installation

### Checklist Backend ✓

```bash
# 1. Tables créées
mysql -u root -p -e "USE fytli; SHOW TABLES LIKE '%social%';"
# Doit afficher 3 tables

# 2. Routes actives
curl http://localhost:9001/social/feed/status -H "Authorization: Bearer TOKEN"
# Ne doit pas retourner 404

# 3. Logs sans erreurs
tail -f backend-fytli/logs/combined-*.log
# Pas d'erreurs rouges au démarrage
```

### Checklist Frontend ✓

1. **Page Feed accessible :** `http://localhost:5173/feed` ✓
2. **Page Share accessible :** `http://localhost:5173/share` ✓
3. **Composant CercleFytli s'affiche** (même vide) ✓
4. **Aucune erreur console** (F12) ✓

---

## 🌐 Déploiement en production

### Variables d'environnement

Assurez-vous que votre fichier `.env` de production contient :

```env
# Backend
DATABASE_HOST=votre_host
DATABASE_USER=votre_user
DATABASE_PASSWORD=votre_password
DATABASE_NAME=votre_database
JWT_SECRET=votre_secret

# Frontend (vite.config.ts ou .env)
VITE_API_URL=https://votre-backend.com
```

### Étapes de déploiement

1. **Base de données :**
   - Connectez-vous à votre BDD de production
   - Exécutez `migration_social_features.sql`
   - Vérifiez que les tables sont créées

2. **Backend :**
   - Push votre code sur le serveur
   - `npm install` (si nouvelles deps)
   - Redémarrez le service : `pm2 restart fytli-backend`

3. **Frontend :**
   - Build : `npm run build`
   - Deploy le dossier `dist/` vers votre hébergement
   - Ou push sur Render/Vercel/Netlify

4. **Test production :**
   - Allez sur votre domaine `/feed`
   - Complétez une session
   - Vérifiez le déverrouillage

---

## 📝 Notes importantes

### Permissions MySQL

Si vous utilisez OVH ou un hébergeur avec MySQL restreint :

```sql
-- Certains hébergeurs n'autorisent pas CREATE FUNCTION
-- Si la migration échoue, commentez les procédures/fonctions
-- et gérez le unlock directement via le code Node.js (déjà fait)
```

### Performance

Pour de gros volumes (1000+ utilisateurs actifs) :

```sql
-- Ajouter des index supplémentaires
CREATE INDEX idx_feed_user_created ON user_feed(user_id, created_at);
CREATE INDEX idx_unlocks_date ON social_unlocks(date, unlocked);
```

---

## 🎉 C'est terminé !

Votre écosystème **Cercle Fytli** est maintenant opérationnel.

**Prochaines étapes :**
1. Invitez quelques utilisateurs de test
2. Créez des connexions entre eux
3. Testez le workflow complet
4. Customisez les messages/emojis selon vos besoins

**Ressources :**
- Documentation complète : `CERCLE_FYTLI_GUIDE.md`
- API Endpoints détaillés : voir section API du guide
- Architecture : voir section Architecture du guide

---

## 💬 Besoin d'aide ?

**Logs à vérifier en cas de problème :**
1. Backend : `backend-fytli/logs/error-*.log`
2. Frontend : Console navigateur (F12 → Console)
3. Base de données : Logs MySQL de votre hébergeur

**Commandes de debug utiles :**

```bash
# Vérifier les processus
ps aux | grep node

# Vérifier les ports
lsof -i :9001  # Backend
lsof -i :5173  # Frontend

# Tester la BDD
mysql -u user -p -e "SELECT COUNT(*) FROM user_connections;"
```

---

**Bon développement ! 🚀**

