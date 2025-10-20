# 🔧 Configuration Environnement Local

## 📋 Étape 1 : Créer le fichier .env

Dans les dossiers, créez un fichier `.env` avec les informations suivantes :

```bash
# Configuration de la base de données (OVH - en ligne)
DB_HOST=votre-host-ovh.ovh.net
DB_USER=votre-utilisateur-db
DB_PASSWORD=votre-mot-de-passe-db
DB_NAME=votre-nom-db
DB_PORT=3306

# Configuration JWT
JWT_SECRET=votre-secret-jwt-securise

# Configuration du serveur
PORT=9001
NODE_ENV=development

# Configuration Email (optionnel pour tests locaux)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=Fytli <noreply@fytli.app>

# Web Push Notifications (optionnel pour tests locaux)
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@example.com

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 🚀 Étape 2 : Installer les dépendances

```bash
npm install
```

## ✅ Étape 3 : Tester la connexion

```bash
npm run dev
```

Vous devriez voir :
```
✅ Connexion MySQL établie avec succès
🚀 Backend Fytli démarré sur http://localhost:9001
```

## 📝 Où trouver vos informations de base de données OVH ?

1. Connectez-vous à votre espace client OVH
2. Allez dans **Web Cloud → Bases de données**
3. Sélectionnez votre base de données
4. Vous trouverez :
   - **DB_HOST** : Nom du serveur
   - **DB_USER** : Nom d'utilisateur
   - **DB_PASSWORD** : Votre mot de passe (si oublié, le réinitialiser)
   - **DB_NAME** : Nom de la base de données
   - **DB_PORT** : 3306 (par défaut)

## 🔐 Sécurité

⚠️ **IMPORTANT** : Ne jamais commiter le fichier `.env` dans Git !

Le fichier `.env` est déjà dans `.gitignore`.

