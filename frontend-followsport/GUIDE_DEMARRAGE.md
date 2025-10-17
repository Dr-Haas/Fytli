# 🚀 Guide de Démarrage - FollowSport Frontend

## ✅ Prérequis

- Node.js v22+ installé
- Backend FollowSport lancé sur `http://localhost:3001`

## 📦 Installation

```bash
# Se placer dans le dossier frontend
cd frontend-followsport

# Installer les dépendances (si pas déjà fait)
npm install
```

## 🎬 Lancement

```bash
# Démarrer en mode développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

## 🔐 Premier utilisateur

### Option 1 : Inscription
1. Ouvrir http://localhost:5173/login
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire
4. Vous serez automatiquement redirigé vers le dashboard

### Option 2 : Utiliser un compte existant
Si vous avez déjà créé un compte via Postman ou le backend :
1. Ouvrir http://localhost:5173/login
2. Entrer vos identifiants
3. Cliquer sur "Se connecter"

## 📱 Pages disponibles

Une fois connecté, vous aurez accès à :

- **Dashboard** (`/dashboard`) - Vue d'ensemble et statistiques
- **Programmes** (`/programs`) - Liste complète des programmes d'entraînement
- **Profil** (`/profile`) - Vos informations personnelles

## 🎨 Features

### ✨ Animations
- Entrées de page fluides avec Framer Motion
- Hover effects sur les cards
- Transitions douces

### 🎯 UX
- Design inspiré de Revolut/Stripe
- Responsive sur tous les écrans
- Sidebar sur desktop
- Navigation intuitive

### 🔒 Sécurité
- JWT automatiquement stocké
- Routes protégées
- Redirection automatique si non authentifié
- Déconnexion propre

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

Vérifiez que :
1. Le backend est bien lancé sur `http://localhost:3001`
2. Pas d'erreurs CORS (normalement configurées côté backend)
3. Le fichier `src/services/api.ts` pointe vers la bonne URL

### Erreur 401 après connexion

Cela signifie que le token JWT est invalide ou expiré :
1. Déconnectez-vous
2. Reconnectez-vous avec vos identifiants

### Les programmes ne s'affichent pas

Vérifiez que :
1. Des programmes existent dans la base de données
2. Le backend répond correctement à `GET /programs`
3. Pas d'erreurs dans la console du navigateur (F12)

## 📝 Structure du code

```
/src
  /components       → Composants réutilisables
    /ui             → Composants de base
  /pages            → Pages principales
  /contexts         → AuthContext
  /services         → Appels API
  /hooks            → Custom hooks
  /types            → Types TypeScript
  /lib              → Utilitaires
  /styles           → CSS global
```

## 🎯 Prochaines étapes

Maintenant que l'application est lancée :

1. **Explorez le Dashboard** - Voir les stats et programmes récents
2. **Consultez les Programmes** - Liste complète avec recherche
3. **Modifiez votre Profil** - Vos informations personnelles
4. **Testez la déconnexion** - Et reconnectez-vous

## 🆘 Besoin d'aide ?

Consultez :
- `context.md` - Vue d'ensemble du projet
- `README.md` - Documentation technique
- `/src/*/context.md` - Documentation de chaque dossier

---

**Enjoy! 💪**

