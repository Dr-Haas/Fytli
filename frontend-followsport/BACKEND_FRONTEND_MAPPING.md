# 🔄 Mapping Backend ↔ Frontend

## ⚠️ Différences de nomenclature

Le **backend** et le **frontend** utilisent des conventions de nommage différentes pour certains champs.

---

## 👤 User / Utilisateur

### Backend (DB réelle) → Frontend

| Backend (snake_case) | Frontend (camelCase) |
|---------------------|---------------------|
| `first_name` | `firstname` |
| `last_name` | `lastname` |
| `email` | `email` ✅ |
| `password` | `password` ✅ (jamais retourné) |
| `gender` | `gender` ✅ |
| `birthdate` | `birthdate` ✅ |
| `height_cm` | `height_cm` ✅ |
| `weight_kg` | `weight_kg` ✅ |
| `goal` | `goal` ✅ |
| `created_at` | `created_at` ✅ |
| `updated_at` | `updated_at` ✅ |

---

## 🔧 Transformation automatique

### Dans `src/services/auth.ts`

Une fonction `transformUserFromBackend()` transforme automatiquement les données :

```typescript
// Backend retourne :
{
  first_name: "Jean",
  last_name: "Dupont"
}

// Frontend reçoit :
{
  firstname: "Jean",
  lastname: "Dupont"
}
```

### Endpoints concernés

#### 1. **POST /auth/register**
- ✅ **Envoi** : `firstname` / `lastname` → transformés en `first_name` / `last_name`
- ✅ **Réponse** : `first_name` / `last_name` → transformés en `firstname` / `lastname`

#### 2. **POST /auth/login**
- ✅ **Réponse** : `first_name` / `last_name` → transformés en `firstname` / `lastname`

#### 3. **GET /auth/me**
- ✅ **Réponse** : `first_name` / `last_name` → transformés en `firstname` / `lastname`

---

## 🏋️ Programs

### Backend → Frontend

| Backend | Frontend | Notes |
|---------|----------|-------|
| `name` | `title` | ⚠️ À vérifier |
| `difficulty_level` | `level` | ⚠️ À vérifier |

**Note** : Il faut vérifier si le backend utilise `name` ou `title` pour les programmes.

---

## 📝 Sessions

### Backend → Frontend

| Backend | Frontend |
|---------|----------|
| `session_number` | `day_number` |
| `name` | `title` |
| `description` | `notes` |

---

## ✅ Champs identiques (pas de transformation)

Ces champs sont identiques entre backend et frontend :

- `id`
- `email`
- `password`
- `gender`
- `birthdate`
- `height_cm`
- `weight_kg`
- `goal`
- `created_at`
- `updated_at`
- `description`
- `level` (enum values)
- `type`
- `bpm`
- etc.

---

## 🎯 Convention adoptée

### Frontend (interface utilisateur)
- ✅ **Noms sans underscore** : `firstname`, `lastname`
- ✅ Plus lisible pour les développeurs frontend
- ✅ Cohérent avec les conventions JavaScript/TypeScript modernes

### Backend (base de données)
- ✅ **snake_case** : `first_name`, `last_name`
- ✅ Convention SQL standard
- ✅ Cohérent avec les conventions Node.js classiques

---

## 🔄 Flux de données

### Inscription (Register)

```
Frontend                Backend                 DB
--------                -------                 --
{                       {                       {
  firstname: "Jean"  →    first_name: "Jean"  →   first_name: "Jean"
  lastname: "Dupont"      last_name: "Dupont"     last_name: "Dupont"
}                       }                       }

                        ↓ Réponse
                        
{                       {
  firstname: "Jean"  ←    first_name: "Jean"
  lastname: "Dupont"      last_name: "Dupont"
}                       }
```

### Connexion (Login)

```
Frontend                Backend                 DB
--------                -------                 --
{                       {                       SELECT * FROM users
  email: "..."       →    email: "..."       →  WHERE email = "..."
  password: "..."         password: "..."
}                       }                       {
                                                  first_name: "Jean"
                        ↓ Réponse                 last_name: "Dupont"
                                                }
{                       {
  firstname: "Jean"  ←    first_name: "Jean"
  lastname: "Dupont"      last_name: "Dupont"
}                       }
```

---

## 🐛 Dépannage

### Erreur 400 sur /auth/register

**Cause** : Le backend attend `first_name` / `last_name`
**Solution** : ✅ Transformation automatique dans `auth.ts`

### Les noms ne s'affichent pas

**Cause** : Le frontend cherche `firstname` / `lastname` mais reçoit `first_name` / `last_name`
**Solution** : ✅ Transformation automatique dans `auth.ts`

---

## 📚 Fichiers concernés

- ✅ `src/services/auth.ts` - Transformation des données user
- ✅ `src/types/index.ts` - Types avec `firstname` / `lastname`
- ✅ `src/components/Header.tsx` - Affichage du nom
- ✅ `src/pages/Dashboard.tsx` - Message de bienvenue
- ✅ `src/pages/Profile.tsx` - Profil complet

---

## 🎯 TODO (si nécessaire)

Si d'autres endpoints retournent des users, ajouter la transformation :

- [ ] `GET /users/:id`
- [ ] `PUT /users/:id`
- [ ] `GET /programs` (si inclut le créateur)

Créer un service générique de transformation si besoin :

```typescript
// src/services/transformers.ts
export const transformUser = (backendUser) => { ... }
export const transformProgram = (backendProgram) => { ... }
```

---

**Date** : Octobre 2025  
**Status** : ✅ Transformations implémentées pour l'authentification

