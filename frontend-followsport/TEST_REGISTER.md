# 🧪 Test de l'inscription - Debugging

## 📋 Ce que le backend attend

D'après `authController.js` ligne 18-22 :

```javascript
if (!email || !password || !first_name || !last_name) {
  return res.status(400).json({
    success: false,
    message: 'Les champs email, password, first_name et last_name sont obligatoires'
  });
}
```

**Champs obligatoires** :
- ✅ `email`
- ✅ `password` (⚠️ PAS `password_hash`)
- ✅ `first_name`
- ✅ `last_name`

---

## 🔍 Payload envoyé par le frontend

```typescript
{
  email: credentials.email,
  password: credentials.password,  // ✅ Correct (le backend hashera)
  first_name: credentials.firstname,  // ✅ Transformé
  last_name: credentials.lastname,    // ✅ Transformé
}
```

---

## 🐛 Causes possibles de l'erreur 400

### 1. Mot de passe trop court
Backend ligne 35-40 :
```javascript
if (password.length < 6) {
  return res.status(400).json({
    message: 'Le mot de passe doit contenir au moins 6 caractères'
  });
}
```

➡️ **Vérifiez que votre mot de passe fait au moins 6 caractères**

### 2. Email invalide
Backend ligne 26-32 :
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: 'Format d\'email invalide'
  });
}
```

➡️ **Vérifiez le format de l'email**

### 3. Email déjà existant
Backend ligne 43-49 :
```javascript
const existingUser = await usersModel.getUserByEmail(email);
if (existingUser) {
  return res.status(409).json({  // ⚠️ 409, pas 400
    message: 'Un utilisateur avec cet email existe déjà'
  });
}
```

➡️ Retourne 409 (pas 400), donc pas ce problème

### 4. Champs manquants
Backend ligne 18-23 :
```javascript
if (!email || !password || !first_name || !last_name) {
  return res.status(400).json({
    message: 'Les champs email, password, first_name et last_name sont obligatoires'
  });
}
```

➡️ **Vérifiez que tous les champs sont remplis**

---

## ✅ Checklist de test

Pour tester l'inscription, assurez-vous que :

- [ ] **Email** : Format valide (ex: `test@example.com`)
- [ ] **Mot de passe** : Au moins 6 caractères
- [ ] **Prénom** : Rempli (non vide)
- [ ] **Nom** : Rempli (non vide)

---

## 🧪 Test manuel avec curl

Testez directement le backend :

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

**Résultat attendu** : 201 avec token et user

---

## 📊 Logs backend

Vérifiez les logs du backend pour voir l'erreur exacte :

```bash
# Dans le terminal où tourne le backend
# Vous devriez voir le message d'erreur exact
```

---

## 🔧 Debug dans le frontend

Ajoutez des logs dans `auth.ts` :

```typescript
async register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const backendPayload = {
    email: credentials.email,
    password: credentials.password,
    first_name: credentials.firstname,
    last_name: credentials.lastname,
  };
  
  console.log('📤 Payload envoyé au backend:', backendPayload);
  
  try {
    const response = await api.post<any>('/auth/register', backendPayload);
    console.log('✅ Réponse backend:', response.data);
    
    return {
      token: response.data.token,
      user: transformUserFromBackend(response.data.user),
    };
  } catch (error: any) {
    console.error('❌ Erreur backend:', error.response?.data);
    throw error;
  }
}
```

---

## 🎯 Action immédiate

1. **Ouvrez la console du navigateur** (F12)
2. **Essayez de vous inscrire** avec :
   - Email : `test@example.com`
   - Mot de passe : `password123` (au moins 6 caractères !)
   - Prénom : `Jean`
   - Nom : `Dupont`
3. **Regardez les logs** dans la console et dans le terminal backend
4. **Notez le message d'erreur exact**

---

**Si l'erreur persiste, partagez-moi le message d'erreur exact du backend !**

