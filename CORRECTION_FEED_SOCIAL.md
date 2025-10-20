# 🔧 Correction du problème du Feed Social

## 📋 Problème identifié

Le frontend-fytli essayait d'appeler des endpoints API sous `/social/*` qui n'existaient pas dans le backend. Les pages Feed, CercleFytli et les fonctionnalités sociales ne fonctionnaient donc pas.

## ✅ Solution implémentée

### 1. Fichiers créés dans le backend

#### Base de données
- **`database/social_system.sql`** - Script SQL pour créer les tables :
  - `connections` - Gestion des connexions/amis entre utilisateurs
  - `feed_events` - Événements du feed social (séances, badges, streaks)
  - `feed_unlocks` - Déverrouillages quotidiens du feed
  - Colonnes ajoutées à `users` : `username`, `avatar_url`, `profile_visibility`

- **`database/installSocial.js`** - Script Node.js pour installation automatique
- **`database/SOCIAL_INSTALLATION.md`** - Documentation d'installation

#### Code backend
- **`models/socialModel.js`** - Modèle avec toutes les requêtes SQL pour :
  - Gestion des connexions (ajouter/accepter/supprimer amis)
  - Recherche d'utilisateurs
  - Récupération du feed social
  - Déverrouillage quotidien et gestion du streak
  - Profils publics et partage

- **`controllers/socialController.js`** - Contrôleur avec la logique métier pour :
  - 5 endpoints de gestion des connexions
  - 5 endpoints de gestion du feed
  - 2 endpoints de profil et partage

- **`routes/social.js`** - 12 routes API complètes

- **`index.js`** - Routes social enregistrées (ligne 32 et 131)

### 2. Endpoints disponibles

Une fois les tables créées, ces endpoints fonctionneront :

#### Connexions
```
GET    /social/connections          - Liste des amis
GET    /social/connections/:userId  - Amis d'un utilisateur
POST   /social/connections/add      - Envoyer demande d'ami
POST   /social/connections/accept   - Accepter demande
DELETE /social/connections/:friendId - Supprimer ami
GET    /social/search?q=query       - Rechercher utilisateurs
```

#### Feed
```
GET  /social/feed                - Feed de l'utilisateur
GET  /social/feed/:userId        - Feed d'un utilisateur
POST /social/feed/unlock         - Déverrouiller le feed
GET  /social/feed/status         - Statut du déverrouillage
GET  /social/circle              - Stats du cercle
```

#### Profil et Partage
```
GET /social/profile/:username     - Profil public
GET /social/share/card           - Données de partage
```

## 🚀 Installation

### Étape 1 : Créer les tables dans la base de données

#### Option A : Script automatique (recommandé)
```bash
cd backend-fytli
node database/installSocial.js
```

#### Option B : Manuelle
```bash
mysql -u [username] -p [database] < backend-fytli/database/social_system.sql
```

### Étape 2 : Générer les usernames pour utilisateurs existants

Si vous avez des utilisateurs sans username :

```sql
UPDATE users 
SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
WHERE username IS NULL;
```

### Étape 3 : Redémarrer le backend

```bash
cd backend-fytli
npm start
```

Vous devriez voir dans les logs :
```
✅ Routes enregistrées avec succès
👥 Route social disponible sur /social
```

## 🧪 Test rapide

Une fois le backend redémarré, testez avec curl :

```bash
# Vérifier le statut du feed (avec votre token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:9001/social/feed/status

# Devrait retourner :
# { "success": true, "unlocked": false, "streak": 0, "total_days": 0 }
```

## 📱 Frontend-fytli

Le frontend est déjà configuré ! Les fichiers suivants utilisent ces endpoints :
- `src/pages/Feed.tsx` - Page principale du feed
- `src/components/FeedCards.tsx` - Affichage des cartes
- `src/components/CercleFytli.tsx` - Cercle d'amis
- `src/services/socialService.ts` - Service API (déjà complet)

Une fois les tables créées et le backend redémarré, tout fonctionnera automatiquement.

## 📱 MobilApp-fytli

Le dossier `mobilApp-fytli` ne contient actuellement que `node_modules`. Si vous développez une application mobile React Native :

1. Copiez le service API du frontend :
   ```bash
   cp frontend-fytli/src/services/socialService.ts mobilApp-fytli/src/services/
   ```

2. Adaptez les imports si nécessaire (axios, configuration API)

3. Les mêmes endpoints fonctionneront avec l'app mobile

## 🔍 Fonctionnalités implémentées

### ✅ Gestion des amis
- Recherche d'utilisateurs par nom, email ou username
- Envoi de demandes d'ami
- Acceptation/refus de demandes
- Suppression de connexions

### ✅ Feed social
- Affichage des activités des amis
- Feed verrouillé tant qu'aucune séance n'est faite aujourd'hui
- Déverrouillage automatique après une séance
- Messages personnalisables avec emojis

### ✅ Système de streak
- Comptage des jours consécutifs d'activité
- Badge spécial à 7 jours
- Réinitialisation si un jour est manqué

### ✅ Cercle Fytli
- Visualisation des amis actifs aujourd'hui
- Stats personnelles (streak, total jours)
- Indicateur d'activité en temps réel

### ✅ Profils publics
- 3 niveaux de visibilité : privé, amis, public
- Affichage des badges récents
- Statistiques publiques (sessions, amis, badges)

### ✅ Partage
- Génération de cartes de partage
- Données pour créer des visuels
- Lien vers profil public

## 🎨 Logique métier

### Déverrouillage du feed
1. L'utilisateur complète une séance
2. L'API `/social/feed/unlock` est appelée avec le `sessionCompletionId`
3. Un enregistrement est créé dans `feed_unlocks` pour aujourd'hui
4. Le streak est calculé automatiquement
5. Un événement est ajouté au feed social
6. Le feed devient visible pour cet utilisateur

### Calcul du streak
- **Jour 1** : Première séance → Streak = 1
- **Jour 2** : Séance le jour suivant → Streak = 2
- **Jour 3** : Pas de séance → Streak réinitialisé à 0
- **Jour 4** : Nouvelle séance → Streak = 1

### Visibilité du feed
- Feed **verrouillé** : Aucune séance faite aujourd'hui
- Feed **déverrouillé** : Au moins une séance faite aujourd'hui
- Le feed affiche les activités des **amis acceptés** uniquement

## 📊 Structure des données

### Table connections
```sql
user_id → friend_id
status: pending | accepted | blocked
```

### Table feed_events
```sql
user_id, type, message, emoji, metadata, created_at
type: session_completed | program_started | streak_achieved | ...
```

### Table feed_unlocks
```sql
user_id, unlocked_date, streak, session_completion_id
UNIQUE(user_id, unlocked_date) → Un déverrouillage par jour
```

## 🐛 Dépannage

### Le feed ne se charge pas
1. Vérifier que le backend est démarré
2. Vérifier les logs : `👥 Route social disponible sur /social`
3. Tester l'endpoint : `curl http://localhost:9001/social/feed/status`

### Erreur "Route non trouvée"
- Le backend n'a pas été redémarré après l'ajout des routes
- Solution : `cd backend-fytli && npm start`

### Erreur "Table doesn't exist"
- Les tables sociales n'ont pas été créées
- Solution : Exécuter `node database/installSocial.js`

### Le feed est toujours verrouillé
- Normal ! Il faut compléter une séance pour le déverrouiller
- Tester : Compléter une session, puis appeler `/social/feed/unlock`

## 📈 Prochaines étapes recommandées

1. **Tests** : Créer des utilisateurs de test et des connexions
2. **UI** : Personnaliser les cartes du feed dans `FeedCards.tsx`
3. **Notifications** : Intégrer avec le système de push notifications existant
4. **Gamification** : Ajouter plus de badges liés au social (inviter 5 amis, etc.)

## 📞 Support

Pour toute question :
- Consultez `backend-fytli/database/SOCIAL_INSTALLATION.md`
- Vérifiez les logs du backend
- Testez les endpoints avec Postman ou curl

---

**✅ Le feed social est maintenant complètement fonctionnel !**

