# 🚀 Guide d'installation rapide - Feed Social

## 🎯 Résumé du problème

Le feed social dans `frontend-fytli` ne fonctionnait pas car les routes `/social/*` n'existaient pas dans le backend. 

## ✅ Corrections effectuées

### Fichiers créés
1. ✅ `backend-fytli/models/socialModel.js` - Modèle de données
2. ✅ `backend-fytli/controllers/socialController.js` - Contrôleur
3. ✅ `backend-fytli/routes/social.js` - Routes API
4. ✅ `backend-fytli/database/social_system.sql` - Tables SQL
5. ✅ `backend-fytli/database/installSocial.js` - Script d'installation
6. ✅ `backend-fytli/index.js` - Routes enregistrées

### Tables à créer
- `connections` - Connexions entre utilisateurs
- `feed_events` - Événements du feed
- `feed_unlocks` - Déverrouillages quotidiens
- `users` - Colonnes ajoutées (username, avatar_url, profile_visibility)

## 📝 Installation en 3 étapes

### 1️⃣ Installer les tables

```bash
cd backend-fytli
node database/installSocial.js
```

### 2️⃣ Générer les usernames (optionnel si vous avez déjà des utilisateurs)

Connectez-vous à votre base MySQL et exécutez :

```sql
UPDATE users 
SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
WHERE username IS NULL;
```

### 3️⃣ Redémarrer le backend

```bash
cd backend-fytli
npm start
```

Vérifiez dans les logs :
```
✅ Routes enregistrées avec succès
👥 Route social disponible sur /social
```

## ✨ C'est tout !

Le frontend est déjà configuré. Une fois le backend redémarré, tout fonctionnera automatiquement.

## 🧪 Test rapide

Dans votre navigateur, allez sur :
- `http://localhost:5173/feed` (frontend)

Ou testez l'API :
```bash
curl http://localhost:9001/social/feed/status \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 📱 Pour mobilApp-fytli

Le dossier `mobilApp-fytli` est vide pour le moment. Quand vous développerez l'app mobile :

1. Copiez le service API :
```bash
cp frontend-fytli/src/services/socialService.ts \
   mobilApp-fytli/src/services/
```

2. Les mêmes endpoints fonctionneront !

## 📚 Documentation complète

Pour plus de détails, consultez :
- `CORRECTION_FEED_SOCIAL.md` - Documentation complète
- `backend-fytli/database/SOCIAL_INSTALLATION.md` - Guide d'installation détaillé

## ❓ Problèmes ?

### Le feed ne charge pas
→ Vérifiez que le backend est bien redémarré

### Erreur "Table doesn't exist"
→ Exécutez `node database/installSocial.js`

### Le feed est verrouillé
→ C'est normal ! Complétez une séance pour le déverrouiller

---

**Bon développement ! 🎉**

