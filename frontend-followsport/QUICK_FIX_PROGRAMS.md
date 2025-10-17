# ⚡ Quick Fix - Affichage des Programmes

## ✅ Correction appliquée

Le problème était que le backend retourne :
```json
{
  "success": true,
  "count": 2,
  "data": [...]  ← Les programmes sont ici
}
```

Mais le frontend cherchait directement dans `response.data` au lieu de `response.data.data`.

### Fichier corrigé : `src/services/programs.ts`

```typescript
// ❌ AVANT
return response.data;

// ✅ APRÈS
return response.data.data;
```

---

## 🚀 Action immédiate

**Rechargez simplement la page** dans votre navigateur :
1. ✅ Allez sur http://localhost:5173/programs
2. ✅ Appuyez sur **F5** ou **Cmd+R**
3. ✅ Vos 2 programmes devraient maintenant s'afficher ! 🎉

---

## 🧪 Si les programmes s'affichent mais sans badge de niveau

C'est normal si votre table `programs` n'a pas de colonne `level` remplie.

Le composant `ProgramCard` gère déjà ce cas et affichera "Non défini" si `level` est absent.

---

## 📝 Pour ajouter le niveau et la durée (optionnel)

Si vous voulez afficher le niveau et la durée, mettez à jour vos programmes :

```sql
-- Via MySQL/HeidiSQL
UPDATE programs SET 
  level = 'beginner', 
  duration_weeks = 8 
WHERE id = 1;

UPDATE programs SET 
  level = 'intermediate', 
  duration_weeks = 12 
WHERE id = 2;
```

Puis rechargez la page → les badges de niveau s'afficheront ! 🎨

---

**Test maintenant : Rechargez http://localhost:5173/programs** 🚀

