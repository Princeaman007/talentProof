# Configuration Backend - Variables d'Environnement Render

## Variables d'environnement REQUISES sur Render Dashboard

**Aller sur:** Dashboard Render → `talentproof-backend` → **Settings** → **Environment**

### 🔴 CRITIQUES (L'app ne démarre pas sans elles):

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talentproof?retryWrites=true&w=majority

# JWT Secret (générer avec: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters

# Node Environment
NODE_ENV=production
```

### 🟡 IMPORTANTES (CORS et Frontend):

```bash
# CORS - Autoriser le frontend
ALLOWED_ORIGINS=https://talentproof-client.onrender.com

# URL du frontend (pour les emails avec liens)
CLIENT_URL=https://talentproof-client.onrender.com
```

### 🟢 OPTIONNELLES (Email, Redis):

```bash
# Email (pour confirmation compte, reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
EMAIL_FROM=TalentProof <noreply@talentproof.com>

# Redis (pour rate limiting en cluster - optionnel)
REDIS_URL=redis://default:password@host:port
```

### 🔵 AVANCÉES (Token, Session):

```bash
# JWT Token expiration
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE_MS=604800000

# Session
SESSION_SECRET=your-session-secret-key
```

## Vérification de la configuration

### 1. Vérifier que MongoDB est connecté

Logs backend doivent afficher:
```
✅ MongoDB connecté avec succès
🚀 Serveur démarré sur le port 10000
```

Si vous voyez:
```
❌ Erreur connexion MongoDB
```
→ Vérifier `MONGODB_URI` (username, password, cluster name)

### 2. Vérifier les CORS

Logs backend doivent afficher:
```
🌍 CORS allowedOrigins: [ 'https://talentproof-client.onrender.com' ]
```

Si vous voyez des erreurs CORS dans le frontend:
```
❌ CORS blocked origin: https://talentproof-client.onrender.com
```
→ Ajouter `ALLOWED_ORIGINS` ou vérifier `NODE_ENV=production`

### 3. Tester le backend

**Health Check:**
```bash
curl https://talentproof.onrender.com/api/health
```

Devrait retourner:
```json
{
  "status": "OK",
  "timestamp": "2025-11-18T...",
  "uptime": 123.456,
  "mongodb": "connected"
}
```

**CSRF Token:**
```bash
curl https://talentproof.onrender.com/api/csrf-token
```

Devrait retourner:
```json
{
  "csrfToken": "..."
}
```

## Troubleshooting

### Erreur: "Cannot find module"
- Relancer un deploy: Dashboard → Manual Deploy

### Erreur: "MongoServerError: bad auth"
- Vérifier `MONGODB_URI`: username et password corrects
- Vérifier MongoDB Atlas: IP whitelist (0.0.0.0/0 pour autoriser Render)

### Erreur: "CORS blocked"
- Vérifier `ALLOWED_ORIGINS` contient l'URL du frontend
- Vérifier `NODE_ENV=production` (active la logique CORS pour *.onrender.com)

### Les emails ne sont pas envoyés
- Vérifier toutes les variables `EMAIL_*`
- Gmail: Utiliser un "App Password" (pas le mot de passe du compte)
- Activer "Less secure app access" (Gmail) ou utiliser OAuth2

### Rate limiting trop strict (429 errors)
- En développement: Le code utilise déjà 100 tentatives
- En production: Rate limiter à 5 tentatives (normal)
- Pour tester: Ajouter `RATE_LIMIT_MAX=100` temporairement
