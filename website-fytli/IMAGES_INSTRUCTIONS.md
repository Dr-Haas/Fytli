# 📸 Instructions pour les Images - Landing Page Fytli

## Images à ajouter

Tu dois placer les **3 images** que tu as fournies dans le dossier `/website/public/images/` avec les noms suivants :

### 1. Image Héro/Célébration
**Nom du fichier** : `hero-celebration.png`
**Description** : Image avec des personnes célébrant ("Nice!", "Great job!")
**Emplacement** : Section Hero (en haut de la page)
**Dimensions recommandées** : 800x600px minimum

### 2. Image Communauté/Fenêtres
**Nom du fichier** : `community-workout.png`
**Description** : Image avec des personnes faisant de l'exercice à travers des fenêtres d'immeuble
**Emplacement** : Section Features (milieu de page)
**Dimensions recommandées** : 800x600px minimum

### 3. Image Bien-être/Yoga
**Nom du fichier** : `home-yoga.png`
**Description** : Image avec un couple faisant du yoga dans un salon chaleureux
**Emplacement** : Section CTA ou nouvelle section (à déterminer)
**Dimensions recommandées** : 800x600px minimum

---

## Comment Ajouter les Images

### Étape 1 : Localiser le Dossier
```bash
cd /Users/garyhaas/Desktop/followSport_app/website/public/images/
```

### Étape 2 : Copier les Images
Copie les 3 images dans ce dossier et renomme-les exactement comme indiqué ci-dessus :
- `hero-celebration.png`
- `community-workout.png`
- `home-yoga.png`

### Étape 3 : Vérifier
```bash
ls /Users/garyhaas/Desktop/followSport_app/website/public/images/
```

Tu devrais voir les 3 fichiers listés.

---

## Utilisation dans le Code

Les images seront automatiquement utilisées dans les composants via Next.js Image :

```tsx
<Image 
  src="/images/hero-celebration.png" 
  alt="Fytli Community" 
  width={800} 
  height={600}
/>
```

---

## Formats Supportés

- PNG (recommandé pour les illustrations)
- JPEG/JPG
- WebP
- SVG

---

## Optimisation

Next.js optimisera automatiquement les images pour :
- ✅ Compression automatique
- ✅ Responsive images
- ✅ Lazy loading
- ✅ Format moderne (WebP)

---

## Note

Si tu veux utiliser d'autres noms de fichiers, il faudra modifier les chemins dans les composants :
- `components/Hero.tsx`
- `components/Features.tsx` (ou créer une nouvelle section)

---

**Une fois les images ajoutées, relance le serveur pour voir les changements :**

```bash
npm run dev
```

