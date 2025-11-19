# Variables d'environnement pour Render.com

## Variables Obligatoires

### Base de données
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
- **Description**: Chaîne de connexion MongoDB Atlas
- **Exemple**: `mongodb+srv://talentproof:MySecurePass123@cluster0.abc123.mongodb.net/talentproof?retryWrites=true&w=majority`
- **Où l'obtenir**: MongoDB Atlas → Database → Connect → Connect your application
- **Vérification**: Doit commencer par `mongodb+srv://` ou `mongodb://`

### Sécurité
```env
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_32_caracteres
```
- **Description**: Secret pour signer les tokens JWT
- **Exemple**: `MyV3ryS3cur3JWT$ecretK3y2024!@#$%^&*()`
- **Génération**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Important**: JAMAIS commiter dans Git, doit être unique par environnement

### URLs et CORS
```env
CLIENT_URL=https://votre-frontend.onrender.com
```
- **Description**: URL complète de votre frontend (pour emails et CORS)
- **Exemple**: `https://talentproof-frontend.onrender.com`
- **Important**: Sans slash final `/`

```env
ALLOWED_ORIGINS=https://votre-frontend.onrender.com,https://autre-domaine.com
```
- **Description**: Liste des origines autorisées pour CORS (séparées par virgules)
- **Exemple**: `https://talentproof-frontend.onrender.com,https://www.talentproof.com`
- **Important**: Pas d'espaces entre les URLs

### Email (Infomaniak SMTP)
```env
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=2525
EMAIL_USER=noreply@talentproof.com
EMAIL_PASS=votre_mot_de_passe_email
```
- **Description**: Configuration SMTP pour envoi d'emails
- **Port 2525**: Obligatoire sur Render (587 est bloqué)
- **EMAIL_USER**: Votre adresse email complète
- **EMAIL_PASS**: Mot de passe de l'adresse email

```env
ADMIN_EMAIL=admin@talentproof.com
CONTACT_EMAIL=info@princeaman.dev
```
- **Description**: Emails de contact pour notifications
- **ADMIN_EMAIL**: Reçoit les notifications d'inscriptions entreprises
- **CONTACT_EMAIL**: Affiché dans les emails envoyés

## Variables Optionnelles

### Environnement
```env
NODE_ENV=production
```
- **Description**: Environnement d'exécution
- **Valeurs**: `development`, `production`, `test`
- **Par défaut**: `development`
- **Impact**: Active les optimisations, logs, HSTS, etc.

### Serveur
```env
PORT=5000
```
- **Description**: Port d'écoute du serveur
- **Par défaut**: `5000`
- **Important**: Render définit automatiquement le port, cette variable est optionnelle

### Performance MongoDB
```env
MONGO_TIMEOUT=30000
```
- **Description**: Timeout de connexion MongoDB en millisecondes
- **Par défaut**: `30000` (30 secondes)
- **Augmenter si**: Connexions lentes ou timeouts fréquents

### Redis (optionnel - pour rate limiting avancé)
```env
REDIS_URL=redis://user:password@host:port
```
- **Description**: URL de connexion Redis pour rate limiting distribué
- **Optionnel**: Le serveur fonctionne sans Redis (utilise la mémoire)
- **Exemple**: `redis://default:mypassword@redis-123.upstash.io:6379`

### Limites de requêtes
```env
REQUEST_BODY_LIMIT=10mb
```
- **Description**: Taille maximale des requêtes JSON
- **Par défaut**: `10mb`
- **Augmenter si**: Upload de gros fichiers

### Logs
```env
LOG_LEVEL=info
```
- **Description**: Niveau de logs
- **Valeurs**: `error`, `warn`, `info`, `debug`
- **Par défaut**: `info`
- **Production**: Utiliser `warn` ou `error` pour réduire les logs

## Configuration Render.com

### Étape 1: Accéder aux variables d'environnement
1. Allez sur [dashboard.render.com](https://dashboard.render.com)
2. Sélectionnez votre service backend
3. Cliquez sur **Environment** dans le menu latéral

### Étape 2: Ajouter les variables
Pour chaque variable:
1. Cliquez sur **Add Environment Variable**
2. **Key**: Nom exact de la variable (ex: `MONGODB_URI`)
3. **Value**: Valeur de la variable
4. Cliquez sur **Save Changes**

### Étape 3: Redéployer
- Render redémarre automatiquement après modification des variables
- Vérifiez les logs pour confirmer le démarrage

## Vérification de la configuration

### Checklist avant déploiement
- [ ] `MONGODB_URI` - Connexion testée sur MongoDB Atlas
- [ ] `JWT_SECRET` - Généré de manière sécurisée (minimum 32 caractères)
- [ ] `CLIENT_URL` - URL correcte du frontend (sans `/` final)
- [ ] `ALLOWED_ORIGINS` - Contient l'URL du frontend
- [ ] `EMAIL_HOST` - mail.infomaniak.com
- [ ] `EMAIL_PORT` - 2525 (PAS 587)
- [ ] `EMAIL_USER` - Adresse email complète
- [ ] `EMAIL_PASS` - Mot de passe correct
- [ ] `NODE_ENV` - production

### Test de connexion MongoDB
Vérifiez les logs Render après démarrage:
```
[MONGODB] Attempting to connect...
[MONGODB] Connected successfully
```

Si erreur:
```
[MONGODB] Connection FAILED: { message: '...', code: '...' }
```
→ Vérifiez `MONGODB_URI` et la whitelist IP sur MongoDB Atlas

### Test CORS
Erreur fréquente:
```
CORS blocked origin: https://...
```
→ Vérifiez que `ALLOWED_ORIGINS` contient l'URL du frontend

### Test Email
Erreur fréquente:
```
Error: connect ETIMEDOUT
```
→ Vérifiez `EMAIL_PORT=2525` (PAS 587)

## Logs de débogage

### Vérifier les variables au démarrage
Render affiche dans les logs:
```
[SERVER] Environment: production
[MONGODB] URI: Set (hidden for security)
[CORS] allowedOrigins: ['https://...']
[EMAIL] Configuration: { host: 'mail.infomaniak.com', port: 2525, ... }
```

### Logs d'inscription entreprise
```
[COMPANY REGISTRATION] Starting registration process
[COMPANY REGISTRATION] Validation passed
[COMPANY REGISTRATION] Email check passed
[COMPANY REGISTRATION] Company created successfully. ID: ...
[COMPANY REGISTRATION] Confirmation email sent successfully
```

### En cas d'erreur
```
[COMPANY REGISTRATION] CRITICAL ERROR: { message: '...', code: '...' }
[MONGODB] DATABASE CONNECTION ERROR - Check MongoDB URI and network
```

## Sécurité

### Secrets à JAMAIS commiter
- ❌ `JWT_SECRET`
- ❌ `MONGODB_URI` (contient username/password)
- ❌ `EMAIL_PASS`
- ❌ `REDIS_URL` (si utilisé)

### Rotation des secrets
Changez régulièrement:
- `JWT_SECRET` (tous les 6 mois minimum)
- `EMAIL_PASS` (si compromis)
- MongoDB password (via Atlas)

### Whitelist IP MongoDB Atlas
Pour Render.com:
1. MongoDB Atlas → Network Access
2. Ajouter `0.0.0.0/0` (toutes les IPs)
3. ⚠️ Ou ajouter les IPs Render spécifiques si disponibles

## Support

### Ressources
- [Documentation Render](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Infomaniak Email](https://www.infomaniak.com/fr/support/faq)

### Contact
- Email: info@princeaman.dev
- GitHub: [Princeaman007/talentProof](https://github.com/Princeaman007/talentProof)

## Exemple complet de configuration

```env
# Base de données
MONGODB_URI=mongodb+srv://talentproof:MyPass123@cluster0.abc123.mongodb.net/talentproof?retryWrites=true&w=majority

# Sécurité
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0

# URLs
CLIENT_URL=https://talentproof-frontend.onrender.com
ALLOWED_ORIGINS=https://talentproof-frontend.onrender.com

# Email
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=2525
EMAIL_USER=noreply@talentproof.com
EMAIL_PASS=MyEmailPassword123
ADMIN_EMAIL=admin@talentproof.com
CONTACT_EMAIL=info@princeaman.dev

# Environnement
NODE_ENV=production
PORT=5000
```

---

**Dernière mise à jour**: 20 novembre 2025
**Version**: 1.0
