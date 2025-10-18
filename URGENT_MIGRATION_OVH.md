# ⚠️ MIGRATION URGENTE À EXÉCUTER SUR OVH

## 🚨 Problème actuel

Le Dashboard ne fonctionne pas car :
1. ❌ La colonne `badge_id` n'existe pas dans la table `badges`
2. ❌ Les utilisateurs ne sont pas inscrits aux programmes
3. ❌ Les sessions n'ont pas d'exercices
4. ❌ Les utilisateurs n'ont pas de badges

## ✅ Solution : Exécuter 2 scripts SQL

### Script 1 : MIGRATION_FIX_PROD_DATABASE.sql (Structure)

Ce script ajoute les colonnes manquantes et corrige les noms de colonnes.

**À faire** :
1. Allez sur phpMyAdmin OVH
2. Sélectionnez votre base de données Fytli
3. Cliquez sur "SQL"
4. Copiez-collez **TOUT** le contenu de `MIGRATION_FIX_PROD_DATABASE.sql`
5. Cliquez sur "Exécuter"

**Ce script va** :
- ✅ Ajouter `badge_id`, `gradient`, `requirement`, `is_secret` dans la table `badges`
- ✅ Créer la table `badge_progress`
- ✅ Renommer `order` → `order_index` dans `sessions` et `session_exercises`
- ✅ Ajouter l'exercice "Marche en pente"

### Script 2 : ATTRIBUTION_BADGES_SESSIONS.sql (Données)

Ce script remplit la base avec des données de test.

**À faire (APRÈS le script 1)** :
1. Toujours sur phpMyAdmin OVH
2. Onglet "SQL"
3. Copiez-collez **TOUT** le contenu de `ATTRIBUTION_BADGES_SESSIONS.sql`
4. Cliquez sur "Exécuter"

**Ce script va** :
- ✅ Inscrire les utilisateurs 1, 2, 3, 4 aux programmes
- ✅ Attribuer des badges aux utilisateurs
- ✅ Ajouter des exercices aux sessions
- ✅ Créer des données de test

## 🔍 Vérifications après migration

Après avoir exécuté les 2 scripts, vérifiez dans phpMyAdmin :

```sql
-- Vérifier les colonnes de badges
DESCRIBE badges;
-- Doit montrer : id, badge_id, name, description, icon, color, gradient, requirement, is_secret, points

-- Vérifier les inscriptions
SELECT * FROM enrollments;
-- Doit montrer 5 inscriptions (users 1-4)

-- Vérifier les badges attribués
SELECT COUNT(*) FROM user_badges;
-- Doit montrer au moins 10 badges

-- Vérifier les exercices des sessions
SELECT COUNT(*) FROM session_exercises;
-- Doit montrer au moins 10 exercices
```

## 📦 Redéploiement Render

Après avoir exécuté les scripts SQL :

1. Push les changements vers GitHub :
   ```bash
   git push origin main
   ```

2. Attendre ~2-3 minutes que Render redéploie

3. Tester le Dashboard sur `http://localhost:5174/dashboard`

## ✅ Checklist complète

- [ ] Exécuter `MIGRATION_FIX_PROD_DATABASE.sql` sur OVH
- [ ] Exécuter `ATTRIBUTION_BADGES_SESSIONS.sql` sur OVH
- [ ] Vérifier que les colonnes existent (DESCRIBE badges)
- [ ] Vérifier qu'il y a des inscriptions (SELECT * FROM enrollments)
- [ ] Push vers GitHub (`git push origin main`)
- [ ] Attendre redéploiement Render
- [ ] Tester Dashboard : programmes actifs visibles ?
- [ ] Tester Dashboard : agenda de la semaine visible ?
- [ ] Tester Dashboard : badges récents visibles ?

## 🆘 En cas de problème

Si vous voyez encore des erreurs après migration :

1. Vérifiez les logs Render pour voir quelle erreur SQL précise
2. Vérifiez dans phpMyAdmin que toutes les colonnes existent
3. Ouvrez la console du navigateur (F12) et regardez les logs `🔍 Dashboard`
4. Copiez-moi les erreurs exactes

## 💡 Pourquoi ces scripts ?

- Le script de **migration** ajoute les colonnes nécessaires que l'application attend
- Le script **d'attribution** remplit la DB avec des données de test réalistes
- Sans ces scripts, l'application ne peut pas fonctionner car elle attend des colonnes qui n'existent pas

**⚠️ IMPORTANT** : Les scripts utilisent `ON DUPLICATE KEY UPDATE` donc ils peuvent être exécutés plusieurs fois sans problème.

