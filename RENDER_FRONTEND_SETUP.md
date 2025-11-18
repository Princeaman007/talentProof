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
   
   ⚠️ **IMPORTANT**: Le script `build.sh` nettoie automatiquement le cache npm pour éviter le bug Rollup.
   
   **Alternative Build Command** (si build.sh ne fonctionne pas):
   ```
   rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build && cp public/_redirects dist/_redirects
   ```

   ⚠️ **IMPORTANT**: 
   - `Root Directory` doit être exactement `client` (sans `./` ni `/`)
   - `Publish Directory` doit être exactement `dist` (PAS `./dist` ni `client/dist`)
   - Le chemin est relatif au Root Directory
   - Le `rm -rf` au début nettoie le cache pour éviter les bugs npm/rollup

4. **Environment Variables** (⚠️ CRITIQUE):
   
   **Aller dans Settings → Environment → Add Environment Variable**
   
   Ajouter ces deux variables **EXACTEMENT**:
   ```
   Key: VITE_API_URL
   Value: https://talentproof.onrender.com/api
   
   Key: VITE_SERVER_URL
   Value: https://talentproof.onrender.com
   ```
   
   ⚠️ **IMPORTANT**: 
   - Les variables DOIVENT commencer par `VITE_` pour être accessibles dans le code
   - Pas d'espace avant ou après les URLs
   - Pas de `/` à la fin de `VITE_SERVER_URL`
   - Un `/api` à la fin de `VITE_API_URL`
   - **Sauvegarder et redéployer après avoir ajouté les variables**

5. **Advanced Settings** (optionnel):
   - Auto-Deploy: Yes
   - Region: Frankfurt (même que le backend)

## Vérification Post-Déploiement

### Étape 1: Vérifier le build
- ✅ Build réussi sans erreurs
- ✅ URL accessible: `https://talentproof-client.onrender.com`
- ✅ **CRITIQUE**: Vérifier dans les logs de build que `_redirects` est copié
  ```
  🔄 Copying SPA redirect rules...
  ```

### Étape 2: Vérifier la configuration API
Aller sur: `https://talentproof-client.onrender.com/config-check.html`

Ce fichier teste:
- ✅ Backend Health Check
- ✅ CORS configuration
- ✅ Routes publiques fonctionnent

Si tous les tests passent ✅, la configuration est correcte.

### Étape 3: Vérifier les routes
- ✅ `/login` - Page de connexion s'affiche
- ✅ `/dashboard` - Pas de 404 (mais redirige vers login si non connecté)
- ✅ Console browser sans erreurs CORS

### Étape 4: Tester la connexion
1. Aller sur `/login`
2. Entrer des identifiants valides
3. ✅ Devrait rediriger vers `/dashboard`
4. ✅ Dashboard affiche les données
5. ✅ Pas de boucle de redirection

### ⚠️ Si les routes ne fonctionnent toujours pas:

**Render Static Sites** ne supporte pas toujours `_redirects` comme Netlify. Si vous voyez toujours des 404:

1. **Vérifier le type de service**:
   - Dashboard Render → Votre service `talentproof-client`
   - Settings → Type doit être **"Static Site"** (pas "Web Service")

2. **Headers/Redirects Configuration** (Render Dashboard):
   - Si disponible, ajouter manuellement la règle de redirection:
   ```
   /* /index.html 200
   ```

3. **Alternative: Passer à Web Service** (si Static Site ne fonctionne pas):
   - Change Type: Web Service
   - Build Command: `bash build.sh`
   - Start Command: `npx serve -s dist -l 3000`
   - Ajouter variable d'environnement: `NODE_ENV=production`
   - Note: Cela consommera plus de ressources mais garantit le routing

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
