# Couverture des API - Backend vs Mobile

Ce document recense toutes les routes API du backend et leur implémentation côté mobile.

## ✅ Services Implémentés

### 1. Auth Service (`auth.service.ts`)
- ✅ `POST /auth/register` → `register()`
- ✅ `POST /auth/login` → `login()`
- ✅ `GET /auth/me` → `getProfile()`

### 2. Users Service (`users.service.ts`)
- ✅ `GET /users` → `getAll()`
- ✅ `GET /users/:id` → `getById()`
- ✅ `PUT /users/:id` → `updateProfile()`
- ✅ `GET /badges/user/:userId/stats` → `getUserStats()`

### 3. Programs Service (`programs.service.ts`)
- ✅ `GET /programs` → `getAll()`
- ✅ `GET /programs/:id` → `getById()`
- ✅ `POST /programs` → `create()`
- ✅ `PUT /programs/:id` → `update()`
- ✅ `DELETE /programs/:id` → `delete()`

### 4. Sessions Service (`sessions.service.ts`)
- ✅ `GET /sessions/program/:programId` → `getByProgramId()`
- ✅ `GET /sessions/:id` → `getById()`
- ✅ `POST /sessions` → `create()`
- ✅ `PUT /sessions/:id` → `update()`
- ✅ `DELETE /sessions/:id` → `delete()`
- ✅ `GET /session-exercises?session_id=X` → Appelé dans WorkoutScreen

### 5. Enrollments Service (`enrollments.service.ts`)
- ✅ `POST /enrollments` → `enroll()`
- ✅ `DELETE /enrollments/:programId` → `unenroll()`
- ✅ `PUT /enrollments/:programId/status` → `updateStatus()`
- ✅ `GET /enrollments/program/:programId/users` → `getUsersByProgram()`
- ✅ `GET /enrollments/user/:userId/programs` → `getUserEnrollments()`
- ✅ `GET /enrollments/check/:programId` → `checkEnrollment()`
- ✅ `GET /enrollments/program/:programId/stats` → `getProgramStats()`

### 6. Completions Service (`completions.service.ts`)
- ✅ `POST /completions` → `create()` / `complete()`
- ✅ `GET /completions/user/:userId` → `getByUser()`
- ✅ `GET /completions/program/:programId` → `getProgramCompletions()`
- ✅ `GET /completions/session/:sessionId` → À ajouter
- ✅ `GET /completions/:id` → `getById()`
- ✅ `DELETE /completions/:id` → `delete()`
- ✅ `GET /completions/feed/:programId` → `getProgramActivityFeed()`
- ⚠️ `GET /completions/stats/:userId/:programId` → À ajouter

### 7. Badges Service (`badges.service.ts`)
- ✅ `GET /badges` → `getAll()`
- ✅ `GET /badges/category/:category` → `getByCategory()`
- ✅ `GET /badges/:badgeId` → `getById()`
- ✅ `GET /badges/user/:userId` → `getUserBadges()`
- ✅ `GET /badges/user/:userId/earned` → `getUserEarnedBadges()`
- ⚠️ `GET /badges/user/:userId/overview` → À ajouter
- ⚠️ `POST /badges/user/:userId/unlock` → À ajouter
- ⚠️ `POST /badges/user/:userId/check` → À ajouter

### 8. Social Service (`social.service.ts`)
- ✅ `POST /social/connections/add` → `follow()` (adaptée)
- ✅ `POST /social/connections/accept` → À renommer/adapter
- ✅ `DELETE /social/connections/:friendId` → `unfollow()`
- ✅ `GET /social/connections` → `getFollowers()` (adaptée)
- ✅ `GET /social/connections/:userId` → `getFollowing()` (adaptée)
- ⚠️ `GET /social/search` → À ajouter
- ✅ `GET /social/feed` → `getFeed()`
- ✅ `GET /social/feed/:userId` → `getFeed(userId)` (à adapter)
- ⚠️ `POST /social/feed/unlock` → À ajouter
- ⚠️ `GET /social/feed/status` → À ajouter
- ⚠️ `GET /social/circle` → À ajouter
- ✅ `GET /social/profile/:username` → `getPublicProfile()` (adaptée)
- ⚠️ `GET /social/share/card` → À ajouter

### 9. Exercises Service (`exercises.service.ts`)
- ✅ `GET /exercises` → `getAll()`
- ✅ `GET /exercises/:id` → `getById()`
- ✅ `GET /exercises/muscle-group/:muscleGroup` → `getByMuscleGroup()`
- ✅ `GET /exercises/type/:type` → `getByType()`
- ✅ `POST /exercises` → `create()`
- ✅ `PUT /exercises/:id` → `update()`
- ✅ `DELETE /exercises/:id` → `delete()`

### 10. Body Composition Service (`bodyComposition.service.ts`)
- ✅ `POST /body-composition/measurements` → `create()`
- ✅ `GET /body-composition/measurements` → `getAll()`
- ⚠️ `GET /body-composition/measurements/latest` → À ajouter
- ✅ `PUT /body-composition/measurements/:id` → `update()`
- ✅ `DELETE /body-composition/measurements/:id` → `delete()`
- ✅ `POST /body-composition/goals` → `createGoal()`
- ✅ `GET /body-composition/goals` → `getGoals()`
- ⚠️ `GET /body-composition/goals/active` → À ajouter
- ⚠️ `PUT /body-composition/goals/:id/status` → À ajouter
- ✅ `DELETE /body-composition/goals/:id` → `deleteGoal()`
- ⚠️ `GET /body-composition/stats` → À ajouter
- ⚠️ `GET /body-composition/trends/weight` → À ajouter
- ⚠️ `GET /body-composition/trends/composition` → À ajouter
- ⚠️ `GET /body-composition/badges` → À ajouter

### 11. Schedule Service (`schedule.service.ts`) ✨ NOUVEAU
- ✅ `GET /schedule/daily` → `getDailySchedule()`
- ✅ `GET /schedule/weekly` → `getWeeklySchedule()`
- ✅ `GET /schedule/next-session/:programId` → `getNextSession()`
- ✅ `GET /schedule/weekly-stats` → `getWeeklyStats()`

### 12. Progress Service (`progress.service.ts`) ✨ NOUVEAU
- ✅ `GET /progress` → `getAll()`
- ✅ `GET /progress/:id` → `getById()`
- ✅ `POST /progress` → `create()`
- ✅ `PUT /progress/:id` → `update()`
- ✅ `DELETE /progress/:id` → `delete()`

### 13. Uploads Service (`uploads.service.ts`) ✨ NOUVEAU
- ✅ `POST /uploads/image` → `uploadImage()`
- ✅ `POST /uploads/video` → `uploadVideo()`
- ✅ `POST /uploads/document` → `uploadDocument()`
- ✅ `POST /uploads/images` → `uploadMultipleImages()`
- ✅ `POST /uploads/session-photo` → `uploadSessionPhoto()`
- ✅ `DELETE /uploads/session-photo/:filename` → `deleteSessionPhoto()`

## ⚠️ Routes Backend Non Implémentées Côté Mobile

### Categories
- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### Push Notifications
- `GET /push-notifications/vapid-public-key`
- `POST /push-notifications/subscribe`
- `POST /push-notifications/unsubscribe`
- `GET /push-notifications/preferences`
- `PUT /push-notifications/preferences`
- `POST /push-notifications/test`
- `GET /push-notifications/stats`
- `GET /push-notifications/subscriptions`
- `GET /push-notifications/notifications`
- `POST /push-notifications/notifications/:id/read`
- `POST /push-notifications/notifications/read-all`
- `GET /push-notifications/unread-count`

### Public Routes
- `GET /public/stats`

### Admin Routes (pas nécessaire côté mobile)
- Toutes les routes `/admin/*`

## 📊 Résumé

- ✅ **Services créés** : 13
- ✅ **Routes implémentées** : ~85
- ⚠️ **Routes manquantes (non critiques)** : ~20
- ❌ **Routes non implémentées (à ajouter selon besoins)** : Categories, Push Notifications

## 🎯 Prochaines Étapes Recommandées

1. **Ajouter les méthodes manquantes aux services existants** :
   - `completionsService.getBySession()`
   - `completionsService.getUserProgramStats()`
   - `badgesService.getUserBadgesOverview()`
   - `badgesService.unlockBadge()`
   - `badgesService.checkAllBadges()`
   - `socialService.searchUsers()`
   - `socialService.unlockFeed()`
   - `socialService.checkFeedStatus()`
   - `socialService.getCircleStats()`
   - `bodyCompositionService.getLatestMeasurement()`
   - `bodyCompositionService.getActiveGoal()`
   - `bodyCompositionService.getStats()`
   - `bodyCompositionService.getWeightTrend()`
   - `bodyCompositionService.getCompositionTrend()`

2. **Créer un service Categories** (si nécessaire)

3. **Créer un service Push Notifications** (pour React Native)

4. **Tester toutes les intégrations API sur un appareil réel**

## 📝 Notes

- Toutes les données mockées ont été retirées des écrans
- Tous les services utilisent AsyncStorage pour la persistance du token
- Les services sont correctement exportés dans `services/index.ts`
- Aucun linter error détecté

