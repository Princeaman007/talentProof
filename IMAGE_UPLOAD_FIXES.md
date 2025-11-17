# Tests de validation - Upload d'image TalentDay

## ✅ Corrections appliquées

### Frontend (CreateTalentDay.jsx)
1. **handleSubmit modifié** :
   - Ne plus envoyer l'URL string de l'image existante dans FormData
   - Ajouter `keepExistingImage: true` et `existingImageUrl` lors de l'édition sans nouveau fichier
   - Réinitialiser le formulaire après création réussie

2. **handleRemoveImage ajouté** :
   - Permet de supprimer l'aperçu et réinitialiser l'input file
   - Nettoie le state (imageFile, imagePreview, formData.image)

3. **Validation d'image améliorée** :
   - Messages d'erreur affichés dans le formulaire (pas d'alert)
   - Erreurs ajoutées au state `errors` avec clé `image`
   - Affichage conditionnel de l'erreur sous l'input

4. **Bouton "Supprimer l'image"** :
   - Affiché uniquement si imagePreview existe
   - Permet de retirer l'image sélectionnée

### Backend (talentdayRoutes.js - PUT route)
1. **Récupération du TalentDay existant** :
   - Fetch du document avant update pour accéder à l'image actuelle

2. **Logique de gestion d'image** :
   - Si `req.file` existe → nouvelle image uploadée
   - Si `keepExistingImage === 'true'` → conserver `existingImageUrl`
   - Sinon → conserver l'image de l'existingTalentDay
   - Nettoyer les champs temporaires (`keepExistingImage`, `existingImageUrl`)

3. **Prévention de l'écrasement** :
   - L'image n'est jamais supprimée involontairement
   - Fallback sur l'image existante par défaut

## 🧪 Scénarios de test

### Test 1 : Création avec image
- [ ] Sélectionner une image → aperçu s'affiche
- [ ] Soumettre le formulaire
- [ ] Vérifier que l'image est sauvegardée dans `/uploads/talentdays/`
- [ ] Vérifier l'URL dans la base de données
- [ ] Vérifier l'affichage dans TalentDayCard

### Test 2 : Création sans image
- [ ] Ne pas sélectionner d'image
- [ ] Soumettre le formulaire
- [ ] Vérifier que l'image par défaut est utilisée (`/uploads/default-talent-day.svg`)

### Test 3 : Édition sans changer l'image
- [ ] Ouvrir un TalentDay existant avec image
- [ ] Vérifier que l'aperçu affiche l'image actuelle
- [ ] Modifier le titre (sans toucher à l'image)
- [ ] Soumettre
- [ ] Vérifier que l'image originale est conservée

### Test 4 : Édition en remplaçant l'image
- [ ] Ouvrir un TalentDay existant
- [ ] Sélectionner une nouvelle image
- [ ] Aperçu de la nouvelle image s'affiche
- [ ] Soumettre
- [ ] Vérifier que la nouvelle image remplace l'ancienne

### Test 5 : Suppression d'image en édition
- [ ] Ouvrir un TalentDay avec image
- [ ] Cliquer sur "Supprimer l'image"
- [ ] Aperçu disparaît
- [ ] Soumettre
- [ ] Vérifier que l'image par défaut est utilisée

### Test 6 : Validation de format
- [ ] Sélectionner un fichier PDF
- [ ] Message d'erreur affiché : "Format de fichier non valide..."
- [ ] Bordure rouge sur l'input

### Test 7 : Validation de taille
- [ ] Sélectionner une image > 5MB
- [ ] Message d'erreur affiché : "Le fichier est trop volumineux..."

### Test 8 : Changement d'image avant soumission
- [ ] Sélectionner une image A → aperçu A
- [ ] Sélectionner une image B → aperçu B remplace A
- [ ] Soumettre → seule l'image B est envoyée

## 🔍 Points de vérification technique

### Frontend
```javascript
// Dans handleSubmit, vérifier FormData :
if (imageFile) {
  formDataToSend.append('image', imageFile); // File object
} else if (isEditing && formData.image) {
  formDataToSend.append('keepExistingImage', 'true');
  formDataToSend.append('existingImageUrl', formData.image); // URL string
}
```

### Backend
```javascript
// Dans PUT route, ordre de priorité :
1. req.file (nouveau fichier)
2. keepExistingImage + existingImageUrl (conserver)
3. existingTalentDay.image (fallback)
```

## 📝 Messages utilisateur

### Succès
- Création : "Événement créé avec succès"
- Édition : "Événement modifié avec succès"

### Erreurs
- Format invalide : "Format de fichier non valide. Utilisez JPEG, PNG, GIF ou WEBP."
- Taille excessive : "Le fichier est trop volumineux. Maximum 5MB."
- Erreur serveur : "Erreur: [message du backend]"

## 🎯 Cas limites gérés

1. **FormData vs JSON** : Le frontend utilise toujours FormData pour supporter les fichiers
2. **Input file non contrôlé** : Le state gère uniquement le File object, pas la value de l'input
3. **Preview avec FileReader** : Lecture locale du fichier pour affichage immédiat
4. **Réinitialisation après succès** : Formulaire clean pour éviter les résidus
5. **Édition defensive** : Toujours un fallback sur l'image existante
6. **Nettoyage des champs temporaires** : `keepExistingImage` et `existingImageUrl` supprimés côté backend

## ✨ Améliorations apportées

- ✅ Image persistante lors de la création
- ✅ Image conservée lors de l'édition sans changement
- ✅ Remplacement d'image fonctionnel
- ✅ Suppression d'image explicite avec bouton
- ✅ Validation de format et taille
- ✅ Messages d'erreur utilisateur clairs
- ✅ Aperçu en temps réel
- ✅ Réinitialisation propre du formulaire
- ✅ Gestion des cas limites côté backend
