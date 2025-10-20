# 🔧 Correction du Système Social & Profil Utilisateur

## ✅ Corrections apportées

### 1. **Erreur "pool.query is not a function"** 

**Fichier:** `backend-fytli/models/socialModel.js`

**Problème:** Mauvaise importation du pool
```javascript
// ❌ AVANT
const pool = require('../db');

// ✅ APRÈS
const { pool } = require('../db');
```

### 2. **FriendProfileScreen rendu dynamique**

**Fichier:** `mobilApp-fytli/src/screens/FriendProfileScreen.tsx`

**Changements:**
- ✅ Récupération du profil public via l'API
- ✅ Statistiques réelles (streak, séances, badges)
- ✅ Système de connexions (amis)
- ✅ 3 états possibles : 
  - **Aucune connexion** → Bouton "Ajouter comme ami"
  - **En attente** → Affiche "⏳ En attente" + Bouton "✓ Accepter"
  - **Connecté** → Affiche "✓ Connecté" + Bouton "Supprimer"
- ✅ Badges et activité récente dynamiques
- ✅ Gestion du chargement et des erreurs

### 3. **Service Social mis à jour**

**Fichier:** `mobilApp-fytli/src/services/social.service.ts`

**Nouvelles fonctions:**
- `addFriend(friendId)` - Envoyer une demande d'ami
- `acceptFriend(friendId)` - Accepter une demande
- `removeFriend(friendId)` - Supprimer une connexion
- `getFriends(userId?)` - Liste des amis
- `searchUsers(query)` - Rechercher des utilisateurs
- `getFeed(userId?, limit, offset)` - Feed social
- `unlockFeed(sessionCompletionId, message, emoji)` - Déverrouiller le feed
- `checkFeedStatus()` - Vérifier si le feed est déverrouillé
- `getCircleStats()` - Statistiques du cercle
- `getPublicProfile(userId)` - Profil public d'un utilisateur

---

## 🗄️ Vérification des tables

### Scripts créés

#### 1. **Vérifier si les tables existent**
```bash
cd backend-fytli
node check-social-tables.js
```

Ce script vérifie :
- ✅ Existence des tables `connections`, `feed_events`, `feed_unlocks`
- ✅ Nombre d'enregistrements
- ✅ Structure des colonnes

#### 2. **Installer les tables manquantes**
```bash
cd backend-fytli
node install-social-tables.js
```

Ce script crée automatiquement les 3 tables si elles n'existent pas.

---

## 📋 Tables requises

### 1. `connections` (Connexions/Amis)

```sql
CREATE TABLE connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (user_id, friend_id)
);
```

**Usage:** Gère les relations d'amitié entre utilisateurs

### 2. `feed_events` (Événements du feed)

```sql
CREATE TABLE feed_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('session_completed', 'program_started', 'streak_achieved', 'goal_reached', 'badge_earned', 'connection_request') NOT NULL,
  message TEXT NOT NULL,
  emoji VARCHAR(10),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

**Usage:** Stocke les événements visibles dans le feed social

### 3. `feed_unlocks` (Déverrouillages quotidiens)

```sql
CREATE TABLE feed_unlocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  unlocked_at TIMESTAMP NULL,
  streak INT DEFAULT 1,
  session_completion_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (session_completion_id) REFERENCES session_completions(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_date (user_id, date)
);
```

**Usage:** Gère le système de déverrouillage quotidien du feed

---

## 🚀 Test du système

### 1. **Vérifier que le backend démarre sans erreur**
```bash
cd backend-fytli
npm start
```

Vous devriez voir :
```
✅ Connexion MySQL établie avec succès
🚀 Serveur démarré sur le port 9001
```

### 2. **Tester le profil utilisateur (Mobile)**

Naviguez vers le profil d'un ami :
```tsx
navigation.navigate('FriendProfile', { userId: 2 });
```

Le profil devrait afficher :
- ✅ Avatar et nom de l'utilisateur
- ✅ Statistiques (streak, séances, badges)
- ✅ Bouton d'ajout d'ami
- ✅ Badges débloqués
- ✅ Activité récente

### 3. **Tester le feed social**

```tsx
// Dans FeedScreen ou Dashboard
const feed = await socialService.getFeed();
console.log('Feed:', feed);
```

---

## 🔑 Points clés du système

### Système de connexions (Amis)

**Flow complet:**
1. **User A** clique sur "Ajouter comme ami" sur le profil de **User B**
   - → Crée une entrée dans `connections` avec `status='pending'`
2. **User B** reçoit la demande et clique sur "Accepter"
   - → Met à jour `status='accepted'`
3. Les deux utilisateurs peuvent maintenant :
   - Voir l'activité de l'autre dans le feed
   - Accéder au profil complet

### Système de feed (Cercle Fytli)

**Concept:** *"Seul, mais ensemble"*

1. L'utilisateur complète une séance
2. Le feed se déverrouille pour la journée
3. Il peut voir les activités de ses amis
4. Ses amis voient son activité

**Avantages:**
- Encourage la régularité (débloquer le feed quotidiennement)
- Crée un sentiment de communauté
- Respecte la vie privée (seulement les amis acceptés)

---

## 🐛 Troubleshooting

### Erreur : "Cannot add foreign key constraint"

**Cause:** La table `users` n'utilise pas `user_id` comme clé primaire

**Solution:**
```sql
-- Vérifier la structure de users
SHOW CREATE TABLE users;

-- Si la clé primaire est "id" au lieu de "user_id", modifiez les foreign keys dans install-social-tables.js
```

### Erreur : "Table 'connections' doesn't exist"

**Solution:**
```bash
cd backend-fytli
node install-social-tables.js
```

### Le feed est toujours verrouillé

**Cause:** L'utilisateur n'a pas complété de séance aujourd'hui

**Solution:**
1. Compléter une séance via WorkoutScreen
2. Le SessionSummaryScreen appelle automatiquement `unlockFeed()`
3. Le feed se déverrouille pour 24h

---

## 📝 TODO - Améliorations futures

- [ ] Notifications push pour les demandes d'ami
- [ ] Suggestions d'amis basées sur les programmes communs
- [ ] Statistiques comparatives avec les amis
- [ ] Commentaires et likes sur les activités
- [ ] Groupes/Challenges collectifs
- [ ] Leaderboard du cercle

---

## ✨ Résumé

### Avant :
- ❌ Profil utilisateur avec données mock
- ❌ Pas de système de connexion
- ❌ Erreur pool.query dans le feed

### Après :
- ✅ Profil utilisateur dynamique
- ✅ Système de connexions (amis) fonctionnel
- ✅ Feed social opérationnel
- ✅ Scripts de vérification et installation des tables
- ✅ Documentation complète

---

**🌟 Le Cercle Fytli est maintenant opérationnel ! 🌟**

*"Seul, mais ensemble - Plus on bouge, plus la lumière s'intensifie."* ☀️

