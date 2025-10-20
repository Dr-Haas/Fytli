# 🚀 Guide de démarrage rapide - Fytli Mobile

## Installation

### 1. Installer les dépendances
```bash
cd /Users/garyhaas/Desktop/Fytli/mobilApp-fytli
npm install
```

### 2. Configurer l'environnement
Le fichier `.env` est déjà créé avec les valeurs par défaut :
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENV=development
```

### 3. Lancer l'application

#### Option A : Avec Expo Go (recommandé pour débuter)
```bash
npm start
```
Scannez le QR code avec :
- **iOS** : App Appareil photo
- **Android** : App Expo Go

#### Option B : Simulateur iOS
```bash
npm run ios
```

#### Option C : Émulateur Android
```bash
npm run android
```

#### Option D : Navigateur web
```bash
npm run web
```

## 🎯 Navigation dans l'app

### Flux principal
```
Splash → Login → Dashboard → Feed/Workout
```

### Écrans disponibles

1. **Splash** (`/`) - Écran d'accueil avec animation
2. **Login** - Connexion/inscription (peut être sautée)
3. **Dashboard** - Cercle Fytli avec amis
4. **Feed** - Activités des amis (si déverrouillé)
5. **LockedFeed** - État verrouillé du feed
6. **Workout** - Séance d'entraînement
7. **SessionSummary** - Résumé après séance
8. **Profile** - Profil utilisateur
9. **FriendProfile** - Profil d'un ami
10. **DailyCard** - Carte partageable

## 🎨 Personnalisation

### Modifier les couleurs
Éditez `/src/config/theme.ts` :
```typescript
export const COLORS = {
  yellow: '#FFD56B',
  orange: '#FFA34A',
  red: '#FF7948',
  // ...
};
```

### Ajouter un nouvel écran
1. Créer le fichier dans `/src/screens/NouvelEcran.tsx`
2. L'exporter dans `/src/screens/index.ts`
3. L'ajouter dans `App.tsx` :
```typescript
<Stack.Screen 
  name="NouvelEcran" 
  component={NouvelEcran}
/>
```

### Créer un composant
1. Créer le fichier dans `/src/components/MonComposant.tsx`
2. L'exporter dans `/src/components/index.ts`
3. L'utiliser :
```typescript
import { MonComposant } from '@components';
```

## 🐛 Résolution de problèmes

### Erreur "Module not found"
```bash
# Nettoyer le cache
npm start -- --clear

# Ou
expo start -c
```

### Problème d'alias de chemin
Vérifier que `babel.config.js` contient le plugin `module-resolver`.

### Erreur de dépendances
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📱 Tests sur différents appareils

### iOS
- iPhone SE (petits écrans)
- iPhone 14 Pro (écrans modernes)
- iPad (tablette)

### Android
- Pixel 5 (référence)
- Samsung Galaxy (écrans variés)

## 🔗 Connexion au backend

Pour connecter l'app au backend Fytli :

1. Démarrer le backend :
```bash
cd ../backend-fytli
npm start
```

2. Mettre à jour l'URL dans `.env` :
```
# Pour iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Pour appareil physique (remplacer par votre IP)
EXPO_PUBLIC_API_URL=http://192.168.1.X:3000/api

# Pour Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

3. Relancer l'app

## 📊 Structure des données

### Utilisateur
```typescript
{
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
```

### Séance
```typescript
{
  id: number;
  exercises: Exercise[];
  duration: number;
  completedAt: string;
}
```

Voir `/src/types/index.ts` pour tous les types.

## 🎯 Prochaines étapes

1. ✅ Installation et lancement
2. ✅ Explorer les écrans
3. ⏳ Connecter au backend
4. ⏳ Implémenter l'authentification
5. ⏳ Ajouter les notifications push
6. ⏳ Tester sur appareils réels

## 💡 Astuces

- Utilisez le raccourci `r` dans le terminal Expo pour recharger
- Utilisez `j` pour ouvrir le debugger
- Activez "Fast Refresh" pour les mises à jour en temps réel
- Consultez les logs avec `npx react-native log-ios` ou `log-android`

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Besoin d'aide ?** Consultez le `README_FYTLI.md` pour plus de détails !

