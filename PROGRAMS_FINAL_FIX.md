# ✅ Correction complète : Création de programmes

## 🔍 Problèmes identifiés

### 1. ❌ Transformation `title` → `name` dans le frontend
**Fichier** : `frontend-fytli/src/services/programs.ts`
- Le service transformait incorrectement `title` en `name`
- Le backend attend maintenant `title` directement

### 2. ❌ Champ `goal` inexistant
- Le champ `goal` était envoyé mais n'existe pas dans la table `programs`
- Présent dans les types mais pas dans la base de données

### 3. ❌ Problème `NaN` sur les champs numériques
**Fichier** : `admin-panel/src/pages/Programs.tsx`
- `parseInt(e.target.value)` retournait `NaN` quand le champ était vide
- Causait des erreurs de validation React

## ✅ Corrections appliquées

### Backend

#### `backend-fytli/controllers/programsController.js`
```javascript
// ✅ Accepte maintenant "title" directement
const { title, description, difficulty_level, duration_weeks } = req.body;

// ✅ Mapping français → anglais
const levelMapping = {
  'débutant': 'beginner',
  'intermédiaire': 'intermediate',
  'avancé': 'advanced'
};

// ✅ Nouveaux champs supportés
const { sessions_per_week, category_id, is_public } = req.body;
```

#### `backend-fytli/models/programsModel.js`
```javascript
// ✅ Suppression de "goal"
// ✅ Ajout de sessions_per_week, category_id, is_public
INSERT INTO programs (title, description, level, duration_weeks, 
                      sessions_per_week, category_id, is_public)
```

### Frontend App (frontend-fytli)

#### `frontend-fytli/src/services/programs.ts`
```javascript
// ❌ AVANT
const backendPayload = {
  name: data.title,  // ❌ Transformation incorrecte
  goal: data.goal,   // ❌ Champ inexistant
  // ...
};

// ✅ APRÈS
const backendPayload = {
  title: data.title,        // ✅ Envoi direct
  description: data.description,
  difficulty_level: data.level,
  duration_weeks: data.duration_weeks,
  // goal supprimé ✅
};
```

#### `frontend-fytli/src/types/index.ts`
```typescript
// ✅ Type Program mis à jour
export interface Program {
  id: number;
  title: string;              // ✅ (pas name)
  description?: string;
  duration_weeks?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  sessions_per_week?: number; // ✅ NOUVEAU
  category_id?: number;       // ✅ NOUVEAU
  is_public?: boolean;        // ✅ NOUVEAU
  image_url?: string;
  // goal supprimé ✅
}
```

### Admin Panel

#### `admin-panel/src/pages/Programs.tsx`
```typescript
// ❌ AVANT
value={formData.duration_weeks}
onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}

// ✅ APRÈS
value={formData.duration_weeks || ''}
onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 0 })}
```

#### `admin-panel/src/types/index.ts`
```typescript
// ✅ Type Program mis à jour (identique au frontend-fytli)
export interface Program {
  id: number;
  title: string;
  sessions_per_week: number;
  category_id: number;
  is_public: boolean;
  // goal supprimé ✅
}
```

## 📊 Migration SQL requise

**Fichier** : `MIGRATION_ADD_PROGRAMS_FIELDS.sql`

```sql
-- Ajouter les colonnes manquantes
ALTER TABLE programs ADD COLUMN sessions_per_week INT DEFAULT 3;
ALTER TABLE programs ADD COLUMN category_id INT NULL;
ALTER TABLE programs ADD COLUMN is_public TINYINT(1) DEFAULT 1;

-- Ajouter les contraintes
ALTER TABLE programs 
ADD CONSTRAINT fk_programs_category 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE SET NULL;

-- Ajouter les index
ALTER TABLE programs ADD INDEX idx_category_id (category_id);
ALTER TABLE programs ADD INDEX idx_is_public (is_public);
```

## 🚀 Déploiement

### Étape 1 : Migration SQL (OVH Production)
1. Connectez-vous à votre base de données OVH
2. Exécutez le fichier `MIGRATION_ADD_PROGRAMS_FIELDS.sql`
3. Vérifiez avec : `DESC programs;`

### Étape 2 : Déployer le Backend (Render)
```bash
git add backend-fytli/
git commit -m "fix: correction complète création programmes - title au lieu de name, suppression goal"
git push origin main
```

Render redéploiera automatiquement.

### Étape 3 : Déployer les Frontends
```bash
# Frontend App
git add frontend-fytli/
git commit -m "fix: correction service programs - envoi direct de title, suppression goal"

# Admin Panel
git add admin-panel/
git commit -m "fix: correction NaN sur champs numériques et type Program"

git push origin main
```

### Étape 4 : Rebuild les applications
- **Admin Panel** : 
  ```bash
  cd admin-panel
  npm run build
  ```
- **Frontend App** :
  ```bash
  cd frontend-fytli
  npm run build
  ```

## ✅ Checklist de vérification

Après déploiement, vérifiez que :

- [ ] La migration SQL s'est bien exécutée (`DESC programs;`)
- [ ] Le backend Render est redéployé et opérationnel
- [ ] L'admin panel peut créer un programme
- [ ] Le frontend app peut afficher les programmes
- [ ] Les niveaux en français (débutant, intermédiaire, avancé) fonctionnent
- [ ] Les champs numériques n'affichent plus `NaN`
- [ ] Aucune erreur dans les logs backend
- [ ] Aucune erreur dans la console navigateur

## 📝 Structure finale de la table programs

```sql
CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level ENUM('beginner', 'intermediate', 'advanced'),
  duration_weeks INT,
  sessions_per_week INT DEFAULT 3,        -- ✅ NOUVEAU
  category_id INT,                        -- ✅ NOUVEAU
  is_public TINYINT(1) DEFAULT 1,        -- ✅ NOUVEAU
  image_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  
  INDEX idx_created_by (created_by),
  INDEX idx_level (level),
  INDEX idx_category_id (category_id),     -- ✅ NOUVEAU
  INDEX idx_is_public (is_public)          -- ✅ NOUVEAU
);
```

## 🎯 Résumé des changements

| Composant | Fichier | Changement |
|-----------|---------|------------|
| Backend Controller | `programsController.js` | ✅ Accepte `title`, mapping FR→EN, nouveaux champs |
| Backend Model | `programsModel.js` | ✅ Suppression `goal`, ajout 3 nouveaux champs |
| Frontend Service | `frontend-fytli/services/programs.ts` | ✅ Envoi `title` au lieu de `name`, suppression `goal` |
| Frontend Types | `frontend-fytli/types/index.ts` | ✅ Type `Program` mis à jour |
| Admin Service | `admin-panel/services/programs.ts` | ✅ Déjà correct (envoi direct) |
| Admin Types | `admin-panel/types/index.ts` | ✅ Type `Program` mis à jour |
| Admin Form | `admin-panel/pages/Programs.tsx` | ✅ Correction `NaN` sur champs numériques |
| Base de données | `programs` table | ✅ Migration SQL avec 3 nouveaux champs |

## 🎉 Résultat attendu

Vous pouvez maintenant :
- ✅ Créer des programmes depuis l'admin panel
- ✅ Utiliser les niveaux en français
- ✅ Définir le nombre de sessions par semaine
- ✅ Associer un programme à une catégorie
- ✅ Définir la visibilité publique/privée
- ✅ Plus d'erreurs `NaN` ou `Unknown column 'goal'`

