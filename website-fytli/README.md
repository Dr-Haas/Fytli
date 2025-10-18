# 🚀 Fytli - Landing Page

Landing page moderne et motivante pour Fytli, développée avec Next.js 15, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

- 🎨 Design moderne avec dégradés colorés
- 📊 Statistiques dynamiques connectées au backend
- 📱 Entièrement responsive
- ⚡ Performance optimisée avec Next.js App Router
- 🎯 Sections : Hero, Stats, Features, CTA, Footer

## 🛠️ Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **Lucide React** - Icônes modernes
- **Axios** - Requêtes HTTP

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier .env.local (pour développement local)
echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
```

## 🚀 Démarrage

### Développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Production

```bash
# Build
npm run build

# Démarrer le serveur de production
npm start
```

## 🌐 Configuration Backend

Le site se connecte au backend Fytli pour récupérer les statistiques en temps réel :

- **Développement** : `http://localhost:9001`
- **Production** : `https://fytli.onrender.com`

### Endpoints utilisés

- `GET /admin/stats` - Statistiques globales (utilisateurs, programmes, exercices)
- `GET /badges` - Liste des badges disponibles
- `GET /sessions` - Liste des sessions disponibles

## 📂 Structure

```
website/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Page principale
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── Hero.tsx          # Section Hero
│   ├── Stats.tsx         # Statistiques dynamiques
│   ├── Features.tsx      # Fonctionnalités
│   ├── CTA.tsx           # Call to action
│   └── Footer.tsx        # Footer
├── lib/                  # Utilitaires
│   └── api.ts            # Service API
└── public/               # Assets statiques
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies via Tailwind CSS :
- Violet/Rose : `from-purple-600 via-pink-500`
- Orange : `to-orange-400`

### Contenu

Pour modifier le contenu, éditer les fichiers dans `/components` :
- **Hero.tsx** : Titre, slogan, description
- **Features.tsx** : Liste des fonctionnalités
- **CTA.tsx** : Appel à l'action final

## 🔗 Liens

- **Application** : [https://app.fytli.fr](https://app.fytli.fr)
- **Admin Panel** : [https://admin.fytli.fr](https://admin.fytli.fr)
- **Backend API** : [https://fytli.onrender.com](https://fytli.onrender.com)

## 📝 Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:9001
```

Pour la production, créer `.env.production` :

```env
NEXT_PUBLIC_API_URL=https://fytli.onrender.com
```

## 🚢 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Autres plateformes

Compatible avec toutes les plateformes supportant Next.js :
- Netlify
- Render
- Railway
- etc.

## 📄 License

© 2025 Fytli. Tous droits réservés.
