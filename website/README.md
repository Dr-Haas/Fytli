# 🌐 Fytli - Landing Page

Landing page Next.js pour Fytli - **"Seul, mais ensemble"**

---

## 📖 À Propos

Cette landing page présente Fytli, une application gratuite qui permet à chacun de s'entraîner seul, tout en partageant sa progression avec ses amis.

### 🎯 Concept

> **Pas de compétition, pas de performance — juste du mouvement, de la motivation et une ambiance positive.**

La landing page explique le concept simplement, à travers des visuels chaleureux, sans CTA commercial.

---

## 🌈 Style Graphique

### Ambiance Visuelle
- Douce, lumineuse, dégradé jaune → orange → rouge Fytli
- Inspiration : illustrations Pixar-style, silhouettes expressives, tons crème et orangés
- Typographie : arrondie, friendly (Poppins)
- Icônes : minimalistes, en aplats, avec contours doux

### Couleurs
```css
--fytli-yellow: #FFD56B
--fytli-orange: #FFA34A
--fytli-red: #FF7948
--fytli-dark: #4A2E20
--fytli-cream: #FFF5E6
--fytli-light: #FFF8EE
```

---

## 🚀 Installation

### Prérequis
- **Node.js** 20+ ou 22+
- **npm** 10+

### 1. Installation des dépendances

```bash
cd website
npm install
```

### 2. Configuration des variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditer `.env.local` pour pointer vers votre frontend local :
```env
NEXT_PUBLIC_APP_URL=http://localhost:5173
NEXT_PUBLIC_API_URL=http://localhost:9001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Ajouter les images

Placer les images suivantes dans `/public/assets/` :
- **fytli-hero.png** → Couple s'entraînant dans le salon
- **fytli-community.png** → Immeuble connecté par les flux lumineux
- **fytli-dashboard.png** → Groupe qui se félicite ("Nice!" / "Great job!")

### 4. Lancer en développement

```bash
npm run dev
```

Le site démarre sur **http://localhost:3000**

Les boutons "Se connecter" et "Commencer gratuitement" redirigent vers l'application frontend (port 5173 en local).

---

## 📱 Structure

```
website/
├── app/
│   ├── layout.tsx          # Layout racine + metadata
│   ├── page.tsx            # Page d'accueil (Hero + Sections)
│   └── globals.css         # Styles globaux + Poppins
│
├── public/
│   ├── assets/             # Images de la landing
│   │   ├── fytli-hero.png
│   │   ├── fytli-community.png
│   │   └── fytli-dashboard.png
│   └── favicon.ico
│
├── next.config.ts          # Configuration Next.js
├── tailwind.config.ts      # Configuration TailwindCSS
├── tsconfig.json           # Configuration TypeScript
└── package.json
```

---

## 🛠️ Technologies

- **Next.js 15** - App Router
- **React 19** - UI Library
- **TypeScript 5** - Type Safety
- **TailwindCSS 3** - Styling
- **Poppins** - Font (Google Fonts)

---

## 🏗️ Build

### Production Build

```bash
npm run build
```

Le build génère :
- `.next/` - Build optimisé Next.js
- Prêt pour déploiement sur Vercel, Netlify, ou VPS

### Preview du Build

```bash
npm run build
npm start
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
cd website
vercel
```

### Option 2 : Netlify

1. Connecter le repo GitHub
2. Build command : `npm run build`
3. Publish directory : `.next`

### Option 3 : VPS (Nginx + PM2)

```bash
# Build
npm run build

# Lancer avec PM2
pm2 start npm --name "fytli-website" -- start
pm2 save
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name fytli.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📝 Scripts

```bash
npm run dev      # Dev server (port 3000)
npm run build    # Build production
npm start        # Start production server
npm run lint     # Linter ESLint
```

---

## ✨ Fonctionnalités

### Header Fixe
- Logo Fytli
- Bouton "Se connecter" (redirection vers l'app)
- Background semi-transparent avec effet blur
- Sticky en haut de page

### Call-to-Actions
- **"Commencer gratuitement"** - Bouton principal (dégradé rouge-orange)
- **"Créer un compte"** - Bouton secondaire (fond blanc)
- **"Se connecter"** - Dans le header
- Tous les boutons redirigent vers l'application frontend configurée

### Configuration Dynamique
- URLs configurables via variables d'environnement
- Support développement local et production
- Fichier `lib/config.ts` pour centraliser la config

---

## 🎨 Sections de la Page

### 1. Hero
- Image du couple s'entraînant
- Titre "Fytli"
- Tagline "Seul, mais ensemble."
- Description courte
- Flèche animée (bounce)

### 2. L'Esprit Fytli
- Image de la communauté connectée
- Explication du concept
- Fond crème (#FFF5E6)

### 3. La Motivation Partagée
- Image du groupe qui se félicite
- Message de motivation collective
- Dégradé orange

### 4. Footer
- Message gratuit et bienveillant
- Copyright 2025
- Fond dégradé rouge-orange

---

## 🖼️ Images

Les images doivent suivre le style :
- **Style** : Illustrations Pixar-style, silhouettes expressives
- **Tons** : Crème, orangés, chaleureux
- **Format** : PNG avec transparence ou fond uni
- **Résolution** : 1920x1080 ou supérieur

---

## 📞 Contact

- **Email** : contact@fytli.app
- **Website** : [fytli.app](https://fytli.app)

---

## 📄 License

© 2025 Fytli – L'esprit du mouvement partagé

---

<div align="center">

**Fytli - Bouge mieux, vis mieux. 💪**

Made with ❤️ and 🔥

</div>

