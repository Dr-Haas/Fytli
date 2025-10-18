# 🚀 Démarrer la Landing Page Fytli

## ⚡ Démarrage Rapide (3 étapes)

### 1️⃣ Configurer l'environnement

Créez le fichier `.env.local` :

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
```

### 2️⃣ Lancer le backend

Dans un terminal, démarrez le backend :

```bash
cd ../backend-followsport
npm start
```

✅ Le backend tourne sur http://localhost:9001

### 3️⃣ Lancer la landing page

Dans un autre terminal :

```bash
npm run dev
```

✅ La landing page est accessible sur http://localhost:3000

---

## 🎯 Ce que vous verrez

La landing page Fytli avec :

1. **Hero Section** 🎨
   - Logo et titre Fytli
   - Slogan motivant
   - Boutons d'action
   - Design coloré avec dégradés

2. **Section Statistiques** 📊
   - Nombre d'utilisateurs actifs (récupéré du backend)
   - Nombre de programmes sportifs
   - Nombre d'exercices disponibles
   - Nombre de badges à débloquer

3. **Section Fonctionnalités** ✨
   - Programmes personnalisés
   - Système de badges
   - Suivi de progression
   - Exercices variés
   - Sessions guidées
   - Bien-être global

4. **Call to Action** 🔥
   - Invitation à rejoindre Fytli
   - Bouton vers l'application

5. **Footer** 💪
   - Logo Fytli
   - Liens utiles
   - Copyright

---

## 🔍 Vérification que tout fonctionne

### Backend actif ?

Testez l'endpoint :

```bash
curl http://localhost:9001/admin/stats
```

Vous devriez voir un JSON avec les statistiques.

### Frontend accessible ?

Ouvrez votre navigateur sur http://localhost:3000

### Stats qui se chargent ?

Les chiffres dans la section statistiques doivent apparaître (pas des "—").

---

## 🛠️ Résolution de problèmes

### Les stats affichent "—"

**Cause** : Le backend n'est pas accessible

**Solutions** :
1. Vérifiez que le backend tourne sur le port 9001
2. Vérifiez la console du navigateur (F12) pour les erreurs
3. Testez manuellement : `curl http://localhost:9001/admin/stats`

### Erreur "Cannot GET /"

**Cause** : Le serveur Next.js n'a pas démarré

**Solution** : Relancez `npm run dev`

### Port 3000 déjà utilisé

**Cause** : Une autre application utilise le port 3000

**Solutions** :
- Arrêtez l'autre application
- Ou lancez sur un autre port : `PORT=3001 npm run dev`

---

## 📱 Test sur mobile

1. Trouvez votre IP locale : `ifconfig | grep "inet "` (Mac/Linux)
2. Sur votre téléphone, connectez-vous au même WiFi
3. Ouvrez : `http://VOTRE_IP:3000`

---

## 🎨 Personnalisation

### Modifier les couleurs

Éditez les classes Tailwind dans les composants :
- `from-purple-600 via-pink-500 to-orange-400` pour les dégradés

### Modifier le contenu

- **Hero** : `components/Hero.tsx`
- **Features** : `components/Features.tsx`
- **CTA** : `components/CTA.tsx`

### Ajouter des sections

1. Créez un nouveau composant dans `components/`
2. Importez-le dans `app/page.tsx`
3. Ajoutez-le entre les sections existantes

---

## 🚢 Prêt pour la production ?

Voir [README.md](README.md) pour les instructions de déploiement sur :
- Vercel (recommandé pour Next.js)
- Netlify
- Render

---

**Besoin d'aide ?** Consultez [QUICK_START.md](QUICK_START.md) pour plus de détails.

