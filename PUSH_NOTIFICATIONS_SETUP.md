# 🔔 Configuration des Notifications Push - Fytli

Ce guide vous explique comment mettre en place le système de notifications push pour l'application Fytli.

## 📋 Prérequis

- Node.js 16+ installé
- Base de données MySQL configurée
- Serveur backend fonctionnel
- HTTPS activé (obligatoire pour les notifications push en production)

## 🚀 Installation

### 1. Installer les dépendances backend

```bash
cd backend-fytli
npm install web-push node-cron
```

### 2. Générer les clés VAPID

Les clés VAPID (Voluntary Application Server Identification) sont nécessaires pour l'authentification des notifications push.

```bash
npx web-push generate-vapid-keys
```

Cette commande va générer deux clés :
```
Public Key: BG...xxx
Private Key: abc...xyz
```

### 3. Configurer les variables d'environnement

Ajoutez ces lignes dans votre fichier `.env` du backend :

```env
# Clés VAPID pour les notifications push
VAPID_PUBLIC_KEY=votre_cle_publique_ici
VAPID_PRIVATE_KEY=votre_cle_privee_ici
VAPID_SUBJECT=mailto:contact@fytli.com
```

**⚠️ IMPORTANT :** 
- Ne partagez JAMAIS votre clé privée VAPID
- Utilisez la même paire de clés pour tous vos environnements (dev, staging, prod)
- Si vous changez les clés, tous les utilisateurs devront se réabonner

### 4. Exécuter les migrations SQL

Exécutez les scripts SQL dans cet ordre :

```sql
-- 1. Ajouter les time slots aux programmes
SOURCE /chemin/vers/MIGRATION_ADD_TIME_SLOTS.sql;

-- 2. Créer les tables de notifications
SOURCE /chemin/vers/MIGRATION_PUSH_NOTIFICATIONS.sql;
```

Ou via MySQL Workbench :
1. Ouvrir le fichier SQL
2. Sélectionner votre base de données
3. Exécuter le script

### 5. Redémarrer le serveur backend

```bash
cd backend-fytli
npm run dev
```

Vérifiez dans les logs :
```
✅ Planificateur de notifications démarré avec succès
```

## 🎯 Configuration des Time Slots

Les time slots permettent de définir des créneaux horaires pour certains programmes.

### Exemple : Programme du matin

```sql
UPDATE programs 
SET 
  time_slot_start = '07:00:00',
  time_slot_end = '09:30:00',
  is_time_specific = TRUE
WHERE title LIKE '%WakeUp%';
```

### Exemple : Programme du soir

```sql
UPDATE programs 
SET 
  time_slot_start = '18:00:00',
  time_slot_end = '21:00:00',
  is_time_specific = TRUE
WHERE title LIKE '%Evening%';
```

## 📱 Utilisation Frontend

### 1. Accéder aux paramètres de notifications

Les utilisateurs peuvent gérer leurs notifications dans :
```
/notifications/settings
```

### 2. S'abonner aux notifications

```typescript
import pushNotificationService from '@/services/pushNotifications';

// Demander la permission et s'abonner
await pushNotificationService.subscribe();
```

### 3. Personnaliser les préférences

Les utilisateurs peuvent activer/désactiver :
- 🏋️ Rappels d'entraînement
- 💪 Sessions complétées par les membres
- 🏆 Badges débloqués
- 🎯 Objectifs hebdomadaires
- ✨ Nouveaux programmes
- 💡 Motivation quotidienne

## 🔧 Types de Notifications

### 1. Rappels d'Entraînement
- **Quand** : X minutes avant le time slot du programme
- **Personnalisable** : Oui (15, 30, 60, 120 minutes)
- **Condition** : Utilisateur inscrit au programme et session non complétée

### 2. Session Complétée par un Membre
- **Quand** : Immédiatement après qu'un membre termine une session
- **Qui** : Tous les autres membres du programme
- **Message** : "[Prénom] vient de terminer sa session !"

### 3. Badge Débloqué
- **Quand** : Immédiatement après obtention d'un badge
- **Message** : "Félicitations ! Vous avez obtenu le badge [nom]"

### 4. Objectif Hebdomadaire Atteint
- **Quand** : Dimanche 20h (vérification hebdomadaire)
- **Condition** : Nombre de sessions >= objectif

### 5. Motivation Quotidienne
- **Quand** : Tous les jours à 8h
- **Message** : Citation motivante aléatoire

### 6. Nouveaux Programmes
- **Quand** : Manuel (envoyé par l'admin)
- **Message** : "Découvrez [nom du programme]"

## ⏰ Planification des Notifications

Le système utilise des cron jobs pour automatiser l'envoi :

| Tâche | Fréquence | Horaire |
|-------|-----------|---------|
| Rappels d'entraînement | Toutes les 15 min | Continu |
| Motivation quotidienne | Quotidien | 8h00 |
| Objectifs hebdomadaires | Hebdomadaire | Dimanche 20h |
| Nettoyage abonnements | Quotidien | 3h00 |

## 🌙 Heures Silencieuses

Par défaut : 22h00 - 7h00

Les utilisateurs peuvent personnaliser leurs heures silencieuses dans les paramètres.

## 🧪 Test des Notifications

### Via l'interface utilisateur

1. Aller dans `/notifications/settings`
2. S'abonner aux notifications
3. Cliquer sur "Envoyer une notification de test"

### Via l'API

```bash
curl -X POST https://api.fytli.fr/push/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Statistiques

Les statistiques incluent :
- Nombre d'appareils abonnés
- Notifications envoyées (semaine/mois)
- Taux de livraison
- Échecs de livraison

## 🐛 Dépannage

### Les notifications ne fonctionnent pas

1. **Vérifier les clés VAPID**
   ```bash
   echo $VAPID_PUBLIC_KEY
   ```

2. **Vérifier le Service Worker**
   - Ouvrir DevTools > Application > Service Workers
   - Le SW doit être actif

3. **Vérifier les permissions**
   - Chrome : chrome://settings/content/notifications
   - Firefox : about:preferences#privacy

4. **Vérifier les logs backend**
   ```bash
   tail -f backend-fytli/logs/combined-*.log
   ```

### Erreur "410 Gone"

L'abonnement est invalide. L'utilisateur doit se réabonner.

### Erreur "403 Forbidden"

Clés VAPID invalides. Regénérez-les et mettez à jour le .env.

## 🔒 Sécurité

- ✅ Les clés VAPID sont stockées uniquement dans le backend
- ✅ La clé publique est partagée avec le frontend (c'est normal)
- ✅ La clé privée ne doit JAMAIS être exposée
- ✅ HTTPS obligatoire en production
- ✅ Les abonnements inactifs sont automatiquement nettoyés

## 📚 Ressources

- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push NPM](https://www.npmjs.com/package/web-push)

## 💡 Conseils

1. **Testez d'abord en local** avec `localhost` (les notifications fonctionnent sur localhost)
2. **Ne spammez pas** - Respectez les préférences des utilisateurs
3. **Messages courts** - Titre : 50 caractères max, Body : 150 caractères max
4. **Utilisez des emojis** - Rend les notifications plus engageantes 🚀
5. **Testez sur mobile** - L'expérience est différente du desktop

## 🎉 Fonctionnalités Futures

- [ ] Notifications personnalisées par utilisateur
- [ ] Notifications de groupe
- [ ] Notifications avec actions (répondre directement)
- [ ] Statistiques avancées
- [ ] A/B testing des messages
- [ ] Segmentation des utilisateurs

---

**Besoin d'aide ?** Contactez l'équipe technique à tech@fytli.com

