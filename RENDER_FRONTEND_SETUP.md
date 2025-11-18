# Configuration Frontend pour Render Dashboard

## Créer le service Static Site

1. **Dashboard Render** → **New** → **Static Site**

2. **Repository**: Sélectionner `talentProof`

3. **Configuration**:
   ```
   Name: talentproof-client
   Branch: master
   Root Directory: client
   Build Command: bash build.sh
   Publish Directory: dist
   ```

4. **Environment Variables**:
   ```
   VITE_API_URL=https://talentproof.onrender.com/api
   VITE_SERVER_URL=https://talentproof.onrender.com
   ```

5. **Advanced Settings** (optionnel):
   - Auto-Deploy: Yes
   - Region: Frankfurt (même que le backend)

## Vérification Post-Déploiement

- ✅ Build réussi sans erreurs
- ✅ URL accessible: `https://talentproof-client.onrender.com`
- ✅ Routes fonctionnent (pas de 404 sur /login, /dashboard)
- ✅ Appels API vers le backend fonctionnent

## Debugging

Si le build échoue avec "dist does not exist":
1. Vérifier que `Build Command` est bien `bash build.sh`
2. Vérifier les logs pour voir si `npm run build` s'exécute
3. S'assurer que `Root Directory` est `client` (pas vide)

Si 404 sur les routes:
1. Vérifier que `_redirects` est dans le dossier dist
2. Logs du build doivent montrer: `🔄 Copying SPA redirect rules...`
