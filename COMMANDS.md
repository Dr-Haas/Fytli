# 🚀 Commandes Rapides - Fytli

Aide-mémoire pour gérer les trois projets (Frontend, Admin Panel, Backend).

---

## 📦 Installation

```bash
# Frontend
cd frontend-fytli && npm install

# Admin Panel
cd admin-panel && npm install

# Backend
cd backend-fytli && npm install
```

---

## 🔧 Développement

```bash
# Frontend (port 5173)
cd frontend-fytli
npm run dev

# Admin Panel (port 5174)
cd admin-panel
npm run dev

# Backend (port 9001)
cd backend-fytli
npm run dev
```

---

## 🏗️ Build Production

```bash
# Frontend
cd frontend-fytli
npm run build

# Admin Panel
cd admin-panel
npm run build

# Backend
cd backend-fytli
npm run build
```

---

## 👀 Preview

```bash
# Frontend
cd frontend-fytli
npm run preview

# Admin Panel
cd admin-panel
npm run preview
```

---

## 🧹 Nettoyage

```bash
# Frontend
cd frontend-fytli
npm run clean

# Admin Panel
cd admin-panel
npm run clean
```

---

## 🔍 Lint

```bash
# Frontend
cd frontend-fytli
npm run lint

# Admin Panel
cd admin-panel
npm run lint
```

---

## 🗄️ Base de données

```bash
# Créer la base de données
mysql -u root -p < backend-fytli/database/enrollment_system.sql

# Vérifier la connexion
mysql -u root -p
USE fytli;
SHOW TABLES;
```

---

## 🌐 URLs de développement

- **Frontend** : http://localhost:5173
- **Admin Panel** : http://localhost:5174
- **Backend API** : http://localhost:9001

---

## 📝 Scripts disponibles par projet

### Frontend (`frontend-fytli`)
- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour production
- `npm run preview` - Preview du build
- `npm run lint` - Vérifie le code
- `npm run clean` - Supprime le dossier dist

### Admin Panel (`admin-panel`)
- `npm run dev` - Lance le serveur de développement (port 5174)
- `npm run build` - Build pour production
- `npm run preview` - Preview du build
- `npm run lint` - Vérifie le code
- `npm run clean` - Supprime le dossier dist

### Backend (`backend-fytli`)
- `npm start` - Lance le backend en production
- `npm run dev` - Lance le backend en mode développement (nodemon)
- `npm run build` - Vérifie que tout est prêt
- `npm test` - Lance les tests

---

## 🔑 Variables d'environnement

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:9001
```

### Admin Panel (`.env`)
```env
VITE_API_URL=http://localhost:9001
```

### Backend (`.env`)
```env
PORT=9001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votreMotDePasse
DB_NAME=fytli
JWT_SECRET=votre_secret_jwt_super_securise
NODE_ENV=development
```

---

## 🛠️ Commandes utiles

### Tout réinstaller
```bash
# Frontend
cd frontend-fytli
rm -rf node_modules package-lock.json
npm install

# Admin Panel
cd ../admin-panel
rm -rf node_modules package-lock.json
npm install

# Backend
cd ../backend-fytli
rm -rf node_modules package-lock.json
npm install
```

### Vérifier les versions
```bash
node --version      # v20.19+ ou v22.12+
npm --version       # v10+
mysql --version     # v8.0+
```

---

## 📚 Documentation

- [README principal](README.md)
- [🚀 Guide de déploiement Render](RENDER_CONFIG.md)
- [🚀 Guide de déploiement complet](DEPLOY.md)
- [Guide de build](BUILD.md)
- [Documentation de la base de données](DATABASE.md)
- [Documentation complète](DOCUMENTATION.md)

---

## 💡 Workflow typique

1. **Lancer le backend** (terminal 1) :
   ```bash
   cd backend-fytli
   npm run dev
   ```

2. **Lancer le frontend** (terminal 2) :
   ```bash
   cd frontend-fytli
   npm run dev
   ```

3. **Lancer l'admin panel** (terminal 3, si nécessaire) :
   ```bash
   cd admin-panel
   npm run dev
   ```

4. **Accéder aux applications** :
   - Frontend : http://localhost:5173
   - Admin : http://localhost:5174
   - API : http://localhost:9001

---

## 🐛 Dépannage rapide

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5173   # ou 5174, 9001
# Tuer le processus
kill -9 <PID>
```

### Erreur de dépendances
```bash
cd <projet>
rm -rf node_modules package-lock.json
npm install
```

### Base de données inaccessible
```bash
# Vérifier que MySQL est lancé
brew services list  # macOS
sudo systemctl status mysql  # Linux

# Redémarrer MySQL
brew services restart mysql  # macOS
sudo systemctl restart mysql  # Linux
```

---

**🎉 Bon développement !**

