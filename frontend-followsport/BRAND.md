# 🔥 Fytli — Brand Guidelines

## 1️⃣ Essence & Positionnement

**Nom** : Fytli

**Tagline** : Bouge mieux, vis mieux.

**Pilier** : Sport + bien-être (lifestyle), motivation douce, progression durable.

**Vibe** : Chaleureux, moderne, inclusif, non-agressif.

---

## 🎯 Mission

Aider chacun à suivre ses entraînements, sentir ses progrès et tenir ses habitudes **sans pression**.

---

## 💬 Ton & Voix

- ✅ Clair, positif, complice
- ❌ Jamais culpabilisant
- Phrases courtes, verbes d'action, pas de jargon "performance hardcore"

### Exemples de micro-copy
- "On y va ? 20 minutes suffisent."
- "Bonne séance — +1 sur ta constance 🎯"
- "Belle régularité 👏"
- "Tu as gagné +6 min actives cette semaine."
- "Raccourcis la séance si tu manques de temps — 12 min suffisent."

---

## 🎨 Logo & Symbole

### Mot-symbole
- **Fytli** en minuscule
- Sans-serif arrondie, graisse medium à bold

### Icône
- Forme corporelle organique intégrant un **pulse (onde ECG)**
- Évoque vitalité & rythme
- Style : bords doux, courbes fluides, **pas d'angles agressifs**

### Utilisation
- **Icône seule** : app icon / favicon
- **Logo horizontal** : icône à gauche + "Fytli"
- **Clear space** : hauteur de la lettre "y" autour
- **Taille mini** : 
  - 24px de haut (icône seule)
  - 32px (lockup complet)
- **Fond recommandé** : crème, blanc, ou très sombre (inverser en blanc)

---

## 🎨 Palette de Couleurs

### Primaires (Dégradés rouge→orange, lifestyle)

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Fytli Red** | `#FF4D3A` | Primaire principale |
| **Fytli Orange** | `#FF8A3D` | Secondaire, dégradés |

**Dégradé signature** : `linear-gradient(45deg, #FF4D3A 0%, #FF8A3D 100%)`

### Neutres

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Noir doux** | `#0E0E10` | Texte principal |
| **Gris 700** | `#3A3A3E` | Texte secondaire |
| **Gris 300** | `#D7D7DB` | Lignes, bordures |
| **Crème** | `#FBFAF7` | Fond par défaut |

### Feedback

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Succès** | `#2BB673` | Validations |
| **Info** | `#2D7FF9` | Informations |
| **Alerte douce** | `#FFCA55` | Warnings |

---

## 📝 Typographie

### UI / App
- **Font** : Inter ou SF Pro (fallback system)
- **Titres** : 700, intervalles de 4px
- **Body** : 400/500

### Brand / Landing
- **Font** : Poppins ou Satoshi (arrondi, friendly)

### Chiffres
- **Style** : Tabulaires pour stats (OpenType `tnum` si dispo)

---

## 🎨 Iconographie & Illustrations

### Icônes
- Arrondies, simple trait ou plein doux
- Style : Lucide Icons (parfait pour ce branding)

### Illustrations
- Formes organiques / silhouettes stylisées
- Micro-grains discrets
- **Pas de bodybuilder** - inclusif et doux

---

## 🎯 UI – Principes

### Cards
- Aérées, rayons 16–20px
- Ombres douces : `0 6px 24px rgba(14,14,16,0.06)`
- Hover : `0 10px 28px rgba(14,14,16,0.10)`

### CTA (Call-to-Action)
- Boutons pleins (Fytli Red/Orange)
- Hover = élévation + légère translation
- Dégradé sur les CTA principaux

### Tags / Chips
- Pour catégories : focus, mobilité, muscu, cardio…
- Fond doux, bordures arrondies

### Progress
- Rings/bars arrondis
- Couleurs subtiles
- Micro-animations

---

## ✨ Motion & Animations

### Timing
- **Fast** : 150ms (micro-interactions)
- **Base** : 200ms (transitions standard)
- **Ease** : `cubic-bezier(0.23, 1, 0.32, 1)` (easeOutQuint)

### Effets
- Transitions en dégradé rouge→orange pour highlights
- Confettis discrets sur milestones (hebdo, 10 séances, etc.)
- Élévation douce au hover

---

## 🧩 Composants Clés

### Header
- Minimal + compteur de constance (streak)

### Écran "Séance"
- Timer
- Étapes (liste)
- RPE (Rate of Perceived Exertion)
- Notes rapides
- Bouton "Terminer" (CTA brand)

### Historique
- Liste + détail séance
- Exercices, séries, charges

### Progression
- Graph hebdo
- PR (Personal Records)
- Temps actif
- Régularité

### Habitudes
- 3–5 routines suivies (eau, sommeil, mobilité)

### Onboarding
- Objectifs simples
- Plan de départ (3 séances/semaine)

---

## 🎨 Design Tokens (JSON)

```json
{
  "color": {
    "primary": "#FF4D3A",
    "primaryAlt": "#FF8A3D",
    "bg": "#FBFAF7",
    "text": "#0E0E10",
    "muted": "#3A3A3E",
    "line": "#D7D7DB",
    "success": "#2BB673",
    "info": "#2D7FF9",
    "warning": "#FFCA55"
  },
  "gradient": {
    "brand": "linear-gradient(45deg, #FF4D3A 0%, #FF8A3D 100%)"
  },
  "radius": { 
    "sm": 12, 
    "md": 16, 
    "lg": 20, 
    "xl": 28 
  },
  "shadow": {
    "card": "0 6px 24px rgba(14,14,16,0.06)",
    "hover": "0 10px 28px rgba(14,14,16,0.10)"
  },
  "font": {
    "family": { 
      "ui": "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial", 
      "brand": "Poppins, Inter, system-ui" 
    },
    "size": { 
      "xs": 12, 
      "sm": 14, 
      "md": 16, 
      "lg": 20, 
      "xl": 28, 
      "xxl": 40 
    }
  },
  "motion": { 
    "fast": 150, 
    "base": 200, 
    "ease": "cubic-bezier(0.23,1,0.32,1)" 
  }
}
```

---

## ✅ Do / ❌ Don't

### ✅ DO
- Espaces généreux
- Contrastes doux
- Messages bienveillants
- Dégradés subtils
- Formes arrondies
- Animations douces

### ❌ DON'T
- Rouges agressifs saturés partout
- Gradients "flamme" trop intenses
- Typo condensée
- Angles aigus
- Messages culpabilisants
- Animations brusques

---

## 🎯 Prompts Cursor (Exemples)

### Landing Hero Section
```
Crée une section hero en Next.js/React + Tailwind reprenant les tokens JSON ci-dessus. 
Fond crème, titre fort, CTA primaire (gradient brand), mockup mobile à droite avec 
ring de progression. Motion 200ms ease.
```

### App Icon
```
Génère un SVG d'icône : forme organique + pulse ECG au centre, bords arrondis, 
couleur #FF4D3A avec légère ombre interne, export 1024/512/256/128.
```

### Écran Séance
```
Écran de suivi d'entraînement : timer, étapes (liste), composant RPE (1–10), 
bouton terminer (CTA brand), barre de progression, respect des radius/shadows/motion tokens.
```

---

## 📦 Implémentation TailwindCSS

### Configuration

```js
colors: {
  'fytli-red': '#FF4D3A',
  'fytli-orange': '#FF8A3D',
  'fytli-dark': '#0E0E10',
  'fytli-gray': '#3A3A3E',
  'fytli-line': '#D7D7DB',
  'fytli-cream': '#FBFAF7',
  'fytli-success': '#2BB673',
  'fytli-info': '#2D7FF9',
  'fytli-warning': '#FFCA55',
}
```

### Classes utiles

```css
.btn-brand { @apply bg-gradient-to-br from-fytli-red to-fytli-orange; }
.card-fytli { @apply rounded-[20px] shadow-[0_6px_24px_rgba(14,14,16,0.06)]; }
.text-gradient { @apply bg-gradient-to-r from-fytli-red to-fytli-orange bg-clip-text text-transparent; }
```

---

**Version** : 1.0  
**Dernière mise à jour** : Octobre 2025  
**Statut** : ✅ Officiel

