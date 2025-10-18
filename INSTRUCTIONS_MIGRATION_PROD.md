# 🔧 Instructions de Migration - Base de Données Production

**Date**: 18 Octobre 2025  
**Problèmes identifiés**: 
- ❌ Table `badge_progress` manquante
- ❌ Colonne `badge_id` manquante dans table `badges`
- ❌ Colonnes `gradient`, `requirement`, `is_secret` manquantes dans table `badges`
- ❌ Code backend utilise `ORDER BY order` au lieu de `ORDER BY order_index`

## 📋 Étapes de migration

### 1. Corriger le backend (✅ DÉJÀ FAIT)

Les fichiers suivants ont été corrigés :
- ✅ `backend-fytli/models/sessionsModel.js` - Utilise maintenant `order_index`
- ✅ `backend-fytli/models/badgesModel.js` - Déjà correct pour la nouvelle structure

### 2. Exécuter la migration SQL sur la base OVH (⚠️ À FAIRE)

**Option A - Via phpMyAdmin (Recommandé)** :
1. Connectez-vous à votre phpMyAdmin OVH
2. Sélectionnez votre base de données Fytli
3. Cliquez sur l'onglet **"SQL"**
4. Ouvrez le fichier `MIGRATION_FIX_PROD_DATABASE.sql`
5. Copiez tout le contenu
6. Collez-le dans l'éditeur SQL de phpMyAdmin
7. Cliquez sur **"Exécuter"**

**Option B - Via MySQL CLI** :
```bash
mysql -h votre-serveur-ovh.mysql.db -u votre-user -p votre-database < MIGRATION_FIX_PROD_DATABASE.sql
```

### 3. Redéployer le backend sur Render (⚠️ À FAIRE APRÈS L'ÉTAPE 2)

Une fois la migration SQL exécutée :

```bash
cd backend-fytli
git add .
git commit -m "fix: Correction requêtes SQL pour sessions et badges"
git push
```

Render redéploiera automatiquement le backend avec les corrections.

### 4. Vérifier que tout fonctionne

Une fois le backend redéployé :
1. Rafraîchir la page frontend (F5)
2. Vérifier que les programmes s'affichent correctement
3. Vérifier qu'on peut créer un nouveau programme
4. Vérifier que l'exercice "Marche en pente" apparaît dans la liste

## 📊 Ce que fait la migration

### Modifications de la table `badges` :
- ➕ Ajoute colonne `badge_id` (identifiant unique texte)
- ➕ Ajoute colonne `gradient` (pour les couleurs frontend)
- ➕ Ajoute colonne `requirement` (description du critère)
- ➕ Ajoute colonne `is_secret` (badges cachés)
- 🔄 Remplit `badge_id` pour les 10 badges existants
- 🔄 Remplit `gradient` et `requirement` pour tous les badges

### Création de la table `badge_progress` :
```sql
CREATE TABLE badge_progress (
  id INT PRIMARY KEY,
  user_id INT,
  badge_id VARCHAR(50),
  progress_percent INT,
  updated_at TIMESTAMP
)
```

### Ajout de l'exercice :
- ➕ Ajoute "Marche en pente" dans la table `exercises`

## ⚠️ Important

**NE PAS** exécuter cette migration plusieurs fois ! Elle contient des `ADD COLUMN IF NOT EXISTS` pour éviter les erreurs, mais il est préférable de ne l'exécuter qu'une seule fois.

## 🔍 Vérification post-migration

Après la migration, vous pouvez exécuter ces requêtes pour vérifier :

```sql
-- Vérifier la structure de badges
DESCRIBE badges;

-- Vérifier que badge_progress existe
DESCRIBE badge_progress;

-- Vérifier les badges
SELECT badge_id, name, gradient FROM badges;

-- Vérifier l'exercice
SELECT * FROM exercises WHERE name = 'Marche en pente';
```

## 🆘 En cas de problème

Si quelque chose ne fonctionne pas après la migration :
1. Vérifiez les logs Render : https://dashboard.render.com
2. Vérifiez la structure des tables dans phpMyAdmin
3. Contactez-moi avec les messages d'erreur exacts

