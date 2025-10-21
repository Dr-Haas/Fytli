# ⚡ Quick Start - Projet Fytli

Guide de démarrage rapide pour le projet Fytli après installation ou mise à jour.

---

## 🚀 Démarrage Rapide (5 minutes)

### 1️⃣ Installer les dépendances

```bash
# Backend
cd backend-fytli
npm install

# Frontend
cd ../frontend-fytli
npm install

# Admin Panel
cd ../admin-panel
npm install

# Mobile App (si nécessaire)
cd ../mobilApp-fytli
npm install
```

### 2️⃣ Créer les fichiers .env

**Backend** (`backend-fytli/.env`) :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=followSport_app
DB_PORT=3306
PORT=9001
NODE_ENV=development
JWT_SECRET=55dcd7551dddcf4300a37f9e053e4cd2fd046b0e3fd7db5cc9e5cac8300747e8edb0d87495fa63c5d320af33337c5876b55294947bc86ce4083b3e4372cdc292
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend-fytli/.env`) :
```env
VITE_API_URL=http://localhost:9001
```

**Admin Panel** (`admin-panel/.env`) :
```env
VITE_API_URL=http://localhost:9001
```

### 3️⃣ Créer la base de données

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS followSport_app;
EXIT;
```

### 4️⃣ Ajouter des données de test (optionnel)

```bash
cd backend-fytli
mysql -u root -p followSport_app < database/quick_seed_feed.sql
```

### 5️⃣ Démarrer les services

```bash
# Terminal 1 - Backend
cd backend-fytli
npm run dev

# Terminal 2 - Frontend
cd frontend-fytli
npm run dev

# Terminal 3 - Admin Panel (optionnel)
cd admin-panel
npm run dev
```

### 6️⃣ Vérification

- Backend : http://localhost:9001
- Frontend : http://localhost:5173
- Admin Panel : http://localhost:5174

---

## ✅ Vérifications rapides

### Dans l'application web :

1. **Login** ✓
   ```
   http://localhost:5173/login → Se connecter
   ```

2. **Profil** ✓
   ```
   Onglet Profil → Doit afficher votre profil
   ```

3. **Programmes** ✓
   ```
   Onglet Programmes → Liste des programmes disponibles
   ```

4. **Feed Social** ✓
   ```
   /feed → Feed verrouillé (si pas de séance aujourd'hui)
   Compléter une séance → Feed déverrouillé ✨
   ```

---

## 🎨 Si les styles ne s'appliquent pas

### Frontend/Admin Web

```bash
# Nettoyer le cache
cd frontend-fytli  # ou admin-panel
rm -rf node_modules/.cache
npm run dev
```

### Mobile App

```bash
cd mobilApp-fytli

# Nettoyer le cache Metro
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true

# Démarrer avec cache reset
npx react-native start --reset-cache

# Dans un autre terminal, rebuild
npx expo run:ios  # ou npx expo run:android
```

---

## 🐛 Problèmes courants

### "Profil non trouvé" (Mobile)
```
1. Allez dans l'onglet Profil
2. Cliquez sur "🔍 Voir le Debug complet"
3. Vérifiez que Token et User sont présents
4. Si non, déconnectez-vous et reconnectez-vous
```

### "Feed vide"
```
1. Exécutez le script SQL de données de test
2. OU complétez une session dans l'app
3. Le feed se remplira automatiquement
```

### "Connection refused" / "Network Error"
```
1. Vérifiez que le backend est démarré (http://localhost:9001)
2. Vérifiez le fichier .env du frontend (VITE_API_URL)
3. Redémarrez le backend
```

### "Permissions photo refusées" (Mobile)
```
iOS:
Réglages → Fytli → Activer Caméra et Photos

Android:
Paramètres → Apps → Fytli → Permissions → Activer Caméra et Stockage
```

### "Table doesn't exist"
```bash
# Exécuter les migrations
cd backend-fytli
mysql -u root -p followSport_app < database/migration_social_features.sql
```

---

## 📝 Logs à surveiller

Ouvrez les terminaux et cherchez :

✅ **Bons signes** :
```
✅ Login successful - User: {...}
✅ Auth stored in AsyncStorage
✅ Completion enregistrée
✅ Feed déverrouillé - Streak: X
✅ Connexion MySQL établie
🚀 Serveur démarré sur le port 9001
```

⚠️ **Warnings normaux** (ne pas s'inquiéter) :
```
⚠️ Stats non disponibles
⚠️ Badges non disponibles
⚠️ 401 sur /social/profile/3
```

❌ **Erreurs à corriger** :
```
❌ Token invalide détecté
❌ Erreur sauvegarde completion
❌ Erreur lors de la connexion
❌ Cannot connect to MySQL
```

---

## 🎯 Test complet (10 minutes)

### Web (Frontend)
```
1. ✓ Déconnexion / Reconnexion
2. ✓ Aller sur Profil → Voir les stats
3. ✓ Programmes → Consulter un programme
4. ✓ Feed → Voir le cercle Fytli
5. ✓ Share → Générer une carte
```

### Admin Panel
```
1. ✓ Connexion admin
2. ✓ Programmes → Créer un programme
3. ✓ Utilisateurs → Voir la liste
4. ✓ Badges → Gérer les badges
```

### Mobile App
```
1. ✓ Déconnexion / Reconnexion
2. ✓ Aller sur Profil → Voir les stats
3. ✓ Programmes → Créer un programme
4. ✓ S'inscrire au programme
5. ✓ Démarrer une session
6. ✓ Compléter la session
7. ✓ Ajouter une photo
8. ✓ Sélectionner un feeling
9. ✓ Vérifier "Feed déverrouillé !"
10. ✓ Vérifier le streak
```

---

## 📦 Ports Utilisés

| Service      | Port  | URL                     |
|-------------|-------|-------------------------|
| Backend     | 9001  | http://localhost:9001   |
| Frontend    | 5173  | http://localhost:5173   |
| Admin Panel | 5174  | http://localhost:5174   |

---

## 📞 Besoin d'aide ?

1. **Logs Backend** : `backend-fytli/logs/error-*.log`
2. **Logs Frontend** : Console navigateur (F12 → Console)
3. **Logs Mobile** : Terminal Metro + Device logs
4. **Database** : Vérifiez que les tables existent et ont des données
5. **Permissions** : Vérifiez dans les réglages du téléphone

**Commandes de diagnostic :**
```bash
# Backend
curl http://localhost:9001/

# Frontend
curl http://localhost:5173/

# Base de données
mysql -u root -p -e "USE followSport_app; SHOW TABLES;"
```

---

## ✨ Fonctionnalités principales

Votre app Fytli inclut maintenant :

### Core Features
- ✅ Authentification (JWT)
- ✅ Gestion des programmes d'entraînement
- ✅ Sessions et exercices
- ✅ Inscriptions et complétions
- ✅ Composition corporelle
- ✅ Objectifs hebdomadaires

### Cercle Fytli (Social)
- ✅ Feed social verrouillé/déverrouillé
- ✅ Cercle d'amis animé
- ✅ Système de streak
- ✅ Génération de cartes partageables
- ✅ Profils publics

### Gamification
- ✅ Système de badges
- ✅ Statistiques utilisateur
- ✅ Progression par programme
- ✅ Achievements

### UI/UX
- ✅ Design System cohérent
- ✅ Composant Soleil Fytli ☀️
- ✅ Animations Framer Motion
- ✅ Responsive mobile/tablet/desktop

---

## 🎨 Design System

Pour respecter le design system Fytli :
- Consultez `DESIGN_SYSTEM_FYTLI.md` pour la documentation complète
- Consultez `DESIGN_SYSTEM_QUICK_REFERENCE.md` pour une référence rapide
- Ouvrez `design-system-demo.html` pour une démo interactive

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

| Document | Description |
|----------|-------------|
| `CERCLE_FYTLI.md` | Guide complet du système social |
| `CORRECTIONS_ET_RESOLUTIONS.md` | Toutes les corrections appliquées |
| `INSTALLATION_ET_CONFIGURATION.md` | Guide d'installation détaillé |
| `FYTLI_SUN.md` | Documentation du composant Soleil |
| `DESIGN_SYSTEM_FYTLI.md` | Design System complet |
| `README.md` | Vue d'ensemble du projet |

---

**✨ C'est tout ! Bon développement ! 🚀**

**Dernière mise à jour : 21 octobre 2025**

