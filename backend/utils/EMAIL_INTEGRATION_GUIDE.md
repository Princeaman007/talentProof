# 🔄 Guide d'Intégration - Emails dans les Contrôleurs

Ce guide montre comment intégrer les nouveaux emails dans les contrôleurs existants de TalentProof.

---

## 📁 Fichiers à Modifier

### 1. authController.js

#### A. Inscription d'un talent (register)

```javascript
import { sendWelcomeTalentEmail } from '../utils/emailService.js';

export const registerTalent = async (req, res) => {
  try {
    const { email, prenom, password, typeProfil } = req.body;
    
    // Créer le talent
    const talent = await Talent.create({
      email,
      prenom,
      password,
      typeProfil
    });
    
    // ✨ NOUVEAU: Envoyer l'email de bienvenue
    try {
      await sendWelcomeTalentEmail({
        to: email,
        firstName: prenom,
        loginUrl: `${process.env.FRONTEND_URL}/login`
      });
      console.log(`✓ Email de bienvenue envoyé à ${email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email bienvenue:', emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Email de bienvenue envoyé.',
      data: { talent }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};
```

#### B. Réinitialisation de mot de passe (forgotPassword)

```javascript
import { sendResetPasswordEmail } from '../utils/emailService.js';
import crypto from 'crypto';

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
    
    // Générer le token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Sauvegarder le token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();
    
    // ✨ NOUVEAU: Envoyer l'email de réinitialisation
    try {
      await sendResetPasswordEmail({
        to: email,
        userName: user.prenom || user.nom || 'Utilisateur',
        resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      });
      console.log(`✓ Email de réinitialisation envoyé à ${email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email reset:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      });
    }
    
    res.json({
      success: true,
      message: 'Email de réinitialisation envoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};
```

---

### 2. companyController.js

#### Inscription d'une entreprise

```javascript
import { sendWelcomeCompanyEmail } from '../utils/emailService.js';

export const registerCompany = async (req, res) => {
  try {
    const { nom, email, contact, telephone } = req.body;
    
    // Créer l'entreprise
    const company = await Company.create({
      nom,
      email,
      contact,
      telephone
    });
    
    // ✨ NOUVEAU: Envoyer l'email de bienvenue
    try {
      await sendWelcomeCompanyEmail({
        to: email,
        companyName: nom,
        contactName: contact,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/entreprise`
      });
      console.log(`✓ Email de bienvenue entreprise envoyé à ${email}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email bienvenue entreprise:', emailError);
      // Ne pas bloquer l'inscription
    }
    
    res.status(201).json({
      success: true,
      message: 'Entreprise inscrite avec succès',
      data: { company }
    });
  } catch (error) {
    console.error('Erreur inscription entreprise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};
```

---

### 3. talentDayController.js

#### Nouvelle inscription à un TalentDay

```javascript
import { sendNewApplicationEmail } from '../utils/emailService.js';

export const registerToTalentDay = async (req, res) => {
  try {
    const { talentDayId } = req.params;
    const { prenom, nom, email, telephone, technologies } = req.body;
    
    // Trouver le TalentDay
    const talentDay = await TalentDay.findById(talentDayId);
    if (!talentDay) {
      return res.status(404).json({
        success: false,
        message: 'TalentDay non trouvé'
      });
    }
    
    // Créer l'inscription
    const inscription = {
      prenom,
      nom,
      email,
      telephone,
      technologies,
      statut: 'en_attente'
    };
    
    talentDay.inscriptions.push(inscription);
    await talentDay.save();
    
    // ✨ NOUVEAU: Notifier Prince par email
    try {
      await sendNewApplicationEmail({
        to: 'info@princeaman.dev',
        talentName: `${prenom} ${nom}`,
        position: technologies?.[0] || 'Développeur',
        eventDate: new Date(talentDay.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        companyName: talentDay.titre,
        talentEmail: email,
        talentTech: technologies?.join(', ') || 'Non spécifié'
      });
      console.log(`✓ Notification candidature envoyée pour ${prenom} ${nom}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi notification candidature:', emailError);
      // Ne pas bloquer l'inscription
    }
    
    res.status(201).json({
      success: true,
      message: 'Inscription enregistrée avec succès',
      data: { inscription }
    });
  } catch (error) {
    console.error('Erreur inscription TalentDay:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};
```

---

### 4. contactController.js

#### Formulaire de contact général

```javascript
import { sendContactReceivedEmail } from '../utils/emailService.js';

export const submitContactForm = async (req, res) => {
  try {
    const { nom, email, telephone, message, sujet } = req.body;
    
    // Sauvegarder le message en DB (optionnel)
    const contact = await Contact.create({
      nom,
      email,
      telephone,
      message,
      sujet,
      dateReception: new Date()
    });
    
    // ✨ NOUVEAU: Notifier Prince par email
    try {
      await sendContactReceivedEmail({
        to: 'info@princeaman.dev',
        userName: nom,
        userEmail: email,
        message: message,
        receivedDate: new Date().toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      console.log(`✓ Notification contact reçu pour ${nom}`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi notification contact:', emailError);
      // Ne pas bloquer la soumission
    }
    
    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès. Nous vous répondrons rapidement.',
      data: { contact }
    });
  } catch (error) {
    console.error('Erreur formulaire contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
};
```

---

### 5. talentController.js

#### Demande de contact entreprise → talent

```javascript
import { sendContactReceivedEmail } from '../utils/emailService.js';

export const contactTalent = async (req, res) => {
  try {
    const { talentId } = req.params;
    const { message, entreprise } = req.body;
    const companyId = req.user.id; // Depuis le middleware auth
    
    // Trouver le talent
    const talent = await Talent.findById(talentId);
    if (!talent) {
      return res.status(404).json({
        success: false,
        message: 'Talent non trouvé'
      });
    }
    
    // Trouver l'entreprise
    const company = await Company.findById(companyId);
    
    // Sauvegarder la demande de contact
    const contactRequest = await ContactRequest.create({
      talent: talentId,
      company: companyId,
      message,
      statut: 'en_attente'
    });
    
    // ✨ NOUVEAU: Notifier Prince par email
    try {
      await sendContactReceivedEmail({
        to: 'info@princeaman.dev',
        userName: company.nom,
        userEmail: company.email,
        message: `Entreprise: ${company.nom}\nTalent: ${talent.prenom} ${talent.nom || ''}\n\nMessage:\n${message}`,
        receivedDate: new Date().toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      console.log(`✓ Notification demande contact envoyée`);
    } catch (emailError) {
      console.error('⚠️ Erreur envoi notification:', emailError);
      // Ne pas bloquer la demande
    }
    
    res.status(201).json({
      success: true,
      message: 'Demande de contact envoyée. Nous vous mettrons en relation rapidement.',
      data: { contactRequest }
    });
  } catch (error) {
    console.error('Erreur demande contact talent:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la demande'
    });
  }
};
```

---

## 🎯 Bonnes Pratiques d'Intégration

### 1. Gestion des erreurs d'email

```javascript
try {
  await sendEmail(...);
  console.log('✓ Email envoyé');
} catch (emailError) {
  console.error('⚠️ Erreur email:', emailError);
  // NE PAS bloquer l'opération principale
  // L'email est un "nice-to-have", pas un "must-have"
}
```

### 2. Logs informatifs

```javascript
console.log(`✓ Email ${typeEmail} envoyé à ${destinataire}`);
console.error(`⚠️ Erreur envoi email ${typeEmail}:`, error.message);
```

### 3. Données dynamiques

```javascript
// Toujours formater les dates
eventDate: new Date(talentDay.date).toLocaleDateString('fr-FR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Gérer les valeurs nulles
firstName: talent.prenom || 'Talent',
companyName: company.nom || 'Entreprise',
```

### 4. Mode développement

```javascript
// En développement, loggez les emails envoyés
if (process.env.NODE_ENV === 'development') {
  console.log('📧 Email envoyé:', {
    to,
    subject,
    type: 'welcome_talent'
  });
}
```

---

## 🧪 Tests d'Intégration

### Test 1: Inscription Talent

```bash
# Terminal 1: Démarrer le backend
cd backend
npm run dev

# Terminal 2: Test inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "prenom": "Jean",
    "password": "Test123456!",
    "typeProfil": "Développeur Full Stack"
  }'

# Vérifier: Email reçu sur test@example.com
```

### Test 2: Forgot Password

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Vérifier: Email de reset reçu
```

### Test 3: Contact Talent

```bash
curl -X POST http://localhost:5000/api/talents/123456/contact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Bonjour, je suis intéressé par votre profil..."
  }'

# Vérifier: Email de notification reçu par Prince
```

---

## 📋 Checklist d'Intégration

### Avant de committer

- [ ] Import des fonctions d'email ajouté
- [ ] Try/catch autour de l'envoi d'email
- [ ] Logs informatifs ajoutés
- [ ] Données dynamiques formatées correctement
- [ ] Test manuel effectué
- [ ] Email reçu et vérifié (design, contenu, liens)
- [ ] Pas d'erreur dans les logs backend
- [ ] Documentation mise à jour si nécessaire

### Avant de déployer

- [ ] Variables d'environnement configurées sur Render
- [ ] `SKIP_EMAILS=false` en production
- [ ] `FRONTEND_URL` pointe vers le bon domaine
- [ ] Test en production effectué
- [ ] Monitoring des logs activé

---

## 🚨 Erreurs Courantes

### 1. Email non envoyé - Variables manquantes

**Erreur** :
```
Error: Missing credentials for "PLAIN"
```

**Solution** :
```env
# Vérifier .env
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=votre_mot_de_passe
```

### 2. FRONTEND_URL undefined

**Erreur** :
```
loginUrl: undefined/login
```

**Solution** :
```env
FRONTEND_URL=http://localhost:5174
```

### 3. Logo non affiché

**Cause** : Logo SVG introuvable

**Solution** : Le système utilise automatiquement un logo de fallback

---

## 📞 Support

**Questions ?** Consultez :
- `backend/utils/EMAIL_SYSTEM_README.md` - Vue d'ensemble
- `backend/utils/EMAIL_USAGE_GUIDE.md` - Guide détaillé
- `backend/test-emails-complete.js` - Script de test

**Contact** :
- Email: info@princeaman.dev
- Téléphone: +32 467 62 08 78

---

**Dernière mise à jour** : Novembre 2025
