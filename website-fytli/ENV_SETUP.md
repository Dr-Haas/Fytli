# 🔧 Configuration des Variables d'Environnement

## Pour le développement local

Créez un fichier `.env.local` à la racine du dossier `website` avec ce contenu :

```env
NEXT_PUBLIC_API_URL=http://localhost:9001
```

### Création automatique

```bash
cd website
echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
```

### Création manuelle

1. Créez un nouveau fichier nommé `.env.local` dans le dossier `website`
2. Copiez-collez cette ligne :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9001
   ```
3. Sauvegardez le fichier

## Pour la production

Si vous déployez sur Render, Vercel ou une autre plateforme, ajoutez cette variable d'environnement dans les paramètres de votre plateforme :

**Nom** : `NEXT_PUBLIC_API_URL`  
**Valeur** : `https://fytli.onrender.com`

### Vercel

1. Dashboard → Project Settings → Environment Variables
2. Ajoutez `NEXT_PUBLIC_API_URL` avec la valeur de production

### Render

1. Dashboard → Web Service → Environment
2. Ajoutez `NEXT_PUBLIC_API_URL` avec la valeur de production

### Netlify

1. Site settings → Build & deploy → Environment
2. Ajoutez `NEXT_PUBLIC_API_URL` avec la valeur de production

## ⚠️ Important

- Le préfixe `NEXT_PUBLIC_` est obligatoire pour que la variable soit accessible côté client
- Ne committez jamais le fichier `.env.local` (il est déjà dans `.gitignore`)
- Assurez-vous que le backend est accessible à l'URL configurée

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. Lancez le backend : `cd ../backend-followsport && npm start`
2. Lancez la landing page : `cd website && npm run dev`
3. Ouvrez http://localhost:3000
4. Les statistiques devraient se charger automatiquement

