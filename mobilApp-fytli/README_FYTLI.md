# 🔥 Fytli - Application Mobile

Bienvenue dans l'application mobile Fytli ! Une app de fitness sociale gratuite qui permet à chacun de s'entraîner seul, tout en se motivant avec ses amis.

## 🌟 Concept

**"Seul, mais ensemble."**

Fytli repose sur l'énergie collective : plus on bouge, plus le cercle social s'allume. Pas de compétition, pas de chiffres agressifs — juste du mouvement, de la bienveillance et du partage.

## 🎨 Design System

### Palette de couleurs

```
Jaune lumineux : #FFD56B
Orange doux    : #FFA34A
Rouge orangé   : #FF7948
Fond crème     : #FBFAF7
Texte chaud    : #4A2E20
```

### Style visuel

- **Univers** : Dégradé jaune-orange-rouge
- **Ambiance** : Pixar lifestyle sportif doux
- **Style** : Flat 3D illustré / pastel, arrondi, lumineux
- **Typographie** : Poppins / Satoshi / Inter Rounded (System fallback)
- **Design** : Arrondi, lumineux, humain, non-technique

## 📱 Écrans principaux

### 1. Splash Screen (Écran d'accueil)
- Logo Fytli au centre
- Dégradé doux de fond
- Animation d'entrée
- CTA "Commencer"

### 2. Login / Inscription
- Interface simple et épurée
- Inputs arrondis
- Bouton gradient orange → rouge
- Option "Continuer sans compte"

### 3. Dashboard
- **Le Cercle Fytli** : cœur de l'application
  - Avatar central de l'utilisateur
  - Avatars des amis autour
  - Connexions lumineuses animées
  - Halo qui pulse (énergie collective)
- Statistiques douces (streak, badges, humeur)
- CTA "Commencer ma séance"

### 4. Feed Social
- Scroll vertical de cartes
- Activités des amis en temps réel
- Design chaleureux et bienveillant
- Émojis et indicateurs d'humeur

### 5. Carte du Jour
- Story partageable (format 9:16)
- Avatar + streak + badge du jour
- Fond dégradé animé
- Partage Instagram / Snapchat

### 6. Profil Utilisateur
- Avatar lumineux avec glow
- Statistiques personnelles
- Collection de badges
- Objectifs corporels avec barres de progression

### 7. Profil d'Ami
- Statistiques visibles publiquement
- Dernier programme suivi
- Badges publics
- Bouton Suivre / Ne plus suivre

### 8. Workout (Séance)
- Mode immersif plein écran
- Barre de progression horizontale
- Cartes d'exercices avec images
- Timer de repos circulaire
- Conseils et encouragements

### 9. Résumé de Séance
- Illustration de célébration
- Statistiques de la séance
- Badges débloqués
- CTA de partage

### 10. Feed Verrouillé
- Cercle Fytli grisé
- Message motivant
- Explication du système
- CTA "Faire ma séance"

## 🧩 Composants réutilisables

### Avatar
- Tailles : small, medium, large, xlarge
- Support image ou initiales
- Option glow (halo lumineux)

### Badge
- Tailles : small, medium, large
- Personnalisable (icône, couleur, label)
- Style 3D avec ombre

### ProgressBar
- Dégradé orange → rouge
- Label et pourcentage optionnels
- Hauteur personnalisable

### GradientButton
- Bouton avec dégradé personnalisable
- Tailles : small, medium, large
- États : normal, disabled, loading
- Ombre lumineuse

### Card
- Conteneur blanc avec ombre douce
- Bordures arrondies
- Style cohérent dans toute l'app

### Input
- Champ de saisie avec label
- Gestion des erreurs
- Style arrondi et moderne

## 🚀 Installation et démarrage

### Prérequis
```bash
Node.js v18+
npm ou yarn
Expo CLI
```

### Installation
```bash
cd mobilApp-fytli
npm install
```

### Lancement
```bash
# Démarrer le serveur
npm start

# Sur Android
npm run android

# Sur iOS
npm run ios

# Dans le navigateur
npm run web
```

## 📂 Structure du projet

```
mobilApp-fytli/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GradientButton.tsx
│   │   ├── Input.tsx
│   │   ├── ProgressBar.tsx
│   │   └── index.ts
│   ├── screens/          # Écrans de l'application
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── DailyCardScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── FriendProfileScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   ├── SessionSummaryScreen.tsx
│   │   ├── LockedFeedScreen.tsx
│   │   └── index.ts
│   ├── config/           # Configuration
│   │   ├── theme.ts      # Couleurs, typographie, espacement
│   │   └── api.ts        # Configuration API
│   ├── services/         # Services API
│   │   └── api.ts
│   ├── types/            # Types TypeScript
│   │   └── index.ts
│   └── utils/            # Fonctions utilitaires
│       └── helpers.ts
├── App.tsx              # Point d'entrée avec navigation
├── app.json             # Configuration Expo
├── package.json         # Dépendances
└── tsconfig.json        # Configuration TypeScript
```

## 🎯 Fonctionnalités principales

### ✅ Implémentées
- Navigation complète entre tous les écrans
- Design system cohérent avec la charte Fytli
- Composants réutilisables et modulaires
- Animations et transitions douces
- Gestion du cercle d'énergie
- Interface de workout immersive
- Système de badges
- Profils utilisateurs et amis

### 🚧 À venir
- Intégration API backend
- Authentification réelle
- Notifications push
- Synchronisation en temps réel
- Partage sur réseaux sociaux
- Mode sombre
- Internationalisation

## 🎨 Philosophie de design

### Émotions clés
- 🔥 Chaleur
- 💪 Fierté douce
- 🤝 Appartenance
- ✨ Bienveillance

### Ton
- Positif et encourageant
- Collectif plutôt que compétitif
- Humain et authentique
- Non-technique et accessible

## 💡 Micro-interactions

- Halo lumineux sur les avatars actifs
- Vibration légère sur tap
- Animations de célébration
- Transitions fluides entre écrans
- Timer de repos pulsant
- Feed qui glisse en douceur

## 🤝 Contribution

Ce projet fait partie de l'écosystème Fytli. Pour contribuer :
1. Respectez la charte graphique
2. Maintenez le ton bienveillant
3. Testez sur iOS et Android
4. Documentez vos composants

## 📄 Licence

Propriétaire - Fytli © 2025

---

**Fytli — Bouge mieux, vis mieux. 💪✨**

