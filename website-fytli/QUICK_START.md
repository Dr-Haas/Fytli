# 🚀 Démarrage Rapide - Fytli Landing Page

## Prérequis

- Node.js 18+ installé
- Backend Fytli en cours d'exécution sur le port 9001

## Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
cd website
npm install
```

### 2️⃣ Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du dossier `website` :

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
```

Ou créez-le manuellement avec ce contenu :

```env
NEXT_PUBLIC_API_URL=http://localhost:9001
```

### 3️⃣ Démarrer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

## ✅ Vérification

1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Vous devriez voir la landing page Fytli
3. Les statistiques devraient se charger automatiquement depuis le backend

## 🔧 Résolution de problèmes

### Les stats ne se chargent pas

**Problème** : Les statistiques affichent "—" au lieu des chiffres

**Solutions** :
1. Vérifiez que le backend tourne sur `http://localhost:9001`
2. Testez l'endpoint manuellement : `curl http://localhost:9001/admin/stats`
3. Vérifiez la console du navigateur pour les erreurs CORS

### Erreur CORS

Si vous voyez une erreur CORS dans la console :

1. Vérifiez que le backend autorise `http://localhost:3000` dans les origines CORS
2. Dans `/backend-followsport/index.js`, la ligne 41 devrait contenir :
   ```javascript
   'http://localhost:3000',  // Alternative locale
   ```

## 🚢 Build de production

Pour créer une version de production :

```bash
npm run build
npm start
```

Le site de production sera accessible sur http://localhost:3000

## 📝 Variables d'environnement

### Développement local (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:9001
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://fytli.onrender.com
```

## 🎨 Personnalisation

Pour personnaliser le contenu :

- **Hero** : Modifier `/components/Hero.tsx`
- **Features** : Modifier `/components/Features.tsx`
- **CTA** : Modifier `/components/CTA.tsx`
- **Stats** : Les stats sont automatiques depuis le backend

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

