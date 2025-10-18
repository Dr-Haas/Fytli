# 🎨 Migration Badges - Ajout des couleurs

## 📋 À faire sur OVH phpMyAdmin

1. **Connectez-vous à votre phpMyAdmin OVH**
   - URL : https://phpmyadmin.cluster042.hosting.ovh.net/
   - Sélectionnez votre base de données `lyfti`

2. **Exécutez le script SQL**
   - Cliquez sur l'onglet **"SQL"**
   - Copiez-collez le contenu du fichier `MIGRATION_ADD_BADGES_COLORS.sql`
   - Cliquez sur **"Exécuter"**

3. **Vérifiez le résultat**
   - Vous devriez voir 10 badges avec leurs couleurs et gradients
   - La dernière requête SELECT affichera tous les badges

## ✅ Résultat attendu

Vous devriez voir 10 badges :
1. 🔥 Constance (rouge)
2. 💪 Progression (orange)
3. 🧘 Sérénité (crème)
4. 🚀 Niveau Supérieur (rouge-orange)
5. ❤️ Santé Cardiaque (rouge)
6. 🌅 Routine Matinale (jaune)
7. 🌙 Routine du Soir (marron)
8. 🎯 Objectif Atteint (vert)
9. 🏆 Challenge Réussi (or)
10. 💫 Esprit Fytli (rouge-orange)

## 🚀 Après la migration

Une fois la migration faite :
1. Faites un `git push` du code backend mis à jour
2. Attendez que Render redéploie (~2-3 min)
3. Les badges s'afficheront avec les bonnes couleurs ! 🎉

