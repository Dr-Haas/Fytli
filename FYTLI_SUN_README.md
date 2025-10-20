# ☀️ Soleil Fytli - Composant React & React Native

## Description

Le **Soleil Fytli** est un composant visuel symbolisant l'énergie collective de la communauté Fytli. Il représente visuellement la philosophie centrale de l'application :

> **"Plus on bouge ensemble, plus la lumière s'intensifie."**

## Caractéristiques

### Visuelles
- 🌟 **Cœur lumineux** : Sphère centrale avec dégradé radial (jaune → orange → ambre)
- 💫 **Pulsation dynamique** : S'intensifie selon le niveau d'activité collective
- 🌊 **Halo lumineux** : Effet de glow qui pulse et brille
- ⚪ **Orbes gravitantes** : Petites bulles représentant les utilisateurs connectés
- ✨ **Animation d'arrivée** : Le halo pulse quand un nouvel utilisateur rejoint

### Techniques
- ✅ 100% SVG et CSS (pas de canvas ni d'images)
- ✅ Responsive et scalable
- ✅ Animations fluides et optimisées
- ✅ Support React et React Native

## Installation

### Version React (Web)

Le composant est disponible dans :
```
frontend-fytli/src/components/FytliSun.tsx
```

**Dépendances requises :**
```bash
npm install styled-components
npm install @types/styled-components --save-dev
```

### Version React Native (Mobile)

Le composant est disponible dans :
```
mobilApp-fytli/src/components/FytliSun.tsx
```

**Dépendances requises :**
```bash
npm install react-native-svg
```

## Utilisation

### Interface des Props

```typescript
interface FytliSunProps {
  activityLevel: number; // 0 à 1 (niveau d'activité collective)
  userCount: number;     // nombre d'utilisateurs connectés
}
```

### Exemple React (Web)

```tsx
import { FytliSun } from './components/FytliSun';

function SessionView() {
  const [activityLevel, setActivityLevel] = useState(0.5);
  const [userCount, setUserCount] = useState(4);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#000',
      minHeight: '100vh'
    }}>
      <FytliSun 
        activityLevel={activityLevel} 
        userCount={userCount} 
      />
    </div>
  );
}
```

### Exemple React Native (Mobile)

```tsx
import { FytliSun } from './components/FytliSun';

function SessionScreen() {
  const [activityLevel, setActivityLevel] = useState(0.5);
  const [userCount, setUserCount] = useState(4);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#000'
    }}>
      <FytliSun 
        activityLevel={activityLevel} 
        userCount={userCount} 
      />
    </View>
  );
}
```

## Comportement Dynamique

### Niveau d'activité (`activityLevel`)

Le niveau d'activité influence plusieurs aspects visuels :

- **0.0 (Aucune activité)** : Soleil calme, pulsation minimale
- **0.5 (Activité modérée)** : Soleil vivant, glow visible
- **1.0 (Activité maximale)** : Soleil intense, pulsation forte, halo éclatant

**Effets :**
- Intensité du glow/halo
- Amplitude de la pulsation
- Luminosité du cœur
- Taille de l'ombre portée

### Nombre d'utilisateurs (`userCount`)

- Chaque utilisateur est représenté par une orbe gravitant autour du soleil
- Maximum de 8 orbes affichées pour éviter la surcharge visuelle
- Vitesse et trajectoire différentes pour chaque orbe
- Couleurs variées dans la palette Fytli

### Animation d'arrivée

Quand `userCount` augmente :
1. Le halo pulse brièvement (0.8 secondes)
2. L'opacité et l'épaisseur du halo augmentent
3. Retour progressif à l'état normal

## Démo Interactive

Un fichier HTML de démonstration est disponible à la racine du projet :
```
fytli-sun-demo.html
```

Ouvrez-le dans un navigateur pour :
- ✅ Tester le rendu visuel
- ✅ Ajuster l'activité en temps réel
- ✅ Simuler l'arrivée d'utilisateurs
- ✅ Observer les animations

## Palette de Couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| Jaune clair | `#FFD75F` | Centre du soleil, orbes |
| Orange chaud | `#FF7A00` | Milieu du dégradé |
| Ambre profond | `#B84300` | Bord extérieur du soleil |
| Orange pastel | `#FFB347` | Halo lumineux |
| Jaune orangé | `#FFC64D` | Orbes secondaires |
| Orange vif | `#FF9A2B` | Orbes tertiaires |

## Cas d'Usage

### 1. Sessions collectives
Afficher l'énergie d'une session de workout en temps réel.

```tsx
<FytliSun 
  activityLevel={sessionIntensity} 
  userCount={participantsOnline} 
/>
```

### 2. Cercle Fytli
Représenter l'activité d'un cercle (groupe d'amis).

```tsx
<FytliSun 
  activityLevel={circleAverageActivity} 
  userCount={circleMembers.length} 
/>
```

### 3. Dashboard global
Vue d'ensemble de la communauté Fytli.

```tsx
<FytliSun 
  activityLevel={globalActivityLevel} 
  userCount={totalActiveUsers} 
/>
```

## Optimisations

### Performance
- Animations utilisant `transform` et `opacity` (GPU-accelerated)
- Nombre d'orbes limité à 8
- Pas de re-render inutile grâce aux animations CSS/Animated

### Accessibilité
- Composant purement décoratif
- Ne perturbe pas la navigation au clavier
- Peut être masqué avec `aria-hidden="true"` si nécessaire

## Architecture Technique

### Version React (Web)
- **styled-components** : CSS-in-JS pour les animations
- **Keyframes CSS** : Animations de pulsation et d'orbite
- **SVG natif** : Rendu vectoriel scalable
- **useEffect** : Détection des changements de props

### Version React Native
- **react-native-svg** : Support SVG cross-platform
- **Animated API** : Animations natives performantes
- **useRef** : Gestion des valeurs animées
- **Animated.Value** : Interpolations fluides

## Philosophie Fytli

Le Soleil Fytli incarne la vision collective de l'application :

1. **Connexion** : Les orbes représentent les individus unis autour d'un objectif commun
2. **Énergie** : Plus l'activité est forte, plus la lumière rayonne
3. **Inspiration** : Un symbole visuel motivant qui encourage l'effort collectif
4. **Communauté** : Chacun contribue à faire briller le soleil plus intensément

---

## Licence

© 2025 Fytli - Tous droits réservés

**Créé avec ❤️ pour la communauté Fytli**

