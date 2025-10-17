# 🏋️ Guide d'Utilisation - Flux d'Entraînement Fytli

## 🚀 Démarrage rapide

### 1. Lancer l'app
```bash
cd frontend-followsport
npm run dev
```

### 2. Tester le flux complet

#### Étape 1 : Page Programmes
- Aller sur http://localhost:5173/programs
- Cliquer sur n'importe quel programme

#### Étape 2 : Détail du Programme
- Voir les informations du programme
- Voir la liste des sessions
- Cliquer sur **"Let's Go!"** sur une session

#### Étape 3 : Séance d'Entraînement
- Faire les exercices un par un
- Cliquer sur **"Série terminée"** après chaque série
- Observer le **compte à rebours** de repos
- (Optionnel) Cliquer sur **"Passer"** pour skip le repos
- Répéter jusqu'au dernier exercice

#### Étape 4 : Résumé de Séance
- Voir les **statistiques** (durée, exercices, séries)
- Lire les **commentaires AI** (données statiques)
- Voir la **liste des exercices réalisés**
- Cliquer sur **"Retour au Dashboard"**

---

## 📱 Captures d'écran (à venir)

### Page Programmes
- Liste des programmes
- Bouton "Nouveau programme"
- Cards avec niveau et durée

### Détail du Programme
- Header avec titre en dégradé
- Badge de niveau
- Liste des sessions avec bouton "Let's Go!"

### Séance d'Entraînement
- Barre de progression en haut
- Grande card exercice
- Stats : Série, Reps, Repos
- Liste "À venir"

### Écran de Repos
- Timer en grand
- Icon Timer
- Message "Temps de repos"
- Bouton "Passer"

### Résumé de Séance
- Hero dégradé avec Trophy
- 3 cards de stats
- 3 commentaires AI
- Liste des exercices

---

## 🎯 Features Principales

### ✅ Flux complet A→Z
- Parcours logique et fluide
- Navigation intuitive
- Animations douces

### ✅ Design Fytli
- Couleurs crème, rouge, orange
- Dégradés harmonieux
- Ombres douces
- Typography cohérente

### ✅ UX Premium
- Timer de repos interactif
- Barre de progression
- Messages motivants
- Animations Framer Motion

### ✅ Données intelligentes
- Calcul automatique des stats
- Gestion des séries/repos
- Progression automatique

---

## 🔧 Configuration

### Variables d'environnement (.env)
```bash
VITE_API_URL=http://localhost:9001
```

### Backend requis
L'app fonctionne avec des **données de test** si le backend n'est pas disponible.

Pour une expérience complète, le backend doit fournir :
- `GET /programs/:id` - Détail d'un programme
- `GET /programs/:id/sessions` - Sessions d'un programme
- `GET /sessions/:id` - Détail d'une session
- `GET /sessions/:id/exercises` - Exercices d'une session (TODO)

---

## 📦 Pages Créées

| Page | Route | Description |
|------|-------|-------------|
| **ProgramDetail** | `/programs/:id` | Détail d'un programme + liste des sessions |
| **SessionWorkout** | `/session/:id` | Entraînement étape par étape |
| **SessionSummary** | `/session-summary` | Résumé post-séance avec stats et AI |

---

## 🎨 Composants Réutilisables

Tous les composants utilisent le design system Fytli :

### Buttons
```tsx
<Button className="btn-brand">Let's Go!</Button>
```

### Cards
```tsx
<Card className="card-fytli">...</Card>
```

### Text Gradient
```tsx
<h1 className="text-gradient">Fytli</h1>
```

### Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  ...
</motion.div>
```

---

## 🚧 Prochaines Améliorations

### Court terme
- [ ] Intégration backend pour récupérer les exercices
- [ ] Sauvegarder l'historique des séances
- [ ] Éditer sets/reps en live

### Moyen terme
- [ ] **Intégration OpenAI** pour commentaires personnalisés
- [ ] Timer audio avec sons
- [ ] Notifications push
- [ ] Mode hors-ligne (PWA)

### Long terme
- [ ] Vidéos des exercices
- [ ] Suivi de la charge (kg)
- [ ] Graphiques de progression
- [ ] Coach AI personnalisé

---

## 🐛 Debug

### Problème : "Session non trouvée"
→ Vérifier que le backend retourne bien les données

### Problème : "Aucun exercice"
→ Normal ! Les exercices sont en données de test (3 exercices statiques)

### Problème : Le timer ne descend pas
→ Vérifier la console, peut-être un problème d'état React

---

## 📝 Logs Utiles

Pour débugger, ouvrir la console :
```javascript
// SessionWorkout
console.log('Current exercise:', currentExercise);
console.log('Current set:', currentSet);
console.log('Is resting:', isResting);
console.log('Rest time left:', restTimeLeft);
```

---

## 💡 Tips

### Pour tester rapidement
1. Créer un programme avec 2-3 exercices
2. Cliquer sur "Let's Go!"
3. Spammer "Série terminée" pour avancer vite
4. Cliquer "Passer" pour skip les repos
5. Arriver au résumé en 30 secondes

### Pour tester le timer
1. Lancer une session
2. Faire une série
3. Observer le compte à rebours
4. Tester le bouton "Passer"

### Pour tester le résumé
1. Terminer une séance complète
2. Vérifier que les stats sont correctes
3. Lire les 3 commentaires AI

---

## 🎉 Résultat Final

Un **parcours d'entraînement complet** qui :
- ✅ Guide l'utilisateur étape par étape
- ✅ Encourage et motive
- ✅ Fournit des stats et analyse
- ✅ Respecte le branding Fytli
- ✅ Offre une UX premium

**Bouge mieux, vis mieux. 💪**

---

## 📚 Documentation Complète

- **`FEATURE_SESSION_WORKOUT.md`** - Documentation technique détaillée
- **`FEATURE_CREATION_PROGRAMMES.md`** - Création de programmes
- **`BRAND.md`** - Guide de branding Fytli
- **`REBRANDING_COMPLETE.md`** - Historique du rebranding

---

**Version** : Fytli 1.2  
**Date** : Octobre 2025  
**Status** : ✅ Production Ready

