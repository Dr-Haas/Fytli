# 🎨 Design System Fytli

## 📋 Table des matières
1. [Philosophie & Identité](#philosophie--identité)
2. [Palette de couleurs](#palette-de-couleurs)
3. [Typographie](#typographie)
4. [Espacements](#espacements)
5. [Border Radius](#border-radius)
6. [Ombres & Élévations](#ombres--élévations)
7. [Gradients](#gradients)
8. [Composants](#composants)
9. [Animations & Transitions](#animations--transitions)
10. [Breakpoints & Responsive](#breakpoints--responsive)
11. [Icônes & Assets](#icônes--assets)
12. [États & Feedback](#états--feedback)

---

## 🎯 Philosophie & Identité

### Tagline
> **"Bouge mieux, vis mieux."**

### Valeurs de marque
- **Chaleureux** : Palette orange-rouge-jaune inspirée du soleil
- **Moderne** : Design épuré, interfaces fluides
- **Accessible** : UX simple et intuitive
- **Motivant** : Encourage sans intimider, bienveillant

### Ton de voix
- Amical et encourageant
- Inclusif ("tu" plutôt que "vous")
- Positif et énergisant
- Simple et direct

### Élément signature : Le Soleil Fytli ☀️
**Symbole central** de l'application, représentant :
- L'énergie collective des utilisateurs
- La progression et l'activité
- La communauté ("Seul, mais ensemble")

---

## 🎨 Palette de couleurs

### Couleurs principales

#### Application Mobile (React Native)
```typescript
COLORS = {
  // Palette principale (dégradé chaleureux)
  yellow: '#FFD56B',     // Jaune soleil
  orange: '#FFA34A',     // Orange vif
  red: '#FF7948',        // Rouge-orange
  
  // Fond et neutres
  cream: '#FBFAF7',      // Crème chaleureux (fond)
  warmText: '#4A2E20',   // Marron chaud (texte)
  white: '#FFFFFF',      // Blanc pur
  
  // États
  gray: '#D1D5DB',       // Gris clair
  lightGray: '#F3F4F6',  // Gris très clair
  darkGray: '#6B7280',   // Gris foncé
}
```

#### Frontend Web (React + Tailwind)
```css
/* Fytli Brand Colors */
--fytli-red: #FF4D3A      /* Primary - Rouge signature */
--fytli-orange: #FF8A3D   /* Secondary - Orange chaleureux */
--fytli-dark: #0E0E10     /* Noir doux */
--fytli-gray: #3A3A3E     /* Gris texte */
--fytli-line: #D7D7DB     /* Gris bordures */
--fytli-cream: #FBFAF7    /* Crème fond */
--fytli-success: #2BB673  /* Vert succès */
--fytli-info: #2D7FF9     /* Bleu info */
--fytli-warning: #FFCA55  /* Jaune warning */
```

#### Website (Next.js)
```css
fytli: {
  yellow: '#FFD56B',  // Jaune
  orange: '#FFA34A',  // Orange
  red: '#FF7948',     // Rouge
  dark: '#4A2E20',    // Marron foncé
  cream: '#FFF5E6',   // Crème clair
  light: '#FFF8EE',   // Crème très clair
}
```

### Variantes HSL (CSS Variables)
```css
:root {
  --background: 42 40% 98%;        /* #FBFAF7 Crème */
  --foreground: 240 6% 6%;         /* #0E0E10 Noir doux */
  --primary: 10 100% 60%;          /* #FF4D3A Fytli Red */
  --secondary: 25 100% 62%;        /* #FF8A3D Fytli Orange */
  --muted: 0 0% 85%;              /* #D7D7DB Gris ligne */
  --muted-foreground: 240 6% 23%; /* #3A3A3E Gris */
}
```

### Utilisation des couleurs

| Usage | Couleur | Contexte |
|-------|---------|----------|
| Actions primaires | `fytli-red` / `red` | Boutons, CTAs, liens importants |
| Actions secondaires | `fytli-orange` / `orange` | Boutons secondaires, hovers |
| Fond principal | `fytli-cream` / `cream` | Background de l'app |
| Texte principal | `fytli-dark` / `warmText` | Corps de texte |
| Texte secondaire | `fytli-gray` / `darkGray` | Labels, descriptions |
| Bordures | `fytli-line` / `gray` | Séparateurs, contours |
| Succès | `fytli-success` | Confirmations, validations |
| Attention | `fytli-warning` | Avertissements |
| Information | `fytli-info` | Messages informatifs |

---

## ✍️ Typographie

### Familles de polices

#### Web (Frontend + Website + Admin)
```css
font-family: {
  'ui': ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  'brand': ['Poppins', 'Inter', 'system-ui', 'sans-serif']
}
```

**Utilisation** :
- `font-ui` : Interface utilisateur générale
- `font-brand` : Titres, logos, éléments de marque

#### Mobile (React Native)
```typescript
FONTS = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
}
```
Utilise les polices système natives pour de meilleures performances.

### Échelle typographique

#### Mobile
```typescript
FONT_SIZES = {
  xs: 12,      // Labels secondaires
  sm: 14,      // Labels, légendes
  base: 16,    // Corps de texte
  lg: 18,      // Texte important
  xl: 20,      // Sous-titres
  '2xl': 24,   // Titres de sections
  '3xl': 30,   // Titres de pages
  '4xl': 36,   // Splash, hero
}
```

#### Web (Tailwind)
Utilise l'échelle Tailwind standard :
- `text-xs` : 12px
- `text-sm` : 14px
- `text-base` : 16px
- `text-lg` : 18px
- `text-xl` : 20px
- `text-2xl` : 24px
- `text-3xl` : 30px
- `text-4xl` : 36px
- `text-5xl` : 48px

### Poids (Font Weights)
- `regular` (400) : Corps de texte
- `medium` (500) : Labels, navigation
- `semibold` (600) : Sous-titres
- `bold` (700) : Titres, boutons
- `extrabold` (800) : Hero, splash
- `black` (900) : Éléments d'emphase forte

### Line Height
- **Corps de texte** : 1.5 (150%)
- **Titres** : 1.2 (120%)
- **Buttons** : 1 (100%)

---

## 📏 Espacements

### Échelle d'espacement (Mobile)
```typescript
SPACING = {
  xs: 4,       // Espacements très serrés
  sm: 8,       // Espacements serrés
  md: 16,      // Espacement standard
  lg: 24,      // Espacement large
  xl: 32,      // Espacement très large
  '2xl': 48,   // Espacement hero/splash
}
```

### Échelle d'espacement (Web - Tailwind)
Suit l'échelle Tailwind (4px base) :
- `p-1` / `m-1` : 4px
- `p-2` / `m-2` : 8px
- `p-4` / `m-4` : 16px
- `p-6` / `m-6` : 24px
- `p-8` / `m-8` : 32px
- `p-12` / `m-12` : 48px

### Grille de base
**Base unit** : 4px  
Tous les espacements sont des multiples de 4px.

### Règles d'utilisation
- **Padding de cartes** : 16px (`md` / `p-4`)
- **Margin entre sections** : 24-32px (`lg`-`xl` / `m-6`-`m-8`)
- **Padding de boutons** : 12-16px vertical, 24-32px horizontal
- **Gap entre éléments** : 8-16px (`sm`-`md` / `gap-2`-`gap-4`)

---

## 🔲 Border Radius

### Mobile (React Native)
```typescript
BORDER_RADIUS = {
  sm: 8,       // Inputs, petits boutons
  md: 12,      // Cards standards, boutons moyens
  lg: 16,      // Cards importantes
  xl: 24,      // Boutons hero, grandes cards
  full: 9999,  // Éléments circulaires (badges, avatars)
}
```

### Web (Tailwind)
```css
borderRadius: {
  'fytli-sm': '12px',
  'fytli-md': '16px',   /* Default */
  'fytli-lg': '20px',
  'fytli-xl': '28px',
}
```

### Règles d'utilisation
- **Boutons primaires** : `xl` (24-28px) - Signature Fytli
- **Cards** : `md`-`lg` (12-20px)
- **Inputs** : `sm`-`md` (8-12px)
- **Badges/Avatars** : `full` (100%)
- **Modals** : `lg`-`xl` (16-28px)

---

## 🌑 Ombres & Élévations

### Mobile (React Native)
```typescript
SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,  // Android
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
}
```

### Web (Tailwind)
```css
boxShadow: {
  'fytli-card': '0 6px 24px rgba(14,14,16,0.06)',
  'fytli-hover': '0 10px 28px rgba(14,14,16,0.10)',
}
```

### Hiérarchie d'élévation
1. **Niveau 0** (flat) : Fond, texte
2. **Niveau 1** (`sm`) : Cards au repos, inputs
3. **Niveau 2** (`md`) : Cards hover, dropdowns
4. **Niveau 3** (`lg`) : Modals, drawers, popovers
5. **Niveau 4** (custom) : Toasts, notifications flottantes

### Règles d'utilisation
- **Cards au repos** : `shadow-fytli-card` / `sm`
- **Cards hover** : `shadow-fytli-hover` / `md`
- **Boutons importants** : `lg` (8-12px blur)
- **Modals** : `lg`-`xl` (12-20px blur)

---

## 🌈 Gradients

### Mobile (React Native)
```typescript
GRADIENTS = {
  primary: ['#FFD700', '#FF8C00', '#FF4500'],  // Jaune → Orange → Rouge
  soft: ['#FFD700', '#FF8C00'],                // Jaune → Orange doux
  warm: ['#FF8C00', '#FF6B35'],                // Orange → Rouge-orange
  blue: ['#3B82F6', '#2563EB'],                // Bleu froid (accents)
  green: ['#10B981', '#059669'],               // Vert (succès)
}
```

### Web (Tailwind + CSS)
```css
.btn-brand {
  background: linear-gradient(135deg, #FF4D3A 0%, #FF8A3D 100%);
}

.text-gradient {
  background: linear-gradient(90deg, #FF4D3A 0%, #FF8A3D 100%);
  background-clip: text;
  -webkit-text-gradient: transparent;
}
```

### Directions préférées
- **Boutons** : 135deg (diagonal haut-gauche → bas-droite)
- **Backgrounds** : 180deg (vertical haut → bas)
- **Texte** : 90deg (horizontal gauche → droite)

### Utilisation
- **Boutons primaires** : Gradient `warm` / `primary`
- **Splash screens** : Gradient vertical rouge
- **Accents de texte** : Gradient horizontal rouge-orange
- **États de succès** : Gradient `green`

---

## 🧩 Composants

### Boutons

#### Variants

**Mobile (React Native)**
```typescript
// GradientButton (signature Fytli)
<GradientButton
  title="Commencer"
  gradient={['#FF8C00', '#FF6B35']}
  size="large"  // small | medium | large
/>

// Button classique
<Button
  variant="primary"   // primary | secondary | outline
  size="medium"       // small | medium | large
/>
```

**Web (React + Tailwind)**
```tsx
<Button
  variant="default"     // default | destructive | outline | secondary | ghost | link
  size="default"        // default | sm | lg | icon
/>
```

#### Tailles
- **Small** : `h-9` / `py-2 px-4` (32-36px height)
- **Medium** : `h-10` / `py-3 px-6` (40-44px height)
- **Large** : `h-11` / `py-4 px-8` (44-48px height)

#### États
- **Default** : Gradient/couleur solide + ombre légère
- **Hover** : Ombre plus prononcée + lift (-2px translateY)
- **Active** : Légère compression (scale 0.98)
- **Disabled** : Gris + opacity 50% + cursor not-allowed
- **Loading** : ActivityIndicator/Spinner centré

### Cards

#### Mobile
```tsx
<Card style={{ padding: 16, borderRadius: 12 }}>
  {children}
</Card>
```

#### Web
```tsx
<Card className="rounded-xl border bg-card shadow-sm">
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{content}</CardContent>
  <CardFooter>{actions}</CardFooter>
</Card>
```

#### Règles
- **Padding** : 16-24px (`p-4` à `p-6`)
- **Border radius** : 12-20px (`rounded-xl` / `md-lg`)
- **Background** : Blanc ou crème
- **Hover** : Lift + shadow `fytli-hover`

### Inputs

#### Mobile
```tsx
<Input
  placeholder="Email"
  value={value}
  onChangeText={setValue}
  style={{
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F3F4F6',
  }}
/>
```

#### Web
```tsx
<Input
  type="text"
  placeholder="Email"
  className="h-10 rounded-lg border border-input bg-background px-3"
/>
```

#### États
- **Default** : Border gris léger
- **Focus** : Ring `fytli-red` / `fytli-orange` (2px)
- **Error** : Border rouge + texte d'erreur
- **Disabled** : Background gris + opacity 60%

### Badges

```tsx
// Mobile
<Badge style={{ backgroundColor: '#FF8A3D', borderRadius: 999 }}>
  <Text>Nouveau</Text>
</Badge>

// Web
<Badge className="bg-fytli-orange text-white rounded-full px-2 py-1">
  Nouveau
</Badge>
```

#### Variants
- **Default** : `fytli-orange` / `primary`
- **Success** : Vert
- **Warning** : Jaune
- **Info** : Bleu
- **Outline** : Border + fond transparent

### Avatars

```tsx
// Tailles standards
xs: 24px
sm: 32px
md: 40px
lg: 56px
xl: 80px

// Toujours border-radius: full (50%)
```

### Progress Bars

```tsx
<ProgressBar
  progress={0.7}  // 0 à 1
  color="#FF8A3D"
  height={8}
  borderRadius={999}
/>
```

---

## 🎬 Animations & Transitions

### Durées

#### Mobile
```typescript
// Animations fluides et naturelles
fast: 150,        // Micro-interactions
normal: 200,      // Interactions standards
slow: 300,        // Transitions de pages
spring: variable  // Animations physiques (tension, friction)
```

#### Web
```css
transitionDuration: {
  'fytli-fast': '150ms',
  'fytli-base': '200ms',
}

transitionTimingFunction: {
  'fytli': 'cubic-bezier(0.23, 1, 0.32, 1)',  // Easing personnalisé
}
```

### Types d'animations

#### Fade In/Out
```typescript
// Mobile
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true,
})

// Web CSS
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide In
```typescript
// Mobile
Animated.timing(slideAnim, {
  toValue: 0,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
})

// Web CSS
@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

#### Scale (Pulse)
```typescript
// Pour attirer l'attention
Animated.sequence([
  Animated.timing(scale, { toValue: 1.1, duration: 200 }),
  Animated.timing(scale, { toValue: 1, duration: 200 }),
])
```

#### Hover Effects (Web)
```css
.card-fytli:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-fytli-hover);
}

transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
```

### Composant signature : FytliSun ☀️

**Animations du soleil** :
- **Pulsation du cœur** : Scale 1 → 1.15 (1500ms loop)
- **Halo lumineux** : Opacity + stroke-width pulsation (3000ms)
- **Orbes en orbite** : Rotation continue (5000-9000ms)
- **Effet utilisateur** : Flash du halo (400ms) quand nouveau user

```typescript
// Animation du cœur
Animated.loop(
  Animated.sequence([
    Animated.timing(coreScale, {
      toValue: 1 + activityLevel * 0.15,
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    }),
    Animated.timing(coreScale, {
      toValue: 1,
      duration: 1500,
    }),
  ])
)
```

---

## 📱 Breakpoints & Responsive

### Breakpoints (Tailwind)
```javascript
screens: {
  'sm': '640px',   // Mobile landscape / small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px', // Large screens
}
```

### Mobile-First Strategy

#### Principes
1. **Design mobile d'abord** puis adaptation desktop
2. **Touch targets minimum** : 44x44px (iOS), 48x48px (Android)
3. **Thumb zone** : Actions importantes en bas de l'écran
4. **One-hand use** : Navigation accessible au pouce

#### Adaptations responsive

**Navigation**
```tsx
// Mobile : Burger menu
<MobileNav />

// Desktop : Sidebar
{isDesktop && <Sidebar />}
```

**Modals**
```css
/* Mobile : Fullscreen */
@media (max-width: 768px) {
  .modal {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}

/* Desktop : Centré avec backdrop */
@media (min-width: 769px) {
  .modal {
    max-width: 600px;
    border-radius: 20px;
  }
}
```

**Grilles**
```css
/* Mobile : 1 colonne */
grid-template-columns: 1fr;

/* Tablet : 2 colonnes */
@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

/* Desktop : 3-4 colonnes */
@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
```

### React Native (Mobile App)

**Dimensions dynamiques**
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Padding adaptatif
const horizontalPadding = width > 768 ? 32 : 16;
```

---

## 🖼️ Icônes & Assets

### Bibliothèque d'icônes

**Web** : [Lucide Icons](https://lucide.dev)
```tsx
import { User, Settings, LogOut } from 'lucide-react';

<User size={24} color="#FF4D3A" />
```

**Mobile** : Icônes personnalisées ou bibliothèque compatible
```tsx
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

<Icon name="account" size={24} color="#FF7948" />
```

### Tailles d'icônes
- **xs** : 16px - Petits badges
- **sm** : 20px - Boutons, inputs
- **md** : 24px - Navigation, actions
- **lg** : 32px - Headers, features
- **xl** : 48px+ - Hero, splash

### Logo Fytli

**Format** : 
- Texte : "fytli" en minuscules
- Font : Poppins Bold / System Bold
- Couleur : Blanc (sur fond coloré) ou gradient rouge-orange
- Letterspacing : 3px

```tsx
// Mobile
<Text style={{
  fontSize: 72,
  fontWeight: 'bold',
  color: '#FFFFFF',
  letterSpacing: 3,
}}>
  fytli
</Text>

// Web
<h1 className="text-6xl font-brand font-bold tracking-wide text-gradient">
  fytli
</h1>
```

### Favicon & App Icons

**Formats requis** :
- **Web** : `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`
- **PWA** : `icon-192x192.png`, `icon-512x512.png`
- **iOS** : `apple-touch-icon.png` (180x180)
- **Android** : `maskable-icon.png` (512x512)

**Style** :
- Soleil Fytli stylisé sur fond gradient
- Ou simple "F" en Poppins Bold

---

## ✅ États & Feedback

### États interactifs

#### Boutons
```css
/* Default */
background: gradient;
box-shadow: 0 4px 8px rgba(0,0,0,0.1);

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 12px rgba(0,0,0,0.15);

/* Active */
transform: translateY(0);
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

#### Cards
```css
/* Default */
box-shadow: 0 6px 24px rgba(14,14,16,0.06);

/* Hover */
transform: translateY(-4px);
box-shadow: 0 10px 28px rgba(14,14,16,0.10);
```

### Feedback utilisateur

#### Toasts/Notifications
```tsx
// Types
success: green + checkmark icon
error: red + X icon
info: blue + info icon
warning: yellow + alert icon

// Position : Top center ou bottom center
// Durée : 3000ms (auto-dismiss)
// Animation : Slide in + fade out
```

#### Loading States
```tsx
// Spinner pour attentes longues (>500ms)
<ActivityIndicator size="large" color="#FF8A3D" />

// Skeleton pour listes/cards
<Skeleton width="100%" height={80} borderRadius={12} />

// Progress bar pour uploads
<ProgressBar progress={uploadProgress} />
```

#### Empty States
```tsx
<EmptyState
  icon={<Icon name="inbox" size={64} />}
  title="Aucun programme"
  description="Crée ton premier programme pour commencer"
  action={<Button>Créer un programme</Button>}
/>
```

#### Error States
```tsx
<ErrorState
  title="Une erreur est survenue"
  description="Impossible de charger les données"
  action={<Button onClick={retry}>Réessayer</Button>}
/>
```

---

## 📦 Composants personnalisés Fytli

### FytliSun ☀️

**Composant signature** visualisant l'activité collective.

**Props** :
- `activityLevel` : 0-1 (niveau d'activité)
- `userCount` : nombre d'utilisateurs connectés

**Comportements** :
- Pulsation du cœur proportionnelle à l'activité
- Halo lumineux dynamique
- Orbes gravitant (1 par utilisateur, max 5)
- Flash du halo à l'arrivée d'un nouveau user

**Utilisation** :
```tsx
<FytliSun 
  activityLevel={0.7} 
  userCount={3} 
/>
```

### GradientButton

**Bouton signature** avec gradient personnalisé.

**Props** :
- `title` : string
- `gradient` : array de couleurs
- `size` : 'small' | 'medium' | 'large'
- `onPress` : callback
- `loading` : boolean
- `disabled` : boolean

**Utilisation** :
```tsx
<GradientButton
  title="Commencer"
  gradient={['#FF8C00', '#FF6B35']}
  size="large"
  onPress={handlePress}
/>
```

### Card (Enhanced)

**Card Fytli** avec hover effect.

**Classes** :
```css
.card-fytli {
  @apply rounded-fytli-lg shadow-fytli-card;
  @apply transition-all duration-fytli-base ease-fytli;
}

.card-fytli:hover {
  @apply shadow-fytli-hover;
  transform: translateY(-4px);
}
```

---

## 🎯 Guidelines d'utilisation

### Do's ✅

- **Utiliser les gradients** pour les boutons primaires
- **Respecter les espacements** (multiples de 4px)
- **Préférer les border-radius généreux** (12px+)
- **Animations fluides** (200-300ms)
- **Contraste suffisant** (WCAG AA minimum)
- **Touch targets** de 44px minimum
- **Loading states** pour toute action asynchrone
- **Feedback immédiat** sur toutes les interactions

### Don'ts ❌

- **Éviter les angles droits** (border-radius: 0)
- **Pas de couleurs pures** (trop vives)
- **Pas de transitions trop rapides** (<100ms)
- **Pas de texte sur fond gradient** sans contraste
- **Pas d'animations inutiles** (distractions)
- **Pas de boutons trop petits** (<40px)
- **Pas de texte trop petit** (<14px sur mobile)

---

## 🚀 Implémentation

### Setup Tailwind (Web)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'fytli-red': '#FF4D3A',
        'fytli-orange': '#FF8A3D',
        'fytli-cream': '#FBFAF7',
        // ... autres couleurs
      },
      fontFamily: {
        'ui': ['Inter', 'system-ui', 'sans-serif'],
        'brand': ['Poppins', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'fytli-sm': '12px',
        'fytli-md': '16px',
        'fytli-lg': '20px',
        'fytli-xl': '28px',
      },
    },
  },
}
```

### Setup React Native (Mobile)

```typescript
// config/theme.ts
export const COLORS = { /* ... */ };
export const FONTS = { /* ... */ };
export const SPACING = { /* ... */ };
export const BORDER_RADIUS = { /* ... */ };
export const SHADOWS = { /* ... */ };

// Utilisation
import { COLORS, SPACING } from '@config/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    padding: SPACING.lg,
  },
});
```

---

## 📚 Ressources

### Polices
- **Inter** : [Google Fonts](https://fonts.google.com/specimen/Inter)
- **Poppins** : [Google Fonts](https://fonts.google.com/specimen/Poppins)

### Icônes
- **Lucide Icons** : [https://lucide.dev](https://lucide.dev)
- **React Native Vector Icons** : [https://oblador.github.io/react-native-vector-icons/](https://oblador.github.io/react-native-vector-icons/)

### Outils
- **Tailwind CSS** : [https://tailwindcss.com](https://tailwindcss.com)
- **Framer Motion** : [https://www.framer.com/motion/](https://www.framer.com/motion/)
- **React Native Reanimated** : [https://docs.swmansion.com/react-native-reanimated/](https://docs.swmansion.com/react-native-reanimated/)

### Inspiration
- **Revolut** : Design moderne et chaleureux
- **Stripe Dashboard** : Interface épurée et professionnelle
- **Nike Training Club** : Motivation et énergie

---

## 📝 Changelog

### Version 1.0 (Actuelle)
- ✅ Palette de couleurs établie
- ✅ Composants de base (Bouton, Card, Input)
- ✅ Composant FytliSun
- ✅ System d'espacement et border-radius
- ✅ Animations et transitions
- ✅ Responsive mobile-first

### Version 1.1 (À venir)
- ⏳ Thème sombre (dark mode)
- ⏳ Composants avancés (Tabs, Accordion)
- ⏳ Animations de page (page transitions)
- ⏳ Illustrations personnalisées

---

<div align="center">

**Fytli Design System v1.0**

Made with ❤️ and ☀️

"Bouge mieux, vis mieux."

</div>

