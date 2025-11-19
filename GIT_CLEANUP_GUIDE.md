# 🛡️ Guide de Nettoyage Git (Si Nécessaire)

> **⚠️ IMPORTANT**: Après audit, votre projet est SÉCURISÉ. Ce guide est fourni pour référence future uniquement.

---

## 🔍 Quand Utiliser Ce Guide

Utilisez ce guide **UNIQUEMENT** si vous avez accidentellement commité :
- ❌ Un fichier `.env` avec de vraies valeurs
- ❌ Des clés API (Stripe, AWS, etc.)
- ❌ Des mots de passe ou tokens
- ❌ Des URLs avec credentials

**Status actuel**: ✅ Aucun secret trouvé dans votre historique Git

---

## 🧹 Option 1: BFG Repo-Cleaner (Recommandé)

### Installation
```bash
# Télécharger BFG
curl -L https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar -o bfg.jar

# Vérifier l'installation
java -jar bfg.jar --version
```

### Utilisation

#### 1. Créer une sauvegarde
```bash
cd /chemin/vers/talentproof
git clone --mirror https://github.com/Princeaman007/talentProof.git talentproof-backup.git
```

#### 2. Supprimer des fichiers spécifiques
```bash
# Supprimer un fichier de tout l'historique
java -jar bfg.jar --delete-files .env talentproof-backup.git
java -jar bfg.jar --delete-files .env.local talentproof-backup.git
java -jar bfg.jar --delete-files config.json talentproof-backup.git

# Supprimer un dossier entier
java -jar bfg.jar --delete-folders secrets talentproof-backup.git
```

#### 3. Nettoyer et valider
```bash
cd talentproof-backup.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Vérifier les changements
git log --all --oneline --graph
```

#### 4. Pousser les changements
```bash
# ⚠️ ATTENTION: Ceci réécrit l'historique
git push --force --all
git push --force --tags
```

---

## 🔧 Option 2: git filter-branch

### Supprimer un fichier spécifique

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local config/secrets.js" \
  --prune-empty --tag-name-filter cat -- --all
```

### Supprimer du texte spécifique

```bash
# Remplacer une clé API par REMOVED_KEY dans tout l'historique
git filter-branch --tree-filter \
  'find . -type f -exec sed -i "" "s/sk_live_abc123xyz/REMOVED_KEY/g" {} +' \
  --prune-empty --tag-name-filter cat -- --all
```

### Nettoyer après filter-branch

```bash
# Supprimer les références
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
git push origin --force --tags
```

---

## 🗑️ Option 3: git-filter-repo (Moderne)

### Installation
```bash
pip install git-filter-repo
```

### Utilisation

```bash
# Supprimer un fichier
git filter-repo --path .env --invert-paths

# Supprimer plusieurs fichiers
git filter-repo --path .env --path .env.local --invert-paths

# Supprimer un dossier
git filter-repo --path secrets/ --invert-paths

# Remplacer du texte
git filter-repo --replace-text <(echo "
sk_live_abc123xyz==>REMOVED_KEY
mongodb://user:pass@==>mongodb://REMOVED_USER:REMOVED_PASS@
")
```

---

## 📋 Checklist Post-Nettoyage

Après avoir nettoyé l'historique Git :

### 1. Vérifier le nettoyage
```bash
# Rechercher dans tout l'historique
git log -S "mot_de_passe" --all --source --full-history
git log -S "sk_live_" --all --source --full-history

# Vérifier qu'aucun fichier sensible n'existe
git log --all --full-history -- .env
```

### 2. Mettre à jour .gitignore
```bash
# Ajouter à .gitignore (si pas déjà présent)
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
echo "secrets/" >> .gitignore
echo "*.pem" >> .gitignore
echo "*.key" >> .gitignore

git add .gitignore
git commit -m "security: enhance .gitignore for secrets"
git push
```

### 3. Révoquer les secrets exposés

#### MongoDB
```bash
# 1. MongoDB Atlas → Database Access
# 2. Sélectionner l'utilisateur
# 3. "Edit" → "Reset Password"
# 4. Générer un nouveau mot de passe
# 5. Mettre à jour .env local et Render
```

#### JWT Secret
```bash
# Générer un nouveau secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Mettre à jour:
# - .env local
# - Render Environment Variables
# ⚠️ Ceci déconnectera tous les utilisateurs
```

#### Email Password
```bash
# Infomaniak ou votre fournisseur:
# 1. Connexion → Gestion des comptes
# 2. Changer le mot de passe
# 3. Mettre à jour .env et Render
```

#### API Keys (si applicable)
```bash
# Stripe
# 1. Dashboard Stripe → Developers → API Keys
# 2. "Roll key" pour générer de nouvelles clés
# 3. Mettre à jour configuration

# Autres services: Suivre leur procédure de révocation
```

### 4. Notifier les collaborateurs
```markdown
⚠️ IMPORTANT: Historique Git réécrit

L'historique du dépôt a été nettoyé pour des raisons de sécurité.

Actions requises:
1. Sauvegarder vos changements locaux non commités
2. Supprimer votre clone local: rm -rf talentproof
3. Recloner le dépôt: git clone https://github.com/...
4. Réappliquer vos changements si nécessaire

Les branches et tags ont été forcé-push.
```

### 5. Protéger GitHub
```bash
# Activer GitHub Secret Scanning
# 1. GitHub → Repository → Settings
# 2. Security → Code security and analysis
# 3. Enable "Secret scanning"
# 4. Enable "Push protection"
```

---

## 🚨 Commandes d'Urgence

### Annuler un commit qui vient d'être poussé

```bash
# Option 1: Revenir au commit précédent (si dernier commit)
git revert HEAD
git push

# Option 2: Force rewind (si pas encore partagé)
git reset --hard HEAD~1
git push --force
```

### Supprimer un fichier du dernier commit

```bash
# Retirer le fichier du commit mais le garder localement
git rm --cached .env
git commit --amend --no-edit
git push --force
```

### Vérifier qu'un secret n'est plus présent

```bash
# Recherche dans tout l'historique
git log --all --full-history --source -S "votre_secret"

# Recherche dans tous les fichiers historiques
git grep "votre_secret" $(git rev-list --all)
```

---

## 🛡️ Prévention Future

### Installer git-secrets

```bash
# Installation
brew install git-secrets  # macOS
# ou
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets && make install

# Configuration dans votre projet
cd /chemin/vers/talentproof
git secrets --install
git secrets --register-aws

# Règles personnalisées
git secrets --add 'mongodb\+srv://[^:]+:[^@]+@'
git secrets --add 'JWT_SECRET\s*=\s*[^\s]+'
git secrets --add 'EMAIL_PASS\s*=\s*[^\s]+'
git secrets --add 'sk_live_[0-9a-zA-Z]+'
git secrets --add 'sk_test_[0-9a-zA-Z]+'
```

### Pre-commit Hooks

Créer `.git/hooks/pre-commit` :

```bash
#!/bin/bash

# Vérifier les fichiers sensibles
if git diff --cached --name-only | grep -E '\.(env|pem|key|p12|pfx)$'; then
    echo "❌ ERREUR: Tentative de commit d'un fichier sensible"
    echo "Fichiers détectés:"
    git diff --cached --name-only | grep -E '\.(env|pem|key|p12|pfx)$'
    exit 1
fi

# Vérifier les patterns de secrets
if git diff --cached | grep -E '(mongodb\+srv://[^:]+:[^@]+@|sk_live_|JWT_SECRET\s*=)'; then
    echo "❌ ERREUR: Détection possible d'un secret"
    echo "Vérifiez votre commit pour les secrets exposés"
    exit 1
fi

exit 0
```

Rendre exécutable :
```bash
chmod +x .git/hooks/pre-commit
```

### GitHub Actions (CI/CD)

Créer `.github/workflows/security.yml` :

```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: TruffleHog Secret Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

---

## 📚 Ressources Externes

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [git-secrets](https://github.com/awslabs/git-secrets)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)

---

## ⚠️ Avertissements Importants

1. **Sauvegardez toujours** avant de réécrire l'historique
2. **Communiquez** avec votre équipe avant un force push
3. **Révoquezimmédiatement** tous les secrets exposés
4. **Testez** sur un clone de backup d'abord
5. **Vérifiez** que les secrets ne sont plus présents après nettoyage

---

**Note**: Ce guide est fourni pour référence. Votre projet actuel n'a **pas besoin** de nettoyage.
