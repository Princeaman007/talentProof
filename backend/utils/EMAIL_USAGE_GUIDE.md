# 📧 Guide d'Utilisation - Système d'Emails TalentProof

## Vue d'ensemble

Le système d'emails TalentProof utilise des templates HTML professionnels avec le logo intégré et un design moderne responsive.

### Technologies
- **SMTP**: Infomaniak (mail.infomaniak.com:587)
- **Library**: Nodemailer
- **Templates**: HTML avec logo SVG en base64
- **Design**: Bleu TalentProof (#1E3A8A) - Responsive (600px)

---

## 🚀 Fonctions Prêtes à l'Emploi

### 1. Email de Bienvenue - Talent

```javascript
import { sendWelcomeTalentEmail } from './utils/emailService.js';

// Exemple d'utilisation
await sendWelcomeTalentEmail({
  to: 'jean.dupont@example.com',
  firstName: 'Jean',
  loginUrl: `${process.env.FRONTEND_URL}/login`
});
```

**Contenu de l'email:**
- Logo TalentProof
- Message de bienvenue personnalisé
- Bouton "Accéder à mon compte"
- Liste des prochaines étapes
- Footer avec coordonnées

---

### 2. Email de Bienvenue - Entreprise

```javascript
import { sendWelcomeCompanyEmail } from './utils/emailService.js';

// Exemple d'utilisation
await sendWelcomeCompanyEmail({
  to: 'contact@entreprise.be',
  companyName: 'TechCorp SA',
  contactName: 'Marie Martin',
  dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/entreprise`
});
```

**Contenu de l'email:**
- Logo TalentProof
- Message de bienvenue avec nom de l'entreprise
- Bouton "Accéder au dashboard"
- Avantages TalentProof
- Footer avec coordonnées

---

### 3. Notification Nouvelle Candidature

```javascript
import { sendNewApplicationEmail } from './utils/emailService.js';

// Exemple d'utilisation
await sendNewApplicationEmail({
  to: 'info@princeaman.dev',
  talentName: 'Alexandre Dubois',
  position: 'Développeur Full Stack',
  eventDate: '15 décembre 2025',
  companyName: 'TechCorp',
  talentEmail: 'alexandre.dubois@example.com',
  talentTech: 'React, Node.js, MongoDB'
});
```

**Contenu de l'email:**
- Notification de candidature
- Informations du talent
- Technologies maîtrisées
- Bouton "Voir le profil complet"

---

### 4. Message de Contact Reçu

```javascript
import { sendContactReceivedEmail } from './utils/emailService.js';

// Exemple d'utilisation
await sendContactReceivedEmail({
  to: 'info@princeaman.dev',
  userName: 'Pierre Leroy',
  userEmail: 'pierre.leroy@example.com',
  message: 'Bonjour, je souhaite en savoir plus sur vos services...',
  receivedDate: new Date().toLocaleDateString('fr-FR')
});
```

**Contenu de l'email:**
- Notification de message
- Informations de l'expéditeur
- Message complet
- Bouton "Répondre par email"

---

### 5. Réinitialisation de Mot de Passe

```javascript
import { sendResetPasswordEmail } from './utils/emailService.js';

// Exemple d'utilisation
await sendResetPasswordEmail({
  to: 'user@example.com',
  userName: 'Jean Dupont',
  resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
});
```

**Contenu de l'email:**
- Logo TalentProof
- Instructions de réinitialisation
- Bouton "Réinitialiser mon mot de passe"
- Avertissement sécurité (expiration 1h)
- Footer avec coordonnées

---

## 🎨 Templates Personnalisés

Si vous avez besoin de créer un email personnalisé, utilisez les composants réutilisables :

```javascript
import { baseTemplate, ctaButton, infoBox, styledList } from './utils/emailTemplates.js';

const customEmail = baseTemplate(
  'Titre de l\'email', // Hero title
  `
    <p>Votre contenu personnalisé ici...</p>
    
    ${ctaButton('Mon bouton', 'https://example.com')}
    
    ${infoBox('<strong>Info importante</strong><br>Détails...', '⚠️', '#FEF3C7', '#F59E0B')}
    
    ${styledList([
      'Premier élément',
      'Deuxième élément',
      'Troisième élément'
    ])}
  `,
  '#1E3A8A' // Couleur de la bannière (optionnel)
);
```

---

## 📝 Exemple Complet dans un Controller

```javascript
// authController.js
import { sendWelcomeTalentEmail, sendResetPasswordEmail } from '../utils/emailService.js';

// Lors de l'inscription d'un talent
export const registerTalent = async (req, res) => {
  try {
    const { email, prenom, password } = req.body;
    
    // Créer le talent en DB
    const talent = await Talent.create({ email, prenom, password });
    
    // Envoyer l'email de bienvenue
    await sendWelcomeTalentEmail({
      to: email,
      firstName: prenom,
      loginUrl: `${process.env.FRONTEND_URL}/login`
    });
    
    res.status(201).json({
      success: true,
      message: 'Talent créé avec succès. Email de bienvenue envoyé.',
      data: { talent }
    });
  } catch (error) {
    console.error('Erreur inscription talent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// Lors de la demande de réinitialisation de mot de passe
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Générer le token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();
    
    // Envoyer l'email
    await sendResetPasswordEmail({
      to: email,
      userName: user.prenom || user.nom || 'Utilisateur',
      resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    });
    
    res.json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });
  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
};
```

---

## 🔧 Configuration Requise

### Variables d'environnement (.env)

```env
# SMTP Infomaniak
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=587
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=TalentProof <info@princeaman.dev>

# Frontend URL
FRONTEND_URL=http://localhost:5174
CLIENT_URL=http://localhost:5174

# Mode développement (skip emails)
SKIP_EMAILS=false
NODE_ENV=development
```

---

## 🎨 Personnalisation du Design

### Couleurs TalentProof

- **Bleu principal**: `#1E3A8A`
- **Bleu secondaire**: `#3B82F6`
- **Orange CTA**: `#F97316`
- **Vert succès**: `#059669`
- **Rouge erreur**: `#DC2626`

### Structure des Emails

Chaque email suit cette structure :

1. **Header** : Logo TalentProof centré sur fond blanc
2. **Hero** : Bannière colorée avec titre principal
3. **Content** : Contenu dynamique avec texte, boutons, listes
4. **Footer** : Logo mini, coordonnées, mentions légales

---

## 📊 Monitoring et Logs

Les emails sont automatiquement loggés dans la console :

```
✓ Configuration Email: {
  host: 'mail.infomaniak.com',
  port: 587,
  secure: false,
  user: 'info@princeaman.dev'
}
✓ Serveur email prêt
✓ Email envoyé avec succès: <message-id>
```

En cas d'erreur :

```
✗ Erreur envoi email: Error: ...
Détails: {
  code: 'ECONNECTION',
  command: 'CONN',
  response: '...'
}
```

---

## 🧪 Tests

### Test basique d'envoi

```javascript
// test-email.js
import { sendWelcomeTalentEmail } from './utils/emailService.js';

const testEmail = async () => {
  try {
    await sendWelcomeTalentEmail({
      to: 'votre-email@example.com',
      firstName: 'Test',
      loginUrl: 'http://localhost:5174/login'
    });
    console.log('✓ Email de test envoyé avec succès');
  } catch (error) {
    console.error('✗ Erreur test email:', error);
  }
};

testEmail();
```

### Lancer le test

```bash
cd backend
node test-email.js
```

---

## 🚨 Dépannage

### Problème : Emails non reçus

1. **Vérifier les variables d'environnement**
   ```bash
   echo $EMAIL_HOST
   echo $EMAIL_USER
   ```

2. **Vérifier le dossier spam**
   - Les nouveaux domaines peuvent être filtrés

3. **Tester la connexion SMTP**
   ```javascript
   await transporter.verify();
   ```

### Problème : Timeout SMTP

Si vous avez des timeouts (60 secondes), c'est normal avec `pool: false`. Solution :

```javascript
// emailService.js
connectionTimeout: 60000, // 60 secondes
greetingTimeout: 30000,   // 30 secondes
socketTimeout: 60000      // 60 secondes
```

### Problème : Logo non affiché

Le logo est embarqué en base64, donc il devrait toujours s'afficher. Si ce n'est pas le cas :

1. Vérifier que `client/public/logo.svg` existe
2. Le fallback logo sera utilisé automatiquement

---

## 📚 Ressources

- **Nodemailer Documentation**: https://nodemailer.com
- **Infomaniak SMTP**: https://www.infomaniak.com/fr/support
- **Email HTML Best Practices**: https://www.campaignmonitor.com/dev-resources/guides/

---

## 🤝 Support

Pour toute question ou problème :

- **Email**: info@princeaman.dev
- **Téléphone**: +32 467 62 08 78
- **GitHub Issues**: [Créer une issue]

---

**Dernière mise à jour** : Novembre 2025
**Version** : 1.0.0
**Auteur** : TalentProof Team
