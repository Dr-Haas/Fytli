# ⚠️ IMPORTANT - À FAIRE AVANT DE LANCER

## 📝 Créer le fichier .env.local

**Ce fichier est OBLIGATOIRE pour que la landing page fonctionne !**

### Option 1 : Avec la commande

Ouvrez un terminal dans le dossier `website` et exécutez :

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
```

### Option 2 : Manuellement

1. Ouvrez le dossier `website` dans votre éditeur de code
2. Créez un nouveau fichier nommé exactement : `.env.local`
3. Copiez-collez cette ligne dedans :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:9001
   ```
4. Sauvegardez le fichier

### Vérification

Après avoir créé le fichier, vous devriez avoir :

```
website/
├── .env.local          ← Ce fichier doit exister !
├── app/
├── components/
├── lib/
├── package.json
└── ...
```

---

## 🚀 Ensuite : Lancer l'application

### 1. Lancer le backend

Dans un terminal :

```bash
cd ../backend-followsport
npm start
```

✅ Le backend doit tourner sur http://localhost:9001

### 2. Lancer la landing page

Dans un autre terminal :

```bash
cd website
npm run dev
```

✅ La landing page sera accessible sur http://localhost:3000

---

## ❌ Si vous ne créez pas le .env.local

Sans ce fichier, la landing page ne pourra pas se connecter au backend et :
- Les statistiques afficheront "—" au lieu des vrais chiffres
- Vous verrez des erreurs dans la console du navigateur

---

## 🎯 Résultat Attendu

Quand tout fonctionne correctement, vous verrez :

- ✅ La landing page sur http://localhost:3000
- ✅ Les statistiques qui se chargent automatiquement
- ✅ Les vrais chiffres (utilisateurs, programmes, exercices, badges)

---

## 🆘 En Cas de Problème

Si les stats ne se chargent pas :

1. Vérifiez que le fichier `.env.local` existe
2. Vérifiez que le backend tourne sur le port 9001
3. Testez : `curl http://localhost:9001/admin/stats`
4. Regardez la console du navigateur (F12) pour les erreurs

---

**Pour plus d'aide, consultez : START.md ou QUICK_START.md**

