# 🔧 Configuration des Variables d'Environnement

## 📝 Fichier `.env`

Le fichier `.env` contient les variables d'environnement pour votre application.

### ⚠️ Important
- Le fichier `.env` est **ignoré par Git** (sécurité)
- Ne partagez **jamais** votre fichier `.env` sur GitHub
- Utilisez `.env.example` comme template

## 🛠️ Configuration actuelle

### Développement local

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3001
```

### Production

Pour déployer en production, modifiez l'URL :

```env
VITE_API_URL=https://votre-api-production.com
```

## 📦 Utilisation dans le code

Les variables d'environnement Vite sont accessibles via `import.meta.env` :

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### ⚡ Règles Vite

1. **Préfixe obligatoire** : `VITE_` pour être exposé au client
2. **Type string** : Toutes les variables sont des strings
3. **Rechargement** : Redémarrer le serveur après modification

## 🔄 Différents environnements

### `.env` (par défaut)
Utilisé dans tous les environnements

### `.env.local` (ignoré par Git)
Variables locales personnelles

### `.env.production`
Variables spécifiques à la production

### `.env.development`
Variables spécifiques au développement

## 🚀 Exemple complet

```env
# Backend API
VITE_API_URL=http://localhost:3001

# Autres variables (exemples pour plus tard)
# VITE_APP_NAME=FollowSport
# VITE_ENABLE_ANALYTICS=false
# VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## 🔍 Variables disponibles

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL du backend | `http://localhost:3001` |

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Créer un fichier `.env.production`
- [ ] Définir `VITE_API_URL` avec l'URL de production
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Tester le build : `npm run build`
- [ ] Configurer les variables sur votre plateforme de déploiement (Vercel, Netlify, etc.)

## 🎯 Plateformes de déploiement

### Vercel
Ajoutez les variables dans : **Settings > Environment Variables**

### Netlify
Ajoutez les variables dans : **Site settings > Build & deploy > Environment**

### Autres
Consultez la documentation de votre plateforme pour configurer les variables d'environnement.

---

**Note** : Le fichier actuel pointe vers `http://localhost:3001` pour le développement local.

