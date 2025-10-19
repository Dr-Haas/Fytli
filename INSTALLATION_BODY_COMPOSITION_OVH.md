# 🚀 Installation Composition Corporelle - Version OVH

## ✅ Version Compatible OVH (Sans procédures stockées)

Cette version a été créée spécifiquement pour fonctionner sur votre hébergement OVH qui ne permet pas les procédures stockées SQL.

---

## 📋 Étape 1 : Migration SQL

### Exécuter la migration

```bash
# Production OVH
mysql -u ton_user -p lyfti < MIGRATION_BODY_COMPOSITION_NO_FUNCTION.sql

# Local
mysql -u root -p lyfti < MIGRATION_BODY_COMPOSITION_NO_FUNCTION.sql
```

Ou via phpMyAdmin :
1. Ouvrir phpMyAdmin
2. Sélectionner votre base de données
3. Aller dans l'onglet "SQL"
4. Copier-coller le contenu de `MIGRATION_BODY_COMPOSITION_NO_FUNCTION.sql`
5. Cliquer sur "Exécuter"

### ✅ Ce qui sera créé :

- **3 nouvelles tables :**
  - `body_measurements` - Mesures corporelles
  - `body_goals` - Objectifs
  - `body_progress_photos` - Photos de progression

- **2 vues SQL :**
  - `body_stats` - Statistiques globales
  - `goal_progress` - Progression des objectifs

- **14 nouveaux badges :**
  - Tracker Assidu, Première Victoire, Grande Transformation, Phoenix, etc.

### ❌ Ce qui N'est PAS inclus (pour éviter l'erreur 1419) :

- ❌ Procédures stockées
- ❌ Triggers automatiques
- ❌ Fonctions SQL

**La logique des badges est gérée dans le code backend** (comme pour les notifications) ! 🎉

---

## 📦 Étape 2 : Backend

### Fichiers déjà créés :

✅ Tous les fichiers backend sont prêts et **déjà mis à jour** pour la version OVH :

```
backend-fytli/
  ├── models/bodyCompositionModel.js       ✅ (vérifie les badges en JavaScript)
  ├── controllers/bodyCompositionController.js ✅
  ├── routes/bodyComposition.js            ✅
  └── index.js                             ✅ (routes enregistrées)
```

### Redémarrer le backend :

```bash
cd backend-fytli
npm start
```

Ou si vous utilisez PM2 :

```bash
pm2 restart fytli-backend
```

---

## 💻 Étape 3 : Frontend

### Fichiers déjà créés :

✅ Tous les composants frontend sont prêts :

```
frontend-fytli/src/
  ├── services/bodyComposition.ts          ✅
  ├── components/
  │   ├── BodyMeasurementForm.tsx          ✅
  │   ├── BodyCompositionStats.tsx         ✅
  │   ├── BodyCompositionBadges.tsx        ✅
  │   └── BodyGoalManager.tsx              ✅
  └── pages/Profile.tsx                    ✅ (mis à jour avec onglets)
```

### Rebuild le frontend :

```bash
cd frontend-fytli
npm run build
```

Si vous utilisez le déploiement Render, le rebuild se fera automatiquement au prochain push git.

---

## 🧪 Étape 4 : Tester

### 1. Vérifier la migration SQL

Dans phpMyAdmin ou MySQL :

```sql
-- Vérifier les tables
SHOW TABLES LIKE 'body_%';

-- Vérifier les badges
SELECT name FROM badges WHERE name LIKE '%Transformation%';

-- Vérifier les vues
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';
```

Vous devriez voir :
- ✅ 3 tables (body_measurements, body_goals, body_progress_photos)
- ✅ 14 badges corporels
- ✅ 2 vues (body_stats, goal_progress)

### 2. Tester l'application

1. **Se connecter** à votre compte Fytli
2. **Aller dans "Mon Profil"**
3. **Cliquer sur l'onglet "Composition Corporelle"**
4. **Ajouter une première mesure :**
   - Poids : 75 kg
   - Taille : 175 cm
   - (optionnel) Masse grasse : 20%
5. **Vérifier que ça s'enregistre** ✅
6. **Ajouter plusieurs mesures** sur quelques jours
7. **Vérifier les graphiques** qui s'affichent
8. **Créer un objectif** de perte de poids

### 3. Tester les badges

Pour tester le déblocage des badges, ajoutez plusieurs mesures avec des changements :

```javascript
// Exemple de test :
// Mesure 1 : 80 kg
// Mesure 2 : 79 kg  → Badge "Première Victoire" (-1 kg) ✅
// Mesure 3 : 75 kg  → Badge "Transformation Débutante" (-5 kg) ✅
```

---

## 🔧 Comment fonctionnent les badges maintenant ?

### Avant (version avec procédures SQL) :
```sql
-- Les badges étaient vérifiés par un TRIGGER automatique
CREATE TRIGGER after_body_measurement_insert ...
CALL check_body_badges(user_id);  ← Procédure SQL
```

### Maintenant (version OVH compatible) :
```javascript
// Les badges sont vérifiés dans le code backend
await bodyCompositionModel.checkBodyBadges(userId);  ← Code JavaScript
```

**C'est appelé automatiquement** après chaque création de mesure dans `bodyCompositionController.js` :

```javascript
// Ligne 89-90 du controller
const measurement = await bodyCompositionModel.createMeasurement({...});
await bodyCompositionModel.checkBodyBadges(userId);  // ← Vérification badges
```

---

## 🎯 Badges disponibles

### Suivi régulier
- 📊 **Tracker Assidu** (75 pts) - 4 semaines de suivi
- 📏 **Mesure Parfaite** (50 pts) - 12 mesures

### Perte de poids
- 🎯 **Première Victoire** (60 pts) - -1 kg
- 🌟 **Transformation Débutante** (100 pts) - -5 kg
- 💫 **Grande Transformation** (150 pts) - -10 kg
- 👑 **Transformation Héroïque** (250 pts) - -15 kg

### Prise de masse musculaire
- 💪 **Muscle en Croissance** (100 pts) - +2 kg muscle
- 🏗️ **Constructeur** (150 pts) - +5 kg muscle

### Composition corporelle
- 🎨 **Sculpteur** (120 pts) - -5% masse grasse
- 🏆 **Maître de la Composition** (200 pts) - -10% masse grasse
- ⚖️ **Corps Équilibré** (100 pts) - IMC santé (18.5-24.9)

### Maintien
- 🎚️ **Stabilité** (80 pts) - 4 semaines stable
- ⏰ **Longue Durée** (150 pts) - 12 semaines stable

### Légendaire
- 🔥 **Phoenix** (300 pts) - Transformation totale

---

## 🐛 Dépannage

### Problème : Erreur 1419 lors de la migration

**Solution :** Vous utilisez le mauvais fichier ! Utilisez :
- ✅ `MIGRATION_BODY_COMPOSITION_NO_FUNCTION.sql` (SANS procédures)
- ❌ ~~`MIGRATION_BODY_COMPOSITION.sql`~~ (AVEC procédures - ne fonctionne pas sur OVH)

### Problème : Les badges ne se débloquent pas

**Solution 1 :** Vérifier que le backend a bien été redémarré avec le nouveau code

**Solution 2 :** Vérifier les logs du backend :
```bash
tail -f backend-fytli/logs/combined-2025-10-19.log
```

**Solution 3 :** Forcer la vérification manuellement via un endpoint API :
```bash
curl -X POST http://votre-backend/body-composition/check-badges \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### Problème : Graphiques ne s'affichent pas

**Solution :** Il faut au moins **2 mesures** pour afficher un graphique. Ajoutez une deuxième mesure avec une date différente.

### Problème : Routes 404

**Solution :** Vérifier que `index.js` contient bien :
```javascript
const bodyCompositionRoutes = require('./routes/bodyComposition');
app.use('/body-composition', bodyCompositionRoutes);
```

---

## ✅ Checklist finale

- [ ] Migration SQL exécutée (fichier **NO_FUNCTION**)
- [ ] Vérification des tables créées (3 tables)
- [ ] Vérification des badges créés (14 badges)
- [ ] Backend redémarré
- [ ] Frontend rebuilt
- [ ] Test : Ajout d'une mesure
- [ ] Test : Affichage des stats
- [ ] Test : Création d'un objectif
- [ ] Test : Déblocage d'un badge
- [ ] Test : Graphiques (avec 2+ mesures)
- [ ] Test sur mobile

---

## 🎉 C'est prêt !

Votre système de composition corporelle est maintenant **100% opérationnel sur OVH** ! 💪

Les utilisateurs peuvent :
- ✅ Enregistrer leurs mesures facilement
- ✅ Suivre leur évolution avec des graphiques
- ✅ Se fixer des objectifs motivants
- ✅ Débloquer des badges de transformation

Et tout fonctionne **sans erreur 1419** grâce à la logique côté backend ! 🚀

---

## 📞 Support

Si vous rencontrez un problème :

1. Vérifiez les logs backend
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que la migration NO_FUNCTION a bien été utilisée
4. Relisez ce guide étape par étape

**Bon déploiement ! 💪**

---

**Date :** 19 Octobre 2025  
**Version :** 1.1 - OVH Compatible  
**Fichier migration :** `MIGRATION_BODY_COMPOSITION_NO_FUNCTION.sql`

