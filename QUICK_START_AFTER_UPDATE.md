# ⚡ Quick Start - Après la mise à jour

## 🚀 Étapes rapides (5 minutes)

### 1️⃣ Installer les dépendances
```bash
cd /Users/garyhaas/Desktop/Fytli/mobilApp-fytli
npm install
```

### 2️⃣ Ajouter des données de feed dans la DB
```bash
cd /Users/garyhaas/Desktop/Fytli/backend-fytli

# Remplacez par vos identifiants DB
mysql -u root -p fytli_db < database/quick_seed_feed.sql

# OU si vous êtes sur OVH :
mysql -h <host> -u <user> -p <database> < database/quick_seed_feed.sql
```

### 3️⃣ Nettoyer le cache et rebuild
```bash
cd /Users/garyhaas/Desktop/Fytli/mobilApp-fytli

# Nettoyer le cache Metro
rm -rf node_modules/.cache
rm -rf /tmp/metro-* 2>/dev/null || true

# Démarrer avec cache reset
npx react-native start --reset-cache
```

### 4️⃣ Dans un AUTRE terminal, rebuild l'app
```bash
cd /Users/garyhaas/Desktop/Fytli/mobilApp-fytli

# iOS
npx expo run:ios

# OU Android
npx expo run:android
```

---

## ✅ Vérifications rapides

### Dans l'app mobile :

1. **Profil** ✓
   ```
   Onglet Profil → Doit afficher votre profil (plus "Profil non trouvé")
   ```

2. **Création de programme** ✓
   ```
   Onglet Programmes → Bouton "+" → Créer un programme avec sessions
   ```

3. **Session avec photo** ✓
   ```
   Dashboard → Programme → Session → Workout → Summary → Ajouter photo
   ```

4. **Feed déverrouillé** ✓
   ```
   Après une session → Vérifier "Feed déverrouillé !" + streak
   ```

---

## 🎨 Si les styles ne s'appliquent pas

```bash
# Dans le simulateur/device :
# Secouer le téléphone (Cmd+D sur iOS)
# → Cliquer "Reload"

# Si ça ne marche pas :
cd /Users/garyhaas/Desktop/Fytli/mobilApp-fytli
pkill -f "react-native" || true
npx react-native start --reset-cache
```

---

## 🐛 Problèmes courants

### "Profil non trouvé"
```
1. Allez dans l'onglet Profil
2. Cliquez sur "🔍 Voir le Debug complet"
3. Vérifiez que Token et User sont présents
4. Si non, déconnectez-vous et reconnectez-vous
```

### "Feed vide"
```
1. Exécutez le script SQL (étape 2)
2. OU complétez une session dans l'app
3. Le feed se remplira automatiquement
```

### "Permissions photo refusées"
```
iOS:
Réglages → Fytli → Activer Caméra et Photos

Android:
Paramètres → Apps → Fytli → Permissions → Activer Caméra et Stockage
```

---

## 📝 Logs à surveiller

Ouvrez le terminal Metro et cherchez :

✅ **Bons signes** :
```
✅ Login successful - User: {...}
✅ Auth stored in AsyncStorage
✅ Completion enregistrée
✅ Feed déverrouillé - Streak: X
```

⚠️ **Warnings normaux** (ne pas s'inquiéter) :
```
⚠️ Stats non disponibles
⚠️ Badges non disponibles
⚠️ 401 sur /social/profile/3
```

❌ **Erreurs à corriger** :
```
❌ Token invalide détecté
❌ Erreur sauvegarde completion
❌ Erreur lors de la connexion
```

---

## 🎯 Test complet (10 minutes)

```
1. ✓ Déconnexion / Reconnexion
2. ✓ Aller sur Profil → Voir les stats
3. ✓ Programmes → Créer un programme
4. ✓ Ajouter 2 sessions avec exercices
5. ✓ S'inscrire au programme
6. ✓ Démarrer une session
7. ✓ Compléter la session
8. ✓ Ajouter une photo
9. ✓ Sélectionner un feeling
10. ✓ Vérifier "Feed déverrouillé !"
11. ✓ Vérifier le streak
12. ✓ Retour au Dashboard
```

---

## 📞 Besoin d'aide ?

1. **Logs Metro** : Regardez les messages `🔐`, `✅`, `❌` dans le terminal
2. **Debug Screen** : Profil → "🔍 Voir le Debug complet"
3. **Database** : Vérifiez que les tables existent et ont des données
4. **Permissions** : Vérifiez dans les réglages du téléphone

---

## ✨ C'est tout !

Votre app est maintenant complète avec :
- ✅ Profil fonctionnel
- ✅ Création de programmes avec sessions
- ✅ Module photo dans le résumé
- ✅ Feed social déverrouillé automatiquement
- ✅ Streak affiché
- ✅ Nouveau gradient orange foncé

**Bon courage ! 🚀**

