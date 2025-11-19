# 🚨 FIX : Email rejeté comme SPAM par Infomaniak

## ❌ Erreur
```
550 5.2.0 Spam message rejected
```

L'email de confirmation est rejeté par le serveur Infomaniak comme spam.

---

## 🎯 Solutions (par ordre de priorité)

### Solution 1 : Vérifier que le domaine est autorisé dans Infomaniak

1. **Connectez-vous à Infomaniak** : https://manager.infomaniak.com
2. **Allez dans "Emails"**
3. **Vérifiez que `info@princeaman.dev` est bien configuré**
4. **Vérifiez les paramètres anti-spam** :
   - L'email doit être vérifié
   - Le domaine `princeaman.dev` doit avoir les DNS corrects

---

### Solution 2 : Configurer SPF et DKIM (IMPORTANT)

#### Qu'est-ce que SPF/DKIM ?
- **SPF** : Autorise les serveurs à envoyer des emails pour votre domaine
- **DKIM** : Signe numériquement vos emails pour prouver leur authenticité

#### Configuration DNS requise

Allez sur votre hébergeur DNS (OVH, Cloudflare, etc.) et ajoutez ces enregistrements :

**1. Enregistrement SPF (TXT)**
```
Nom : princeaman.dev
Type : TXT
Valeur : v=spf1 include:spf.infomaniak.ch ~all
```

**2. Enregistrements DKIM (demandez-les à Infomaniak)**

Dans Infomaniak Manager :
1. Emails → Votre domaine
2. Configuration → DKIM
3. Copiez les enregistrements DNS fournis
4. Ajoutez-les à votre DNS

---

### Solution 3 : Utiliser l'email Infomaniak comme expéditeur réel

Modifiez `EMAIL_FROM` sur Render pour correspondre EXACTEMENT à l'email Infomaniak :

**Actuellement (peut-être incorrect)** :
```env
EMAIL_FROM=TalentProof <info@princeaman.dev>
```

**Changez en** :
```env
EMAIL_FROM=info@princeaman.dev
```

Ou si vous voulez garder le nom d'affichage :
```env
EMAIL_FROM="TalentProof" <info@princeaman.dev>
```

---

### Solution 4 : Vérifier le contenu de l'email

Les filtres anti-spam détectent certains mots/patterns. Vérifiez que votre template :

❌ **ÉVITEZ** :
- Trop de liens
- Mots comme "gratuit", "urgent", "cliquez ici"
- Images en base64 trop grandes
- HTML mal formaté

✅ **BONNES PRATIQUES** :
- Un seul bouton CTA clair
- Texte simple et professionnel
- Ratio texte/HTML équilibré
- Pas d'images externes non HTTPS

---

### Solution 5 : Simplifier temporairement le template

Créons une version minimaliste du template pour tester :

```javascript
export const confirmationEmailTemplateSimple = (companyName, confirmationLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Bienvenue sur TalentProof</h2>
      <p>Bonjour ${companyName},</p>
      <p>Merci de vous être inscrit sur TalentProof.</p>
      <p>Pour confirmer votre compte, cliquez sur le lien ci-dessous :</p>
      <p><a href="${confirmationLink}" style="background: #2E4A9E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirmer mon email</a></p>
      <p>Ou copiez ce lien dans votre navigateur :</p>
      <p>${confirmationLink}</p>
      <p>Ce lien expire dans 24 heures.</p>
      <p>Cordialement,<br>L'équipe TalentProof</p>
    </body>
    </html>
  `;
};
```

---

### Solution 6 : Ajouter un fallback texte brut

Les emails sans version texte sont souvent marqués comme spam.

Dans `emailService.js`, ajoutez toujours un `text` :

```javascript
const mailOptions = {
  from: process.env.EMAIL_FROM || 'TalentProof <info@princeaman.dev>',
  to,
  subject,
  html,
  text: text || stripHtml(html), // Fallback : convertir HTML en texte
};
```

Fonction helper :
```javascript
const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};
```

---

## 🔧 Actions Immédiates

### ÉTAPE 1 : Vérifier le domaine sur Infomaniak

1. Manager Infomaniak → Emails
2. Vérifiez que `info@princeaman.dev` :
   - ✅ Existe
   - ✅ Est vérifié
   - ✅ N'a pas de restrictions

### ÉTAPE 2 : Configurer SPF

Ajoutez l'enregistrement SPF dans votre DNS :
```
v=spf1 include:spf.infomaniak.ch ~all
```

### ÉTAPE 3 : Tester avec un template simple

Utilisez temporairement un email texte simple sans HTML complexe.

### ÉTAPE 4 : Vérifier EMAIL_FROM

Assurez-vous que `EMAIL_FROM` sur Render est exactement `info@princeaman.dev`.

---

## 🧪 Test de validation

Après chaque modification, testez avec ces outils :

1. **Mail Tester** : https://www.mail-tester.com
   - Envoyez un email à l'adresse fournie
   - Score minimum attendu : 8/10

2. **MXToolbox** : https://mxtoolbox.com/spf.aspx
   - Vérifiez votre SPF : `princeaman.dev`

3. **DKIM Validator** : https://dkimvalidator.com
   - Testez votre DKIM

---

## 📋 Checklist

- [ ] Domaine `princeaman.dev` vérifié sur Infomaniak
- [ ] Enregistrement SPF ajouté au DNS
- [ ] Enregistrement DKIM ajouté au DNS (si disponible)
- [ ] `EMAIL_FROM` sur Render = `info@princeaman.dev`
- [ ] Template email simplifié pour test
- [ ] Version texte brut ajoutée
- [ ] Test avec mail-tester.com (score > 8/10)
- [ ] Inscription test réussie

---

## 🆘 Si rien ne fonctionne

### Option A : Utiliser un autre domaine temporairement

Créez un email avec un domaine Infomaniak vérifié :
```
contact@votreautredomaine.ch
```

### Option B : Utiliser un service d'email transactionnel

Migrer vers un service spécialisé anti-spam :

1. **SendGrid** (100 emails/jour gratuit)
   - https://sendgrid.com

2. **Mailgun** (5000 emails/mois gratuit 3 mois)
   - https://www.mailgun.com

3. **Brevo (ex-Sendinblue)** (300 emails/jour gratuit)
   - https://www.brevo.com

### Option C : Contacter Infomaniak

Support Infomaniak : https://www.infomaniak.com/fr/support

Demandez :
- Pourquoi l'email est rejeté comme spam
- Configuration SPF/DKIM recommandée
- Whitelist IP de Render si possible

---

## 📞 Ressources

- **Infomaniak Help** : https://www.infomaniak.com/fr/support/faq
- **SPF Record Checker** : https://mxtoolbox.com/spf.aspx
- **DKIM Validator** : https://dkimvalidator.com
- **Email Test** : https://www.mail-tester.com

---

**Date** : 19 novembre 2025  
**Priorité** : 🔴 CRITIQUE - Utilisateurs ne peuvent pas s'inscrire
