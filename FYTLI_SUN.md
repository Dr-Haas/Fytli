# ☀️ Soleil Fytli - Guide Complet

> **"Plus on bouge ensemble, plus la lumière s'intensifie."**

Le Soleil Fytli est un composant visuel symbolisant l'énergie collective de la communauté Fytli.

---

## 📋 Table des Matières

- [Description](#description)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Intégrations](#intégrations-réalisées)
- [Démo](#démo-interactive)

---

## Description

### Caractéristiques Visuelles

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

---

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

---

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

---

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

---

## Intégrations Réalisées

### 1. 🏋️ Écran de Repos (WorkoutScreen)

**Localisation :** `mobilApp-fytli/src/screens/WorkoutScreen.tsx`

**Utilisation :** Remplace l'icône pendant la phase de repos entre les séries.

**Comportement :**
- Le soleil s'intensifie progressivement au fur et à mesure que le temps de repos diminue
- `activityLevel` = `1 - (restTimeLeft / rest_time_sec)`
- Démarre faible (beaucoup de repos restant) et augmente jusqu'à 1 (repos presque terminé)

**Code clé :**
```tsx
<FytliSun
  activityLevel={1 - (restTimeLeft / currentExercise.rest_time_sec)}
  userCount={1}
/>
```

**Expérience utilisateur :**
> "Pendant que tu reprends ton souffle, le soleil se recharge avec toi. Plus le repos avance, plus il brille intensément, signe que ton énergie revient ! ⚡"

### 2. 🏠 Page d'Accueil (HomeScreen)

**Localisation :** `mobilApp-fytli/src/screens/HomeScreen.tsx`

**Utilisation :** Affiché en haut de la page d'accueil comme symbole central de Fytli.

**Comportement :**
- Animation continue avec pulse dynamique entre 0.3 et 0.8
- Changement de niveau toutes les 2 secondes pour créer un effet vivant
- 3 orbes gravitant autour (représentant les utilisateurs de la communauté)
- Fond noir avec bordure dorée subtile
- Tagline en dessous : *"Plus on bouge ensemble, plus la lumière s'intensifie"*

**Code clé :**
```tsx
const [activityLevel, setActivityLevel] = useState(0.5);

useEffect(() => {
  const interval = setInterval(() => {
    setActivityLevel(prev => {
      const next = prev + 0.05;
      return next > 0.8 ? 0.3 : next;
    });
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

**Expérience utilisateur :**
> "Dès l'ouverture de l'app, tu es accueilli par le Soleil Fytli qui pulse au rythme de la communauté. Il te rappelle que tu fais partie de quelque chose de plus grand. 🌟"

### 3. 🚀 Écran de Démarrage (SplashScreen)

**Localisation :** `mobilApp-fytli/src/screens/SplashScreen.tsx`

**Utilisation :** Animation de chargement au lancement de l'application.

**Comportement :**
- Le soleil démarre à `activityLevel = 0` (éteint)
- Monte progressivement jusqu'à 1.0 par paliers de 0.1 toutes les 200ms
- Les orbes apparaissent progressivement (1 à 5) toutes les 600ms
- Texte dynamique : "Chargement..." puis "Prêt à briller ! ✨"
- Fond noir dégradé pour mettre en valeur le soleil
- Logo "fytli" en couleur dorée assortie

**Code clé :**
```tsx
// Animation progressive du soleil (chargement)
const activityTimer = setInterval(() => {
  setActivityLevel(prev => {
    const next = prev + 0.1;
    return next > 1 ? 1 : next;
  });
}, 200);

// Ajout progressif d'utilisateurs
const userTimer = setInterval(() => {
  setUserCount(prev => (prev < 5 ? prev + 1 : prev));
}, 600);
```

**Expérience utilisateur :**
> "Au démarrage de l'app, le Soleil Fytli s'éveille progressivement. Tu vois l'énergie monter, les orbes arriver... L'app prend vie sous tes yeux ! 🌅"

---

## Palette de Couleurs

| Couleur | Code | Usage |
|---------|------|-------|
| Jaune clair | `#FFD75F` | Centre du soleil, orbes |
| Orange chaud | `#FF7A00` | Milieu du dégradé |
| Ambre profond | `#B84300` | Bord extérieur du soleil |
| Orange pastel | `#FFB347` | Halo lumineux |
| Jaune orangé | `#FFC64D` | Orbes secondaires |
| Orange vif | `#FF9A2B` | Orbes tertiaires |

---

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

### Recommandations d'usage

| Contexte | activityLevel | userCount | Description |
|----------|--------------|-----------|-------------|
| Repos (début) | ~0.0 - 0.2 | 1 | Soleil calme, repos max |
| Repos (milieu) | ~0.5 | 1 | Soleil modéré |
| Repos (fin) | ~0.8 - 1.0 | 1 | Soleil intense, prêt ! |
| Home (idle) | 0.3 - 0.8 (pulse) | 3-5 | Animation vivante |
| Splash (loading) | 0.0 → 1.0 | 1 → 5 | Progression visible |
| Session collective | variable | nombre réel | Reflète l'activité groupe |

---

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

---

## Optimisations

### Performance
- Animations utilisant `transform` et `opacity` (GPU-accelerated)
- Nombre d'orbes limité à 8
- Pas de re-render inutile grâce aux animations CSS/Animated

### Accessibilité
- Composant purement décoratif
- Ne perturbe pas la navigation au clavier
- Peut être masqué avec `aria-hidden="true"` si nécessaire

---

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

---

## Philosophie Fytli

Le Soleil Fytli incarne la vision collective de l'application :

1. **Connexion** : Les orbes représentent les individus unis autour d'un objectif commun
2. **Énergie** : Plus l'activité est forte, plus la lumière rayonne
3. **Inspiration** : Un symbole visuel motivant qui encourage l'effort collectif
4. **Communauté** : Chacun contribue à faire briller le soleil plus intensément

---

## 🚀 Prochaines Évolutions Possibles

### 1. Sessions Collectives
Afficher le nombre réel de participants dans une session live :
```tsx
<FytliSun 
  activityLevel={averageHeartRate / maxHeartRate} 
  userCount={liveParticipants.length}
/>
```

### 2. Cercle Fytli
Sur la page d'un cercle, montrer l'activité du groupe :
```tsx
<FytliSun 
  activityLevel={circleWeeklyActivity} 
  userCount={circleMembers.length}
/>
```

### 3. Dashboard Communautaire
Vue globale de l'activité Fytli :
```tsx
<FytliSun 
  activityLevel={globalActivityScore} 
  userCount={Math.min(activeUsersToday, 8)}
/>
```

### 4. Badges et Achievements
Remplacer certaines icônes de badges par le soleil animé.

---

## 🎯 Philosophie d'Intégration

Le Soleil Fytli n'est pas qu'une animation décorative. C'est le **cœur battant de l'application**, qui rappelle constamment :

1. **Connexion** : Les orbes représentent chaque membre de la communauté
2. **Énergie collective** : Plus l'activité est haute, plus le soleil brille
3. **Progression** : Le soleil évolue avec toi (repos, chargement, activité)
4. **Inspiration** : Un symbole visuel fort qui motive

> **"Seul, mais ensemble. Plus on bouge, plus la lumière s'intensifie."** ☀️

---

## 📝 Notes Techniques

### Performance
- Animations natives (React Native Animated API)
- SVG optimisé (pas de canvas)
- Pas de re-render excessif
- Nettoyage des timers dans `useEffect`

### Compatibilité
- ✅ iOS
- ✅ Android
- ✅ Web (via React Native Web si configuré)

### Accessibilité
- Composant purement décoratif
- Ne bloque pas la navigation
- Peut être masqué sans impact fonctionnel

---

## 📞 Support

Pour toute question ou amélioration :
1. Consultez la démo HTML : `fytli-sun-demo.html`
2. Examinez les fichiers modifiés :
   - `mobilApp-fytli/src/components/FytliSun.tsx`
   - `mobilApp-fytli/src/screens/WorkoutScreen.tsx`
   - `mobilApp-fytli/src/screens/HomeScreen.tsx`
   - `mobilApp-fytli/src/screens/SplashScreen.tsx`

---

**🌟 Fais briller ton cercle ! 🌟**

**Date de création :** Octobre 2025  
**Créé avec ❤️ pour Fytli**

