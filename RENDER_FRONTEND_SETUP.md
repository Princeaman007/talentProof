# Configuration Frontend pour Render Dashboard

## Créer le service Static Site

1. **Dashboard Render** → **New** → **Static Site**

2. **Repository**: Sélectionner `talentProof`

3. **Configuration**:
   ```
   Name: talentproof-client
   Branch: master
   Root Directory: client
   Build Command: npm install --legacy-peer-deps && npm run build
   Publish Directory: dist
   Auto-Deploy: Yes
   ```

   ⚠️ **IMPORTANT**: 
   - `Root Directory` doit être exactement `client` (sans `./` ni `/`)
   - `Publish Directory` doit être exactement `dist` (PAS `./dist` ni `client/dist`)
   - Le chemin est relatif au Root Directory

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

**Causes possibles:**

1. ⚠️ **Root Directory mal configuré**
   - Vérifier: Doit être `client` (sans slash, sans point)
   - PAS `./client`, PAS `/client`, PAS vide

2. ⚠️ **Publish Directory mal configuré**
   - Vérifier: Doit être `dist`
   - PAS `./dist`, PAS `client/dist`, PAS `/dist`

3. ⚠️ **Build Command**
   - Recommandé: `npm install --legacy-peer-deps && npm run build`
   - Alternative: `bash build.sh` (si bash disponible)

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

Si 404 sur les routes:
1. Vérifier que `_redirects` est dans le dossier dist
2. Logs du build doivent montrer: `🔄 Copying SPA redirect rules...`
