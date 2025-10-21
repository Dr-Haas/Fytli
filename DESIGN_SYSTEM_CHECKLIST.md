# ✅ Fytli Design System - Checklist de Conformité

Cette checklist vous aide à vérifier qu'un nouveau composant ou feature respecte bien le design system Fytli.

---

## 🎨 Couleurs

### ✅ Couleurs utilisées
- [ ] Utilise uniquement les couleurs de la palette Fytli
- [ ] Rouge `#FF4D3A` / `#FF7948` pour actions primaires
- [ ] Orange `#FF8A3D` / `#FFA34A` pour actions secondaires
- [ ] Crème `#FBFAF7` pour les fonds
- [ ] Texte : `#0E0E10` ou `#4A2E20`
- [ ] États : Succès `#2BB673`, Warning `#FFCA55`, Info `#2D7FF9`

### ✅ Contraste
- [ ] Ratio de contraste WCAG AA minimum (4.5:1 pour texte)
- [ ] Texte lisible sur tous les fonds
- [ ] Pas de texte directement sur gradient sans contrôle

---

## ✍️ Typographie

### ✅ Police
- [ ] Utilise `font-ui` (Inter) pour l'interface
- [ ] Utilise `font-brand` (Poppins) pour les éléments de marque
- [ ] Mobile : Utilise les polices système natives

### ✅ Tailles
- [ ] Texte minimum : 14px sur mobile, 12px sur desktop (cas extrêmes)
- [ ] Corps de texte : 16px (base)
- [ ] Titres : 24px-36px
- [ ] Labels : 14px

### ✅ Poids
- [ ] Regular (400) pour corps de texte
- [ ] Medium (500) pour labels
- [ ] Semibold (600) pour sous-titres
- [ ] Bold (700) pour titres et boutons
- [ ] Black (900) pour emphase

### ✅ Line Height
- [ ] 1.5 (150%) pour corps de texte
- [ ] 1.2 (120%) pour titres
- [ ] 1 (100%) pour boutons

---

## 📏 Espacements

### ✅ Grille de base
- [ ] Tous les espacements sont des multiples de 4px
- [ ] Utilise les tokens : `xs(4)`, `sm(8)`, `md(16)`, `lg(24)`, `xl(32)`, `2xl(48)`

### ✅ Padding
- [ ] Cards : 16-24px
- [ ] Boutons : 12-16px vertical, 24-32px horizontal
- [ ] Sections : 24-48px

### ✅ Margin
- [ ] Entre sections : 24-32px
- [ ] Entre éléments : 8-16px
- [ ] Cohérence verticale (rythme)

---

## 🔲 Border Radius

### ✅ Arrondis
- [ ] Pas d'angles droits (0px)
- [ ] Minimum 8px
- [ ] Boutons primaires : 24-28px (signature Fytli)
- [ ] Cards : 12-20px
- [ ] Inputs : 8-12px
- [ ] Badges/Avatars : 100% (full)

### ✅ Cohérence
- [ ] Border-radius cohérent dans un même contexte
- [ ] Éléments parents et enfants harmonisés

---

## 🌑 Ombres & Élévations

### ✅ Hiérarchie
- [ ] Niveau 0 : Fond, texte (pas d'ombre)
- [ ] Niveau 1 : Cards au repos (`sm` / `shadow-fytli-card`)
- [ ] Niveau 2 : Cards hover (`md` / `shadow-fytli-hover`)
- [ ] Niveau 3 : Modals, dropdowns (`lg`)
- [ ] Niveau 4 : Toasts, notifications

### ✅ Cohérence
- [ ] Ombres uniquement noires avec opacity
- [ ] Pas de couleurs dans les ombres (sauf cas spéciaux)
- [ ] Élévation proportionnelle à l'importance

---

## 🌈 Gradients

### ✅ Utilisation
- [ ] Boutons primaires : Gradient `warm` ou `primary`
- [ ] Direction : 135deg (diagonal) ou 180deg (vertical)
- [ ] Pas plus de 3 couleurs dans un gradient
- [ ] Transition fluide entre couleurs

### ✅ Accessibilité
- [ ] Contraste suffisant si texte sur gradient
- [ ] Dégradés lisibles sur tous les écrans

---

## 🧩 Composants

### ✅ Boutons

#### Dimensions
- [ ] Touch target minimum : 44x44px (iOS) / 48x48px (Android)
- [ ] Small : 32-36px height
- [ ] Medium : 40-44px height
- [ ] Large : 44-48px height

#### États
- [ ] Default : Défini
- [ ] Hover : Lift + shadow
- [ ] Active : Compression
- [ ] Disabled : Gris + opacity 50%
- [ ] Loading : Spinner/ActivityIndicator

#### Style
- [ ] Border-radius généreux (24px+ pour primaires)
- [ ] Ombre visible
- [ ] Transition fluide (200ms)

### ✅ Cards

#### Structure
- [ ] Padding : 16-24px
- [ ] Border-radius : 12-20px
- [ ] Background : Blanc / Crème
- [ ] Shadow : `fytli-card` au repos

#### Interactions
- [ ] Hover : Lift -4px + `shadow-fytli-hover`
- [ ] Transition : 200ms ease
- [ ] Cursor pointer si cliquable

### ✅ Inputs

#### Dimensions
- [ ] Height : 40-44px
- [ ] Padding : 12-16px
- [ ] Border-radius : 8-12px

#### États
- [ ] Default : Border gris léger
- [ ] Focus : Ring 2px rouge/orange
- [ ] Error : Border rouge + message
- [ ] Disabled : Background gris + opacity 60%

### ✅ Badges

#### Style
- [ ] Border-radius : 999px (full)
- [ ] Padding : 6-8px vertical, 12-16px horizontal
- [ ] Font-size : 12-14px
- [ ] Font-weight : 600 (semibold)

#### Couleurs
- [ ] Primary : Orange
- [ ] Success : Vert
- [ ] Warning : Jaune (texte foncé)
- [ ] Info : Bleu

---

## 🎬 Animations & Transitions

### ✅ Durées
- [ ] Micro-interactions : 150ms
- [ ] Interactions standards : 200ms
- [ ] Transitions de pages : 300ms
- [ ] Pas de transition trop rapide (<100ms)
- [ ] Pas de transition trop lente (>500ms)

### ✅ Easing
- [ ] Utilise l'easing Fytli : `cubic-bezier(0.23, 1, 0.32, 1)`
- [ ] Ou `ease-out` / `ease-in-out` standard
- [ ] Éviter `linear` pour UX fluide

### ✅ Types
- [ ] Fade : Opacity 0 → 1
- [ ] Slide : TranslateY -10px → 0
- [ ] Scale : 1 → 1.05 → 1 (pulse)
- [ ] Lift : TranslateY 0 → -2px (hover)

### ✅ Performance
- [ ] `useNativeDriver: true` (React Native)
- [ ] Transform et opacity uniquement (pas de width/height)
- [ ] Pas d'animations inutiles

---

## 📱 Responsive & Accessibilité

### ✅ Mobile-First
- [ ] Design pensé mobile d'abord
- [ ] Touch targets : 44px minimum
- [ ] Pouce zone : Actions importantes en bas
- [ ] Navigation accessible au pouce

### ✅ Breakpoints
- [ ] Mobile : < 640px
- [ ] Tablet : 768px
- [ ] Desktop : 1024px+
- [ ] Adaptation fluide entre breakpoints

### ✅ Accessibilité
- [ ] Contraste WCAG AA (4.5:1 texte, 3:1 UI)
- [ ] Focus visible (ring 2px)
- [ ] Labels sur tous les inputs
- [ ] Alt text sur toutes les images
- [ ] Navigation au clavier fonctionnelle
- [ ] ARIA labels si nécessaire

---

## ✅ États & Feedback

### ✅ Loading States
- [ ] Spinner pour attentes > 500ms
- [ ] Skeleton pour listes/cards
- [ ] Progress bar pour uploads
- [ ] Feedback visuel immédiat

### ✅ Empty States
- [ ] Icône appropriée
- [ ] Titre descriptif
- [ ] Description claire
- [ ] Action suggérée (CTA)

### ✅ Error States
- [ ] Message d'erreur clair
- [ ] Action de correction (Réessayer)
- [ ] Couleur rouge pour attirer l'œil
- [ ] Pas de jargon technique

### ✅ Success States
- [ ] Toast/notification de confirmation
- [ ] Icône checkmark
- [ ] Couleur verte
- [ ] Auto-dismiss après 3s

---

## 🖼️ Icônes & Assets

### ✅ Icônes
- [ ] Taille minimum : 16px
- [ ] Tailles standards : 20px, 24px, 32px
- [ ] Couleur cohérente avec le contexte
- [ ] Bibliothèque : Lucide Icons (web)

### ✅ Images
- [ ] Format optimisé (WebP, AVIF)
- [ ] Responsive (srcset)
- [ ] Alt text descriptif
- [ ] Loading lazy si hors viewport

### ✅ Logo
- [ ] "fytli" en minuscules
- [ ] Font : Poppins Bold
- [ ] Letterspacing : 3px
- [ ] Couleur : Blanc ou gradient

---

## 🎯 Guidelines Générales

### ✅ Do's
- [x] Respecter la palette de couleurs
- [x] Espacements multiples de 4px
- [x] Border-radius généreux (12px+)
- [x] Animations fluides (200ms)
- [x] Contraste WCAG AA
- [x] Touch targets 44px+
- [x] Loading states partout
- [x] Feedback immédiat

### ✅ Don'ts
- [ ] ❌ Angles droits (border-radius: 0)
- [ ] ❌ Couleurs hors palette
- [ ] ❌ Transitions trop rapides (<100ms)
- [ ] ❌ Texte sur gradient sans contraste
- [ ] ❌ Animations inutiles
- [ ] ❌ Boutons < 40px
- [ ] ❌ Texte < 14px mobile
- [ ] ❌ Espacement non-multiple de 4px

---

## 📝 Processus de Review

### Avant de merger un composant/feature :

1. **Visual Review**
   - [ ] Screenshots sur mobile, tablet, desktop
   - [ ] Test sur différents navigateurs
   - [ ] Vérification des couleurs
   - [ ] Vérification des espacements

2. **Interaction Review**
   - [ ] Test hover, focus, active
   - [ ] Test loading, error states
   - [ ] Test navigation clavier
   - [ ] Test sur touch device

3. **Code Review**
   - [ ] Utilise les tokens du design system
   - [ ] Pas de valeurs hardcodées
   - [ ] Components réutilisables
   - [ ] Props typés (TypeScript)

4. **Accessibility Review**
   - [ ] Test screen reader
   - [ ] Test contraste
   - [ ] Test navigation clavier
   - [ ] Test ARIA labels

5. **Performance Review**
   - [ ] Animations performantes
   - [ ] Images optimisées
   - [ ] Pas de re-renders inutiles
   - [ ] Bundle size raisonnable

---

## 🚀 Outils de Vérification

### Contraste
- WebAIM Contrast Checker : https://webaim.org/resources/contrastchecker/
- Chrome DevTools : Lighthouse Accessibility

### Responsive
- Chrome DevTools : Device Mode
- Firefox DevTools : Responsive Design Mode
- BrowserStack : Tests multi-devices

### Performance
- Lighthouse : Performance & Accessibility
- React DevTools : Profiler
- Chrome DevTools : Performance

### Accessibilité
- axe DevTools : Extension Chrome/Firefox
- WAVE : Extension d'accessibilité
- NVDA / JAWS : Screen readers

---

## 📚 Ressources

- [📘 Documentation Complète](DESIGN_SYSTEM_FYTLI.md)
- [⚡ Référence Rapide](DESIGN_SYSTEM_QUICK_REFERENCE.md)
- [🎨 Démo Interactive](design-system-demo.html)
- [🏠 README Principal](README.md)

---

## 📞 Questions ?

Si vous avez un doute sur l'application du design system :

1. Consultez la documentation complète
2. Regardez la démo interactive
3. Vérifiez les composants existants
4. Demandez une review design

**En cas de doute, privilégiez toujours la cohérence avec l'existant.**

---

<div align="center">

**Fytli Design System - Checklist v1.0**

"La cohérence fait la différence."

</div>

