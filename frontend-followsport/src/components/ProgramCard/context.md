# 💪 ProgramCard Component

## 🎯 Rôle

Le `ProgramCard` est une card interactive qui affiche les informations d'un programme sportif de manière élégante et engageante.

## 🎨 Design UX inspiré Revolut

### Visuels
- **Card arrondie** avec bordure subtile
- **Hover effect** : élévation (translateY -4px) + ombre accentuée
- **Icône** : Dumbbell dans un cercle coloré (bg-primary/10)
- **Badge difficulté** : Couleur dynamique selon le niveau
  - Débutant : vert
  - Intermédiaire : bleu
  - Avancé : violet

### Animations (Framer Motion)
- **Entrée** : fade-in + slide-up (opacity + translateY)
- **Hover** : smooth elevation
- **Durée** : 300ms pour fluidité

### Informations affichées
1. **Nom du programme** (CardTitle)
2. **Description** (CardDescription, line-clamp-2)
3. **Badge difficulté** (coin supérieur droit)
4. **Date de création** (icône calendrier)

## 📦 Props

```tsx
interface ProgramCardProps {
  program: Program;        // Objet programme complet
  onClick?: () => void;    // Callback au clic (navigation)
}
```

## 🔗 Utilisation

Typiquement dans la page `/programs` :

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {programs.map(program => (
    <ProgramCard 
      key={program.id} 
      program={program}
      onClick={() => navigate(`/programs/${program.id}`)}
    />
  ))}
</div>
```

## ✅ Ce qu'il gère

- Affichage élégant des données
- Hover states interactifs
- Animation d'entrée
- Click handler
- Couleurs conditionnelles (difficulté)
- Truncate description (line-clamp-2)

## ❌ Ce qu'il ne gère PAS

- Chargement des données (fait par la page)
- Navigation (délégué au parent via onClick)
- Édition/suppression de programmes
- Gestion d'état local

## 🚀 Évolutions possibles

### Court terme
- Progress bar (% de complétion)
- Nombre de sessions
- Icône "favori"

### Moyen terme
- Preview des exercices au hover
- Mode compact/étendu
- Actions rapides (éditer, supprimer)
- Drag & drop pour réorganiser

### Long terme
- Partage social
- Duplication de programme
- Export PDF

---

**Inspiration** : Cards Revolut (épurées, interactives, informatives)
**Animations** : Framer Motion
**Design** : TailwindCSS + shadcn/ui

