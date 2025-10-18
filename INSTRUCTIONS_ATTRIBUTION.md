# Instructions pour Attribution des Badges et Sessions

## 🎯 Objectif
Ce guide explique comment attribuer des badges aux utilisateurs et ajouter des exercices aux sessions.

## 📋 Étapes à suivre

### 1. Corrections du Backend (✅ Déjà fait)

Les corrections suivantes ont été appliquées :
- ✅ `backend-fytli/models/sessionExercisesModel.js` : Alias `rest_seconds as rest_sec` pour compatibilité frontend
- ✅ `frontend-fytli/src/pages/SessionWorkout.tsx` : Support de `duration_seconds` et `rest_sec`
- ✅ `frontend-fytli/src/types/index.ts` : Ajout de `duration_seconds` dans `SessionExercise`

### 2. Attribution des badges et sessions (à faire)

#### Option A : Via phpMyAdmin (Recommandé)

1. Connectez-vous à phpMyAdmin sur OVH
2. Sélectionnez votre base de données Fytli
3. Cliquez sur l'onglet "SQL"
4. Copiez-collez le contenu du fichier `ATTRIBUTION_BADGES_SESSIONS.sql`
5. Cliquez sur "Exécuter"

Le script va :
- ✅ Attribuer des badges aux utilisateurs (ID 1, 2, 3, 4)
- ✅ Créer des exercices pour les sessions 1, 2, 3, 4
- ✅ Ajouter l'exercice "Marche en pente" s'il n'existe pas
- ✅ Afficher des statistiques de vérification

#### Option B : Via Script Node.js (Alternative)

Si vous préférez un script Node.js pour plus de contrôle, dites-le moi et je le créerai.

### 3. Pousser les changements

```bash
cd /Users/garyhaas/Desktop/Fytli
git add -A
git commit -m "fix: correction affichage temps exercices + script attribution badges/sessions"
git push origin main
```

### 4. Attendre le redéploiement Render

Une fois le push effectué, attendez ~2-3 minutes que Render redéploie.

### 5. Tester sur le frontend

Testez les pages suivantes sur `http://localhost:5174` :

1. **Dashboard** : Vérifier les badges récents
2. **Page Profil** : Voir tous les badges débloqués
3. **Session Workout** : 
   - Le temps de repos devrait s'afficher correctement
   - La durée des exercices cardio devrait être visible
   - Les exercices doivent être dans le bon ordre

## 🔍 Vérifications

### Badges attribués

- **User 1** : 3 badges (Constance, Progression, Objectif Atteint)
- **User 2** : 2 badges (Constance, Sérénité)
- **User 3** : 6 badges (très actif)
- **User 4** : 1 badge (Constance)

### Sessions avec exercices

- **Session 1** : 3 exercices (Tapis de marche, Cardio léger, Marche en pente)
- **Session 2** : 3 exercices (Presse, Pompes, Squats)
- **Session 3** : 3 exercices (Curl, Triceps, Pompes)
- **Session 4** : 3 exercices (Leg press, Squats, Presse)

## 🐛 Problèmes résolus

### 1. Affichage du temps dans les exercices
**Problème** : Le frontend attendait `rest_sec` mais le backend envoyait `rest_seconds`

**Solution** : 
- Backend : Ajout d'un alias `rest_seconds as rest_sec` dans la requête SQL
- Frontend : Support de `rest_sec`, `rest_seconds` et `duration_seconds`

### 2. Données manquantes
**Problème** : Les sessions n'avaient pas d'exercices, les utilisateurs n'avaient pas de badges

**Solution** : Script SQL `ATTRIBUTION_BADGES_SESSIONS.sql` pour peupler la base

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de Render
2. Testez les endpoints API avec curl :
   ```bash
   curl https://fytli.onrender.com/session-exercises?session_id=1
   ```
3. Vérifiez la console du navigateur pour les erreurs frontend

## ✅ Checklist finale

- [ ] Exécuter `ATTRIBUTION_BADGES_SESSIONS.sql` sur OVH
- [ ] Push des changements vers GitHub
- [ ] Attendre le redéploiement Render
- [ ] Tester le dashboard
- [ ] Tester une session workout
- [ ] Vérifier l'affichage des badges

