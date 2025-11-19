# 🚀 SOLUTION COMPLÈTE : INFOMANIAK SMTP SUR RENDER

## ❌ PROBLÈME IDENTIFIÉ

Render bloque les ports SMTP standards (25, 465, 587) sur leur infrastructure gratuite/starter pour éviter le spam.

**Erreur typique :**
```
Error: Connection timeout
code: 'ETIMEDOUT'
command: 'CONN'
```

## ✅ SOLUTION : UTILISER LE PORT 2525 D'INFOMANIAK

Infomaniak propose **4 ports SMTP** :
- **Port 25** : Bloqué par la plupart des hébergeurs
- **Port 465** : SSL/TLS direct - Souvent bloqué par Render
- **Port 587** : STARTTLS - Bloqué par défaut sur Render Free/Starter
- **Port 2525** : ✅ **PORT ALTERNATIF - NON BLOQUÉ PAR RENDER**

### 📋 CONFIGURATION COMPLÈTE

#### 1. VARIABLES D'ENVIRONNEMENT RENDER

Sur le Dashboard Render, configurez ces variables d'environnement :

```env
# Configuration SMTP Infomaniak (PORT 2525)
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=2525
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=***VOTRE_MOT_DE_PASSE***
EMAIL_FROM=TalentProof <info@princeaman.dev>

# Autres variables importantes
NODE_ENV=production
SKIP_EMAILS=false
```

#### 2. CODE NODEMAILER OPTIMISÉ

Votre configuration actuelle dans `emailService.js` est déjà bonne. Seul le **port change**.

```javascript
const transporter = nodemailer.createTransporter({
  host: 'mail.infomaniak.com',
  port: 2525, // ✅ PORT ALTERNATIF
  secure: false, // false pour 2525 (utilise STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
    ciphers: 'SSLv3', // Compatibilité maximale
  },
  connectionTimeout: 60000, // 60 secondes
  greetingTimeout: 30000,
  socketTimeout: 60000,
  pool: true,
  maxConnections: 5,
});
```

---

## 🧪 TESTS DE CONNEXION

### Test 1 : Vérifier la connexion SMTP

Créez un script de test sur Render :

```javascript
// test-smtp-connection.js
import nodemailer from 'nodemailer';

const testPorts = [2525, 587, 465];

for (const port of testPorts) {
  console.log(`\n🔍 Test connexion port ${port}...`);
  
  const transporter = nodemailer.createTransporter({
    host: 'mail.infomaniak.com',
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  try {
    await transporter.verify();
    console.log(`✅ Port ${port} : FONCTIONNE !`);
  } catch (error) {
    console.log(`❌ Port ${port} : ${error.code || error.message}`);
  }
}
```

Exécutez sur Render :
```bash
node test-smtp-connection.js
```

### Test 2 : Vérifier depuis le terminal Render

Connectez-vous en SSH sur Render (si disponible) :

```bash
# Tester la connexion avec telnet
telnet mail.infomaniak.com 2525
# Devrait afficher : 220 mail.infomaniak.com ESMTP

# Tester avec curl
curl -v telnet://mail.infomaniak.com:2525

# Tester avec netcat
nc -zv mail.infomaniak.com 2525
```

---

## 🔧 SOLUTION #2 : SI LE PORT 2525 EST AUSSI BLOQUÉ

Si même le port 2525 est bloqué, voici les alternatives **AVEC INFOMANIAK** :

### Option A : UPGRADE RENDER PLAN

Le plan **Starter ($7/mois)** ou supérieur de Render débloque les ports SMTP.

**Avantages :**
- ✅ Tous les ports SMTP fonctionnent
- ✅ Meilleure performance
- ✅ Support prioritaire

**Comment :**
1. Allez sur Dashboard Render → Votre service
2. Settings → Plan → Upgrade to Starter
3. Les ports 587 et 465 seront débloqués

### Option B : PROXY/RELAY SMTP

Utilisez un service de relay SMTP compatible Infomaniak :

```javascript
// Configuration avec relay SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp-relay.sendinblue.com', // Exemple de relay
  port: 587,
  auth: {
    user: process.env.RELAY_USER,
    pass: process.env.RELAY_PASS,
  },
  // Forwarder vers Infomaniak
  dkim: {
    domainName: 'princeaman.dev',
    keySelector: 'mail',
    privateKey: process.env.DKIM_PRIVATE_KEY,
  },
});
```

### Option C : INFOMANIAK API (SI DISPONIBLE)

Infomaniak n'a **pas d'API REST officielle** pour l'envoi d'emails, mais propose :

1. **IMAP/POP3** (pas adapté pour envoyer)
2. **Webmail API** (limité)
3. **SMTP uniquement** (votre cas actuel)

❌ Pas d'alternative API REST disponible chez Infomaniak.

### Option D : CONTACTER LE SUPPORT

**1. Support Render :**
```
Sujet : Demande de déblocage ports SMTP pour service professionnel

Bonjour,

Je développe une application SaaS (TalentProof) déployée sur Render.
Mon application nécessite l'envoi d'emails transactionnels (confirmations, réinitialisation de mot de passe).

J'utilise mon propre serveur SMTP professionnel (Infomaniak - mail.infomaniak.com).

Pourriez-vous débloquer les ports SMTP (587, 465, 2525) pour mon service ?
Service ID : [VOTRE_SERVICE_ID]

Merci d'avance.
```

**2. Support Infomaniak :**
```
Sujet : Problème connexion SMTP depuis Render.com

Bonjour,

J'utilise votre service SMTP (mail.infomaniak.com) depuis une application hébergée sur Render.com.

Je rencontre des timeouts de connexion (ETIMEDOUT) sur les ports 465 et 587.
Le port 2525 fonctionne-t-il depuis des datacenters AWS (Render utilise AWS) ?

Avez-vous des recommandations de configuration pour les hébergeurs cloud ?

Merci.
```

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### Étape 1 : CHANGER LE PORT SUR RENDER

1. Allez sur **Render Dashboard**
2. Sélectionnez votre service backend
3. **Environment** → Trouvez `EMAIL_PORT`
4. Changez `587` → `2525`
5. **Save Changes** → Render va redéployer automatiquement

### Étape 2 : VÉRIFIER LES LOGS

Après le redéploiement, surveillez les logs :

```bash
# Sur Render Dashboard → Logs
# Recherchez :
✅ Serveur email prêt
✅ Email envoyé avec succès
```

### Étape 3 : TESTER L'ENVOI D'EMAIL

Testez une inscription ou réinitialisation de mot de passe sur votre app en production.

---

## 📊 TABLEAU RÉCAPITULATIF DES PORTS

| Port | Type | Render Free | Render Starter | Recommandation |
|------|------|-------------|----------------|----------------|
| 25   | SMTP | ❌ Bloqué   | ❌ Bloqué      | ❌ Ne pas utiliser |
| 465  | SSL  | ❌ Bloqué   | ✅ Fonctionne  | ⚠️ Si payant |
| 587  | TLS  | ❌ Bloqué   | ✅ Fonctionne  | ⚠️ Si payant |
| 2525 | ALT  | ✅ Souvent OK | ✅ Fonctionne | ✅ **RECOMMANDÉ** |

---

## 🐛 DÉBOGAGE AVANCÉ

Si rien ne fonctionne, activez les logs détaillés :

```javascript
const transporter = nodemailer.createTransporter({
  host: 'mail.infomaniak.com',
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // ✅ Logs détaillés
  logger: true, // ✅ Logger chaque étape
  tls: {
    rejectUnauthorized: false,
  },
});

// Vérifier la connexion avec détails
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de connexion SMTP:', error);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    console.error('Response:', error.response);
  } else {
    console.log('✅ Serveur SMTP prêt:', success);
  }
});
```

---

## ✅ CHECKLIST FINALE

- [ ] Variable `EMAIL_PORT=2525` sur Render
- [ ] Variable `EMAIL_HOST=mail.infomaniak.com` sur Render
- [ ] Variable `EMAIL_USER=info@princeaman.dev` sur Render
- [ ] Variable `EMAIL_PASS=***` sur Render (mot de passe correct)
- [ ] `secure: false` dans le code Nodemailer
- [ ] `connectionTimeout: 60000` configuré
- [ ] Logs Render vérifiés après déploiement
- [ ] Test d'envoi d'email en production

---

## 🆘 SI RIEN NE FONCTIONNE

Si même le port 2525 est bloqué :

1. **Upgrade vers Render Starter** ($7/mois) - Débloque tous les ports
2. **Migrer vers Railway** (alternative à Render, ports SMTP non bloqués)
3. **Utiliser un VPS** (DigitalOcean, Vultr) où vous contrôlez le réseau

---

## 📞 CONTACTS SUPPORT

**Render Support :**
- Email : support@render.com
- Dashboard : Help → Contact Support
- Documentation : https://render.com/docs/networking

**Infomaniak Support :**
- Email : support@infomaniak.com
- Téléphone : +41 22 820 35 41
- Console : https://manager.infomaniak.com

---

## 💡 CONCLUSION

**Le port 2525 d'Infomaniak est la solution la plus probable pour Render Free.**

Si ce port ne fonctionne pas non plus, le **plan Starter de Render** ($7/mois) est le meilleur investissement pour débloquer SMTP de manière fiable.

**Infomaniak reste votre provider** - vous ne changez que la configuration technique.
