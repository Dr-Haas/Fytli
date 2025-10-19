# 🧪 Guide de Test des Notifications - Backend Connecté

## 🎯 Ce qui a changé

**AVANT** : Les notifications étaient des fausses données (mockées)
**MAINTENANT** : Les notifications viennent de la vraie base de données ! 🎉

## 📝 Étapes de Test

### Étape 1 : Migration SQL ✅

Exécute les 2 fichiers de migration dans cet ordre :

```bash
# 1. Migration pour les notifications (si pas déjà fait)
mysql -u ton_user -p ta_database < MIGRATION_PUSH_NOTIFICATIONS_SAFE.sql

# 2. Migration pour le statut lu/non lu (VERSION SANS FONCTION pour OVH)
mysql -u ton_user -p ta_database < MIGRATION_NOTIFICATION_READ_STATUS_NO_FUNCTION.sql
```

⚠️ **Important** : Utilise bien `MIGRATION_NOTIFICATION_READ_STATUS_NO_FUNCTION.sql`
(pas `MIGRATION_NOTIFICATION_READ_STATUS.sql` qui ne fonctionne pas sur OVH)

### Étape 2 : Insérer des notifications de test 📊

```bash
# Édite d'abord le fichier pour mettre ton user ID
nano TEST_NOTIFICATIONS_INSERT.sql
# Change cette ligne : SET @test_user_id = 1;  (mets ton vrai ID)

# Puis exécute le script
mysql -u ton_user -p ta_database < TEST_NOTIFICATIONS_INSERT.sql
```

Ce script va créer 7 notifications de test :
- 💪 Session complétée (il y a 10 min)
- 🏆 Badge débloqué (il y a 2h)
- ⏰ Rappel d'entraînement (il y a 5h)
- 🎯 Objectif hebdomadaire (il y a 1 jour)
- ✨ Motivation quotidienne (il y a 2 jours)
- 🚀 Nouveau programme (il y a 3 jours)
- 🔔 Mise à jour app (il y a 5 jours)

### Étape 3 : Redémarrer le Backend 🔄

```bash
cd backend-fytli
# Si tu utilises pm2
pm2 restart fytli-backend

# Ou si tu lances manuellement
npm start
```

### Étape 4 : Ouvrir l'Application 📱

1. **Ouvre l'app Fytli dans ton navigateur**
2. **Connecte-toi avec le compte dont tu as utilisé l'ID**
3. **Regarde en haut à gauche** → Tu devrais voir la cloche 🔔 avec un badge rouge "7"

### Étape 5 : Tester les Fonctionnalités ✨

#### Test 1 : Voir les notifications
- Clique sur la cloche 🔔
- Tu dois voir les 7 notifications de test
- Les non lues ont un point orange 🟠

#### Test 2 : Marquer une notification comme lue
- Clique sur une notification
- Le point orange disparaît
- Le compteur se met à jour (7 → 6)

#### Test 3 : Marquer toutes comme lues
- Clique sur "Tout marquer lu"
- Tous les points orange disparaissent
- Le badge rouge sur la cloche disparaît

#### Test 4 : Navigation
- Clique sur la notification "Badge débloqué"
  → Doit t'amener sur `/profile`
  
- Clique sur "Session terminée"
  → Doit t'amener sur le programme

#### Test 5 : Rafraîchissement automatique
- Laisse le panneau ouvert
- Dans une autre fenêtre, insère une nouvelle notification dans la DB
- Attends 30 secondes max
- La nouvelle notification doit apparaître automatiquement

## 🔍 Vérifications Techniques

### Vérifie dans la Console Navigateur (F12)

Tu devrais voir :
```
Chargement des notifications...
✅ 7 notifications chargées
```

Pas d'erreurs 404 ou 500.

### Vérifie les Requêtes Réseau (Onglet Network)

Tu devrais voir ces appels :
```
GET /api/push/notifications → 200 OK
POST /api/push/notifications/1/read → 200 OK
POST /api/push/notifications/read-all → 200 OK
```

### Vérifie dans la Base de Données

```sql
-- Voir les notifications
SELECT * FROM v_user_notifications WHERE user_id = TON_ID LIMIT 10;

-- Voir lesquelles sont lues
SELECT * FROM user_notification_reads WHERE user_id = TON_ID;

-- Compter les non lues
SELECT fn_get_unread_count(TON_ID) as unread_count;
```

## 🐛 Problèmes Possibles

### Problème 1 : "Aucune notification"
**Cause** : Les tables n'existent pas ou pas de données
**Solution** :
```sql
-- Vérifie que les tables existent
SHOW TABLES LIKE '%notification%';

-- Vérifie qu'il y a des données
SELECT COUNT(*) FROM notification_logs WHERE user_id = TON_ID;
```

### Problème 2 : Erreur 500 sur l'API
**Cause** : Migration SQL pas complète
**Solution** :
```bash
# Regarde les logs backend
tail -f backend-fytli/logs/error-*.log

# Vérifie que la vue existe
mysql> SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

### Problème 3 : Badge ne se met pas à jour
**Cause** : Cache ou requête qui échoue
**Solution** :
- Ouvre la console (F12) et regarde les erreurs
- Fais un Ctrl+Shift+R (hard refresh)
- Vérifie que le backend tourne

### Problème 4 : Notification pas marquée comme lue
**Cause** : Procédure stockée pas créée
**Solution** :
```sql
-- Vérifie les procédures
SHOW PROCEDURE STATUS WHERE Db = 'ta_database';

-- Doit afficher:
-- sp_mark_notification_read
-- sp_mark_all_notifications_read
```

## 🎨 Personnalisation

### Ajouter tes propres notifications de test

```sql
INSERT INTO notification_logs 
  (user_id, notification_type, title, body, data, sent_at, was_delivered)
VALUES 
  (TON_USER_ID, 
   'custom_type', 
   'Mon titre',
   'Mon message',
   JSON_OBJECT('key', 'value'),
   NOW(),
   TRUE
  );
```

### Changer les icônes

Dans `frontend-fytli/src/components/NotificationBell.tsx` :

```typescript
const getIconForType = (type: string): string => {
  switch (type) {
    case 'custom_type':
      return '🎨';  // ← Ajoute ici
    // ...
  }
}
```

## 📊 Statistiques

Pour voir des stats sur les notifications :

```sql
-- Notifications par type
SELECT 
  notification_type,
  COUNT(*) as count,
  COUNT(CASE WHEN unr.read_id IS NULL THEN 1 END) as unread
FROM notification_logs nl
LEFT JOIN user_notification_reads unr 
  ON nl.log_id = unr.notification_log_id AND nl.user_id = unr.user_id
WHERE nl.user_id = TON_ID
GROUP BY notification_type;

-- Notifications par jour
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as count
FROM notification_logs
WHERE user_id = TON_ID
GROUP BY DATE(sent_at)
ORDER BY date DESC;
```

## ✅ Checklist de Test

- [ ] Migration SQL exécutée
- [ ] Notifications de test insérées
- [ ] Backend redémarré
- [ ] Badge rouge visible sur la cloche
- [ ] Liste des notifications s'affiche
- [ ] Clic sur notification → marquée comme lue
- [ ] "Tout marquer lu" fonctionne
- [ ] Badge disparaît quand tout est lu
- [ ] Navigation fonctionne (badge → profile)
- [ ] Pas d'erreurs dans la console
- [ ] Requêtes API retournent 200 OK

## 🎉 Résultat Attendu

Quand tout fonctionne :
1. Cloche avec badge "7" 🔔
2. Liste des 7 notifications avec icônes
3. Points orange sur les non lues
4. Clic → marquage instantané
5. Navigation vers les bonnes pages
6. Rafraîchissement auto toutes les 30s

---

**C'est parti pour les tests ! 🚀**

Si tu as des soucis, regarde le fichier `NOTIFICATIONS_CONNEXION_BACKEND.md` pour plus de détails techniques.

