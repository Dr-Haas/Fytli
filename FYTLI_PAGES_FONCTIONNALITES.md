# 📱 Fytli - Pages & Fonctionnalités

> Documentation complète des pages et fonctionnalités de l'application mobile Fytli

---

## 🎯 Vue d'Ensemble

**Type** : Progressive Web App (PWA) - Mobile-First  
**Stack** : React + TypeScript + Vite  
**Backend** : Node.js + Express + MySQL  
**Auth** : JWT (JSON Web Token)

---

## 📄 PAGES (12 pages)

### 1. 🔐 Login / Inscription
**Route** : `/login`  
**Statut** : Public

#### Fonctionnalités
- Formulaire de connexion (email + password)
- Formulaire d'inscription (firstname, lastname, email, password, birthdate, gender, fitness_level)
- Toggle entre mode login et register
- Validation des champs en temps réel
- Gestion des erreurs d'authentification
- Auto-login avec JWT stocké dans localStorage
- Redirection vers `/dashboard` après connexion réussie

---

### 2. 🏠 Dashboard
**Route** : `/dashboard`  
**Statut** : Privé (authentification requise)

#### Fonctionnalités
- **Statistiques rapides**
  - Nombre de programmes actifs
  - Sessions complétées cette semaine
  - Badges débloqués
  - Série actuelle (streak) en jours consécutifs

- **Calendrier hebdomadaire**
  - Vue des 7 derniers jours
  - Jour actuel en surbrillance
  - Nombre de sessions par jour
  - Indicateur visuel des sessions complétées

- **Agenda du jour**
  - Sessions planifiées pour aujourd'hui
  - Créneaux horaires assignés
  - Bouton rapide pour démarrer une session

- **Programmes actifs (Top 3)**
  - Liste des 3 programmes en cours
  - Barre de progression pour chaque programme
  - Pourcentage de complétion
  - Click pour accéder au détail

- **Badges récents (3 derniers)**
  - Derniers badges débloqués
  - Date d'obtention
  - Lien vers la page complète des badges

- **Activité récente (5 dernières)**
  - Liste des 5 dernières sessions complétées
  - Date, durée, feeling
  - Nom de la session et du programme

- **Call-to-Action**
  - Message motivant basé sur le streak
  - Bouton pour commencer une nouvelle session

---

### 3. 💪 Programmes
**Route** : `/programs`  
**Statut** : Privé

#### Fonctionnalités
- **Recherche**
  - Barre de recherche en temps réel
  - Filtrage par titre ou description

- **Planning hebdomadaire**
  - Agenda des sessions planifiées
  - Vue par jour de la semaine
  - Créneaux horaires (morning, afternoon, evening)

- **Liste des programmes**
  - Grille de tous les programmes disponibles
  - Pour chaque programme :
    - Titre, description
    - Niveau (beginner, intermediate, advanced)
    - Objectif (muscle_gain, weight_loss, endurance, etc.)
    - Durée en semaines
    - Nombre de sessions
    - Statut d'inscription de l'utilisateur

- **Création de programme**
  - Bouton "Nouveau programme"
  - Modal multi-étapes :
    - Informations générales (titre, description, niveau, objectif, durée)
    - Ajout d'exercices depuis la bibliothèque
    - Configuration des sets/reps/repos pour chaque exercice
  - Validation et création

---

### 4. 📋 Détail Programme
**Route** : `/programs/:id`  
**Statut** : Privé

#### Fonctionnalités
- **Informations du programme**
  - Titre, description complète
  - Badge de niveau
  - Badge d'objectif
  - Durée totale
  - Créateur du programme

- **Statistiques personnelles**
  - Nombre total de sessions
  - Sessions complétées par l'utilisateur
  - Barre de progression
  - Pourcentage de complétion

- **Gestion de l'inscription**
  - Bouton "S'inscrire" (si pas inscrit)
  - Bouton "Se désinscrire" (si inscrit)
  - Confirmation avant désinscription

- **Liste des sessions**
  - Toutes les sessions du programme
  - Pour chaque session :
    - Titre
    - Ordre/numéro
    - Durée estimée
    - Nombre d'exercices
    - Statut (complétée ou non)
    - Bouton "Commencer" ou "Reprendre"

- **Planification**
  - Assigner des sessions à des jours/créneaux
  - Modifier ou supprimer des créneaux
  - Vue récapitulative du planning

- **Historique**
  - Liste des fois où les sessions ont été complétées
  - Dates, durées, feelings

---

### 5. 🏋️ Session Workout
**Route** : `/session/:id`  
**Statut** : Privé - Mode plein écran

#### Fonctionnalités
- **Mode immersif**
  - Pas de navigation (header/sidebar masqués)
  - Bouton "Quitter" avec confirmation

- **Informations de session**
  - Titre de la session
  - Numéro d'exercice actuel / total
  - Barre de progression globale

- **Exercice actuel**
  - Nom de l'exercice
  - Image ou GIF de démonstration
  - Catégorie et muscles ciblés
  - Instructions détaillées
  - Configuration : sets × reps
  - Poids suggéré (si applicable)
  - Zone pour notes personnelles

- **Timer de repos**
  - Compte à rebours entre les sets
  - Affichage du temps restant
  - Son/notification à la fin du repos
  - Bouton "Skip rest"
  - Bouton "Add 30s"

- **Tracking des sets**
  - Liste des sets à effectuer
  - Checkbox pour valider chaque set
  - Input pour saisir le poids utilisé
  - Input pour saisir les reps réelles

- **Navigation**
  - Bouton "Exercice précédent"
  - Bouton "Exercice suivant"
  - Support du swipe gauche/droite (mobile)
  - Indicateurs de position

- **Complétion**
  - Bouton "Terminer la session"
  - Confirmation avant sortie
  - Redirection vers `/session-summary`

- **Modes disponibles**
  - Mode classique (`SessionWorkout.tsx`)
  - Mode circuit/flexible (`SessionWorkoutFlexible.tsx`)

---

### 6. 📊 Session Summary
**Route** : `/session-summary`  
**Statut** : Privé

#### Fonctionnalités
- **Résumé de la session**
  - Durée totale
  - Nombre d'exercices complétés
  - Nombre de sets totaux
  - Volume total (poids × reps)
  - Calories estimées brûlées

- **Formulaire de feedback**
  - **Feeling** : Comment tu te sens ?
    - Excellent, Bien, Correct, Difficile, Très dur
  - **Intensité** : Niveau de difficulté (1-10)
  - **Notes personnelles** : Commentaires libres
  - Sauvegarde du feedback dans la base

- **Commentaire AI (beta)**
  - Analyse générée par OpenAI (si activé)
  - Conseils personnalisés
  - Encouragements

- **Badges débloqués**
  - Si un badge a été débloqué pendant cette session
  - Animation de célébration
  - Détails du badge

- **Actions**
  - Voir le détail complet de la complétion
  - Retour au programme
  - Retour au dashboard

---

### 7. 📈 Détail Complétion
**Route** : `/completion/:id`  
**Statut** : Privé

#### Fonctionnalités
- **En-tête**
  - Titre de la session
  - Nom du programme
  - Date et heure exacte de complétion

- **Statistiques détaillées**
  - Durée totale
  - Durée effective (temps de travail)
  - Temps de repos total
  - Nombre d'exercices effectués
  - Nombre total de sets
  - Nombre total de reps
  - Volume total soulevé

- **Liste des exercices effectués**
  - Pour chaque exercice :
    - Nom et catégorie
    - Sets × reps réalisés
    - Poids utilisés par set
    - Temps de repos entre sets
    - Notes spécifiques

- **Feedback de l'utilisateur**
  - Feeling (emoji + texte)
  - Intensité perçue
  - Notes écrites
  - Commentaire AI (si disponible)

- **Graphiques**
  - Répartition du temps (travail vs repos)
  - Volume par exercice
  - Comparaison avec la session précédente

- **Comparaison historique**
  - Comparaison avec la dernière fois que cette session a été faite
  - Indicateurs de progression ou régression
  - Suggestions d'amélioration

---

### 8. 👤 Profil
**Route** : `/profile`  
**Statut** : Privé - Profil de l'utilisateur connecté

#### Fonctionnalités

##### Section Informations Personnelles
- Affichage et édition des données :
  - Photo de profil (upload possible)
  - Prénom, Nom
  - Email
  - Date de naissance
  - Genre
  - Niveau de fitness
- Mode édition inline
- Sauvegarde des modifications

##### Section Objectifs Corporels
- Définir un objectif :
  - Type d'objectif (perte de poids, prise de masse, maintenance)
  - Poids de départ
  - Poids cible
  - Date cible
- Visualisation de la progression
- Barre de progression vers l'objectif
- Calcul automatique du rythme nécessaire

##### Section Composition Corporelle
- **Graphiques d'évolution**
  - Courbe du poids dans le temps
  - Courbe de l'IMC
  - Courbe du pourcentage de graisse
  - Courbe de la masse musculaire
  - Mesures corporelles (taille, hanches, bras, cuisses, poitrine)

- **Historique des mesures**
  - Liste de toutes les mesures enregistrées
  - Dates et valeurs
  - Suppression possible

- **Ajout de mesure**
  - Formulaire pour nouvelle mesure
  - Champs : poids, body fat %, masse musculaire, mensurations
  - Date et notes optionnelles

##### Section Badges
- Badges débloqués (affichage visuel)
- Nombre total de badges / badges obtenus
- Progression globale
- Lien vers page complète des badges

##### Section Statistiques Générales
- Membre depuis (date d'inscription)
- Nombre total de sessions complétées
- Nombre de programmes inscrits
- Streak actuel (jours consécutifs)
- Record de streak
- Temps total d'entraînement (heures)
- Calories totales brûlées (estimation)

##### Section Objectifs Hebdomadaires
- Définir un objectif de sessions par semaine
- Progression dans la semaine actuelle
- Historique des semaines précédentes
- Taux de réussite

##### Déconnexion
- Bouton de déconnexion
- Confirmation avant logout
- Clear du token JWT

---

### 9. 👥 Profil Utilisateur (autre)
**Route** : `/profile/:userId`  
**Statut** : Privé

#### Fonctionnalités
- Voir le profil public d'un autre utilisateur
- Informations visibles :
  - Photo de profil
  - Prénom, Nom
  - Niveau de fitness
  - Badges débloqués (publics)
  - Statistiques générales (si publiques)
- Bouton "Suivre" (si feature sociale activée)
- Pas d'accès aux données privées
- Pas d'édition possible

---

### 10. 🏆 Badges
**Route** : Intégré dans `/profile` (ou route dédiée si activée)  
**Statut** : Privé

#### Fonctionnalités

##### Vue d'ensemble
- Nombre de badges débloqués / total
- Pourcentage global de complétion
- Points totaux gagnés (si système de points activé)

##### Filtres par catégorie
- **Tous** : Affiche tous les badges
- **Routine** : Constance, Routine Matinale, Routine du Soir
- **Performance** : Progression, Niveau Supérieur
- **Santé** : Sérénité, Santé Cardiaque
- **Accomplissement** : Objectif Atteint, Challenge Réussi, Esprit Fytli

##### Grille de badges
- **Pour chaque badge débloqué** :
  - Icône en couleur
  - Nom du badge
  - Description complète
  - Date et heure d'obtention
  - Condition pour l'obtenir

- **Pour chaque badge verrouillé** :
  - Icône en gris/opacity
  - Nom masqué si badge secret
  - Condition pour le débloquer
  - Barre de progression vers le débloquage
  - Pourcentage d'avancement

##### Motivation
- Messages personnalisés selon la progression
- Encouragements adaptés au nombre de badges

---

### 11. 🔔 Paramètres Notifications
**Route** : `/notifications/settings`  
**Statut** : Privé

#### Fonctionnalités

##### Notifications Push
- Toggle activer/désactiver les push notifications
- Demande de permission au navigateur
- Enregistrement du token de notification
- Bouton de test de notification

##### Types de notifications
- Rappels de séances planifiées (toggle)
- Badges débloqués (toggle)
- Objectifs atteints (toggle)
- Encouragements pour maintenir le streak (toggle)
- Messages sociaux/communautaires (toggle, si activé)

##### Fréquence et timing
- Jamais / Quotidien / Plusieurs fois par jour
- Heure préférée pour les rappels du matin
- Heure préférée pour les rappels du soir
- Plages horaires personnalisées

##### Notifications Email
- Toggle pour recevoir des emails
- Types d'emails :
  - Newsletter
  - Résumés hebdomadaires
  - Nouveaux programmes
  - Rappels de sessions

##### Gestion
- Liste des appareils enregistrés
- Désinscription par appareil
- Historique des notifications envoyées

---

### 12. ❌ Redirections & 404
**Routes** : `/`, `/*`

#### Fonctionnalités
- Route `/` : Redirection automatique vers `/dashboard`
- Routes non trouvées : Redirection vers `/dashboard`
- OU affichage d'une page 404 si nécessaire
- Message d'erreur si applicable

---

## 🔧 FONCTIONNALITÉS TRANSVERSES

### 1. Authentication (JWT)

#### Inscription
- Endpoint : `POST /auth/register`
- Données : firstname, lastname, email, password, birthdate, gender, fitness_level
- Validation côté client et serveur
- Hash du mot de passe (bcrypt)
- Génération du token JWT
- Stockage dans localStorage

#### Connexion
- Endpoint : `POST /auth/login`
- Données : email, password
- Vérification des credentials
- Génération du token JWT
- Stockage dans localStorage
- Redirection vers `/dashboard`

#### Protection des routes
- Middleware `PrivateRoute`
- Vérification du token JWT
- Redirection vers `/login` si non authentifié
- Refresh automatique du token si expiré

#### Déconnexion
- Clear du token dans localStorage
- Endpoint : `POST /auth/logout` (optionnel)
- Redirection vers `/login`

#### Context AuthContext
- `user` : Objet utilisateur courant
- `login(email, password)` : Fonction de connexion
- `logout()` : Fonction de déconnexion
- `updateProfile(data)` : Mise à jour du profil
- `isAuthenticated` : Boolean
- `loading` : Boolean

---

### 2. Gamification - Système de Badges

#### 10 Badges Disponibles

| Badge ID | Nom | Icône | Catégorie | Condition |
|----------|-----|-------|-----------|-----------|
| consistency | Constance | 🔥 | Routine | Compléter des sessions 7 jours consécutifs |
| progress | Progression | 💪 | Performance | Amélioration sur 3 sessions d'un même programme |
| serenity | Sérénité | 🧘 | Santé | Compléter 10 sessions de yoga/stretching |
| level_up | Niveau Supérieur | 🚀 | Performance | Compléter un programme de niveau advanced |
| cardio_health | Santé Cardiaque | ❤️ | Santé | Compléter 20 sessions de cardio |
| morning_routine | Routine Matinale | 🌅 | Routine | Compléter 5 sessions avant 9h du matin |
| evening_routine | Routine du Soir | 🌙 | Routine | Compléter 5 sessions après 18h |
| goal_achieved | Objectif Atteint | 🎯 | Accomplissement | Atteindre son objectif de poids corporel |
| challenge_complete | Challenge Réussi | 🏆 | Accomplissement | Compléter un programme entier (100%) |
| fytli_spirit | Esprit Fytli | 💫 | Accomplissement | Débloquer tous les autres badges |

#### Attribution Automatique
- Déclenchée après chaque session complétée
- Endpoint : `POST /badges/check/:userId`
- Utilisation de stored procedures SQL dans le backend
- Vérification de toutes les conditions
- Insertion dans `user_badges` avec `earned_at`
- Retour des nouveaux badges débloqués

#### Notifications de Badge
- Toast notification immédiate
- Modal de célébration avec animation
- Détails du badge (nom, description, icône)
- Partage possible (si feature sociale)

#### Progression vers les Badges
- Calcul du pourcentage d'avancement
- Endpoint : `GET /badges/user/:userId/with-progress`
- Affichage de barres de progression
- Feedback visuel sur la proximité du déblocage

---

### 3. Planification - Time Slots

#### Créneaux Horaires
- Table `time_slots` :
  - `user_id` : ID de l'utilisateur
  - `session_id` : ID de la session planifiée
  - `program_id` : ID du programme
  - `day_of_week` : Jour de la semaine (1=Lundi, 7=Dimanche)
  - `time_slot` : Créneau (morning, afternoon, evening) ou HH:MM
  - `is_recurring` : Boolean (répétition chaque semaine)

#### Fonctionnalités
- **Création de créneau** : `POST /time-slots`
- **Modification** : `PUT /time-slots/:id`
- **Suppression** : `DELETE /time-slots/:id`
- **Vue semaine** : `GET /time-slots/week/:userId`
- **Vue jour** : Créneaux du jour actuel

#### Agenda
- Vue hebdomadaire avec 7 jours
- Affichage des sessions par créneau
- Drag & drop pour réorganiser (optionnel)
- Validation des conflits d'horaire

#### Rappels
- Notifications push avant une session planifiée
- Délai configurable (30min, 1h, 2h avant)
- Snooze possible

---

### 4. Objectifs Hebdomadaires - Weekly Goals

#### Structure
- Table `weekly_goals` :
  - `user_id` : ID de l'utilisateur
  - `target_sessions` : Nombre de sessions visées
  - `current_sessions` : Nombre de sessions complétées
  - `week_start_date` : Début de la semaine (lundi)
  - `week_end_date` : Fin de la semaine (dimanche)
  - `status` : in_progress, completed, failed

#### Fonctionnalités
- **Création d'objectif** : `POST /weekly-goals`
  - Définir le nombre de sessions cible
  - Semaine actuelle par défaut
  
- **Récupération** : `GET /weekly-goals/current/:userId`
  - Objectif de la semaine en cours
  - Calcul de la progression

- **Mise à jour automatique**
  - Incrémentation du compteur à chaque session complétée
  - Marquage comme "completed" si objectif atteint
  - Marquage comme "failed" si semaine terminée et objectif non atteint

#### Affichage
- Carte sur le dashboard ou profil
- Barre de progression visuelle
- Pourcentage d'avancement
- Nombre de sessions restantes
- Encouragements dynamiques

#### Historique
- Liste des semaines précédentes
- Taux de réussite global
- Statistiques de régularité

---

### 5. Composition Corporelle - Body Composition

#### Métriques Trackées
- Poids (kg ou lbs)
- IMC (Body Mass Index)
- Pourcentage de graisse corporelle
- Masse musculaire (kg)
- Mensurations :
  - Tour de taille (cm)
  - Tour de hanches (cm)
  - Tour de bras (cm)
  - Tour de cuisses (cm)
  - Tour de poitrine (cm)

#### Structure
- Table `body_measurements` :
  - `user_id`
  - `weight`
  - `body_fat_percentage`
  - `muscle_mass`
  - `waist`, `hips`, `chest`, `arms`, `thighs`
  - `measurement_date`
  - `notes`

#### Fonctionnalités
- **Ajout de mesure** : `POST /body-measurements`
  - Formulaire avec tous les champs (optionnels sauf poids et date)
  - Validation des valeurs
  - Notes libres

- **Historique** : `GET /body-measurements/user/:userId`
  - Liste de toutes les mesures
  - Tri par date (plus récent en premier)
  - Suppression possible

- **Dernière mesure** : `GET /body-measurements/latest/:userId`
  - Récupération rapide de la mesure la plus récente

#### Visualisation
- Graphiques d'évolution dans le temps
  - Line chart pour le poids
  - Line chart pour l'IMC
  - Line chart pour le body fat %
  - Line chart pour la masse musculaire
  - Multi-line chart pour les mensurations

- Calculs automatiques :
  - IMC = poids / (taille²)
  - Variation depuis la dernière mesure
  - Tendance (hausse/baisse)

- Comparaison avec objectif corporel
  - Alignement avec la cible
  - Prédiction d'atteinte de l'objectif

---

### 6. Objectifs Corporels - Body Goals

#### Types d'Objectifs
- `weight_loss` : Perte de poids
- `muscle_gain` : Prise de masse
- `maintenance` : Maintien
- `recomposition` : Recomposition corporelle

#### Structure
- Table `body_goals` :
  - `user_id`
  - `goal_type`
  - `target_weight` : Poids cible (kg)
  - `target_date` : Date cible
  - `starting_weight` : Poids de départ
  - `current_weight` : Poids actuel
  - `status` : active, completed, abandoned
  - `strategy` : Notes sur la stratégie

#### Fonctionnalités
- **Création** : `POST /body-goals`
  - Sélection du type d'objectif
  - Définition du poids cible
  - Définition de la date cible
  - Poids de départ (automatique depuis dernière mesure)

- **Mise à jour** : `PUT /body-goals/:id`
  - Modification du poids cible ou date
  - Changement de stratégie
  - Mise à jour du poids actuel (sync avec body_measurements)

- **Calculs** :
  - Progression : `(poids actuel - poids départ) / (poids cible - poids départ) * 100`
  - Poids restant à perdre/gagner
  - Taux hebdomadaire nécessaire
  - Date estimée d'atteinte (basée sur tendance)

#### Visualisation
- Barre de progression
- Graphique avec 3 lignes :
  - Poids de départ
  - Poids actuel
  - Poids cible
- Courbe de progression réelle vs projection linéaire
- Messages motivants selon progression

---

### 7. Historique des Sessions

#### Accès
- Page dédiée (si implémentée) ou section dans profil
- Endpoint : `GET /completions/user/:userId`

#### Fonctionnalités
- **Liste complète** de toutes les sessions complétées
  - Date et heure
  - Nom de la session
  - Programme associé
  - Durée
  - Feeling
  - Volume total
  
- **Filtres**
  - Par programme
  - Par plage de dates
  - Par feeling
  - Par type d'exercice (cardio, strength, etc.)

- **Tri**
  - Plus récent en premier (défaut)
  - Plus ancien en premier
  - Par durée
  - Par volume

- **Recherche**
  - Par nom de session ou programme

- **Export**
  - Export CSV de l'historique
  - Export PDF (optionnel)

#### Statistiques Globales
- Nombre total de sessions
- Temps total d'entraînement
- Volume total soulevé
- Moyenne de sessions par semaine/mois
- Distribution par type d'exercice
- Évolution dans le temps

---

### 8. Système de Notifications

#### Notifications Push (Web Push)

##### Configuration
- Demande de permission via l'API Notifications
- Enregistrement du service worker
- Génération et stockage du subscription token
- Endpoint : `POST /notifications/subscribe`

##### Types de Notifications
1. **Rappel de session planifiée**
   - Déclenchée X minutes avant le créneau
   - Titre : "C'est l'heure de bouger ! 💪"
   - Message : Nom de la session et du programme
   - Action : Ouvrir l'app sur la session

2. **Badge débloqué**
   - Déclenchée immédiatement après débloquage
   - Titre : "Nouveau badge ! 🏆"
   - Message : Nom du badge
   - Action : Ouvrir l'app sur la page badges

3. **Objectif atteint**
   - Objectif hebdomadaire complété
   - Objectif corporel atteint
   - Titre : "Objectif atteint ! 🎯"
   - Action : Ouvrir l'app sur le dashboard

4. **Encouragement streak**
   - Si pas de session depuis X jours
   - Titre : "On revient ? 🔥"
   - Message : "Ta série de X jours t'attend"
   - Action : Ouvrir l'app

5. **Social (optionnel)**
   - Nouvel ami
   - Message d'un ami
   - Challenge communautaire

##### Gestion
- Liste dans la page `/notifications/settings`
- Toggle on/off global
- Toggle par type de notification
- Configuration des heures préférées
- Test de notification

#### Notifications In-App (Toasts)

##### Bibliothèque
- React Hot Toast

##### Types
- `success` : Opération réussie (vert)
- `error` : Erreur (rouge)
- `info` : Information (bleu)
- `loading` : En cours (spinner)
- `custom` : Personnalisé

##### Utilisation
```javascript
showToast.success('Session terminée ! 💪');
showToast.error('Impossible de charger les données');
showToast.info('Nouveau badge débloqué !');
```

##### Configuration
- Position : top-center ou top-right
- Durée : 3-5 secondes (auto-dismiss)
- Dismissible : Click pour fermer
- Max visible : 3 simultanément

#### Notifications Email

##### Types
- Résumé hebdomadaire
- Newsletter mensuelle
- Rappels de sessions (si désactivé sur push)
- Notifications de compte (changement de mot de passe, etc.)

##### Configuration
- Opt-in/opt-out par type
- Endpoint : `PUT /notifications/email-preferences`

---

### 9. Animations - Framer Motion

#### Transitions de Page
- Fade in/out lors du changement de route
- Slide up pour les modals
- Delay pour stagger effect sur listes

#### Éléments Animés
- **Compteurs** : Animation incrémentale des chiffres
- **Progress bars** : Fill animé de 0 à X%
- **Badges** : Scale + rotate lors du débloquage
- **Cards** : Hover effect avec translateY
- **Lists** : Stagger children (apparition décalée)
- **Loaders** : Spinner rotation

#### Micro-interactions
- Buttons : Scale on press
- Checkboxes : Bounce on check
- Inputs : Border color transition
- Cards : Shadow expansion on hover

---

### 10. PWA - Progressive Web App

#### Manifest (`manifest.webmanifest`)
```json
{
  "name": "Fytli",
  "short_name": "Fytli",
  "description": "Ton compagnon sport & bien-être",
  "start_url": "/dashboard",
  "display": "standalone",
  "theme_color": "#FF4D3A",
  "background_color": "#FBFAF7",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker (Workbox)
- **Précache** : Assets statiques (HTML, CSS, JS, images)
- **Runtime Cache** :
  - API responses (NetworkFirst strategy)
  - Images (CacheFirst strategy)
  - Fonts (CacheFirst strategy)
- **Offline Fallback** : Page hors ligne si pas de connexion
- **Background Sync** : Retry failed requests
- **Push Notifications** : Écoute des notifications push

#### Fonctionnalités PWA
- **Installable** : 
  - Prompt "Ajouter à l'écran d'accueil"
  - Desktop install disponible
  - Icônes et splash screens

- **Offline-ready** :
  - Contenu en cache accessible hors ligne
  - API calls mises en queue si pas de réseau
  - Sync automatique au retour de la connexion

- **Standalone** :
  - Lance comme une app native (pas de barre d'URL)
  - Fullscreen sur mobile

- **Auto-update** :
  - Détection de nouvelle version
  - Prompt "Nouvelle version disponible"
  - Reload automatique

---

## 📊 API ENDPOINTS - Récapitulatif

### Authentication
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion (retourne JWT)
- `GET /auth/profile` - Profil (avec JWT header)
- `PUT /auth/profile` - Modifier profil
- `POST /auth/logout` - Déconnexion

### Users
- `GET /users` - Liste (admin)
- `GET /users/:id` - Détail
- `PUT /users/:id` - Modifier
- `DELETE /users/:id` - Supprimer

### Programs
- `GET /programs` - Liste
- `GET /programs/:id` - Détail
- `POST /programs` - Créer
- `PUT /programs/:id` - Modifier
- `DELETE /programs/:id` - Supprimer

### Sessions
- `GET /sessions` - Liste
- `GET /sessions/:id` - Détail
- `GET /programs/:programId/sessions` - Sessions d'un programme
- `POST /sessions` - Créer
- `PUT /sessions/:id` - Modifier
- `DELETE /sessions/:id` - Supprimer
- `POST /sessions/:id/exercises` - Ajouter exercice
- `PUT /sessions/:id/exercises/:exerciseId` - Modifier exercice
- `DELETE /sessions/:id/exercises/:exerciseId` - Retirer exercice

### Exercises
- `GET /exercises` - Liste
- `GET /exercises/:id` - Détail
- `GET /exercises/category/:id` - Par catégorie
- `POST /exercises` - Créer (admin)

### Enrollments
- `GET /enrollments/user/:userId` - Programmes d'un utilisateur
- `GET /enrollments/program/:programId` - Utilisateurs d'un programme
- `POST /enrollments` - S'inscrire
- `DELETE /enrollments/:id` - Se désinscrire

### Completions
- `GET /completions` - Liste
- `GET /completions/:id` - Détail
- `GET /completions/user/:userId` - Par utilisateur
- `GET /completions/session/:sessionId` - Par session
- `POST /completions` - Marquer session complétée
- `PUT /completions/:id` - Modifier complétion

### Badges
- `GET /badges` - Liste tous les badges
- `GET /badges/user/:userId` - Badges d'un utilisateur
- `GET /badges/user/:userId/with-progress` - Badges avec progression
- `POST /badges/check/:userId` - Vérifier et attribuer badges

### Body Measurements
- `GET /body-measurements/user/:userId` - Mesures d'un utilisateur
- `GET /body-measurements/latest/:userId` - Dernière mesure
- `POST /body-measurements` - Ajouter mesure

### Body Goals
- `GET /body-goals/user/:userId` - Objectifs d'un utilisateur
- `POST /body-goals` - Créer objectif
- `PUT /body-goals/:id` - Modifier objectif
- `DELETE /body-goals/:id` - Supprimer objectif

### Weekly Goals
- `GET /weekly-goals/user/:userId` - Objectifs hebdo
- `GET /weekly-goals/current/:userId` - Objectif semaine actuelle
- `POST /weekly-goals` - Créer objectif
- `PUT /weekly-goals/:id` - Modifier objectif

### Time Slots
- `GET /time-slots/user/:userId` - Créneaux d'un utilisateur
- `GET /time-slots/week/:userId` - Planning de la semaine
- `POST /time-slots` - Créer créneau
- `PUT /time-slots/:id` - Modifier créneau
- `DELETE /time-slots/:id` - Supprimer créneau

### Notifications
- `GET /notifications/user/:userId` - Notifications d'un utilisateur
- `PUT /notifications/:id/read` - Marquer comme lue
- `POST /notifications/subscribe` - S'abonner aux push
- `POST /notifications/send` - Envoyer notification (admin)

---

## 🗄️ STRUCTURE DE LA BASE DE DONNÉES

### Tables Principales

#### users
- `id`, `firstname`, `lastname`, `email`, `password_hash`
- `birthdate`, `gender`, `fitness_level`
- `profile_picture_url`
- `created_at`, `updated_at`

#### programs
- `id`, `title`, `description`
- `goal` (muscle_gain, weight_loss, etc.)
- `level` (beginner, intermediate, advanced)
- `duration_weeks`
- `created_by` (user_id)
- `created_at`, `updated_at`

#### sessions
- `id`, `program_id`, `title`
- `order_index`, `day_number`
- `estimated_duration_minutes`
- `created_at`, `updated_at`

#### exercises
- `id`, `name`, `description`
- `category` (cardio, strength, flexibility, etc.)
- `muscle_group`
- `difficulty_level`
- `image_url`, `video_url`
- `created_at`, `updated_at`

#### session_exercises
- `id`, `session_id`, `exercise_id`
- `order_index`
- `sets`, `reps`, `rest_time_sec`
- `notes`

#### user_program_enrollments
- `id`, `user_id`, `program_id`
- `enrolled_at`, `status`
- `sessions_completed`, `total_sessions`

#### session_completions
- `id`, `user_id`, `session_id`, `program_id`
- `completed_at`
- `duration_minutes`
- `feeling`, `intensity`, `notes`
- `total_sets`, `total_reps`, `total_volume`
- `ai_comment`

#### badges
- `badge_id`, `name`, `description`
- `icon`, `color`, `gradient`
- `category`, `requirement`
- `is_secret`, `points`

#### user_badges
- `id`, `user_id`, `badge_id`
- `earned_at`, `progress_percent`

#### body_measurements
- `id`, `user_id`
- `weight`, `body_fat_percentage`, `muscle_mass`
- `waist`, `hips`, `chest`, `arms`, `thighs`
- `measurement_date`, `notes`

#### body_goals
- `id`, `user_id`
- `goal_type`, `target_weight`, `target_date`
- `starting_weight`, `current_weight`
- `status`, `strategy`

#### weekly_goals
- `id`, `user_id`
- `target_sessions`, `current_sessions`
- `week_start_date`, `week_end_date`
- `status`

#### time_slots
- `id`, `user_id`, `session_id`, `program_id`
- `day_of_week`, `time_slot`
- `is_recurring`

#### notifications
- `id`, `user_id`
- `type`, `title`, `message`
- `is_read`, `created_at`
- `action_url`

#### notification_subscriptions
- `id`, `user_id`
- `endpoint`, `p256dh_key`, `auth_key`
- `created_at`

---

## 📱 SPÉCIFICITÉS MOBILE

### Interactions Tactiles
- **Swipe** : Navigation entre exercices pendant workout
- **Pull to refresh** : Rafraîchir dashboard ou listes
- **Long press** : Ouvrir menu contextuel (optionnel)
- **Tap** : Toutes les zones interactives ≥ 44×44px
- **Haptic feedback** : Vibration légère sur actions importantes (si disponible)

### Navigation
- **Bottom tab bar** OU **Burger menu** (selon choix UX)
- Boutons retour physiques gérés (Android)
- Breadcrumbs si navigation profonde
- Modals en fullscreen sur petits écrans
- Drawer latéral pour sidebar

### Performance
- **Lazy loading** : Chargement progressif des images
- **Infinite scroll** : Listes longues (exercices, historique)
- **Virtual scrolling** : Grandes listes (1000+ items)
- **Debounce** : Recherche (300ms delay)
- **Throttle** : Scroll events (pour animations)
- **Code splitting** : Chargement par route

### Gestures
- Swipe left/right : Navigation
- Pinch to zoom : Images d'exercices
- Pull down : Rafraîchir

---

## 🚀 ROADMAP & FUTURES FEATURES

### V1.1 (Court terme)
- [ ] Intégration OpenAI pour commentaires personnalisés
- [ ] Historique détaillé des séances (page dédiée)
- [ ] Graphiques de progression avancés
- [ ] Export des données (CSV, PDF)

### V1.2 (Moyen terme)
- [ ] Push notifications natives complètes
- [ ] Partage de programmes entre utilisateurs
- [ ] Features sociales (amis, feed d'activité)
- [ ] Vidéos de démonstration d'exercices HD
- [ ] Mode hors ligne complet avec sync

### V2.0 (Long terme)
- [ ] Coach AI personnalisé avec recommandations
- [ ] Intégration wearables (Apple Watch, Fitbit, Garmin)
- [ ] Nutrition tracking intégré
- [ ] Challenges communautaires
- [ ] Classements et compétitions
- [ ] Marketplace de programmes payants

---

## 📋 RÉSUMÉ DES COMPOSANTS

### Pages (12)
1. Login
2. Dashboard
3. Programmes (liste)
4. Programme (détail)
5. Session Workout
6. Session Summary
7. Complétion (détail)
8. Profil (utilisateur connecté)
9. Profil (autre utilisateur)
10. Badges
11. Notifications Settings
12. Redirections/404

### Composants Globaux
- Header
- Sidebar
- MobileNav
- Layout
- PrivateRoute

### Composants UI
- Button, Input, Card, Label, Textarea, Spinner
- BadgeCard
- ProgramCard
- CreateProgramModal
- DailySchedule
- ProgramSchedule
- NotificationBell
- BodyGoalManager
- BodyCompositionStats
- BodyMeasurementForm
- BodyCompositionBadges
- WeeklyGoalCard
- WeeklyGoalModal

### Services API (dans `/services`)
- authService
- programsService
- sessionsService
- exercisesService
- enrollmentsService
- completionsService
- badgesService
- bodyMeasurementsService
- bodyGoalsService
- weeklyGoalsService
- timeSlotsService
- notificationsService

---

**Fin du document**

*Version: 1.0*  
*Date: 19 octobre 2025*  
*Fytli - Bouge mieux, vis mieux. 💪*

