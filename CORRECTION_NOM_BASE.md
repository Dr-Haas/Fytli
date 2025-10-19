# ⚠️ CORRECTION IMPORTANTE - Nom de la base de données

## 🎯 Information Cruciale

**LE NOM CORRECT DE LA BASE DE DONNÉES EST : `lyfti`**

❌ **PAS** `followSport_app`  
❌ **PAS** `followsport_app`  
✅ **OUI** `lyfti`

---

## 📝 Corrections apportées

Tous les fichiers de documentation ont été mis à jour avec le bon nom de base de données :

### ✅ Fichiers corrigés

1. **`DATABASE_CONFIG.md`** ⭐ NOUVEAU
   - Fichier de référence centralisé
   - Configuration complète Local/Production
   - Commandes avec le bon nom de base

2. **`INSTALLATION_BODY_COMPOSITION_OVH.md`**
   - Commandes MySQL mises à jour
   - Nom de base corrigé

3. **`BODY_COMPOSITION_SETUP.md`**
   - Commandes de migration corrigées
   - Avertissement ajouté

---

## 🔧 Commandes Correctes

### Connexion MySQL

```bash
# ✅ CORRECT
mysql -u root -p lyfti

# ❌ INCORRECT
mysql -u root -p followSport_app
```

### Migration SQL

```bash
# ✅ CORRECT - Local
mysql -u root -p lyfti < MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql

# ✅ CORRECT - Production OVH
mysql -u votre_user -p lyfti < MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql

# ❌ INCORRECT
mysql -u root -p followSport_app < migration.sql
```

### Vérification

```sql
-- ✅ CORRECT
USE lyfti;
SELECT DATABASE();

-- ❌ INCORRECT
USE followSport_app;
```

---

## 📂 Fichier de Référence

**Consultez toujours `DATABASE_CONFIG.md`** pour les informations de configuration de la base de données !

Ce fichier contient :
- ✅ Le nom correct de la base : **`lyfti`**
- ✅ Configuration Local/Production
- ✅ Toutes les commandes courantes
- ✅ Liste des tables
- ✅ Commandes de vérification

---

## 💡 Rappel

Partout dans le code et la documentation :
- Variables d'environnement : `DB_NAME=lyfti`
- Connexions MySQL : `USE lyfti;`
- Migrations : `mysql -u user -p lyfti < migration.sql`

**Ne plus jamais utiliser `followSport_app` !**

---

**Date :** 19 Octobre 2025  
**Status :** ✅ Corrigé et documenté

