# ✅ Simplification de l'inscription

## 🎯 Objectif

Simplifier la création de compte pour ne demander que les **4 champs essentiels** :
- ✅ `first_name` (prénom)
- ✅ `last_name` (nom)
- ✅ `email`
- ✅ `password`

## 🔧 Modifications appliquées

### 1. **controllers/authController.js** - Fonction `register()`

#### Avant
```javascript
const { email, password, first_name, last_name, birthdate, gender, fitness_level } = req.body;

// + Validations pour gender et fitness_level

const newUser = await usersModel.createUser({
  email,
  password: hashedPassword,
  first_name,
  last_name,
  birthdate,
  gender,
  fitness_level
});
```

#### Après
```javascript
const { email, password, first_name, last_name } = req.body;

// Seulement les 4 champs essentiels
const newUser = await usersModel.createUser({
  email,
  password: hashedPassword,
  first_name,
  last_name
});
```

✅ **Supprimé** :
- Extraction de `birthdate`, `gender`, `fitness_level`
- Validation du genre
- Validation du fitness_level

---

### 2. **models/usersModel.js** - Fonction `createUser()`

#### Avant
```javascript
const { first_name, last_name, email, password, birthdate, gender, fitness_level } = userData;

INSERT INTO users (first_name, last_name, email, password_hash, birthdate, gender, fitness_level) 
VALUES (?, ?, ?, ?, ?, ?, ?)
```

#### Après
```javascript
const { first_name, last_name, email, password } = userData;

INSERT INTO users (first_name, last_name, email, password_hash) 
VALUES (?, ?, ?, ?)
```

✅ **Simplifié** :
- Ne demande que les 4 champs obligatoires
- Les autres colonnes auront la valeur NULL par défaut dans la DB

---

## 📋 Champs lors de l'inscription

### Obligatoires ✅
- `email` - Validé avec regex
- `password` - Minimum 6 caractères, hashé avec bcrypt
- `first_name` - Prénom
- `last_name` - Nom

### Optionnels (à ajouter plus tard via profil)
- `birthdate` - Date de naissance
- `gender` - Genre (male, female, other)
- `height_cm` - Taille en cm
- `weight_kg` - Poids en kg
- `goal` - Objectif sportif
- `fitness_level` - Niveau (beginner, intermediate, advanced)

---

## 🎯 Flux d'inscription simplifié

```
Frontend                    Backend                     Database
--------                    -------                     --------
{                           {                           INSERT INTO users
  email: "..."          →     email: "..."          →   (first_name, last_name,
  password: "..."             password_hash: "..."       email, password_hash)
  firstname: "Jean"           first_name: "Jean"        VALUES (...)
  lastname: "Dupont"          last_name: "Dupont"
}                           }                           
                            
                            ↓ Réponse
                            
{                           {
  token: "..."          ←     token: "..."
  user: {                     user: {
    id: 1                       id: 1
    email: "..."                email: "..."
    firstname: "Jean"           first_name: "Jean"
    lastname: "Dupont"          last_name: "Dupont"
    created_at: "..."           created_at: "..."
  }                           }
}                           }
```

---

## ✅ Avantages

1. **UX améliorée** : Formulaire d'inscription plus court et rapide
2. **Moins de validation** : Code backend simplifié
3. **Progressif** : L'utilisateur peut compléter son profil après inscription
4. **Standard** : Correspond aux pratiques courantes (nom, email, password)

---

## 🚀 Prochaines étapes (optionnel)

### Page "Compléter mon profil"
Permettre à l'utilisateur d'ajouter plus tard :
- Date de naissance
- Genre
- Taille et poids
- Objectif sportif
- Niveau de fitness

### Endpoint à créer
```javascript
PUT /users/:id/profile
Body: {
  birthdate: "1990-01-01",
  gender: "male",
  height_cm: 180,
  weight_kg: 75,
  goal: "Prise de masse",
  fitness_level: "intermediate"
}
```

---

## 🧪 Test

### Inscription minimale
```bash
curl -X POST http://localhost:9001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Jean",
    "last_name": "Dupont"
  }'
```

**Résultat attendu** : ✅ 201 avec token et user

---

**Date** : Octobre 2025  
**Status** : ✅ Simplifié et testé

