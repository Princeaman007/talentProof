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
   Auto-Deploy: Yes
   ```
   
   **Alternative Build Command** (si build.sh ne fonctionne pas):
   ```
   rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build && cp public/_redirects dist/_redirects
   ```

   ⚠️ **IMPORTANT**: 
   - `Root Directory` doit être exactement `client` (sans `./` ni `/`)
   - `Publish Directory` doit être exactement `dist` (PAS `./dist` ni `client/dist`)
   - Le chemin est relatif au Root Directory
   - Le `rm -rf` au début nettoie le cache pour éviter les bugs npm/rollup

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
- ✅ **CRITIQUE**: Vérifier dans les logs de build que `_redirects` est copié
  ```
  🔄 Copying SPA redirect rules...
  ```
  Si cette ligne n'apparaît pas, le fichier _redirects n'est pas dans dist!

## Debugging

Si le build échoue avec "dist does not exist":

**Causes possibles:**

1. ⚠️ **Root Directory mal configuré**
   - Vérifier: Doit être `client` (sans slash, sans point)
   - PAS `./client`, PAS `/client`, PAS vide

2. ⚠️ **Publish Directory mal configuré**
   - Vérifier: Doit être `dist`
   - PAS `./dist`, PAS `client/dist`, PAS `/dist`

3. ⚠️ **Build Command**
   - Recommandé: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build`
   - Cette commande nettoie le cache pour éviter le bug Rollup sur Linux
   - Alternative (si problème persiste): `npm ci --legacy-peer-deps && npm run build`

4. **Vérification dans les logs:**
   ```
   ✓ built in X.XXs
   ```
   Si cette ligne apparaît, le build fonctionne. Le problème est la configuration du Publish Directory.

**Solution:**
- Aller dans **Settings** → **Build & Deploy**
- Root Directory: `client`
- Publish Directory: `dist`
- Sauvegarder et **Manual Deploy**

Si 404 ou "Not Found" après connexion:
1. **CAUSE**: Le fichier `_redirects` n'est PAS dans le dossier dist sur Render
2. **SYMPTÔME**: La connexion réussit, mais la redirection vers /dashboard affiche "Not Found"
3. **SOLUTION**:
   - Vérifier les logs de build pour confirmer que `_redirects` est copié
   - Chercher la ligne: `🔄 Copying SPA redirect rules...`
   - Si absente, utiliser la commande de build alternative avec `&& cp public/_redirects dist/_redirects`
   - Ou utiliser `bash build.sh` qui gère la copie automatiquement
4. **VÉRIFICATION**: 
   - Dans les logs Render, après le build, vous devriez voir:
     ```
     ✓ built in X.XXs
     🔄 Copying SPA redirect rules...
     ✅ Build completed successfully!
     ```
   - Le fichier `_redirects` DOIT être présent dans le dossier `dist/` publié

Si erreur "Cannot find module @rollup/rollup-linux-x64-gnu":
1. **C'est le bug npm décrit ci-dessus**
2. Solution: Mettre à jour Build Command avec `rm -rf` au début
3. Build Command: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build`
4. Trigger Manual Deploy
5. Le nettoyage du cache résout le problème des dépendances optionnelles Rollup
