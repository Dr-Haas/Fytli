# 🔧 Corrections Backend - password → password_hash

## 🐛 Problème détecté

La **base de données** utilise la colonne `password_hash`, mais le backend utilisait `password`.

```sql
Error: Unknown column 'password' in 'field list'
```

## ✅ Corrections appliquées

### 1. **models/usersModel.js**

#### `createUser()` - Ligne 45
```javascript
// ❌ AVANT
INSERT INTO users (first_name, last_name, email, password, ...)

// ✅ APRÈS
INSERT INTO users (first_name, last_name, email, password_hash, ...)
```

#### `updateUser()` - Ligne 80
```javascript
// ❌ AVANT
fields.push('password = ?');

// ✅ APRÈS
fields.push('password_hash = ?');
```

---

### 2. **controllers/authController.js**

#### `register()` - Ligne 89
```javascript
// ❌ AVANT
delete newUser.password;

// ✅ APRÈS
delete newUser.password_hash;
```

#### `login()` - Ligne 133
```javascript
// ❌ AVANT
const isPasswordValid = await bcrypt.compare(password, user.password);

// ✅ APRÈS
const isPasswordValid = await bcrypt.compare(password, user.password_hash);
```

#### `login()` - Ligne 149
```javascript
// ❌ AVANT
delete user.password;

// ✅ APRÈS
delete user.password_hash;
```

#### `getProfile()` - Ligne 184
```javascript
// ❌ AVANT
delete user.password;

// ✅ APRÈS
delete user.password_hash;
```

---

## 🎯 Résumé

### Structure de la DB (réelle)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- ⚠️ password_hash, pas password
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  ...
);
```

### Flux de données

```
Frontend                Backend                 DB
--------                -------                 --
password: "abc123"  →   bcrypt.hash()      →   password_hash: "$2b$10..."
                        (ligne 68)              (colonne password_hash)

                        ↓ Login
                        
                        user.password_hash  ←   password_hash: "$2b$10..."
                        (ligne 133)             (colonne password_hash)
```

---

## 🚀 Actions à faire

1. ✅ **Corrections appliquées** dans le code backend
2. ⚠️ **Redémarrer le serveur backend** pour prendre en compte les changements

```bash
# Arrêter le serveur backend (Ctrl+C)
# Relancer
cd backend-followsport
node index.js
```

3. ✅ **Tester l'inscription** depuis le frontend

---

## 📝 Note importante

Le frontend envoie toujours `password` (en clair) au backend, ce qui est **correct**.
Le backend :
1. ✅ Reçoit `password` du frontend
2. ✅ Le hashe avec bcrypt → `hashedPassword`
3. ✅ Insère dans la colonne `password_hash` de la DB

---

**Status** : ✅ Corrigé  
**Date** : Octobre 2025

