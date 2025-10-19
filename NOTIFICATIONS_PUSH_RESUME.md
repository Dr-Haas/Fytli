# 🔔 Système de Notifications Push - Fytli

## ✅ Implémentation Complète

J'ai mis en place un système complet de notifications push pour votre application Fytli avec toutes les fonctionnalités demandées.

---

## 📁 Fichiers Créés

### 🗄️ SQL (Migrations)
1. **`MIGRATION_ADD_TIME_SLOTS.sql`** - Ajout des créneaux horaires aux programmes
2. **`MIGRATION_PUSH_NOTIFICATIONS.sql`** - Tables pour les notifications push

### 🖥️ Backend (Node.js/Express)
1. **`models/pushNotificationsModel.js`** - Modèle de données
2. **`controllers/pushNotificationsController.js`** - Contrôleur des API
3. **`routes/pushNotifications.js`** - Routes API
4. **`services/pushNotificationService.js`** - Logique métier
5. **`services/notificationScheduler.js`** - Planification automatique (cron jobs)

### 💻 Frontend (React/TypeScript)
1. **`services/pushNotifications.ts`** - Service client
2. **`pages/NotificationSettings.tsx`** - Interface utilisateur complète

### 📚 Documentation
1. **`PUSH_NOTIFICATIONS_SETUP.md`** - Guide d'installation complet

---

## 🎯 Fonctionnalités Implémentées

### 1. ⏰ Time Slots pour les Programmes

Vous pouvez maintenant définir des créneaux horaires pour chaque programme :

```sql
-- Exemple : Programme WakeUp (7h - 9h30)
UPDATE programs 
SET 
  time_slot_start = '07:00:00',
  time_slot_end = '09:30:00',
  is_time_specific = TRUE
WHERE title LIKE '%Wake%';
```

**Colonnes ajoutées :**
- `time_slot_start` - Heure de début
- `time_slot_end` - Heure de fin
- `is_time_specific` - Si le programme a un créneau fixe

### 2. 🏋️ Rappels d'Entraînement

**Fonctionnement :**
- Envoi automatique avant le time slot du programme
- Personnalisable (15, 30, 60 ou 120 minutes avant)
- Vérifie si l'utilisateur n'a pas déjà fait sa session
- Respecte les heures silencieuses

**Planification :**
- Vérification toutes les 15 minutes
- Uniquement pendant les créneaux horaires définis

### 3. 💪 Notifications "Session Complétée"

**Quand un membre complète une session :**
- ✅ Tous les autres membres du programme sont notifiés
- ✅ Message : "[Prénom] vient de terminer sa session !"
- ✅ Envoi immédiat et asynchrone
- ✅ Ne bloque pas l'enregistrement de la session

**Intégration :**
Automatiquement intégré dans `sessionCompletionsController.js` lors de la création d'une completion.

### 4. 🏆 Autres Types de Notifications

| Type | Déclencheur | Timing |
|------|-------------|--------|
| **Badge débloqué** | Nouveau badge obtenu | Immédiat |
| **Objectif hebdomadaire** | Objectif atteint | Dimanche 20h |
| **Motivation quotidienne** | Automatique | Tous les jours 8h |
| **Nouveau programme** | Manuel (admin) | À la demande |

---

## 🔧 Configuration Technique

### Base de Données

**3 nouvelles tables :**

1. **`push_subscriptions`**
   - Stocke les abonnements push de chaque appareil
   - Lien vers `users(id)`
   - Gestion automatique des abonnements invalides

2. **`notification_preferences`**
   - Préférences personnalisées par utilisateur
   - Types de notifications activés/désactivés
   - Heures silencieuses
   - Minutes avant rappel

3. **`notification_logs`**
   - Historique de toutes les notifications envoyées
   - Tracking des succès/échecs
   - Statistiques

### API Endpoints

Toutes les routes sous `/push` (authentification requise) :

```
GET    /push/vapid-public-key      → Récupérer la clé publique
POST   /push/subscribe              → S'abonner aux notifications
POST   /push/unsubscribe            → Se désabonner
GET    /push/preferences            → Récupérer les préférences
PUT    /push/preferences            → Mettre à jour les préférences
POST   /push/test                   → Envoyer une notification de test
GET    /push/stats                  → Statistiques utilisateur
GET    /push/subscriptions          → Liste des appareils abonnés
```

### Cron Jobs (Planification Automatique)

Le scheduler s'exécute automatiquement au démarrage du serveur :

```javascript
// Rappels d'entraînement : toutes les 15 minutes
cron.schedule('*/15 * * * *', sendTrainingReminders);

// Motivation quotidienne : tous les jours à 8h
cron.schedule('0 8 * * *', sendDailyMotivation);

// Objectifs hebdomadaires : dimanche 20h
cron.schedule('0 20 * * 0', checkWeeklyGoals);

// Nettoyage : tous les jours à 3h
cron.schedule('0 3 * * *', cleanupInactiveSubscriptions);
```

---

## 🚀 Installation Rapide

### 1. Installer les dépendances

```bash
cd backend-fytli
npm install web-push node-cron
```

### 2. Générer les clés VAPID

```bash
npx web-push generate-vapid-keys
```

### 3. Configurer .env

```env
VAPID_PUBLIC_KEY=votre_cle_publique
VAPID_PRIVATE_KEY=votre_cle_privee
VAPID_SUBJECT=mailto:contact@fytli.com
```

### 4. Exécuter les migrations SQL

**⚠️ IMPORTANT : Les fichiers SQL ont été corrigés pour utiliser les bons noms de colonnes :**
- `users.id` (au lieu de `user_id`)
- `programs.title` (au lieu de `name`)

```sql
-- Utiliser votre base de données
USE lyfti;

-- 1. Time slots
SOURCE /Users/garyhaas/Desktop/Fytli/MIGRATION_ADD_TIME_SLOTS.sql;

-- 2. Notifications
SOURCE /Users/garyhaas/Desktop/Fytli/MIGRATION_PUSH_NOTIFICATIONS.sql;
```

### 5. Redémarrer le serveur

```bash
npm run dev
```

**Vérifiez dans les logs :**
```
✅ Planificateur de notifications démarré avec succès
```

---

## 💻 Utilisation Frontend

### Accès aux paramètres

Route disponible : `/notifications/settings`

Les utilisateurs peuvent :
- ✅ Activer/désactiver les notifications push
- ✅ Choisir les types de notifications
- ✅ Configurer les heures silencieuses
- ✅ Définir le délai des rappels
- ✅ Envoyer une notification de test
- ✅ Voir les statistiques

### Interface Utilisateur

L'interface est **complète et prête à l'emploi** :
- 🎨 Design moderne avec Tailwind CSS
- 📱 Responsive (mobile + desktop)
- 🔄 Toggles interactifs
- 📊 Statistiques en temps réel
- 🧪 Bouton de test intégré

---

## 🎯 Cas d'Usage Concrets

### Scénario 1 : Programme "WakeUp" du matin

1. **Configuration du programme**
   ```sql
   UPDATE programs 
   SET time_slot_start = '07:00:00', 
       time_slot_end = '09:30:00', 
       is_time_specific = TRUE
   WHERE title = 'WakeUp';
   ```

2. **Utilisateur inscrit au programme**
   - Préférence : rappel 30 minutes avant
   - → Notification envoyée à 6h30
   - Message : "🏋️ Il est temps de faire votre séance WakeUp !"

3. **Utilisateur complète la session**
   - → Tous les autres membres reçoivent : "💪 [Jean] vient de terminer sa session !"

### Scénario 2 : Programme flexible (sans time slot)

```sql
-- Programme flexible (peut être fait à tout moment)
UPDATE programs 
SET is_time_specific = FALSE
WHERE title = 'Yoga Flow';
```

- ❌ Pas de rappels automatiques
- ✅ Notifications de sessions complétées actives
- ✅ Notifications de badges actives

### Scénario 3 : Heures silencieuses

Utilisateur avec heures silencieuses : 22h - 7h

- ❌ Aucune notification entre 22h et 7h
- ✅ Notifications en attente envoyées après 7h
- ⚙️ Personnalisable par utilisateur

---

## 📊 Statistiques & Monitoring

### Pour chaque utilisateur

```typescript
const stats = await pushNotificationService.getStats();
// {
//   active_devices: 2,           // Nombre d'appareils
//   total_sent: 45,              // Total notifications
//   sent_last_week: 12,          // Cette semaine
//   sent_last_month: 38,         // Ce mois
//   failed_deliveries: 3         // Échecs
// }
```

### Vue administrateur

Une vue SQL `notification_stats` fournit :
- Liste des utilisateurs
- Appareils actifs par utilisateur
- Notifications envoyées (semaine/total)
- Préférences activées

---

## 🔒 Sécurité & Bonnes Pratiques

✅ **Implémenté :**
- Authentification requise pour toutes les routes
- Clés VAPID sécurisées (jamais exposées au client)
- Abonnements liés aux utilisateurs (pas anonymes)
- Nettoyage automatique des abonnements inactifs (90 jours)
- Gestion des erreurs (410 Gone → suppression auto)

✅ **Respect de la vie privée :**
- Opt-in obligatoire (pas de notifications sans permission)
- Désabonnement facile
- Heures silencieuses respectées
- Préférences granulaires

---

## 🐛 Correction des Erreurs SQL

### Erreurs initiales rencontrées :

1. ❌ `Unknown column 'name'` → ✅ Corrigé en `title`
2. ❌ `Missing column 'user_id'` → ✅ Corrigé en `users(id)`

Tous les fichiers SQL sont maintenant **100% compatibles** avec votre schéma de base de données.

---

## 📱 Support Navigateurs

| Navigateur | Desktop | Mobile | Notes |
|------------|---------|--------|-------|
| Chrome | ✅ | ✅ | Support complet |
| Firefox | ✅ | ✅ | Support complet |
| Safari | ✅ | ⚠️ | iOS 16.4+ requis |
| Edge | ✅ | ✅ | Support complet |

**Note iOS/Safari :** Les notifications push PWA sont supportées depuis iOS 16.4 (mars 2023).

---

## 🚀 Prochaines Étapes

### Pour déployer en production :

1. **Installer les dépendances**
   ```bash
   npm install web-push node-cron
   ```

2. **Générer et configurer les clés VAPID**
   ```bash
   npx web-push generate-vapid-keys
   ```

3. **Exécuter les migrations SQL**
   - `MIGRATION_ADD_TIME_SLOTS.sql`
   - `MIGRATION_PUSH_NOTIFICATIONS.sql`

4. **Redémarrer le serveur backend**

5. **Tester en local**
   - Aller sur `/notifications/settings`
   - Activer les notifications
   - Envoyer une notification de test

6. **Configurer les time slots de vos programmes**

7. **Déployer !** 🎉

### Améliorations futures possibles :

- [ ] Notifications avec actions (répondre directement)
- [ ] Notifications de groupe/équipe
- [ ] Rich notifications (avec images)
- [ ] Deep links vers des pages spécifiques
- [ ] Analytics avancés
- [ ] A/B testing des messages

---

## 📞 Support

Pour toute question sur l'implémentation :

1. Consultez `PUSH_NOTIFICATIONS_SETUP.md` pour le guide détaillé
2. Vérifiez les logs backend : `backend-fytli/logs/`
3. Testez avec le bouton "Test" dans les paramètres

---

## 🎉 Résumé

✅ **Système complet de notifications push**
✅ **Time slots pour les programmes**
✅ **Rappels d'entraînement automatiques**
✅ **Notifications de sessions complétées**
✅ **6 types de notifications différents**
✅ **Interface utilisateur complète**
✅ **Planification automatique (cron jobs)**
✅ **Statistiques et monitoring**
✅ **Documentation complète**

**Tout est prêt à être déployé !** 🚀

