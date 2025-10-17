# 🔐 Contexte d'Authentification (AuthContext)

## 🎯 Rôle et responsabilité

Le `AuthContext` est le gestionnaire central de l'état d'authentification de l'application. Il fournit un accès global aux informations utilisateur et aux méthodes de connexion/déconnexion à tous les composants de l'application.

## 📦 Ce qu'il gère

### État global
- **user** : Objet utilisateur actuel (null si non connecté)
- **token** : Token JWT stocké en localStorage
- **isAuthenticated** : Boolean indiquant l'état de connexion
- **isLoading** : Boolean pour les états de chargement

### Méthodes exposées
- **login(credentials)** : Connexion utilisateur → POST /auth/login
- **register(credentials)** : Inscription utilisateur → POST /auth/register
- **logout()** : Déconnexion et nettoyage du localStorage

## 🔒 Sécurité

### Storage du token
- Token JWT stocké dans **localStorage** (clé: 'token')
- User data stocké dans **localStorage** (clé: 'user') en JSON
- Nettoyage automatique lors de la déconnexion

### Injection du token
- Le token est automatiquement injecté dans les headers Axios via un intercepteur dans `api.ts`
- Format : `Authorization: Bearer <token>`

### Gestion des erreurs 401
- Si le backend renvoie 401 (Unauthorized) → redirection automatique vers `/login`
- Nettoyage du localStorage pour éviter les tokens expirés

## 🔄 Cycle de vie

1. **Initialisation** : Au mount, vérifie si un token existe dans localStorage
2. **Connexion** : Appel API → stockage token + user → mise à jour état
3. **Navigation** : Composant `PrivateRoute` vérifie `isAuthenticated`
4. **Déconnexion** : Nettoyage localStorage → redirection login

## 🧩 Utilisation dans l'app

### Provider
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### Consumer (via hook)
```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

## ❌ Ce qu'il ne gère PAS

- ❌ Refresh token (à implémenter si nécessaire)
- ❌ Remember me / cookies
- ❌ OAuth / Social login
- ❌ Vérification email
- ❌ Réinitialisation mot de passe

## 🚀 Évolutions possibles

### Court terme
- Ajouter un timeout pour expiration token
- Gestion des erreurs réseau plus fine
- Loading states plus précis

### Moyen terme
- Refresh token automatique
- Remember me avec cookies sécurisés
- Gestion des permissions/rôles

### Long terme
- OAuth 2.0 (Google, Facebook)
- Biométrie (FaceID, TouchID)
- MFA (Multi-Factor Authentication)

## 🔗 Dépendances

- `authService` → Appels API
- `localStorage` → Persistance token
- `React Context API` → Propagation état
- `useEffect` → Initialisation au mount

## 🎨 Philosophie

Le contexte d'authentification suit le principe **"Single Source of Truth"** :
- Un seul endroit pour l'état d'auth
- Propagation automatique aux enfants
- Pas de duplication de logique
- Facilite la maintenance et les tests

---

**Fichier** : `/src/contexts/AuthContext.tsx`  
**Hook** : `useAuth()`

