# 🤝 Cercle Fytli - Guide Complet

> **Transformez votre application fitness en une communauté motivante**

Le Cercle Fytli est un système social innovant qui crée une motivation collective en gamifiant l'accès au feed social. Les utilisateurs doivent compléter une séance pour déverrouiller le feed de leurs amis, créant ainsi un cercle vertueux de discipline et d'inspiration mutuelle.

---

## 📚 Table des Matières

- [Concept](#-concept-clé)
- [Architecture](#️-architecture)
- [Installation Rapide](#-installation-rapide)
- [Fonctionnalités](#-fonctionnalités)
- [API Endpoints](#-api-endpoints)
- [Composants Frontend](#-composants-frontend)
- [Dépannage](#-dépannage)

---

## 🎯 Concept Clé

**"Bouge pour voir ce que font tes amis"**

### Philosophie
- 🔒 Feed verrouillé par défaut chaque jour
- ✨ Déverrouillé automatiquement après une séance
- 🔥 Système de streak pour encourager la régularité
- 💬 Feed 100% positif (pas de comparaison, que de l'inspiration)
- 📤 Cartes partageables pour Instagram/Threads

### Concepts clés

#### 1. Verrouillage du Feed
- Le feed social est **verrouillé par défaut** chaque jour
- L'utilisateur doit compléter une séance pour le déverrouiller
- Crée une discipline collective : "bouge pour voir ce que font tes amis"

#### 2. Cercle Visuel
- Affichage graphique animé de vos amis autour de vous
- Connexions lumineuses entre vous et vos amis
- États visuels : 
  - 🔒 Verrouillé (pas de séance aujourd'hui)
  - ✨ Actif (séance complétée)
  - 🔥 Streak (plusieurs jours consécutifs)

#### 3. Feed Social Positif
- Aucune métrique de performance affichée
- Focus sur le ressenti humain et l'encouragement
- Messages générés : "Jenny a terminé sa routine matinale 🌅"

#### 4. Partage Viral
- Génération de cartes visuelles partageables
- Fond dégradé selon le streak
- Export pour Instagram Stories / Threads

---

## 🏗️ Architecture

### Base de données

Trois nouvelles tables ont été ajoutées :

#### Table `connections` (ou `user_connections`)
Gère les relations sociales entre utilisateurs.

```sql
CREATE TABLE connections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'blocked'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_connection (user_id, friend_id)
);
```

#### Table `feed_events` (ou `user_feed`)
Stocke les événements visibles dans le feed social.

```sql
CREATE TABLE feed_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('session_completed', 'program_started', 'streak_achieved', 'goal_reached', 'badge_earned'),
  message TEXT NOT NULL,
  emoji VARCHAR(10),
  session_completion_id INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

#### Table `feed_unlocks` (ou `social_unlocks`)
Gère l'état de déverrouillage du feed par jour.

```sql
CREATE TABLE feed_unlocks (
  id INT PRIMARY KEY AUTO_INCREMENT,
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

### Backend (Node.js/Express)

**Fichiers créés :**
- `models/socialModel.js` - Requêtes base de données (15+ fonctions)
- `controllers/socialController.js` - Logique métier
- `routes/social.js` - Routes API (11 routes)
- `database/migration_social_features.sql` - Script de migration

### Frontend (React/TypeScript)

**Nouvelles pages :**
- `/feed` - Cercle Fytli et feed social
- `/share` - Génération de carte partageable
- `/u/:username` - Profil public

**Nouveaux composants :**
- `CercleFytli.tsx` - Visualisation du cercle animé (Framer Motion)
- `FeedCards.tsx` - Cartes d'activité des amis
- `ShareCard.tsx` - Génération de carte visuelle (html-to-image)

**Nouveau service :**
- `services/socialService.ts` - Appels API sociaux

---

## 🚀 Installation Rapide

### Étape 1 : Migration de la base de données (2 min)

```bash
cd backend-fytli
mysql -u votre_user -p votre_database < database/migration_social_features.sql
```

**Vérification :**
```sql
SHOW TABLES LIKE '%social%';
-- Doit afficher : user_connections, user_feed, social_unlocks
-- OU : connections, feed_events, feed_unlocks
```

### Étape 2 : Backend - Vérifier les routes (1 min)

Le backend est déjà configuré. Démarrez le serveur :

```bash
cd backend-fytli
npm start
```

**Vous devriez voir :**
```
✅ Routes enregistrées avec succès
🤝 Route social disponible sur /social (Cercle Fytli)
🚀 Serveur démarré sur le port 9001
```

### Étape 3 : Frontend - Installer les dépendances (1 min)

```bash
cd frontend-fytli
npm install framer-motion html-to-image
```

### Étape 4 : Test (1 min)

1. Allez sur `http://localhost:5173/login`
2. Connectez-vous
3. Allez sur `/feed` → Feed verrouillé 🔒
4. Complétez une séance rapide
5. Retournez sur `/feed` → Feed déverrouillé ✨

**Temps total : ~5 minutes** ⏱️

---

## ✨ Fonctionnalités

### 1. Cercle Fytli (Page `/feed`)

**Affichage :**
- Cercle social animé avec vous au centre
- Amis positionnés autour en cercle
- Lignes de connexion vers chaque ami
- Indicateurs visuels :
  - Ami actif aujourd'hui (vert pulsant)
  - Ami inactif (gris)
  - Votre streak (badge 🔥)

**États :**
- 🔒 **Verrouillé** : Si vous n'avez pas fait de séance aujourd'hui
- ✨ **Actif** : Feed déverrouillé, cartes des amis visibles
- 🔥 **Streak** : Halo doré si 3+ jours consécutifs

**Interactions :**
- Clic sur un ami → voir son profil
- Bouton "Faire une séance" si verrouillé
- Bouton "Gérer mes amis"
- Rafraîchissement du feed

### 2. Feed Social

**Affichage :**
- Cartes d'activité des amis (7 derniers jours)
- Avatar + nom + message + emoji
- Timestamp relatif ("Il y a 2h")
- Stats optionnelles (durée, calories, BPM)

**Types d'événements :**
- 💪 Session complétée
- 🔥 Streak atteint
- 🎯 Programme démarré
- 🏆 Objectif atteint
- 🏅 Badge gagné

### 3. Génération de Carte (Page `/share`)

**Fonctionnalités :**
- Prévisualisation de la carte (format Story 9:16)
- Fond dégradé dynamique selon le streak :
  - Vert : Séance du jour complétée
  - Bleu/Violet : 3-6 jours de streak
  - Orange/Rouge : 7+ jours de streak
- Avatar + nom + stats
- Génération d'image PNG haute qualité (1080x1920)

**Actions :**
- 📸 Générer la carte
- 📤 Partager (Web Share API)
- 💾 Télécharger l'image

### 4. Profil Public (Page `/u/:username`)

**Affichage :**
- Nom + username + avatar
- Stats publiques (séances, amis, badges)
- Badges récents (si profil public)
- Bouton "Ajouter à mon cercle"

**Visibilité :**
- `private` : Visible uniquement par l'utilisateur
- `friends` : Visible par les amis connectés (défaut)
- `public` : Visible par tous

---

## 🔌 API Endpoints

### Connexions sociales

#### `POST /social/connections/add`
Envoyer une demande d'ami.

**Body :**
```json
{
  "friendId": 42
}
```

**Response :**
```json
{
  "message": "Demande de connexion envoyée",
  "status": "pending"
}
```

#### `POST /social/connections/accept`
Accepter une demande d'ami.

#### `DELETE /social/connections/:friendId`
Supprimer une connexion.

#### `GET /social/connections/:userId?`
Récupérer la liste des amis.

**Response :**
```json
{
  "friends": [
    {
      "id": 42,
      "name": "Marie Dupont",
      "username": "marie_fit",
      "avatar_url": "...",
      "feed_unlocked_today": true,
      "unlocked_at": "2025-10-19T10:15:00Z"
    }
  ],
  "count": 5
}
```

#### `GET /social/search?q=username`
Rechercher des utilisateurs.

### Feed social

#### `GET /social/feed/:userId?`
Récupérer le feed social (activités des amis).

**Query params :**
- `limit` (défaut: 50)
- `offset` (défaut: 0)

**Response (verrouillé) :**
```json
{
  "locked": true,
  "message": "Bouge pour rallumer ton cercle 🔒",
  "feed": []
}
```

**Response (déverrouillé) :**
```json
{
  "locked": false,
  "feed": [
    {
      "id": 123,
      "user_id": 42,
      "type": "session_completed",
      "message": "Marie a terminé sa routine matinale",
      "emoji": "🌅",
      "created_at": "2025-10-19T08:30:00Z",
      "name": "Marie Dupont",
      "username": "marie_fit",
      "avatar_url": "..."
    }
  ]
}
```

#### `POST /social/feed/unlock`
Déverrouiller le feed après une session.

**Body :**
```json
{
  "sessionCompletionId": 456,
  "message": "Séance du matin terminée",
  "emoji": "💪"
}
```

**Response :**
```json
{
  "message": "Feed déverrouillé ! 🔓",
  "unlocked": true,
  "streak": 5
}
```

#### `GET /social/feed/status`
Vérifier le statut du feed.

**Response :**
```json
{
  "unlocked": true,
  "unlocked_at": "2025-10-19T10:15:00Z",
  "streak": 5,
  "total_days": 42
}
```

#### `GET /social/circle`
Récupérer les stats du cercle.

**Response :**
```json
{
  "user_status": {
    "unlocked": true,
    "streak": 5,
    "total_days": 42
  },
  "circle": {
    "total_friends": 8,
    "active_today": 3,
    "friends": [...]
  }
}
```

### Profil public

#### `GET /social/profile/:username`
Récupérer un profil public.

#### `GET /social/share/card?sessionCompletionId=456`
Obtenir les données pour générer une carte.

---

## 🎨 Composants Frontend

### `<CercleFytli />`

Affiche le cercle social animé.

**Props :**
```typescript
interface CercleFytliProps {
  className?: string;
  onFriendClick?: (friendId: number) => void;
}
```

**Usage :**
```tsx
import CercleFytli from '../components/CercleFytli';

<CercleFytli onFriendClick={(id) => navigate(`/u/${id}`)} />
```

### `<FeedCards />`

Affiche les cartes d'activité du feed.

**Props :**
```typescript
interface FeedCardsProps {
  feedEvents: FeedEvent[];
  loading?: boolean;
  onRefresh?: () => void;
}
```

### `<ShareCard />`

Génère une carte partageable.

**Props :**
```typescript
interface ShareCardProps {
  data: ShareCardData;
  onShare?: (imageUrl: string) => void;
}
```

---

## 🔄 Workflow Utilisateur

### 1. Démarrage de la journée

```
Ouvre l'app → Feed verrouillé? 
  → Oui: Affiche cercle flou + message "Bouge pour rallumer"
  → Non: Affiche feed + cercle actif
```

### 2. Après une séance

```
1. Utilisateur termine une séance
2. → SessionSummary appelle completionsService.create()
3. → Backend crée la completion
4. → Frontend appelle unlockFeed(completionId)
5. → Backend:
   - Insère dans social_unlocks (unlocked = true)
   - Crée un événement dans user_feed
   - Retourne le streak
6. → Frontend affiche "Cercle déverrouillé!" avec streak
7. → Bouton "Voir mon cercle" disponible
```

### 3. Partage sur les réseaux

```
1. Utilisateur va sur /share
2. → Charge les données via getShareCardData()
3. → Prévisualise la carte
4. → Clique "Générer"
5. → html-to-image convertit le DOM en PNG
6. → Clique "Partager"
7. → Web Share API (mobile) ou téléchargement (desktop)
```

---

## 🎮 Gamification

### Mécanique du Streak

Le **streak** est calculé automatiquement :
- +1 chaque jour où une séance est complétée
- Reset à 0 si un jour est sauté
- Halo doré sur l'avatar à partir de 3 jours
- Couleur de carte spéciale à 7+ jours

### Effet collectif

**Principe :** "Si je bouge, mes amis débloquent leur feed"

Quand un utilisateur complète une séance :
1. Son feed est déverrouillé
2. Un événement est créé dans `user_feed`
3. Tous ses amis qui ont un feed déverrouillé voient cet événement
4. Ça motive les amis à bouger aussi pour rester dans la boucle

**Bénéfice :** Crée un cercle vertueux de motivation collective.

---

## 🔐 Sécurité & Confidentialité

### Authentification

Tous les endpoints `/social/*` nécessitent un token JWT valide via le middleware `authenticateToken`.

### Visibilité des profils

Trois niveaux de confidentialité :
- **private** : Visible uniquement par l'utilisateur
- **friends** : Visible par les amis connectés (défaut)
- **public** : Visible par tout le monde

### Données partagées

Le feed social ne partage **jamais** :
- ❌ Les métriques de performance exactes (poids, reps, etc.)
- ❌ Les données sensibles (email, mot de passe, etc.)
- ❌ Les notes privées

Seul partage : 
- ✅ Nom, username, avatar
- ✅ Message positif généré ("a terminé une séance")
- ✅ Stats optionnelles publiques (durée générale, si l'utilisateur le souhaite)

---

## 🐛 Dépannage

### Erreur "Table doesn't exist"

**Solution :** Exécutez la migration SQL
```bash
mysql -u user -p database < backend-fytli/database/migration_social_features.sql
```

### Erreur "Cannot find module 'framer-motion'"

**Solution :**
```bash
cd frontend-fytli
npm install framer-motion html-to-image
```

### Feed ne se déverrouille pas

**Solution :**
1. Vérifiez les logs backend : `backend-fytli/logs/error-*.log`
2. Vérifiez la console navigateur (F12)
3. Testez l'endpoint manuellement :

```bash
# Remplacez TOKEN par votre JWT
curl -X POST http://localhost:9001/social/feed/unlock \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionCompletionId": 1, "message": "Test", "emoji": "💪"}'
```

### Routes 404

**Solution :**
1. Vérifiez que `routes/social.js` existe
2. Vérifiez `index.js` : `const socialRoutes = require('./routes/social');`
3. Vérifiez `index.js` : `app.use('/social', socialRoutes);`
4. Redémarrez le serveur

---

## 🚀 Prochaines améliorations possibles

### Court terme
- [ ] Notifications push quand un ami complète une séance
- [ ] Suggestions d'amis (amis communs)
- [ ] Réactions aux posts (👏, 🔥, 💪)

### Moyen terme
- [ ] Génération de messages AI via OpenAI (résumés plus personnalisés)
- [ ] Défis collectifs (ex: "Faites 3 séances cette semaine à plusieurs")
- [ ] Streak de groupe (halo spécial si tous les amis ont un streak)

### Long terme
- [ ] Classements/leaderboards (optionnels)
- [ ] Événements communautaires (challenges globaux)
- [ ] Intégration avec d'autres apps fitness (Strava, Apple Health)

---

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Fichiers créés** | 14 |
| **Lignes de code** | ~3500 |
| **Tables SQL** | 3 |
| **Endpoints API** | 11 |
| **Pages React** | 3 |
| **Composants** | 3 |
| **Documentation** | 2000+ lignes |

---

## 💡 Philosophie du Projet

**Motivation par le collectif, pas par la comparaison.**

Le Cercle Fytli ne montre **jamais** :
- ❌ Qui a fait le plus de séries
- ❌ Qui a soulevé le plus lourd
- ❌ Qui a couru le plus vite

Le Cercle Fytli montre **toujours** :
- ✅ Qui a bougé aujourd'hui
- ✅ Qui maintient un streak
- ✅ Qui inspire les autres

**L'objectif :** Créer une communauté bienveillante où chacun avance à son rythme, tout en étant motivé par l'énergie collective.

---

## 📞 Support

Pour toute question :
1. Consultez les logs : `backend-fytli/logs/`
2. Vérifiez la console du navigateur (erreurs React)
3. Testez les endpoints avec Postman/cURL

**Endpoints de test :**
```bash
# Statut du serveur
curl http://localhost:9001/

# Test authentification + social
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:9001/social/feed/status
```

---

**Créé avec ❤️ pour motiver le monde à bouger ensemble.**

**Projet réalisé le 19 octobre 2025**  
**Technologies : Node.js, Express, React, TypeScript, MySQL, Framer Motion**

