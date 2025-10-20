# mobilApp-fytli

Application mobile React Native avec TypeScript pour Fytli - Votre application de fitness.

## 🚀 Démarrage

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI
- Un émulateur iOS/Android ou l'application Expo Go sur votre téléphone

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Modifiez `.env` avec vos propres valeurs.

3. Démarrer l'application :
```bash
npm start
```

### Scripts disponibles

- `npm start` - Démarre le serveur de développement Expo
- `npm run android` - Lance l'application sur Android
- `npm run ios` - Lance l'application sur iOS
- `npm run web` - Lance l'application dans le navigateur
- `npm test` - Lance les tests
- `npm run lint` - Vérifie le code avec ESLint

## 📁 Structure du projet

```
mobilApp-fytli/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── screens/         # Écrans de l'application
│   │   └── HomeScreen.tsx
│   ├── services/        # Services API
│   │   └── api.ts
│   ├── types/           # Types TypeScript
│   │   └── index.ts
│   ├── config/          # Configuration
│   │   └── api.ts
│   └── utils/           # Fonctions utilitaires
│       └── helpers.ts
├── assets/              # Images, polices, etc.
├── App.tsx              # Point d'entrée de l'application
├── app.json             # Configuration Expo
├── package.json         # Dépendances
└── tsconfig.json        # Configuration TypeScript
```

## 🛠️ Technologies utilisées

- **React Native** - Framework mobile
- **TypeScript** - Typage statique
- **Expo** - Plateforme de développement
- **React Navigation** - Navigation
- **Axios** - Client HTTP
- **ESLint** - Linter

## 📱 Fonctionnalités

- ✅ Navigation entre écrans
- ✅ Composants UI réutilisables
- ✅ Service API avec intercepteurs
- ✅ Typage TypeScript strict
- ✅ Validation de formulaires
- ✅ Design moderne et responsive

## 🎨 Design

L'application utilise une palette de couleurs moderne avec :
- Couleur principale : Indigo (#6366f1)
- Couleur secondaire : Violet (#8b5cf6)
- Design Material avec ombres et bordures arrondies

## 🔧 Configuration

### Alias de chemins

Le projet utilise des alias pour simplifier les imports :
- `@/` → `src/`
- `@components/` → `src/components/`
- `@screens/` → `src/screens/`
- `@services/` → `src/services/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`
- `@config/` → `src/config/`

### API

L'URL de l'API peut être configurée dans le fichier `.env` :
```
EXPO_PUBLIC_API_URL=http://votre-api.com/api
```

## 📄 Licence

Propriétaire - Fytli

## 👥 Auteurs

Équipe Fytli

