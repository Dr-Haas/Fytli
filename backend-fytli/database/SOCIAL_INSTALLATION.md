# Installation du Système Social - Cercle Fytli

Ce document explique comment installer et configurer le système social (Cercle Fytli) dans votre base de données.

## 📋 Vue d'ensemble

Le système social permet aux utilisateurs de :
- Se connecter avec des amis
- Voir un feed des activités de leurs amis
- Déverrouiller le feed en complétant une séance quotidienne
- Maintenir un streak d'activité
- Partager leurs réalisations

## 🗄️ Tables créées

1. **connections** - Gestion des connexions entre utilisateurs (amis)
2. **feed_events** - Événements du feed social (séances, badges, etc.)
3. **feed_unlocks** - Déverrouillages quotidiens du feed
4. **users** (modifié) - Ajout de colonnes sociales (username, avatar_url, profile_visibility)

## 📦 Installation

### Option 1 : Via MySQL Workbench ou phpMyAdmin

1. Connectez-vous à votre base de données
2. Ouvrez le fichier `social_system.sql`
3. Exécutez le script complet

### Option 2 : Via ligne de commande

```bash
# Connectez-vous à votre base de données
mysql -u [username] -p [database_name] < backend-fytli/database/social_system.sql
```

Remplacez :
- `[username]` par votre nom d'utilisateur MySQL
- `[database_name]` par le nom de votre base de données

### Option 3 : Via Node.js (script automatique)

Un script Node.js est fourni pour automatiser l'installation :

```bash
cd backend-fytli
node database/installSocial.js
```

## ✅ Vérification

Pour vérifier que tout est installé correctement, exécutez :

```sql
-- Vérifier les tables
SHOW TABLES LIKE '%connection%';
SHOW TABLES LIKE '%feed%';

-- Vérifier les colonnes ajoutées à users
DESCRIBE users;
```

Vous devriez voir :
- Table `connections`
- Table `feed_events`
- Table `feed_unlocks`
- Colonnes `username`, `avatar_url`, `profile_visibility` dans la table `users`

## 🔧 Configuration backend

Les fichiers suivants ont été créés/modifiés :

1. **models/socialModel.js** - Modèle pour les requêtes SQL
2. **controllers/socialController.js** - Logique métier
3. **routes/social.js** - Routes API
4. **index.js** - Enregistrement des routes (ligne 32 et 131)

## 🚀 Endpoints disponibles

Une fois installé, les endpoints suivants sont disponibles :

### Connexions
- `GET /social/connections` - Liste des amis
- `POST /social/connections/add` - Ajouter un ami
- `POST /social/connections/accept` - Accepter une demande
- `DELETE /social/connections/:friendId` - Supprimer un ami
- `GET /social/search?q=query` - Rechercher des utilisateurs

### Feed
- `GET /social/feed` - Récupérer le feed
- `POST /social/feed/unlock` - Déverrouiller le feed
- `GET /social/feed/status` - Statut du feed
- `GET /social/circle` - Stats du cercle

### Profil
- `GET /social/profile/:username` - Profil public

### Partage
- `GET /social/share/card` - Données de partage

## 📝 Notes importantes

1. **Usernames** : Les utilisateurs existants n'auront pas de username. Vous devrez :
   - Soit générer des usernames automatiquement
   - Soit demander aux utilisateurs de choisir un username à la connexion

2. **Compatibilité** : Le script utilise `ADD COLUMN IF NOT EXISTS` qui est compatible avec MySQL 8.0+. Pour les versions antérieures, vous devrez peut-être adapter le script.

3. **Données existantes** : Le script ne supprime aucune donnée existante. Il ajoute uniquement de nouvelles tables et colonnes.

## 🔄 Migration des utilisateurs

Si vous avez des utilisateurs existants, exécutez ce script pour générer des usernames :

```sql
-- Générer des usernames basés sur email
UPDATE users 
SET username = CONCAT(
  SUBSTRING_INDEX(email, '@', 1),
  '_',
  id
)
WHERE username IS NULL;
```

## ❓ Dépannage

### Erreur "Table already exists"
C'est normal, le script utilise `IF NOT EXISTS` pour éviter les erreurs. La table existante est conservée.

### Erreur "Column already exists"
Idem, `IF NOT EXISTS` protège contre cette erreur.

### Erreur "Foreign key constraint fails"
Assurez-vous que :
- La table `users` existe
- La table `session_completions` existe
- Les données référencées existent

## 📞 Support

Pour toute question ou problème, consultez la documentation complète dans `backend-fytli/docs/endpoints.md`.

