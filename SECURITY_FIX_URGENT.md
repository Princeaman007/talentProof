# 🚨 GUIDE DE SÉCURITÉ URGENT - SECRETS EXPOSÉS

## 🔴 SECRETS COMPROMIS IDENTIFIÉS

### ✅ Confirmé exposé publiquement sur GitHub :
- **EMAIL_PASS** : `***MOT_DE_PASSE_SUPPRIME***` (dans 4 fichiers .md)
  - SOLUTION_INFOMANIAK_RENDER.md
  - GUIDE_EMAILS_PROFESSIONNELS.md
  - PROBLEME_EMAIL_RENDER.md
  - RECAP_EMAILS_TRANSFORMATION.md

### ⚠️ Potentiellement exposés (à vérifier) :
- MONGODB_URI (avec mot de passe MongoDB Atlas)
- JWT_SECRET
- Autres credentials

---

## ⚡ PHASE 1 : ACTIONS IMMÉDIATES (15 MINUTES)

### Étape 1.1 : Changer le mot de passe email Infomaniak (MAINTENANT)

1. Connectez-vous sur **https://manager.infomaniak.com**
2. Allez dans **Email & Collaboration** → Votre domaine
3. Trouvez le compte `info@princeaman.dev`
4. **Changer le mot de passe** → Générez un mot de passe fort
5. Notez le nouveau mot de passe dans un gestionnaire sécurisé (1Password, Bitwarden, etc.)

**Nouveau mot de passe recommandé** : Utilisez un générateur pour créer quelque chose comme :
```
xK9#mP2@vL5$wN8^qR3&tY7*uJ4!
```

### Étape 1.2 : Mettre à jour le mot de passe sur Render

1. **Render Dashboard** → Votre service backend
2. **Environment** → Trouvez `EMAIL_PASS`
3. Remplacez par le **nouveau mot de passe**
4. **Save Changes** (redéploiement automatique)

### Étape 1.3 : Mettre à jour localement

Modifiez votre fichier `.env` local :
```env
EMAIL_PASS=VOTRE_NOUVEAU_MOT_DE_PASSE_ICI
```

**⚠️ NE COMMITEZ JAMAIS CE FICHIER !**

---

## 🧹 PHASE 2 : NETTOYAGE DES FICHIERS COMPROMIS (10 MINUTES)

### Étape 2.1 : Supprimer le mot de passe des fichiers markdown

Remplacez `***MOT_DE_PASSE_SUPPRIME***` par `***CENSURÉ***` dans tous les fichiers :

```powershell
# PowerShell - Exécutez depuis C:\Users\princ\talentproof
(Get-Content SOLUTION_INFOMANIAK_RENDER.md) -replace '***MOT_DE_PASSE_SUPPRIME***','***CENSURÉ***' | Set-Content SOLUTION_INFOMANIAK_RENDER.md
(Get-Content GUIDE_EMAILS_PROFESSIONNELS.md) -replace '***MOT_DE_PASSE_SUPPRIME***','***CENSURÉ***' | Set-Content GUIDE_EMAILS_PROFESSIONNELS.md
(Get-Content PROBLEME_EMAIL_RENDER.md) -replace '***MOT_DE_PASSE_SUPPRIME***','***CENSURÉ***' | Set-Content PROBLEME_EMAIL_RENDER.md
(Get-Content RECAP_EMAILS_TRANSFORMATION.md) -replace '***MOT_DE_PASSE_SUPPRIME***','***CENSURÉ***' | Set-Content RECAP_EMAILS_TRANSFORMATION.md
```

### Étape 2.2 : Commit et push immédiat

```powershell
git add SOLUTION_INFOMANIAK_RENDER.md GUIDE_EMAILS_PROFESSIONNELS.md PROBLEME_EMAIL_RENDER.md RECAP_EMAILS_TRANSFORMATION.md
git commit -m "Security: Remove exposed email password from documentation"
git push
```

---

## 🔒 PHASE 3 : NETTOYAGE DE L'HISTORIQUE GIT (15 MINUTES)

**IMPORTANT** : Même après suppression, le mot de passe reste dans l'historique Git !

### Option A : BFG Repo-Cleaner (RECOMMANDÉ - Simple)

#### Installation :
```powershell
# Télécharger BFG
# https://rtyley.github.io/bfg-repo-cleaner/
# Ou avec Chocolatey :
choco install bfg-repo-cleaner
```

#### Utilisation :
```powershell
# 1. Clone un mirror du repo
cd C:\Users\princ
git clone --mirror https://github.com/Princeaman007/talentProof.git talentProof-mirror
cd talentProof-mirror

# 2. Créer un fichier avec les secrets à supprimer
echo "***MOT_DE_PASSE_SUPPRIME***" > ../secrets.txt

# 3. Lancer BFG pour supprimer le secret
bfg --replace-text ../secrets.txt

# 4. Nettoyer et forcer le push
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push (⚠️ ATTENTION : écrase l'historique distant)
git push --force
```

### Option B : git-filter-repo (Alternative)

```powershell
# Installation
pip install git-filter-repo

# Utilisation
cd C:\Users\princ\talentproof
git filter-repo --replace-text <(echo '***MOT_DE_PASSE_SUPPRIME***==>***CENSURÉ***')

# Force push
git push --force --all
```

### ⚠️ APRÈS LE FORCE PUSH

**Si vous avez des collaborateurs** :
```
Tous les collaborateurs doivent supprimer leur copie locale et re-cloner :

git clone https://github.com/Princeaman007/talentProof.git
```

---

## 🛡️ PHASE 4 : SÉCURISER DÉFINITIVEMENT (10 MINUTES)

### Étape 4.1 : Créer .gitignore racine

Créez `C:\Users\princ\talentproof\.gitignore` :

```gitignore
# ========================
# SECRETS & CREDENTIALS
# ========================
.env
.env.*
!.env.example
*.pem
*.key
*.p12
*.pfx
secrets.txt

# ========================
# NODE
# ========================
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# ========================
# LOGS
# ========================
logs/
*.log

# ========================
# UPLOADS
# ========================
uploads/
!uploads/.gitkeep

# ========================
# OS
# ========================
.DS_Store
Thumbs.db
desktop.ini

# ========================
# IDE
# ========================
.vscode/
.idea/
*.swp
*.swo
*~

# ========================
# BUILD
# ========================
dist/
build/
.cache/
```

### Étape 4.2 : Créer .env.example

Créez `C:\Users\princ\talentproof\backend\.env.example` :

```env
# ========================
# MONGODB
# ========================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# ========================
# JWT
# ========================
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
JWT_EXPIRE=24h
JWT_RESET_EXPIRE=1h

# ========================
# EMAIL (INFOMANIAK)
# ========================
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=2525
EMAIL_USER=your_email@yourdomain.com
EMAIL_PASS=your_email_password_here
EMAIL_FROM="Your App <your_email@yourdomain.com>"
SKIP_EMAILS=false

# ========================
# SERVER
# ========================
PORT=5000
NODE_ENV=development

# ========================
# ADMIN
# ========================
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password_here

# ========================
# CLIENT
# ========================
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

### Étape 4.3 : Vérifier .gitignore fonctionne

```powershell
# Vérifier que .env est ignoré
git check-ignore backend/.env
# Devrait afficher : backend/.env

# Lister tous les fichiers ignorés
git status --ignored
```

### Étape 4.4 : Scanner le repo pour d'autres secrets

```powershell
# Installer truffleHog (Python requis)
pip install truffleHog

# Scanner le repo
trufflehog filesystem C:\Users\princ\talentproof --only-verified
```

---

## ✅ PHASE 5 : VÉRIFICATION AUTRES SECRETS

### Vérifier MongoDB

1. Connectez-vous sur **https://cloud.mongodb.com**
2. **Database Access** → Vérifiez votre utilisateur DB
3. Si le mot de passe est dans un commit → **Changez-le immédiatement**
4. Mettez à jour `MONGODB_URI` dans `.env` local et Render

### Vérifier JWT_SECRET

1. Générez un nouveau secret JWT :
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. Mettez à jour :
   - `.env` local
   - Variables d'environnement Render

**⚠️ ATTENTION** : Changer JWT_SECRET déconnectera tous les utilisateurs !

---

## 📊 CHECKLIST FINALE

### Secrets révoqués et changés :
- [ ] Mot de passe email Infomaniak changé
- [ ] Nouveau mot de passe mis à jour sur Render
- [ ] Nouveau mot de passe mis à jour dans `.env` local
- [ ] Mot de passe MongoDB changé (si exposé)
- [ ] JWT_SECRET regénéré (si exposé)

### Nettoyage Git :
- [ ] Secrets supprimés des fichiers markdown
- [ ] Commit de nettoyage poussé
- [ ] Historique Git nettoyé avec BFG/git-filter-repo
- [ ] Force push effectué
- [ ] Collaborateurs avertis de re-cloner

### Sécurisation :
- [ ] `.gitignore` racine créé et complet
- [ ] `.env.example` créé
- [ ] `.env` vérifié comme ignoré
- [ ] Scanner de secrets exécuté (truffleHog)
- [ ] Aucun secret trouvé dans le code

### Tests :
- [ ] Application fonctionne avec nouveaux credentials
- [ ] Emails s'envoient correctement
- [ ] Authentification JWT fonctionne
- [ ] MongoDB connecté

---

## 🚀 BONNES PRATIQUES POUR L'AVENIR

### 1. Utilisez un gestionnaire de secrets

- **1Password** / **Bitwarden** pour stocker les passwords
- **Doppler** / **HashiCorp Vault** pour les secrets d'équipe

### 2. Ne commitez JAMAIS de secrets

- Toujours utiliser `.env` pour les secrets
- Double-check avant chaque `git add`
- Utilisez `git add -p` pour revoir chaque changement

### 3. Activez la détection de secrets

```powershell
# Installer git-secrets
git secrets --install

# Ajouter des patterns
git secrets --register-aws
git secrets --add 'password\s*=\s*.+'
git secrets --add '[A-Za-z0-9+/=]{40,}'
```

### 4. Utilisez GitHub Secret Scanning

1. GitHub Repository → **Settings** → **Security** → **Code security**
2. Activez **Secret scanning alerts**

### 5. Rotation régulière des secrets

- MongoDB password : tous les 3 mois
- JWT_SECRET : tous les 6 mois
- Email passwords : tous les 3 mois
- API keys : tous les 6 mois

---

## 🆘 SI VOUS AVEZ BESOIN D'AIDE

1. **GitHub Support** : https://support.github.com
2. **MongoDB Support** : https://support.mongodb.com
3. **Render Support** : support@render.com

---

## 📚 RESSOURCES

- BFG Repo-Cleaner : https://rtyley.github.io/bfg-repo-cleaner/
- git-filter-repo : https://github.com/newren/git-filter-repo
- truffleHog : https://github.com/trufflesecurity/trufflehog
- git-secrets : https://github.com/awslabs/git-secrets

---

**Temps estimé total : 45-60 minutes**

**⚠️ COMMENCEZ PAR PHASE 1 IMMÉDIATEMENT !**
