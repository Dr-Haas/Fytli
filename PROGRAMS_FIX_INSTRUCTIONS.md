# 🔧 Correction : Création de programmes

## 📋 Problèmes résolus

### 1. Incompatibilité Frontend ↔️ Backend
- ❌ **Avant** : Le frontend envoyait `title` mais le backend attendait `name`
- ✅ **Après** : Le backend accepte maintenant `title` directement

### 2. Niveaux de difficulté en français
- ❌ **Avant** : Le backend n'acceptait que "beginner", "intermediate", "advanced"
- ✅ **Après** : Support complet français + anglais
  - "débutant" → "beginner"
  - "intermédiaire" → "intermediate"
  - "avancé" → "advanced"

### 3. Champs manquants dans la base de données
- ❌ **Avant** : Les champs `sessions_per_week`, `category_id`, `is_public` n'existaient pas
- ✅ **Après** : Migration SQL créée pour ajouter ces champs

## 🚀 Étapes à suivre

### Étape 1 : Exécuter la migration SQL

1. Ouvrez **MySQL Workbench**
2. Connectez-vous à votre base de données Fytli
3. Ouvrez le fichier `MIGRATION_ADD_PROGRAMS_FIELDS.sql`
4. Exécutez toutes les commandes (Ctrl+Shift+Enter ou Cmd+Shift+Enter)

```sql
-- La migration ajoutera :
ALTER TABLE programs ADD COLUMN sessions_per_week INT DEFAULT 3;
ALTER TABLE programs ADD COLUMN category_id INT NULL;
ALTER TABLE programs ADD COLUMN is_public TINYINT(1) DEFAULT 1;
-- + contraintes et index
```

### Étape 2 : Redémarrer le serveur backend

```bash
cd backend-fytli
npm start
```

Ou si vous utilisez nodemon :
```bash
npm run dev
```

### Étape 3 : Tester la création de programmes

1. Accédez à votre admin panel
2. Cliquez sur "Programmes" dans le menu
3. Cliquez sur "Nouveau programme"
4. Remplissez le formulaire :
   - **Titre** : "Test Programme"
   - **Description** : "Description de test"
   - **Difficulté** : Débutant
   - **Durée** : 4 semaines
   - **Sessions/sem** : 3
   - **Programme public** : ✓
5. Cliquez sur "Créer"

## ✅ Vérification

Après avoir suivi ces étapes, vous devriez pouvoir :
- ✅ Créer des programmes avec tous les champs
- ✅ Utiliser les niveaux en français (débutant, intermédiaire, avancé)
- ✅ Définir le nombre de sessions par semaine
- ✅ Associer un programme à une catégorie
- ✅ Définir si le programme est public ou privé

## 🔄 Rollback (en cas de problème)

Si vous devez annuler la migration, exécutez cette commande SQL :

```sql
ALTER TABLE programs DROP FOREIGN KEY fk_programs_category;
ALTER TABLE programs DROP INDEX idx_category_id;
ALTER TABLE programs DROP COLUMN category_id;
ALTER TABLE programs DROP INDEX idx_is_public;
ALTER TABLE programs DROP COLUMN is_public;
ALTER TABLE programs DROP COLUMN sessions_per_week;
```

## 📝 Modifications apportées

### Fichiers modifiés :
1. ✅ `backend-fytli/controllers/programsController.js`
   - Fonction `create()` : accepte `title` et mapping français
   - Fonction `update()` : mapping français et support nouveaux champs

2. ✅ `backend-fytli/models/programsModel.js`
   - Fonction `create()` : ajout de `sessions_per_week`, `category_id`, `is_public`
   - Fonction `update()` : ajout de la gestion des nouveaux champs

3. ✅ `MIGRATION_ADD_PROGRAMS_FIELDS.sql`
   - Nouveau fichier de migration

## 📊 Structure de la table programs (après migration)

```sql
programs:
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── title (VARCHAR(255)) ← utilisé par le frontend
├── description (TEXT)
├── level (ENUM: 'beginner', 'intermediate', 'advanced')
├── duration_weeks (INT)
├── goal (TEXT)
├── sessions_per_week (INT) ← NOUVEAU
├── category_id (INT, FK → categories) ← NOUVEAU
├── is_public (TINYINT(1)) ← NOUVEAU
├── image_url (VARCHAR(500))
├── created_by (INT, FK → users)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 💡 Notes importantes

- Les programmes existants auront automatiquement :
  - `sessions_per_week = 3` (valeur par défaut)
  - `is_public = 1` (public par défaut)
  - `category_id = NULL` (aucune catégorie)

- La colonne `category_id` est optionnelle (peut être NULL)
- La clé étrangère est configurée avec `ON DELETE SET NULL`
  - Si une catégorie est supprimée, les programmes associés ne seront pas supprimés
  - Leur `category_id` sera simplement mis à NULL

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que la migration SQL s'est bien exécutée : `DESC programs;`
2. Vérifiez les logs du backend pour voir les erreurs
3. Vérifiez la console du navigateur (F12) pour voir les erreurs frontend
4. Assurez-vous que le backend est bien redémarré après les modifications

