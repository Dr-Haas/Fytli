# 🧩 Composants UI

## 📦 Organisation des composants

### `/components/ui/` - Composants de base (shadcn/ui style)
- **Button** : Boutons avec variantes (default, outline, ghost, etc.)
- **Card** : Cards avec header, content, footer
- **Input** : Champs de saisie stylisés
- **Label** : Labels pour formulaires

Ces composants sont réutilisables et suivent le design system.

### `/components/` - Composants métier

#### **Header**
- Barre de navigation supérieure sticky
- Affiche le nom de l'utilisateur connecté
- Bouton de déconnexion
- Design avec backdrop-blur pour effet moderne

#### **Sidebar**
- Navigation latérale (desktop uniquement)
- Links vers Dashboard, Programmes, Profil
- Indicateur visuel de la page active
- Version de l'app en footer

#### **AuthForm**
- Formulaire de connexion/inscription
- Mode switch entre login et register
- Validation en temps réel
- Gestion d'erreurs élégante
- Loading states avec spinner

#### **ProgramCard** (à créer)
- Card interactive pour afficher un programme
- Hover effects
- Informations : nom, difficulté, description
- Click pour voir les détails

## 🎨 Design principles

### Style Revolut/Stripe
- Cards arrondies (`rounded-xl`)
- Ombres douces (`shadow-sm`)
- Effets de flou (`backdrop-blur`)
- Palette sobre (bleu/gris/blanc)
- Transitions douces

### Interactions
- Hover states clairs
- Loading states avec spinners
- Feedback visuel immédiat
- Animations Framer Motion (entrées)

### Responsive
- Mobile-first approach
- Sidebar masquée sur mobile
- Grid adaptatif pour les cards
- Padding/margin cohérents

## 🔗 Dépendances

- `lucide-react` : Icônes
- `tailwindcss` : Styling
- `class-variance-authority` : Variantes de composants
- `framer-motion` : Animations (à ajouter)

## ❌ Ce qui n'est PAS géré ici

- ❌ Logique métier (dans pages/)
- ❌ Appels API (dans services/)
- ❌ State management global (dans contexts/)
- ❌ Routing (dans App.tsx)

## 🚀 Évolutions

- Dark mode toggle
- Plus de variantes de composants
- Composants de formulaire avancés (Select, Checkbox, Radio)
- Toast notifications
- Modal/Dialog
- Skeleton loaders

---

Les composants sont purement présentationnels et reçoivent leurs données via props.

