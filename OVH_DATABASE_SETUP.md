# 🗄️ Configuration Base de Données OVH - Fytli

Guide pour configurer et connecter votre base de données MySQL OVH avec votre application Fytli.

---

## 📋 Informations à récupérer après création

Après avoir créé votre base de données sur OVH, notez ces informations :

### Informations de connexion MySQL

```
Host (Hôte) : recovvk.mysql.db
Port : 3306
Username (Utilisateur) : recovvk
Password (Mot de passe) : [le mot de passe que vous avez créé]
Database (Base de données) : [nom de votre base, ex: followsport]
```

**Où trouver ces informations ?**
- OVH Manager → Web Cloud → Hébergements → Fytli
- Onglet "Bases de données"
- Cliquer sur votre base de données

---

## 🔧 Configuration du Backend

### 1. Créer le fichier .env local

Dans `backend-followsport/.env` :

```env
# Configuration Serveur
NODE_ENV=production
PORT=9001

# Configuration Base de Données OVH
DB_HOST=recovvk.mysql.db
DB_PORT=3306
DB_USER=recovvk
DB_PASSWORD=VotreMotDePasseOVH
DB_NAME=followsport

# JWT Secret (générer une clé aléatoire)
JWT_SECRET=votre_secret_jwt_32_caracteres_minimum

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_app_password
```

### 2. Générer un JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier le résultat dans `JWT_SECRET`.

---

## 📊 Importer le schéma de base de données

### Option A : Via phpMyAdmin OVH

1. **Accéder à phpMyAdmin** :
   - OVH Manager → Bases de données → Cliquer sur votre base
   - Bouton "Accéder à phpMyAdmin"

2. **Se connecter** :
   - Serveur : `recovvk.mysql.db`
   - Utilisateur : `recovvk`
   - Mot de passe : [votre mot de passe]

3. **Importer le schéma** :
   - Sélectionner votre base de données (à gauche)
   - Onglet "Importer"
   - Choisir le fichier : `backend-followsport/database/enrollment_system.sql`
   - Cliquer "Exécuter"

### Option B : Via ligne de commande

```bash
# Depuis votre machine locale
mysql -h recovvk.mysql.db -P 3306 -u recovvk -p followsport < backend-followsport/database/enrollment_system.sql
```

Entrer le mot de passe quand demandé.

---

## 🚀 Configuration pour Render

### Variables d'environnement Render

Sur Render Dashboard → Votre service backend → Environment :

```env
NODE_ENV=production
DB_HOST=recovvk.mysql.db
DB_PORT=3306
DB_USER=recovvk
DB_PASSWORD=VotreMotDePasseOVH
DB_NAME=followsport
JWT_SECRET=votre_secret_genere_32_caracteres
```

⚠️ **Important** : Ne pas mettre `PORT` dans Render, il le définit automatiquement.

---

## 🔒 Autoriser l'accès depuis Render

### Whitelist des IPs

OVH peut restreindre l'accès à la base de données par IP. Vous devez autoriser les IPs de Render :

1. **Sur OVH Manager** :
   - Bases de données → Votre base → Configuration
   - Chercher "Autoriser l'accès depuis"

2. **Autoriser toutes les IPs** (pour Render) :
   - Ajouter : `0.0.0.0/0` (tous les IPs)
   - ⚠️ Moins sécurisé mais nécessaire pour Render

**OU** autoriser seulement les IPs de Render :
   - Trouver les IPs de Render dans leur dashboard
   - Les ajouter une par une

---

## 🔧 Modifier db.js pour OVH

Vérifier que `backend-followsport/db.js` utilise les bonnes variables :

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
```

---

## ✅ Tester la connexion

### Depuis votre machine locale

```bash
cd backend-followsport

# Tester la connexion
mysql -h recovvk.mysql.db -P 3306 -u recovvk -p

# Vérifier les tables
USE followsport;
SHOW TABLES;
```

### Depuis le backend

```bash
cd backend-followsport
npm run dev
```

Vous devriez voir :
```
Server running on port 9001
✓ MySQL Connected
```

---

## 🗺️ Architecture avec OVH

```
┌──────────────────────┐
│   Render (Backend)   │
│   Node.js + Express  │
└──────────┬───────────┘
           │
           │ MySQL (port 3306)
           │
           ▼
┌──────────────────────┐
│   OVH MySQL          │
│   recovvk.mysql.db   │
│   Base: followsport  │
└──────────────────────┘
```

---

## 📊 Informations sur les offres OVH

### Offre PRO (6.59 €/mois)
- ✅ **4 x base de données MySQL 1 Go**
- Parfait pour Fytli
- Espace suffisant pour l'application

### Offre PERFORMANCE (10.99 €/mois)
- ✅ **4 x base de données MySQL 1 Go**
- ✅ **1 x Web Cloud database 512MB RAM - 8GB**
- Plus performant mais pas forcément nécessaire au début

**Recommandation** : L'offre **PRO** est suffisante pour commencer.

---

## 🔍 Vérifications

### Checklist de configuration

- [ ] Base de données créée sur OVH
- [ ] Utilisateur : `recovvk`
- [ ] Mot de passe défini (respectant les règles)
- [ ] Schéma SQL importé via phpMyAdmin
- [ ] Tables créées (users, programs, sessions, etc.)
- [ ] `.env` créé avec les bonnes informations
- [ ] JWT_SECRET généré
- [ ] Connexion testée en local
- [ ] Variables d'environnement configurées sur Render
- [ ] Accès autorisé depuis les IPs de Render

---

## 🐛 Problèmes courants

### Erreur : "Access denied for user"

**Cause** : Mauvais mot de passe ou utilisateur

**Solution** :
- Vérifier DB_USER = `recovvk`
- Vérifier DB_PASSWORD
- Retester la connexion avec mysql en ligne de commande

### Erreur : "Can't connect to MySQL server"

**Cause** : Host incorrect ou IP non autorisée

**Solution** :
- Vérifier DB_HOST = `recovvk.mysql.db`
- Vérifier que l'IP est autorisée sur OVH
- Vérifier le firewall

### Erreur : "Unknown database"

**Cause** : La base de données n'existe pas

**Solution** :
- Créer la base de données sur OVH
- Vérifier DB_NAME dans .env
- Importer le schéma SQL

### Erreur : "Too many connections"

**Cause** : Limite de connexions atteinte

**Solution** :
- Réduire `connectionLimit` dans db.js
- Passer à l'offre PERFORMANCE
- Optimiser les requêtes

---

## 📚 Ressources

- [Documentation OVH MySQL](https://docs.ovh.com/fr/hosting/creer-bases-de-donnees-et-utilisateurs/)
- [phpMyAdmin OVH](https://phpmyadmin.ovh.net/)
- [Guide Render](RENDER_CONFIG.md)
- [Guide de déploiement](DEPLOY.md)

---

## 🎯 Résumé

1. **Créer la base de données sur OVH** avec les informations du formulaire
2. **Noter les credentials** (host, user, password, database)
3. **Importer le schéma SQL** via phpMyAdmin
4. **Configurer .env** en local et sur Render
5. **Tester la connexion**
6. **Déployer**

---

**✨ Votre base de données OVH est maintenant prête pour Fytli !**

