# Design System — Fytli V2 "Energy Mode"

## Table des matières
1. [Identité & Philosophie](#identité--philosophie)
2. [Palette de couleurs](#palette-de-couleurs)
3. [Typographie](#typographie)
4. [Gradients](#gradients)
5. [Composants clés](#composants-clés)
6. [Visuals & Assets](#visuals--assets)
7. [Animations & Ambiance](#animations--ambiance)
8. [Icônes & Navigation](#icônes--navigation)
9. [Guidelines d'utilisation](#guidelines-dutilisation)
10. [Configuration technique](#configuration-technique)

---

## Identité & Philosophie

### Tagline
> **"Bouge. Ressens. Rayonne."**

### ADN de Marque

- **Énergie** : Le mouvement, la puissance, la sueur, la lumière
- **Connexion** : Toi, ton corps, les autres
- **Soleil intérieur** : La chaleur du feu Fytli, dans un monde plus sombre

### Ton de Voix

Direct, énergique, motivant.  
Moins "zen", plus "impact".  
Comme un coach qui t'encourage sans bullshit.

### Univers Visuel

**Night Energy** : Un univers nocturne, contrasté, presque "néon gym"
- Noir profond
- Reflets verts lumineux
- Halos rouges et oranges
- Photos réelles d'athlètes
- Lumières directionnelles et contre-jours

---

## Palette de couleurs

### Thème Global

| Usage | Couleur | Hex | Description |
|-------|---------|-----|-------------|
| Fond principal | Black Deep | `#0A0A0C` | Noir profond, base "gym nocturne" |
| Surface secondaire | Dark Gray | `#121214` | Gris anthracite pour les cartes |
| Surface tertiaire | Charcoal | `#1E1E22` | Lignes / séparateurs |
| Accent principal | Solar Red | `#FF502F` | Rouge solaire (plasma signature) |
| Accent secondaire | Fire Orange | `#FFA84B` | Orange feu |
| Accent tertiaire | Neon Green | `#00FF9C` | Vert menthe lumineux (néon énergie) |
| Texte clair | White | `#FFFFFF` | Texte principal |
| Texte secondaire | Gray | `#B3B3B3` | Labels, infos |
| Succès / Validation | Success Green | `#00E676` | Vert doux |
| Erreur / Danger | Alert Red | `#FF3B30` | Rouge vif |
| Avertissement | Warm Yellow | `#FFD166` | Jaune chaud |
| Info / Focus | Cool Blue | `#5AC8FA` | Bleu froid |

### Variables CSS

```css
:root {
  /* Backgrounds */
  --fytli-black: #0A0A0C;
  --fytli-gray: #121214;
  --fytli-charcoal: #1E1E22;
  
  /* Accents */
  --fytli-red: #FF502F;
  --fytli-orange: #FFA84B;
  --fytli-green: #00FF9C;
  
  /* Text */
  --fytli-text-primary: #FFFFFF;
  --fytli-text-secondary: #B3B3B3;
  
  /* States */
  --fytli-success: #00E676;
  --fytli-error: #FF3B30;
  --fytli-warning: #FFD166;
  --fytli-info: #5AC8FA;
}
```

### Variables React Native

```typescript
export const COLORS = {
  // Backgrounds
  black: '#0A0A0C',
  gray: '#121214',
  charcoal: '#1E1E22',
  
  // Accents
  red: '#FF502F',
  orange: '#FFA84B',
  green: '#00FF9C',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  
  // States
  success: '#00E676',
  error: '#FF3B30',
  warning: '#FFD166',
  info: '#5AC8FA',
};
```

---

## Typographie

### Police principale

**Family** : `Urbanist` (ou `Poppins` si non disponible)  
**Style** : Sans-serif, géométrique, musclée  
**Fallback** : `Inter`, `system-ui`, `sans-serif`

### Poids

- **400** : Corps de texte
- **600** : Labels et sous-titres
- **700** : Titres et boutons
- **800–900** : Hero / branding

### Hiérarchie

| Usage | Taille | Poids | Style |
|-------|--------|-------|-------|
| Hero (H1) | 32–36px | 800 | Majuscule, gradient ou néon |
| Titre (H2) | 24–28px | 700 | Bold, couleur accent |
| Sous-titre (H3) | 20–22px | 600 | Titres secondaires |
| Body | 16px | 400–500 | Lecture fluide |
| Small | 14px | 400 | Légendes, statuts |
| Tiny | 12px | 400 | Timestamps, métadonnées |

### Configuration Web

```css
.font-brand {
  font-family: 'Urbanist', 'Poppins', 'Inter', system-ui, sans-serif;
}

.text-gradient {
  background: linear-gradient(90deg, #FF502F, #FFA84B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-neon {
  color: #00FF9C;
  text-shadow: 0 0 10px rgba(0, 255, 156, 0.5);
}
```

### Configuration React Native

```typescript
export const FONTS = {
  hero: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  small: {
    fontSize: 14,
    fontWeight: '400',
  },
};
```

---

## Gradients

### Gradients principaux

| Nom | Dégradé | Utilisation |
|-----|---------|-------------|
| Primary Flame | `linear-gradient(135deg, #FF502F 0%, #FFA84B 100%)` | Boutons, CTAs |
| Plasma Glow | `linear-gradient(160deg, #FF502F 0%, #00FF9C 100%)` | Accents spéciaux, sphère |
| Night Pulse | `linear-gradient(180deg, #0A0A0C 0%, #121214 100%)` | Backgrounds |
| Green Burst | `linear-gradient(90deg, #00FF9C 0%, #5AF78E 100%)` | Stats, badges, succès |
| Heatwave | `radial-gradient(circle at center, #FF6B35 0%, #0A0A0C 70%)` | Halo de la sphère Fytli |

### CSS

```css
.gradient-primary {
  background: linear-gradient(135deg, #FF502F 0%, #FFA84B 100%);
}

.gradient-plasma {
  background: linear-gradient(160deg, #FF502F 0%, #00FF9C 100%);
}

.gradient-green {
  background: linear-gradient(90deg, #00FF9C 0%, #5AF78E 100%);
}

.gradient-heatwave {
  background: radial-gradient(circle at center, #FF6B35 0%, #0A0A0C 70%);
}
```

### React Native

```typescript
import LinearGradient from 'react-native-linear-gradient';

export const GRADIENTS = {
  primary: ['#FF502F', '#FFA84B'],
  plasma: ['#FF502F', '#00FF9C'],
  green: ['#00FF9C', '#5AF78E'],
};

// Utilisation
<LinearGradient
  colors={GRADIENTS.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.button}
>
  {children}
</LinearGradient>
```

---

## Composants clés

### Boutons

#### Variantes

**Primary** : Dégradé "Primary Flame" + ombre douce
```tsx
<button className="px-8 py-4 rounded-2xl bg-gradient-to-br from-[#FF502F] to-[#FFA84B] text-white font-semibold shadow-lg hover:shadow-[0_0_20px_rgba(255,80,47,0.4)] transition-all hover:-translate-y-0.5 active:scale-98">
  Commencer
</button>
```

**Secondary** : Fond transparent + border vert néon + glow léger
```tsx
<button className="px-6 py-3 rounded-xl bg-transparent border-2 border-[#00FF9C] text-[#00FF9C] font-semibold shadow-[0_0_12px_rgba(0,255,156,0.3)] hover:shadow-[0_0_20px_rgba(0,255,156,0.5)] transition-all">
  Voir plus
</button>
```

**Ghost** : Texte seul avec effet néon vert/orange au hover
```tsx
<button className="px-4 py-2 text-white font-medium hover:text-[#00FF9C] hover:drop-shadow-[0_0_8px_rgba(0,255,156,0.6)] transition-all">
  Suivre
</button>
```

**Disabled** : Gris foncé, opacité 40%
```tsx
<button className="px-8 py-4 rounded-2xl bg-[#1E1E22] text-[#B3B3B3] opacity-40 cursor-not-allowed">
  Indisponible
</button>
```

#### États

- **Hover** → Légère translation `Y(-2px)` + glow
- **Active** → `scale(0.98)`
- **Loading** → Spinner plasma (gradient rotatif)

#### React Native

```tsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

<TouchableOpacity
  onPress={onPress}
  disabled={loading || disabled}
  activeOpacity={0.9}
>
  <LinearGradient
    colors={['#FF502F', '#FFA84B']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
    }}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
        {title}
      </Text>
    )}
  </LinearGradient>
</TouchableOpacity>
```

### Cards

**Style** : Fond anthracite mat, bordure subtile, ombre diffuse

```tsx
// Web
<div className="rounded-2xl bg-[#121214] border border-[#1E1E22] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_12px_rgba(0,255,156,0.2)] transition-all overflow-hidden">
  <img 
    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600" 
    alt="Training"
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h3 className="text-white text-xl font-bold mb-2">Full Body Workout</h3>
    <p className="text-[#B3B3B3] text-sm">340 Kcal — 25 min</p>
    <div className="mt-4 flex justify-end">
      <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF502F] to-[#FFA84B] text-white text-sm font-semibold">
        Démarrer
      </button>
    </div>
  </div>
</div>

// React Native
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

<View style={{
  backgroundColor: '#121214',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#1E1E22',
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 20,
}}>
  <Image 
    source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600' }}
    style={{ width: '100%', height: 200 }}
  />
  <View style={{ padding: 16 }}>
    <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
      Full Body Workout
    </Text>
    <Text style={{ color: '#B3B3B3', fontSize: 14 }}>
      340 Kcal — 25 min
    </Text>
  </View>
</View>
```

**Mock Images** (Unsplash fitness/gym) :
- Workout : `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600`
- Cardio : `https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600`
- Strength : `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600`
- Yoga : `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600`
- Running : `https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600`
- Gym : `https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600`

### Fytli Sphere (Plasma Sun)

**Symbole du flux vital** : mélange du feu et du néon

#### Caractéristiques

- Sphère lumineuse animée (SVG + blur)
- Couleurs : rouge → orange → vert néon
- Pulsation lente : `scale 1 → 1.1`
- Orbes flottantes : particules vertes/oranges gravitant
- Halo dynamique : glow radial
- Intensité liée au nombre d'utilisateurs connectés

#### Implémentation Web (SVG + CSS)

```tsx
<div className="relative flex items-center justify-center w-64 h-64">
  {/* Halo externe */}
  <div className="absolute inset-0 rounded-full bg-gradient-radial from-[#FF6B35] to-transparent opacity-30 blur-3xl animate-pulse" />
  
  {/* Core sphere */}
  <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10">
    <defs>
      <radialGradient id="plasma-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF502F" />
        <stop offset="50%" stopColor="#FFA84B" />
        <stop offset="100%" stopColor="#00FF9C" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle 
      cx="80" 
      cy="80" 
      r="60" 
      fill="url(#plasma-gradient)" 
      filter="url(#glow)"
      className="animate-[pulse_2.5s_ease-in-out_infinite]"
    />
  </svg>
  
  {/* Orbes flottantes */}
  <div className="absolute w-4 h-4 rounded-full bg-[#00FF9C] blur-sm animate-orbit-1" />
  <div className="absolute w-3 h-3 rounded-full bg-[#FFA84B] blur-sm animate-orbit-2" />
</div>

<style jsx>{`
  @keyframes orbit-1 {
    from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
    to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
  }
  @keyframes orbit-2 {
    from { transform: rotate(180deg) translateX(80px) rotate(-180deg); }
    to { transform: rotate(540deg) translateX(80px) rotate(-540deg); }
  }
  .animate-orbit-1 { animation: orbit-1 5s linear infinite; }
  .animate-orbit-2 { animation: orbit-2 7s linear infinite; }
`}</style>
```

#### React Native (Animated)

```tsx
import { View, Animated } from 'react-native';
import { Svg, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const FytliSphere = ({ activityLevel = 0.7, userCount = 3 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1 + activityLevel * 0.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [activityLevel]);
  
  return (
    <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Svg width={160} height={160}>
          <Defs>
            <RadialGradient id="plasma">
              <Stop offset="0%" stopColor="#FF502F" />
              <Stop offset="50%" stopColor="#FFA84B" />
              <Stop offset="100%" stopColor="#00FF9C" />
            </RadialGradient>
          </Defs>
          <Circle cx="80" cy="80" r="60" fill="url(#plasma)" />
        </Svg>
      </Animated.View>
    </View>
  );
};
```

### Badges & Stats

**Calories** : Texte vert néon + icône feu
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF9C20] text-[#00FF9C] text-sm font-semibold">
  <Flame size={16} />
  340 Kcal
</span>
```

**Durée** : Orange doux + icône horloge
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFA84B20] text-[#FFA84B] text-sm font-semibold">
  <Clock size={16} />
  25 min
</span>
```

**Difficulté** : Gradient rouge-orange
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF502F] to-[#FFA84B] text-white text-sm font-semibold">
  <Zap size={16} />
  Intense
</span>
```

**Niveau** : Capsule arrondie avec halo léger
```tsx
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121214] border border-[#00FF9C] text-[#00FF9C] text-sm font-semibold shadow-[0_0_8px_rgba(0,255,156,0.3)]">
  <Award size={16} />
  Expert
</span>
```

---

## Visuals & Assets

### Photos réelles

**Style** : Athlètes, sueur, lumière rasante, studio sombre

**Sources Mock** (Unsplash) :
- Athlète en action : `https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800`
- Sueur et effort : `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800`
- Contre-jour gym : `https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800`
- Musculation focus : `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800`
- Cardio intense : `https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800`
- Portrait athlète : `https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800`

### Caractéristiques visuelles

- **Lumière directionnelle** : Contre-jour, halo néon, ambiance "night energy"
- **Pas d'illustrations** : Remplacement total par des assets humains
- **Mouvements capturés** : Muscles contractés, visages concentrés
- **Couleurs dominantes** : Noir, peau, lumière chaude ou verte

### Overlays & Effets

```css
/* Overlay sombre pour texte sur image */
.image-overlay {
  position: relative;
}

.image-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.8) 100%);
}

/* Glow effect sur image */
.image-glow {
  box-shadow: 0 0 40px rgba(0, 255, 156, 0.2);
}
```

---

## Animations & Ambiance

### Style global

- **Transitions** : Fluides, puissantes, légèrement élastiques
- **Durée moyenne** : 200–300ms
- **Easing** : `cubic-bezier(0.23, 1, 0.32, 1)`

### Micro-interactions

```css
/* Hover → glow vert/orange */
.interactive:hover {
  box-shadow: 0 0 20px rgba(0, 255, 156, 0.4);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

/* Tap → pulsation rapide */
.interactive:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}

/* Scroll → parallaxe légère */
.parallax {
  transform: translateY(var(--scroll-offset));
  transition: transform 300ms ease-out;
}

/* Changement d'écran → fade + slide diagonal */
.page-transition {
  animation: slideInDiagonal 400ms cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes slideInDiagonal {
  from {
    opacity: 0;
    transform: translate(-20px, -20px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}
```

### Animations spéciales

**Loading Spinner (Plasma)**
```tsx
<div className="relative w-12 h-12">
  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF502F] border-r-[#FFA84B] animate-spin" />
  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#00FF9C] animate-spin-reverse" />
</div>

<style jsx>{`
  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  .animate-spin-reverse {
    animation: spin-reverse 1s linear infinite;
  }
`}</style>
```

**Glow Pulse**
```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 255, 156, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 255, 156, 0.6);
  }
}

.glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}
```

---

## Icônes & Navigation

### Bibliothèque d'icônes

**Web** : [Lucide Icons](https://lucide.dev)
```tsx
import { 
  Home, Dumbbell, Users, TrendingUp, Settings, 
  Play, Pause, Flame, Clock, Award, Zap, Heart,
  ChevronRight, X, Menu, Search, User
} from 'lucide-react';

// Utilisation
<Home size={24} color="#00FF9C" strokeWidth={2} />
<Dumbbell size={20} color="#FFFFFF" />
```

**Mobile** : [React Native Vector Icons](https://oblador.github.io/react-native-vector-icons/)
```tsx
import Icon from 'react-native-vector-icons/Feather';

<Icon name="home" size={24} color="#00FF9C" />
<Icon name="activity" size={20} color="#FFFFFF" />
```

### Mapping des icônes principales

| Action | Nom Lucide | Nom Feather | Usage |
|--------|-----------|-------------|-------|
| Accueil | `Home` | `home` | Navigation principale |
| Entraînement | `Dumbbell` | `activity` | Section programmes |
| Communauté | `Users` | `users` | Feed social / Cercle Fytli |
| Progrès | `TrendingUp` | `trending-up` | Stats / Dashboard |
| Profil | `User` | `user` | Compte utilisateur |
| Paramètres | `Settings` | `settings` | Configuration |
| Démarrer | `Play` | `play` | Lancer un workout |
| Pause | `Pause` | `pause` | Pause workout |
| Calories | `Flame` | `activity` | Indicateur calories |
| Durée | `Clock` | `clock` | Durée session |
| Badge | `Award` | `award` | Récompenses |
| Intensité | `Zap` | `zap` | Difficulté |
| Favoris | `Heart` | `heart` | Likes / Favoris |
| Navigation | `ChevronRight` | `chevron-right` | Flèches |
| Fermer | `X` | `x` | Fermeture modals |
| Menu | `Menu` | `menu` | Burger menu |
| Recherche | `Search` | `search` | Barre de recherche |

### Tailles standardisées

```typescript
export const ICON_SIZES = {
  xs: 16,   // Badges, inline text
  sm: 20,   // Buttons, inputs
  md: 24,   // Navigation, actions (DEFAULT)
  lg: 32,   // Headers, features
  xl: 48,   // Hero, splash
};
```

### Styles d'icônes

```tsx
// Icône standard
<Home size={24} color="#FFFFFF" />

// Icône avec glow néon
<Flame 
  size={20} 
  color="#00FF9C" 
  className="drop-shadow-[0_0_8px_rgba(0,255,156,0.6)]"
/>

// Icône dans badge
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF502F20] text-[#FF502F]">
  <Zap size={16} />
  Intense
</span>

// Bouton icône uniquement
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#121214] hover:bg-[#1E1E22] transition-colors">
  <Settings size={20} color="#FFFFFF" />
</button>
```

### Navigation Bottom Bar (Mobile)

```tsx
import { Home, Dumbbell, Users, TrendingUp, User } from 'lucide-react';

const tabs = [
  { name: 'Accueil', icon: Home, href: '/' },
  { name: 'Programmes', icon: Dumbbell, href: '/programs' },
  { name: 'Cercle', icon: Users, href: '/social' },
  { name: 'Progrès', icon: TrendingUp, href: '/progress' },
  { name: 'Profil', icon: User, href: '/profile' },
];

<nav className="fixed bottom-0 left-0 right-0 bg-[#121214] border-t border-[#1E1E22] px-4 py-2">
  <div className="flex justify-around items-center">
    {tabs.map((tab) => (
      <button 
        key={tab.name}
        className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover:bg-[#1E1E22]"
      >
        <tab.icon 
          size={24} 
          color={isActive ? "#00FF9C" : "#B3B3B3"} 
          className={isActive ? "drop-shadow-[0_0_8px_rgba(0,255,156,0.6)]" : ""}
        />
        <span className={`text-xs ${isActive ? 'text-[#00FF9C] font-semibold' : 'text-[#B3B3B3]'}`}>
          {tab.name}
        </span>
      </button>
    ))}
  </div>
</nav>
```

---

## Guidelines d'utilisation

### À FAIRE ✓

- **Utiliser des photos réalistes** contrastées (athlètes, sueur, lumière dure)
- **Accentuer les effets lumineux** doux (glow, gradient, halo)
- **Préserver la chaleur Fytli** dans un monde sombre
- **Introduire le vert** comme énergie du mouvement
- **Faire respirer les espaces** (padding généreux, pas de surcharge)
- **Utiliser des icônes** au lieu d'emojis pour tous les éléments UI
- **Contraste élevé** pour la lisibilité (blanc sur noir profond)
- **Gradients subtils** sur les boutons et accents

### À ÉVITER ✗

- **Fonds plats ou gris clairs** (rester dans le noir profond)
- **Boutons sans relief ni glow** (toujours ajouter une dimension lumineuse)
- **Textes trop petits** ou sans contraste
- **Illustrations vectorielles** type cartoon (privilégier photos réelles)
- **Emojis** dans l'interface (utiliser des icônes Lucide/Feather)
- **Surcharge visuelle** (laisser respirer, espaces généreux)
- **Animations trop rapides** (<100ms) ou trop nombreuses

### Accessibilité

- **Contraste minimum** : 4.5:1 (WCAG AA) pour texte normal
- **Contraste élevé** : 7:1 (WCAG AAA) pour texte important
- **Touch targets** : Minimum 44x44px (iOS), 48x48px (Android)
- **Focus visible** : Ring vert néon sur focus clavier
- **Alt text** : Descriptions pour toutes les images

```css
/* Focus ring accessible */
.focusable:focus-visible {
  outline: 2px solid #00FF9C;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 255, 156, 0.2);
}
```

---

## Configuration technique

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'fytli-black': '#0A0A0C',
        'fytli-gray': '#121214',
        'fytli-charcoal': '#1E1E22',
        'fytli-red': '#FF502F',
        'fytli-orange': '#FFA84B',
        'fytli-green': '#00FF9C',
        'fytli-text': '#FFFFFF',
        'fytli-text-muted': '#B3B3B3',
        'fytli-success': '#00E676',
        'fytli-error': '#FF3B30',
        'fytli-warning': '#FFD166',
        'fytli-info': '#5AC8FA',
      },
      fontFamily: {
        'brand': ['Urbanist', 'Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'fytli-glow': '0 0 20px rgba(0, 255, 156, 0.3)',
        'fytli-glow-red': '0 0 20px rgba(255, 80, 47, 0.3)',
        'fytli-card': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-plasma': 'linear-gradient(135deg, #FF502F 0%, #00FF9C 100%)',
        'gradient-primary': 'linear-gradient(135deg, #FF502F 0%, #FFA84B 100%)',
        'gradient-green': 'linear-gradient(90deg, #00FF9C 0%, #5AF78E 100%)',
        'gradient-night': 'linear-gradient(180deg, #0A0A0C 0%, #121214 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
        'glow': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 156, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 156, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
```

### React Native Theme

```typescript
// config/theme.ts
export const COLORS = {
  black: '#0A0A0C',
  gray: '#121214',
  charcoal: '#1E1E22',
  red: '#FF502F',
  orange: '#FFA84B',
  green: '#00FF9C',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  success: '#00E676',
  error: '#FF3B30',
  warning: '#FFD166',
  info: '#5AC8FA',
};

export const FONTS = {
  hero: { fontSize: 36, fontWeight: '800' as const },
  title: { fontSize: 28, fontWeight: '700' as const },
  subtitle: { fontSize: 22, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  small: { fontSize: 14, fontWeight: '400' as const },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const GRADIENTS = {
  primary: ['#FF502F', '#FFA84B'],
  plasma: ['#FF502F', '#00FF9C'],
  green: ['#00FF9C', '#5AF78E'],
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#00FF9C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};
```

### Installation des dépendances

#### Web

```bash
# Installer Lucide Icons
npm install lucide-react

# Installer Tailwind CSS (si pas déjà fait)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Mobile

```bash
# Installer React Native Vector Icons
npm install react-native-vector-icons
npx react-native link react-native-vector-icons

# Installer Linear Gradient
npm install react-native-linear-gradient
npx react-native link react-native-linear-gradient
```

---

## Exemples d'implémentation

### Page d'accueil (Web)

```tsx
import { Home, Dumbbell, Users, TrendingUp, Play, Flame, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-fytli-black text-white">
      {/* Header */}
      <header className="p-6 border-b border-fytli-charcoal">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-brand font-bold tracking-wide bg-gradient-primary bg-clip-text text-transparent">
            fytli
          </h1>
          <nav className="flex gap-6">
            <button className="flex items-center gap-2 text-fytli-text-muted hover:text-fytli-green transition-colors">
              <Home size={20} />
              <span>Accueil</span>
            </button>
            <button className="flex items-center gap-2 text-fytli-text-muted hover:text-fytli-green transition-colors">
              <Dumbbell size={20} />
              <span>Programmes</span>
            </button>
            <button className="flex items-center gap-2 text-fytli-text-muted hover:text-fytli-green transition-colors">
              <Users size={20} />
              <span>Cercle</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-brand font-extrabold mb-4 tracking-tight">
            Bouge. Ressens. Rayonne.
          </h2>
          <p className="text-xl text-fytli-text-muted mb-8">
            Rejoins l'énergie collective et transforme ton corps
          </p>
          <button className="px-8 py-4 rounded-2xl bg-gradient-primary text-white font-semibold shadow-lg hover:shadow-fytli-glow-red transition-all hover:-translate-y-0.5 active:scale-98">
            Commencer maintenant
          </button>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Programmes populaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div 
                key={program.id}
                className="rounded-2xl bg-fytli-gray border border-fytli-charcoal shadow-fytli-card hover:shadow-[0_0_12px_rgba(0,255,156,0.2)] transition-all overflow-hidden group"
              >
                <img 
                  src={program.image}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-bold mb-2">{program.title}</h4>
                  <div className="flex gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#00FF9C20] text-[#00FF9C] text-xs font-semibold">
                      <Flame size={14} />
                      {program.calories} Kcal
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFA84B20] text-[#FFA84B] text-xs font-semibold">
                      <Clock size={14} />
                      {program.duration} min
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-fytli-glow-red transition-all">
                    <Play size={16} />
                    Démarrer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const programs = [
  {
    id: 1,
    title: "Full Body Burn",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
    calories: 340,
    duration: 25,
  },
  {
    id: 2,
    title: "Cardio Blast",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600",
    calories: 280,
    duration: 20,
  },
  {
    id: 3,
    title: "Strength Power",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    calories: 420,
    duration: 30,
  },
];
```

### Écran d'accueil (Mobile)

```tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, GRADIENTS } from '@/config/theme';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <ScrollView>
        {/* Header */}
        <View style={{ padding: SPACING.lg }}>
          <Text style={{ ...FONTS.hero, color: COLORS.textPrimary }}>
            Bouge. Ressens.
          </Text>
          <Text style={{ ...FONTS.hero, color: COLORS.green }}>
            Rayonne.
          </Text>
        </View>

        {/* Fytli Sphere */}
        <View style={{ alignItems: 'center', marginVertical: SPACING.xl }}>
          {/* Placeholder for FytliSphere component */}
          <View style={{ 
            width: 200, 
            height: 200, 
            borderRadius: 100,
            backgroundColor: COLORS.red,
            opacity: 0.3,
          }} />
        </View>

        {/* Programs */}
        <View style={{ padding: SPACING.lg }}>
          <Text style={{ ...FONTS.title, color: COLORS.textPrimary, marginBottom: SPACING.md }}>
            Programmes
          </Text>

          {programs.map((program) => (
            <TouchableOpacity 
              key={program.id}
              style={{
                marginBottom: SPACING.md,
                backgroundColor: COLORS.gray,
                borderRadius: BORDER_RADIUS.lg,
                overflow: 'hidden',
              }}
            >
              <Image 
                source={{ uri: program.image }}
                style={{ width: '100%', height: 200 }}
              />
              <View style={{ padding: SPACING.md }}>
                <Text style={{ ...FONTS.subtitle, color: COLORS.textPrimary, marginBottom: SPACING.sm }}>
                  {program.title}
                </Text>
                
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: BORDER_RADIUS.full,
                    backgroundColor: `${COLORS.green}20`,
                  }}>
                    <Icon name="activity" size={14} color={COLORS.green} />
                    <Text style={{ color: COLORS.green, fontSize: 12, fontWeight: '600' }}>
                      {program.calories} Kcal
                    </Text>
                  </View>
                  
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: BORDER_RADIUS.full,
                    backgroundColor: `${COLORS.orange}20`,
                  }}>
                    <Icon name="clock" size={14} color={COLORS.orange} />
                    <Text style={{ color: COLORS.orange, fontSize: 12, fontWeight: '600' }}>
                      {program.duration} min
                    </Text>
                  </View>
                </View>

                <TouchableOpacity>
                  <LinearGradient
                    colors={GRADIENTS.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      paddingVertical: 12,
                      borderRadius: BORDER_RADIUS.md,
                    }}
                  >
                    <Icon name="play" size={16} color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                      Démarrer
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.gray,
        borderTopWidth: 1,
        borderTopColor: COLORS.charcoal,
      }}>
        {[
          { name: 'home', label: 'Accueil' },
          { name: 'activity', label: 'Programmes' },
          { name: 'users', label: 'Cercle' },
          { name: 'trending-up', label: 'Progrès' },
          { name: 'user', label: 'Profil' },
        ].map((tab, index) => (
          <TouchableOpacity 
            key={tab.name}
            style={{ alignItems: 'center', gap: 4 }}
          >
            <Icon 
              name={tab.name} 
              size={24} 
              color={index === 0 ? COLORS.green : COLORS.textSecondary}
            />
            <Text style={{ 
              fontSize: 11, 
              color: index === 0 ? COLORS.green : COLORS.textSecondary,
              fontWeight: index === 0 ? '600' : '400',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const programs = [
  {
    id: 1,
    title: "Full Body Burn",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600",
    calories: 340,
    duration: 25,
  },
  {
    id: 2,
    title: "Cardio Blast",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600",
    calories: 280,
    duration: 20,
  },
];
```

---

## Ressources

### Polices
- **Urbanist** : [Google Fonts](https://fonts.google.com/specimen/Urbanist)
- **Poppins** : [Google Fonts](https://fonts.google.com/specimen/Poppins)
- **Inter** : [Google Fonts](https://fonts.google.com/specimen/Inter)

### Icônes
- **Lucide Icons (Web)** : [https://lucide.dev](https://lucide.dev)
- **React Native Vector Icons (Mobile)** : [https://oblador.github.io/react-native-vector-icons/](https://oblador.github.io/react-native-vector-icons/)
- **Feather Icons** : [https://feathericons.com](https://feathericons.com)

### Images Mock (Unsplash)
- **Fitness Collection** : [https://unsplash.com/s/photos/fitness](https://unsplash.com/s/photos/fitness)
- **Gym Collection** : [https://unsplash.com/s/photos/gym](https://unsplash.com/s/photos/gym)
- **Workout Collection** : [https://unsplash.com/s/photos/workout](https://unsplash.com/s/photos/workout)

### Outils
- **Tailwind CSS** : [https://tailwindcss.com](https://tailwindcss.com)
- **Framer Motion** : [https://www.framer.com/motion/](https://www.framer.com/motion/)
- **React Native Reanimated** : [https://docs.swmansion.com/react-native-reanimated/](https://docs.swmansion.com/react-native-reanimated/)

---

<div align="center">

**Fytli V2 "Energy Mode"**

Feu + Ombre + Réalisme

"Bouge. Ressens. Rayonne."

</div>
