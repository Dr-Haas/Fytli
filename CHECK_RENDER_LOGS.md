# 🔍 Vérification Logs Render - Erreurs 500

## 🎯 Problème

Erreurs 500 en production (fytli.onrender.com) :
- `POST /body-composition/goals` → 500
- `GET /push/notifications?limit=20` → 500

## 📋 Étapes de diagnostic

### 1️⃣ Vérifier les logs Render

1. Aller sur [Render Dashboard](https://dashboard.render.com)
2. Ouvrir votre service backend `backend-fytli`
3. Onglet **"Logs"**
4. Chercher les erreurs récentes (autour de 13:47)

**Erreurs possibles à chercher :**
```
❌ Table 'lyfti.body_measurements' doesn't exist
❌ Table 'lyfti.body_goals' doesn't exist
❌ ER_NO_SUCH_TABLE
❌ Cannot read property of undefined
❌ Error in bodyCompositionController
```

### 2️⃣ Vérifier les variables d'environnement Render

Dans **"Environment"** sur Render, vérifier :

```env
DB_HOST=hg101756-001.eu.clouddb.ovh.net
DB_PORT=35419
DB_USER=votre_user_ovh
DB_PASSWORD=votre_password_ovh
DB_NAME=lyfti  # ⚠️ IMPORTANT : doit être "lyfti"
```

### 3️⃣ Vérifier le déploiement

- Dernière version déployée : commit `ca1b322` ("feat: objectifs hebdomadaires complets - 6 types supportés")
- Statut : **Deploying** ou **Live** ?

## 🔧 Causes probables

### A. Tables manquantes dans la base OVH ❌

**Symptôme :** Erreur `ER_NO_SUCH_TABLE: Table 'lyfti.body_goals' doesn't exist`

**Solution :**
```bash
# Via phpMyAdmin OVH ou MySQL Workbench
# Exécuter : MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql
```

### B. Mauvais nom de base de données ❌

**Symptôme :** Connexion OK mais tables non trouvées

**Solution :**
```env
# Sur Render, vérifier que DB_NAME=lyfti
DB_NAME=lyfti  # et PAS followSport_app
```

### C. Erreur dans le code backend ❌

**Symptôme :** Stack trace dans les logs Render

**Solution :** Analyser l'erreur et corriger le code

### D. Problème de connexion OVH → Render ❌

**Symptôme :** `ETIMEDOUT`, `ECONNREFUSED`

**Solution :** Vérifier les whitelist IP sur OVH

## 📊 Logs attendus (si tout va bien)

```
✅ Connexion MySQL établie avec succès
🚀 Serveur démarré sur le port 9001
POST /body-composition/goals → 201 Created
GET /push/notifications?limit=20 → 200 OK
```

## 🎯 Actions immédiates

1. **Consulter les logs Render** → Identifier l'erreur exacte
2. **Vérifier les variables d'environnement** → `DB_NAME=lyfti`
3. **Vérifier que la migration a été faite sur OVH** (déjà vérifié ✅)
4. **Redéployer si nécessaire** après correction

---

**Date :** 19 Octobre 2025 13:47  
**Environnement :** Production (Render → OVH)

