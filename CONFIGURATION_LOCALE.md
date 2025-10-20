# 🔧 Configuration Locale - Frontend & Backend

## ✅ Problème Résolu

Le frontend et l'admin panel sont maintenant correctement configurés pour se connecter au backend sur le port **9001**.

## 📁 Fichiers Créés/Modifiés

### 1. Frontend (`frontend-fytli/`)

**Fichier créé : `.env`**
```env
# Configuration de l'API Backend
VITE_API_URL=http://localhost:9001
```

**Fichier créé : `.env.example`**
```env
# Configuration de l'API Backend
# En développement local
VITE_API_URL=http://localhost:9001

# En production (exemple)
# VITE_API_URL=https://api.fytli.fr
```

### 2. Admin Panel (`admin-panel/`)

**Fichier créé : `.env`**
```env
# Configuration de l'API Backend
VITE_API_URL=http://localhost:9001
```

**Fichier créé : `.env.example`**
```env
# Configuration de l'API Backend
# En développement local
VITE_API_URL=http://localhost:9001

# En production (exemple)
# VITE_API_URL=https://api.fytli.fr
```

### 3. Backend (`backend-fytli/`)

**Fichier modifié : `.env`**

Corrections apportées :
- ✅ `PORT=9001` (inchangé - correct)
- ✅ `BASE_URL=http://localhost:9001` (corrigé - était sur Render)
- ✅ `FRONTEND_URL=http://localhost:5173` (corrigé - était sur 5175)
- ✅ Suppression de `VITE_API_URL` (n'a pas sa place dans le backend)

## 🚀 Comment Démarrer

### 1. Backend
```bash
cd backend-fytli
npm install
npm run dev
```

Le backend devrait démarrer sur : `http://localhost:9001`

### 2. Frontend
```bash
cd frontend-fytli
npm install
npm run dev
```

Le frontend devrait démarrer sur : `http://localhost:5173`

### 3. Admin Panel
```bash
cd admin-panel
npm install
npm run dev
```

L'admin panel devrait démarrer sur : `http://localhost:5174`

## 🔍 Vérification de la Configuration

### Test 1 : Backend
Ouvrez `http://localhost:9001` dans votre navigateur.

Vous devriez voir :
```json
{
  "success": true,
  "message": "Backend Fytli API - Serveur fonctionnel",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### Test 2 : Frontend → Backend
1. Ouvrez la console du navigateur (F12)
2. Naviguez sur le frontend
3. Vous devriez voir des logs comme :
```
🌐 API Request: GET http://localhost:9001/...
✅ API Response: GET /... - Status: 200
```

### Test 3 : CORS
Si vous voyez des erreurs CORS, vérifiez que :
- Le backend est bien démarré sur le port 9001
- Le `FRONTEND_URL` dans le backend `.env` est `http://localhost:5173`

## 📝 Fichiers de Configuration

### Backend (`backend-fytli/.env`)
- `PORT` : Port du serveur backend (9001)
- `BASE_URL` : URL de base pour les fichiers uploadés
- `FRONTEND_URL` : URL du frontend pour CORS

### Frontend & Admin (`frontend-fytli/.env` et `admin-panel/.env`)
- `VITE_API_URL` : URL de l'API backend

## ⚠️ Notes Importantes

1. Les fichiers `.env` sont dans `.gitignore` et ne seront pas commitées
2. Une sauvegarde de l'ancien `.env` du backend a été créée : `.env.backup`
3. Les fichiers `.env.example` servent de documentation et peuvent être commités

## 🔄 Ports Utilisés

| Service      | Port  | URL                     |
|-------------|-------|-------------------------|
| Backend     | 9001  | http://localhost:9001   |
| Frontend    | 5173  | http://localhost:5173   |
| Admin Panel | 5174  | http://localhost:5174   |

## 🐛 Dépannage

### Problème : "Connection refused" ou "Network Error"
- Vérifiez que le backend est bien démarré
- Vérifiez que le port 9001 n'est pas utilisé par une autre application

### Problème : CORS Error
- Vérifiez que `FRONTEND_URL` dans le backend `.env` correspond à l'URL du frontend
- Redémarrez le backend après avoir modifié `.env`

### Problème : Le frontend utilise la mauvaise URL
- Vérifiez que le fichier `.env` existe dans `frontend-fytli/`
- Redémarrez le serveur de développement du frontend (`npm run dev`)
- Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)

## ✅ Checklist de Vérification

- [ ] Backend démarre sans erreur sur le port 9001
- [ ] Frontend démarre sans erreur sur le port 5173
- [ ] Admin Panel démarre sans erreur sur le port 5174
- [ ] Les requêtes API du frontend vers le backend fonctionnent
- [ ] Pas d'erreurs CORS dans la console du navigateur
- [ ] Les logs du backend montrent les requêtes entrantes

