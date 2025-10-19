# 🗄️ Configuration Base de Données - FYTLI

## ⚠️ INFORMATION IMPORTANTE

**NOM DE LA BASE DE DONNÉES : `lyfti`** (et NON `followSport_app` ou `followsport_app`)

---

## 📋 Configurations par environnement

### 🏠 Développement Local

```bash
Host: localhost
User: root
Database: lyfti
Port: 3306
```

**Commande de connexion :**
```bash
mysql -u root -p lyfti
```

**Variables d'environnement (.env local) :**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=lyfti
DB_PORT=3306
```

---

### 🌐 Production (OVH)

```bash
Host: lyfti.mysql.db (à vérifier dans votre panel OVH)
User: votre_user_ovh
Database: lyfti
Port: 3306
```

**Variables d'environnement (.env production) :**
```env
DB_HOST=lyfti.mysql.db
DB_USER=votre_user_ovh
DB_PASSWORD=votre_mot_de_passe_ovh
DB_NAME=lyfti
DB_PORT=3306
```

---

### 🚀 Render (si utilisé)

Configuré via les variables d'environnement du dashboard Render.

---

## 🔧 Commandes SQL Courantes

### Se connecter

```bash
# Local
mysql -u root -p lyfti

# Ou via MySQL Workbench/Sequel Ace
# Database: lyfti
```

### Vérifier les tables

```sql
USE lyfti;
SHOW TABLES;
```

### Exécuter une migration

```bash
# Local
mysql -u root -p lyfti < nom_de_la_migration.sql

# Production OVH (via phpMyAdmin)
# 1. Ouvrir phpMyAdmin
# 2. Sélectionner la base "lyfti"
# 3. Onglet SQL
# 4. Copier-coller le contenu de la migration
# 5. Exécuter
```

---

## 📊 Tables Principales

Voici les principales tables de la base `lyfti` :

### Utilisateurs et Auth
- `users` - Utilisateurs
- `user_badges` - Badges débloqués
- `user_notification_reads` - Notifications lues
- `user_stats` - Statistiques utilisateurs

### Programmes et Sessions
- `programs` - Programmes d'entraînement
- `sessions` - Sessions des programmes
- `session_exercises` - Exercices des sessions
- `session_completions` - Sessions complétées
- `enrollments` - Inscriptions aux programmes

### Composition Corporelle ⭐ NOUVEAU
- `body_measurements` - Mesures corporelles
- `body_goals` - Objectifs corporels
- `body_progress_photos` - Photos de progression

### Badges et Gamification
- `badges` - Badges disponibles
- `weekly_goals` - Objectifs hebdomadaires
- `workout_history` - Historique d'entraînements

### Notifications
- `notification_logs` - Logs de notifications
- `notification_preferences` - Préférences utilisateurs
- `push_subscriptions` - Abonnements push

### Autres
- `categories` - Catégories d'exercices
- `exercises` - Bibliothèque d'exercices

---

## 🔍 Vérifications Rapides

### Vérifier que la base est correcte

```sql
SELECT DATABASE();
-- Résultat attendu: lyfti
```

### Compter les utilisateurs

```sql
SELECT COUNT(*) as total_users FROM users;
```

### Vérifier les tables de composition corporelle

```sql
SHOW TABLES LIKE 'body_%';
-- Devrait afficher:
-- body_measurements
-- body_goals
-- body_progress_photos
```

---

## 💡 Notes Importantes

1. **Nom de base unique** : `lyfti` partout (local, production, tests)
2. **Encodage** : utf8mb4_unicode_ci
3. **Engine** : InnoDB
4. **Timezone** : UTC pour les TIMESTAMP

---

## 📝 Historique des migrations

### Composition Corporelle (19 Oct 2025)
- ✅ `MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql`
- Tables créées : body_measurements, body_goals, body_progress_photos
- 14 nouveaux badges ajoutés

### Notifications (précédent)
- ✅ `MIGRATION_NOTIFICATION_READ_STATUS_NO_FUNCTION.sql`
- Table créée : user_notification_reads

### Objectifs Hebdomadaires
- ✅ `MIGRATION_WEEKLY_GOALS_UPDATE.sql`
- Table créée : weekly_goals

---

**⚠️ RAPPEL : Le nom de la base est `lyfti` et NON `followSport_app` !**

---

**Date de création :** 19 Octobre 2025  
**Dernière mise à jour :** 19 Octobre 2025

