# 📘 Installation du Feed Social sur OVH CloudDB

## 📁 Fichier SQL à utiliser

**Fichier** : `backend-fytli/database/social_system_ovh.sql`

Ce fichier contient :
- ✅ 3 nouvelles tables (connections, feed_events, feed_unlocks)
- ✅ 3 colonnes ajoutées à la table users (username, avatar_url, profile_visibility)

## 🚀 Installation sur OVH CloudDB

### Méthode 1 : Via phpMyAdmin (Recommandé)

1. **Connectez-vous à phpMyAdmin OVH**
   - URL : https://phpmyadmin.hosting.ovh.net
   - Ou via votre espace client OVH → Web Cloud → CloudDB

2. **Sélectionnez votre base de données**
   - Cliquez sur `lyfti` dans la colonne de gauche

3. **Onglet SQL**
   - Cliquez sur l'onglet "SQL" en haut

4. **Copier-coller le contenu**
   - Ouvrez le fichier `backend-fytli/database/social_system_ovh.sql`
   - Copiez TOUT le contenu
   - Collez dans la zone de texte phpMyAdmin

5. **Exécuter**
   - Cliquez sur "Exécuter" en bas à droite
   - ⚠️ **Important** : Si vous voyez des erreurs "Duplicate column", c'est NORMAL
   - Les colonnes existent déjà, continuez !

### Méthode 2 : Via MySQL Workbench

1. **Ouvrir MySQL Workbench**
2. **Se connecter à OVH CloudDB**
   - Host : `hg101756-001.eu.clouddb.ovh.net`
   - Port : `35419`
   - User : `admin`
   - Database : `lyfti`

3. **Ouvrir un nouvel onglet SQL**
   - File → Open SQL Script
   - Sélectionner `backend-fytli/database/social_system_ovh.sql`

4. **Exécuter**
   - Cliquer sur l'icône ⚡ (Execute)

### Méthode 3 : Via ligne de commande

```bash
mysql -h hg101756-001.eu.clouddb.ovh.net \
      -P 35419 \
      -u admin \
      -p lyfti < backend-fytli/database/social_system_ovh.sql
```

## ⚠️ Gestion des erreurs

### Erreur "Duplicate column name"
```
ERROR 1060 (42S21): Duplicate column name 'username'
```
**✅ C'est normal !** Cela signifie que la colonne existe déjà. Continuez l'exécution.

### Erreur "Table already exists"
```
ERROR 1050 (42S01): Table 'connections' already exists
```
**✅ C'est normal !** Le script utilise `IF NOT EXISTS` donc les tables existantes sont conservées.

### Erreur "Cannot add foreign key constraint"
```
ERROR 1215 (HY000): Cannot add foreign key constraint
```
**❌ Problème !** Assurez-vous que :
- La table `users` existe
- La table `session_completions` existe
- Les colonnes référencées existent

## ✅ Vérification de l'installation

Après avoir exécuté le script, vérifiez avec ces requêtes :

```sql
-- Vérifier les nouvelles tables
SHOW TABLES LIKE '%connection%';
SHOW TABLES LIKE '%feed%';

-- Vérifier les colonnes de users
DESCRIBE users;

-- Compter les connexions (devrait être 0 au début)
SELECT COUNT(*) FROM connections;
SELECT COUNT(*) FROM feed_events;
SELECT COUNT(*) FROM feed_unlocks;
```

Résultat attendu :
```
connections     → 0 rows
feed_events     → 0 rows  
feed_unlocks    → 0 rows
```

## 🔧 Générer les usernames pour utilisateurs existants

Si vous avez déjà des utilisateurs dans la base, générez leurs usernames :

```sql
UPDATE users 
SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
WHERE username IS NULL;
```

Exemple :
- Email : `gary@example.com` (id=1) → Username : `gary_1`
- Email : `marie@test.fr` (id=5) → Username : `marie_5`

## 🎯 Vérification finale

Une fois l'installation terminée, testez l'API :

```bash
# Depuis votre machine locale
curl -H "Authorization: Bearer VOTRE_TOKEN" \
     https://fytli.onrender.com/social/feed/status
```

Réponse attendue :
```json
{
  "success": true,
  "unlocked": false,
  "streak": 0,
  "total_days": 0
}
```

## 📊 Tables créées

| Table | Description | Colonnes principales |
|-------|-------------|---------------------|
| `connections` | Connexions entre utilisateurs (amis) | user_id, friend_id, status |
| `feed_events` | Événements du feed social | user_id, type, message, emoji |
| `feed_unlocks` | Déverrouillages quotidiens | user_id, unlocked_date, streak |
| `users` (modifié) | Profils utilisateurs enrichis | + username, avatar_url, profile_visibility |

## 🚨 En cas de problème

### Rollback (Annuler les modifications)

Si vous voulez tout supprimer :

```sql
-- ⚠️ ATTENTION : Cela supprime TOUTES les données sociales !
DROP TABLE IF EXISTS feed_unlocks;
DROP TABLE IF EXISTS feed_events;
DROP TABLE IF EXISTS connections;

-- Supprimer les colonnes ajoutées à users
ALTER TABLE users DROP COLUMN username;
ALTER TABLE users DROP COLUMN avatar_url;
ALTER TABLE users DROP COLUMN profile_visibility;
```

### Réinstallation propre

1. Exécutez le rollback ci-dessus
2. Re-exécutez le script `social_system_ovh.sql`

## 📞 Support

Si vous rencontrez des erreurs :
1. Notez le message d'erreur exact
2. Vérifiez la version MySQL : `SELECT VERSION();`
3. Vérifiez les tables existantes : `SHOW TABLES;`

---

**✅ Une fois l'installation terminée, le backend reconnaîtra automatiquement les nouvelles tables et les routes `/social/*` fonctionneront !**

