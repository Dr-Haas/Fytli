# 🔄 Mise à Jour - Mode Circuit Amélioré

## ✨ Nouvelles Fonctionnalités

### 1. **Sélection d'Exercices pour le Circuit**

Vous pouvez maintenant **choisir** exactement quels exercices inclure dans votre circuit !

**Comment ça marche :**

1. **Cliquez sur le bouton "Circuit"** en haut à droite
2. **Une modale s'ouvre** avec tous les exercices disponibles
3. **Cochez les exercices** que vous voulez dans votre circuit (minimum 2)
4. **Cliquez sur "Démarrer le Circuit"**
5. **Go !** Faites 1 série de chaque exercice sélectionné, puis recommencez

### 2. **Retour Automatique en Mode Linéaire**

**Nouvelle logique :**
- Une fois que **tous les exercices du circuit** ont complété **toutes leurs séries**
- Le système **repasse automatiquement en mode linéaire**
- Vous recevez une notification : "🎉 Circuit terminé ! Passage en mode linéaire"
- Vous pouvez ensuite continuer avec les exercices restants

**Exemple :**
```
Circuit sélectionné : Pompes + Squats + Planche

Tour 1: Pompes (1/3) → Squats (1/3) → Planche (1/3)
Tour 2: Pompes (2/3) → Squats (2/3) → Planche (2/3)
Tour 3: Pompes (3/3) → Squats (3/3) → Planche (3/3)

✅ Circuit terminé ! → Mode linéaire activé

Continue avec : Tractions → Développé couché → etc.
```

---

## 🎯 Interface Utilisateur

### Modal de Sélection

```
┌─────────────────────────────────┐
│ 🔄 Créer un Circuit            │
│ Sélectionnez les exercices     │
├─────────────────────────────────┤
│                                 │
│  ☑ Pompes         2/3 • 12 reps│
│  ☑ Squats         1/3 • 15 reps│
│  ☐ Tractions      0/3 • 8 reps │
│  ☑ Planche        0/3 • 30s    │
│                                 │
│  ✅ 3 exercice(s) sélectionné(s)│
│  Vous ferez 1 série de chaque,  │
│  puis recommencerez.            │
│                                 │
├─────────────────────────────────┤
│  [🔥 Démarrer le Circuit]      │
│  [   Annuler   ]                │
└─────────────────────────────────┘
```

### Bouton Circuit

Le bouton en haut à droite change selon le mode :
- **Mode Linéaire** : Bouton gris "📋 Linéaire" → Cliquez pour ouvrir la sélection
- **Mode Circuit** : Bouton orange "🔄 Circuit" → Cliquez pour revenir en linéaire

---

## 🚀 Cas d'Usage

### Scénario 1 : Superset Haut/Bas

1. **Sélectionner** : Développé couché + Squats
2. **Circuit** : Alterner haut et bas du corps
3. **Résultat** : Meilleure récupération, intensité maintenue

### Scénario 2 : Circuit Cardio

1. **Sélectionner** : Burpees + Mountain Climbers + Jumping Jacks
2. **Circuit** : Enchaînement rapide
3. **Résultat** : Fréquence cardiaque élevée, brûlage calorique max

### Scénario 3 : Focus sur un Groupe

1. **Sélectionner** : Tous les exercices de jambes
2. **Circuit** : Tour complet des jambes
3. **Après le circuit** : Continuer en linéaire avec le haut du corps

---

## 📊 Logique Technique

### Cycle du Circuit

```javascript
// 1. Sélection
circuitExercises = [Pompes, Squats, Planche]

// 2. Exécution
Pompes série 1 → repos → Squats série 1 → repos → Planche série 1
↓
Pompes série 2 → repos → Squats série 2 → repos → Planche série 2
↓
Pompes série 3 → repos → Squats série 3 → repos → Planche série 3

// 3. Vérification
Tous les exercices du circuit ont complété toutes leurs séries ?
→ OUI : Passer en mode linéaire
→ NON : Recommencer le circuit

// 4. Continuation
Mode linéaire activé → Exercices restants
```

### États du Circuit

| État | Description | Action |
|------|-------------|--------|
| **Linear** | Mode normal, série par série | Bouton "Circuit" visible |
| **Selecting** | Modal de sélection ouverte | Choix des exercices |
| **Circuit Active** | Circuit en cours d'exécution | Alternance automatique |
| **Circuit Complete** | Tous les exercices terminés | Retour auto en Linear |

---

## 🎨 Détails Visuels

### Exercices Sélectionnés
- ✅ **Bordure orange** + **Fond orange clair**
- ✅ **Checkmark** dans le cercle
- ✅ **Progrès visible** : "2/3 séries • 12 reps"

### Exercices Non Sélectionnés
- ⬜ **Bordure grise** + **Fond blanc**
- ⬜ **Cercle vide**
- ⬜ **Hover** : Bordure grise foncée

### Exercices Terminés
- 🚫 **Non affichés** dans la sélection
- 🚫 Ne peuvent pas être ajoutés au circuit

### Compteur
```
✅ 3 exercice(s) sélectionné(s)
Vous ferez 1 série de chaque, puis recommencerez jusqu'à épuisement.
```

---

## ⚡ Avantages

### Pour l'Utilisateur
- ✅ **Liberté totale** : Créez vos propres circuits
- ✅ **Flexible** : Changez de stratégie en cours de séance
- ✅ **Motivant** : Alternance réduit la monotonie
- ✅ **Efficace** : Optimisez votre temps

### Pour l'Entraînement
- ✅ **Supersets** : Groupes musculaires antagonistes
- ✅ **Circuit training** : Cardio + force
- ✅ **HIIT** : Haute intensité avec repos courts
- ✅ **Variété** : Combinez les styles

---

## 🔧 Fichiers Modifiés

```
frontend-fytli/src/pages/SessionWorkoutFlexible.tsx
```

**Changements :**
1. ✅ Ajout état `circuitExercises` (Set)
2. ✅ Ajout état `isSelectingCircuit` (boolean)
3. ✅ Fonction `toggleCircuitExercise()`
4. ✅ Fonction `startCircuit()`
5. ✅ Logique de retour auto en linéaire
6. ✅ Modal de sélection avec checkboxes
7. ✅ Gestion du cycle de circuit complet

---

## 📱 Expérience Utilisateur

### Flux Complet

```
1. Utilisateur clique sur "Circuit"
   ↓
2. Modal s'ouvre
   ↓
3. Utilisateur coche 3 exercices
   ↓
4. "Démarrer le Circuit"
   ↓
5. Modal se ferme
   ↓
6. Premier exercice du circuit s'affiche
   ↓
7. Utilisateur fait sa série
   ↓
8. Repos
   ↓
9. Deuxième exercice du circuit
   ↓
10. ... (continue le circuit)
    ↓
11. Tous les exercices du circuit terminés
    ↓
12. 🎉 Toast : "Circuit terminé !"
    ↓
13. Mode linéaire activé automatiquement
    ↓
14. Continue avec exercices restants
```

---

## 🎯 Résumé

| Fonctionnalité | Avant | Maintenant |
|----------------|-------|------------|
| **Sélection circuit** | Tous les exercices | ✅ Choix libre |
| **Retour linéaire** | Manuel | ✅ Automatique |
| **Interface** | Simple toggle | ✅ Modal complète |
| **Feedback** | Basique | ✅ Toast + compteurs |
| **Flexibilité** | Limitée | ✅ Totale |

---

## 🚀 À Tester

1. **Créer un circuit de 2 exercices**
2. **Compléter toutes les séries**
3. **Vérifier le retour auto en mode linéaire**
4. **Créer un nouveau circuit** (devrait rouvrir la modal)
5. **Annuler une sélection** (fermer la modal)

---

## 💡 Recommandations

### Pour les Débutants
- Commencer avec **2-3 exercices** dans le circuit
- Groupes musculaires différents (haut/bas)
- Repos de 60-90 secondes

### Pour les Avancés
- **4-5 exercices** dans le circuit
- Enchaînement rapide (30-45s de repos)
- Créer des circuits thématiques (force, cardio, mobilité)

### Exemples de Circuits
```
🔥 Circuit Cardio Explosif
- Burpees
- Mountain Climbers
- Jumping Jacks
- High Knees

💪 Circuit Force
- Pompes
- Squats
- Tractions
- Dips

🏃 Circuit HIIT
- Sprint sur place
- Burpees
- Squats sautés
- Pompes explosives
```

---

## ✅ Résultat Final

**Avant** : Mode circuit = tous les exercices, pas de choix
**Maintenant** : Mode circuit = sélection libre + retour auto en linéaire

**Impact** : Expérience utilisateur **beaucoup plus flexible** et **personnalisable** ! 🎉

