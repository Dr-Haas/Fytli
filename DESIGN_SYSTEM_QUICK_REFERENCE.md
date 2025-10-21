# 🎨 Fytli Design System - Référence Rapide

## 🎯 Philosophie
> **"Bouge mieux, vis mieux."**  
> Chaleureux • Moderne • Accessible • Motivant

---

## 🎨 Couleurs

### Principales
```
🔴 Rouge     #FF4D3A / #FF7948  (Primary)
🟠 Orange    #FF8A3D / #FFA34A  (Secondary)
🟡 Jaune     #FFD56B            (Accent)
🤎 Marron    #4A2E20            (Texte chaleureux)
🟤 Crème     #FBFAF7            (Fond)
⚪ Blanc     #FFFFFF
⚫ Noir      #0E0E10            (Texte)
```

### États
```
✅ Succès    #2BB673  (Vert)
⚠️ Warning   #FFCA55  (Jaune)
ℹ️ Info      #2D7FF9  (Bleu)
🔴 Erreur    #FF4D3A  (Rouge)
```

---

## ✍️ Typographie

### Polices
```
UI:    Inter, system-ui, sans-serif
Brand: Poppins, Inter, sans-serif
```

### Échelle
```
xs    12px    Labels secondaires
sm    14px    Labels, légendes
base  16px    Corps de texte
lg    18px    Texte important
xl    20px    Sous-titres
2xl   24px    Titres de sections
3xl   30px    Titres de pages
4xl   36px+   Hero, splash
```

### Poids
```
400  Regular     Corps de texte
500  Medium      Labels
600  Semibold    Sous-titres
700  Bold        Titres, boutons
900  Black       Emphase forte
```

---

## 📏 Espacements

```
xs    4px     Très serré
sm    8px     Serré
md    16px    Standard ⭐
lg    24px    Large
xl    32px    Très large
2xl   48px    Hero/Splash
```

**Règle** : Multiples de 4px

---

## 🔲 Border Radius

```
sm    8-12px     Inputs, petits boutons
md    12-16px    Cards standards ⭐
lg    16-20px    Cards importantes
xl    24-28px    Boutons hero
full  100%       Badges, avatars
```

**Signature Fytli** : Générer (12px+)

---

## 🌑 Ombres

### Mobile (React Native)
```typescript
sm: elevation: 1, shadowRadius: 2
md: elevation: 3, shadowRadius: 4
lg: elevation: 5, shadowRadius: 8
```

### Web (Tailwind)
```css
shadow-fytli-card   0 6px 24px rgba(14,14,16,0.06)
shadow-fytli-hover  0 10px 28px rgba(14,14,16,0.10)
```

---

## 🌈 Gradients

```typescript
primary:  ['#FFD700', '#FF8C00', '#FF4500']  ☀️
soft:     ['#FFD700', '#FF8C00']
warm:     ['#FF8C00', '#FF6B35']             ⭐
blue:     ['#3B82F6', '#2563EB']
green:    ['#10B981', '#059669']
```

**Direction préférée** : 135deg (diagonal)

---

## 🎬 Animations

### Durées
```
fast    150ms    Micro-interactions
base    200ms    Interactions standards ⭐
slow    300ms    Transitions de pages
```

### Easing
```css
cubic-bezier(0.23, 1, 0.32, 1)  /* Fytli custom */
```

### Effets
```css
/* Hover Card */
transform: translateY(-4px);
box-shadow: var(--shadow-fytli-hover);
transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);

/* Pulse */
scale: 1 → 1.1 → 1
duration: 200ms each
```

---

## 🧩 Composants

### Boutons

**Tailles**
```
Small   32-36px height   py-2 px-4
Medium  40-44px height   py-3 px-6  ⭐
Large   44-48px height   py-4 px-8
```

**Variants**
```
Primary       Gradient rouge-orange + ombre
Secondary     Orange solide
Outline       Border + fond transparent
Ghost         Transparent, hover background
```

### Cards
```css
Padding:        16-24px
Border-radius:  12-20px
Background:     Blanc / Crème
Hover:          Lift -4px + shadow-fytli-hover
```

### Inputs
```css
Height:         40-44px
Padding:        12-16px
Border-radius:  8-12px
Focus:          Ring 2px fytli-red/orange
```

---

## 📱 Responsive

### Breakpoints
```
sm    640px    Mobile landscape
md    768px    Tablets
lg    1024px   Laptops ⭐
xl    1280px   Desktops
```

### Mobile-First
```
✅ Touch targets: 44px minimum
✅ Thumb zone: Actions en bas
✅ One-hand use
✅ Fullscreen modals sur mobile
```

---

## 🖼️ Icônes

**Bibliothèque** : Lucide Icons (web)

**Tailles**
```
xs    16px    Petits badges
sm    20px    Boutons, inputs
md    24px    Navigation, actions ⭐
lg    32px    Headers
xl    48px+   Hero, splash
```

---

## ☀️ Composant Signature : FytliSun

```tsx
<FytliSun 
  activityLevel={0.7}  // 0-1
  userCount={3}        // 1-5
/>
```

**Comportements** :
- Pulsation du cœur (activityLevel)
- Halo lumineux dynamique
- Orbes gravitant (1 par user)
- Flash à l'arrivée d'un nouveau user

---

## 🎯 Do's & Don'ts

### ✅ Do's
- Gradients pour boutons primaires
- Border-radius généreux (12px+)
- Animations fluides (200-300ms)
- Contraste WCAG AA
- Touch targets 44px+
- Loading states partout
- Feedback immédiat

### ❌ Don'ts
- Angles droits (border-radius: 0)
- Couleurs trop vives
- Transitions <100ms
- Boutons <40px
- Texte <14px mobile
- Animations inutiles

---

## 🚀 Quick Setup

### Web (Tailwind)
```javascript
colors: {
  'fytli-red': '#FF4D3A',
  'fytli-orange': '#FF8A3D',
  'fytli-cream': '#FBFAF7',
}
```

### Mobile (React Native)
```typescript
import { COLORS, SPACING, SHADOWS } from '@config/theme';
```

---

## 📦 Composants Clés

```tsx
// GradientButton (signature)
<GradientButton
  title="Commencer"
  gradient={['#FF8C00', '#FF6B35']}
  size="large"
/>

// Card Fytli
<Card className="card-fytli">
  {content}
</Card>

// FytliSun
<FytliSun activityLevel={0.7} userCount={3} />
```

---

## 🎨 Classes Utility (Tailwind)

```css
/* Bouton brand */
.btn-brand {
  @apply bg-gradient-to-br from-fytli-red to-fytli-orange;
  @apply text-white font-medium;
  @apply transition-all duration-fytli-base ease-fytli;
}

/* Card Fytli */
.card-fytli {
  @apply rounded-fytli-lg shadow-fytli-card;
  @apply transition-all duration-fytli-base ease-fytli;
}

.card-fytli:hover {
  @apply shadow-fytli-hover;
}

/* Texte gradient */
.text-gradient {
  @apply bg-gradient-to-r from-fytli-red to-fytli-orange;
  @apply bg-clip-text text-transparent;
}
```

---

## 📊 Hiérarchie Visuelle

```
1. Hero/CTA       Gradient + xl border-radius + lg shadow
2. Titres         2xl-4xl + bold/black + text-gradient
3. Cards          md border-radius + fytli-card shadow
4. Texte          base size + regular weight
5. Labels         sm size + medium weight + muted color
```

---

## 🔗 Liens Utiles

- 📘 [Documentation complète](DESIGN_SYSTEM_FYTLI.md)
- 🎨 [Figma](https://figma.com) - À créer
- 🎭 [Storybook](https://storybook.js.org) - À implémenter

---

<div align="center">

**⚡ Référence Rapide v1.0**

[📘 Doc Complète](DESIGN_SYSTEM_FYTLI.md) • [🏠 README](README.md)

</div>

