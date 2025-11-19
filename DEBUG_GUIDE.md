# Guide de Débogage - Inscription Entreprise en Production

## Problème: "Erreur de connexion" lors de l'inscription

### Étape 1: Vérifier les logs Render

1. Accédez à [dashboard.render.com](https://dashboard.render.com)
2. Sélectionnez votre service backend
3. Cliquez sur **Logs** dans le menu
4. Recherchez les messages suivants:

#### ✅ Démarrage réussi
```
[MONGODB] Attempting to connect...
[MONGODB] Connected successfully
[MONGODB] host: cluster0.abc123.mongodb.net
Serveur TalentProof démarré
http://localhost:5000
```

#### ❌ Erreur de connexion MongoDB
```
[MONGODB] Connection FAILED: { message: 'connect ETIMEDOUT' }
```
**Solution**: Vérifiez `MONGODB_URI` et la whitelist IP MongoDB Atlas

#### ❌ Variable manquante
```
ERREUR: Variables d'environnement manquantes: MONGODB_URI
```
**Solution**: Ajoutez la variable dans Render Environment

### Étape 2: Tester l'API Health

```bash
curl https://votre-backend.onrender.com/api/health
```

**Réponse attendue**:
```json
{
  "status": "OK",
  "timestamp": "2025-11-20T...",
  "environment": "production",
  "database": "Connected"
}
```

**Si database: "Disconnected"**:
- Problème MongoDB → Vérifiez MONGODB_URI
- Vérifiez la whitelist IP sur MongoDB Atlas

### Étape 3: Tester l'inscription depuis le frontend

Ouvrez la console développeur (F12) et tentez une inscription.

#### ✅ Inscription réussie
```
[COMPANY REGISTRATION] Submitting form...
[COMPANY REGISTRATION] Response: { success: true, ... }
[COMPANY REGISTRATION] Registration successful!
```

#### ❌ Erreur réseau (pas de réponse)
```
[COMPANY REGISTRATION] Network error - no response
```
**Causes possibles**:
- Backend down → Vérifiez les logs Render
- CORS bloqué → Vérifiez `ALLOWED_ORIGINS`
- URL backend incorrecte dans le frontend

#### ❌ Erreur 400 (validation)
```
[COMPANY REGISTRATION] Server error: { status: 400, data: { errors: [...] } }
```
**Solution**: Vérifiez les données du formulaire

#### ❌ Erreur 503 (service indisponible)
```
[COMPANY REGISTRATION] Server error: { status: 503 }
```
**Cause**: Connexion MongoDB échouée
**Solution**: Redémarrez le service Render après correction des variables

### Étape 4: Vérifier les logs backend détaillés

Dans les logs Render, recherchez:

```
[COMPANY REGISTRATION] Starting registration process
[COMPANY REGISTRATION] Request body: { "companyName": "...", ... }
[COMPANY REGISTRATION] Validation passed
[COMPANY REGISTRATION] Email check passed
[COMPANY REGISTRATION] Company created successfully. ID: 67...
[COMPANY REGISTRATION] TalentDays populated. Count: 2
[COMPANY REGISTRATION] Confirmation email sent successfully
[COMPANY REGISTRATION] Admin notification email sent successfully
[COMPANY REGISTRATION] Registration process completed successfully
```

#### Si bloqué à "Validation passed":
→ Problème de connexion MongoDB

#### Si erreur à "Email check passed":
```
[COMPANY REGISTRATION] CRITICAL ERROR: { name: 'MongoNetworkError' }
[MONGODB] DATABASE CONNECTION ERROR
```
→ MongoDB URI invalide ou réseau bloqué

#### Si erreur à "Confirmation email":
```
[COMPANY REGISTRATION] Error sending confirmation email: connect ETIMEDOUT
```
→ Configuration email incorrecte (vérifiez EMAIL_PORT=2525)

## Checklist de diagnostic rapide

### Variables d'environnement Render
- [ ] `MONGODB_URI` existe et est correcte
- [ ] `JWT_SECRET` existe (minimum 32 caractères)
- [ ] `CLIENT_URL` = URL frontend (sans `/`)
- [ ] `ALLOWED_ORIGINS` contient URL frontend
- [ ] `EMAIL_HOST` = mail.infomaniak.com
- [ ] `EMAIL_PORT` = 2525 (PAS 587)
- [ ] `EMAIL_USER` = adresse email complète
- [ ] `EMAIL_PASS` = mot de passe email
- [ ] `NODE_ENV` = production

### MongoDB Atlas
- [ ] Whitelist IP: `0.0.0.0/0` activée
- [ ] Utilisateur DB a les droits "readWrite"
- [ ] Cluster accessible (pas en pause)
- [ ] URI copiée depuis "Connect" → "Connect your application"

### Frontend
- [ ] URL de l'API backend correcte dans `api.js`
- [ ] Console affiche les logs `[COMPANY REGISTRATION]`
- [ ] Pas d'erreur CORS dans la console

## Solutions aux erreurs courantes

### "Impossible de contacter le serveur"
**Frontend ne peut pas joindre le backend**

1. Vérifiez l'URL de l'API dans `client/src/utils/api.js`:
```javascript
const API_URL = 'https://votre-backend.onrender.com/api';
```

2. Testez manuellement:
```bash
curl https://votre-backend.onrender.com/api/health
```

3. Vérifiez CORS dans les logs:
```
CORS blocked origin: https://...
```
→ Ajoutez l'origine dans `ALLOWED_ORIGINS`

### "Service temporairement indisponible"
**Backend ne peut pas se connecter à MongoDB**

1. Vérifiez `MONGODB_URI` dans Render Environment
2. Testez la connexion MongoDB:
   - MongoDB Atlas → Database → Connect → Test Connection
3. Vérifiez la whitelist IP:
   - MongoDB Atlas → Network Access → Add IP Address → `0.0.0.0/0`
4. Redémarrez le service Render:
   - Manual Deploy → Deploy latest commit

### "Cette entreprise est déjà inscrite"
**Email déjà utilisé**

C'est normal si l'email existe déjà en base.
Pour tester avec un nouvel email:
- Utilisez un email différent
- Ou supprimez l'entrée existante dans MongoDB

### "Erreur serveur"
**Erreur 500 interne**

1. Consultez les logs Render pour le stack trace complet
2. Recherchez `[COMPANY REGISTRATION] CRITICAL ERROR:`
3. Vérifiez les variables d'environnement manquantes
4. Vérifiez la syntaxe du MONGODB_URI

## Tests manuels

### Test 1: Connexion MongoDB
```bash
# Dans les logs Render au démarrage
[MONGODB] Connected successfully
```

### Test 2: API Health
```bash
curl https://votre-backend.onrender.com/api/health
# Réponse: { "status": "OK", "database": "Connected" }
```

### Test 3: Inscription test
1. Ouvrez le formulaire d'inscription
2. Remplissez avec des données valides
3. Ouvrez la console (F12)
4. Cliquez sur "S'inscrire"
5. Vérifiez les logs dans la console

### Test 4: Email de confirmation
1. Après inscription réussie
2. Vérifiez la boîte email
3. Si pas reçu, vérifiez les logs:
```
[COMPANY REGISTRATION] Confirmation email sent successfully
```

## Monitoring en temps réel

### Commande pour suivre les logs
1. Dashboard Render → Service → Logs
2. Activez "Auto-scroll"
3. Tentez une inscription
4. Observez les messages `[COMPANY REGISTRATION]`

### Alertes à surveiller
- `[MONGODB] Disconnected` → Perte de connexion DB
- `CORS blocked` → Problème CORS
- `CRITICAL ERROR` → Erreur critique nécessitant action

## Support

### Si le problème persiste

1. **Collectez les informations**:
   - Logs Render complets (dernières 100 lignes)
   - Message d'erreur exact dans la console frontend
   - Variables d'environnement configurées (masquez les secrets)

2. **Vérifiez la documentation**:
   - `RENDER_ENV_VARIABLES.md` pour la config complète
   - Logs pour identifier l'étape qui échoue

3. **Points de contact**:
   - Email: info@princeaman.dev
   - GitHub Issues: [talentProof/issues](https://github.com/Princeaman007/talentProof/issues)

---

**Dernière mise à jour**: 20 novembre 2025
**Version**: 1.0
