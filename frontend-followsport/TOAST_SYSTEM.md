# 🎨 Système de Toast - Fytli

## 📚 Vue d'ensemble

Un système de notifications toast élégant et cohérent avec le branding Fytli, utilisant **react-hot-toast**.

---

## 🎯 Features

✅ **4 types de toasts** : success, error, warning, info  
✅ **Toast de chargement** avec `loading()`  
✅ **Toast Promise** pour opérations async  
✅ **Extraction automatique** des messages d'erreur API  
✅ **Design Fytli** (couleurs, bordures arrondies)  
✅ **Position top-right** cohérente  
✅ **Durées adaptées** (4-5 secondes)  

---

## 🔧 Installation

```bash
npm install react-hot-toast
```

---

## 📝 Utilisation

### Import
```typescript
import { showToast, getErrorMessage } from '../utils/toast';
```

### Success
```typescript
showToast.success('Programme créé ! On y va ? 💪');
// ✅ Fond vert (#2BB673), 4 secondes
```

### Error
```typescript
showToast.error('Une erreur est survenue');
// ❌ Fond rouge (#FF4D3A), 5 secondes
```

### Warning
```typescript
showToast.warning('Attention à cette action');
// ⚠️ Fond jaune (#FFCA55), 4 secondes
```

### Info
```typescript
showToast.info('À bientôt ! 👋');
// ℹ️ Fond bleu (#2D7FF9), 4 secondes
```

### Loading
```typescript
const toastId = showToast.loading('Chargement en cours...');
// ... opération
showToast.dismiss(toastId);
```

### Promise (recommandé pour les opérations async)
```typescript
showToast.promise(
  programsService.create(data),
  {
    loading: 'Création du programme...',
    success: 'Programme créé ! 💪',
    error: 'Erreur lors de la création',
  }
);
```

---

## 🛠️ Utilitaire `getErrorMessage`

Extrait le message d'erreur d'une erreur API de manière intelligente.

### Exemple
```typescript
try {
  await programsService.create(data);
} catch (error) {
  const message = getErrorMessage(error);
  showToast.error(message);
}
```

### Logique d'extraction
1. Si `error.response.data.message` existe → utilise ce message
2. Sinon si `error.message` existe → utilise ce message
3. Sinon si c'est un string → utilise directement
4. Fallback → "Une erreur est survenue"

---

## 🎨 Design Fytli

### Couleurs
- **Success** : `#2BB673` (vert Fytli)
- **Error** : `#FF4D3A` (rouge Fytli)
- **Warning** : `#FFCA55` (jaune Fytli)
- **Info** : `#2D7FF9` (bleu Fytli)
- **Loading** : `#3A3A3E` (gris Fytli)

### Style
```typescript
{
  background: '#2BB673',
  color: '#fff',
  padding: '16px',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '500',
}
```

### Position
- **Top-right** pour toutes les notifications
- Empilage automatique si plusieurs toasts

---

## 📍 Où sont utilisés les toasts ?

### AuthContext
- ✅ Login success : "Connexion réussie ! Bienvenue 👋"
- ✅ Login error : message d'erreur API
- ✅ Register success : "Compte créé ! Bienvenue chez Fytli 🎉"
- ✅ Register error : message d'erreur API
- ✅ Logout : "À bientôt ! 👋"

### Programs Page
- ✅ Create success : "Programme créé ! On y va ? 💪"
- ✅ Create error : message d'erreur API
- ✅ Load error : message d'erreur API

### ProgramDetail Page
- ✅ Load error : message d'erreur API

### SessionWorkout Page
- ✅ Load error : message d'erreur API

---

## 🚀 Prochaines améliorations

### Court terme
- [ ] Ajouter un toast lors de la suppression de programme
- [ ] Ajouter un toast lors de la mise à jour de programme
- [ ] Toast de confirmation avant suppression

### Moyen terme
- [ ] Toast personnalisés avec actions (Undo, Retry)
- [ ] Toast avec progression pour uploads
- [ ] Sons pour les notifications (optionnel)

---

## 🧪 Exemples de messages

### ✅ Messages de succès (motivants)
```typescript
showToast.success('Programme créé ! On y va ? 💪');
showToast.success('Séance terminée ! Bien joué 🎉');
showToast.success('Profil mis à jour avec succès');
showToast.success('Exercice ajouté à la session');
```

### ❌ Messages d'erreur (clairs et utiles)
```typescript
showToast.error('Le titre est obligatoire');
showToast.error('Email ou mot de passe incorrect');
showToast.error('Connexion au serveur impossible');
showToast.error('Cet exercice est déjà dans la session');
```

### ⚠️ Messages d'avertissement
```typescript
showToast.warning('Cette action est irréversible');
showToast.warning('Remplissez tous les champs obligatoires');
showToast.warning('Votre session va expirer dans 5 minutes');
```

### ℹ️ Messages d'information
```typescript
showToast.info('À bientôt ! 👋');
showToast.info('Pensez à sauvegarder vos modifications');
showToast.info('Nouvelle fonctionnalité disponible');
```

---

## 📊 Messages d'erreur Backend

### Structure des réponses d'erreur
Le backend renvoie des erreurs sous ce format :
```json
{
  "success": false,
  "message": "Message d'erreur clair",
  "error": "Détails techniques (optionnel)"
}
```

### Exemples de messages backend
```json
// 400 - Bad Request
{
  "success": false,
  "message": "Le champ name est obligatoire"
}

// 401 - Unauthorized
{
  "success": false,
  "message": "Token invalide ou expiré"
}

// 404 - Not Found
{
  "success": false,
  "message": "Programme avec l'ID 123 non trouvé"
}

// 500 - Server Error
{
  "success": false,
  "message": "Erreur lors de la création du programme"
}
```

---

## 🔄 Flux d'une erreur

```
1. Backend renvoie une erreur avec message
   ↓
2. Service Axios catch l'erreur
   ↓
3. getErrorMessage() extrait le message
   ↓
4. showToast.error() affiche le toast
   ↓
5. L'utilisateur voit le toast (5 secondes)
   ↓
6. Toast disparaît automatiquement
```

---

## 💡 Bonnes pratiques

### ✅ DO
- Utiliser `getErrorMessage()` pour extraire les messages
- Messages courts et clairs (max 60 caractères)
- Ajouter des emojis pour rendre sympathique 💪
- Utiliser `showToast.promise()` pour les opérations async longues
- Adapter la durée selon l'importance (4-5 secondes)

### ❌ DON'T
- Afficher des messages techniques bruts
- Spammer l'utilisateur de toasts
- Oublier de catch les erreurs
- Messages trop longs ou trop vagues
- Position différente des toasts

---

## 🧩 Composants

### Toaster (App.tsx)
```tsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster />
      {/* ... */}
    </>
  );
}
```

### Configuration globale
```typescript
<Toaster 
  position="top-right"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    // Options par défaut pour tous les toasts
    duration: 4000,
    style: {
      borderRadius: '12px',
      fontSize: '14px',
    },
  }}
/>
```

---

## 📦 Fichiers créés

- `src/utils/toast.ts` - Utilitaires de toast
- `TOAST_SYSTEM.md` - Cette documentation

---

## 📈 Statistiques

- **4 types** de toasts
- **2 fonctions** utilitaires
- **6 pages** avec toasts
- **~150 lignes** de code

---

## ✅ Checklist d'implémentation

- [x] Installation de react-hot-toast
- [x] Création du fichier `utils/toast.ts`
- [x] Ajout du `<Toaster />` dans App.tsx
- [x] Toasts dans AuthContext (login, register, logout)
- [x] Toasts dans Programs (create, load errors)
- [x] Toasts dans ProgramDetail (load errors)
- [x] Toasts dans SessionWorkout (load errors)
- [x] Fonction `getErrorMessage()` pour extraire les messages
- [x] Design Fytli appliqué
- [x] Build sans erreurs
- [x] Documentation complète

---

**Statut** : ✅ Opérationnel  
**Design** : ✅ Fytli  
**Documentation** : ✅ Complète  

**Bouge mieux, affiche mieux. 🎨**

