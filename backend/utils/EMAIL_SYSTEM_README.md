# 📧 Système d'Emails Professionnels TalentProof

## 🎯 Vue d'ensemble

Système d'emails complet avec templates HTML dynamiques, logo TalentProof intégré et design moderne responsive.

### ✨ Caractéristiques

- ✅ **Templates dynamiques** - Intégration automatique des données (nom, email, etc.)
- ✅ **Logo intégré** - Logo TalentProof en SVG embarqué en base64
- ✅ **Design responsive** - S'adapte à tous les écrans (mobile, desktop)
- ✅ **5 templates prêts** - Bienvenue talent/entreprise, candidature, contact, reset password
- ✅ **Composants réutilisables** - Boutons, encadrés, listes pour créer de nouveaux emails
- ✅ **SMTP Infomaniak** - Configuration professionnelle sécurisée

---

## 📁 Structure des Fichiers

```
backend/
├── utils/
│   ├── emailService.js              # Service principal d'envoi
│   ├── emailTemplates.js            # Templates HTML dynamiques
│   ├── emailTemplates.professional.js # Templates existants
│   └── EMAIL_USAGE_GUIDE.md         # Guide détaillé d'utilisation
├── test-emails-complete.js          # Script de test complet
└── .env                              # Configuration SMTP
```

---

## 🚀 Quick Start

### 1. Installation

Les dépendances sont déjà installées (Nodemailer).

### 2. Configuration (.env)

```env
# SMTP Infomaniak
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=587
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=votre_mot_de_passe
EMAIL_FROM=TalentProof <info@princeaman.dev>

# URLs Frontend
FRONTEND_URL=http://localhost:5174
CLIENT_URL=http://localhost:5174

# Options
SKIP_EMAILS=false
NODE_ENV=development
```

### 3. Tester le système

```bash
cd backend
node test-emails-complete.js
```

**Ce test envoie 5 emails** :
1. Bienvenue Talent
2. Bienvenue Entreprise
3. Nouvelle Candidature
4. Contact Reçu
5. Réinitialisation Mot de Passe

---

## 📝 Utilisation dans le Code

### Import

```javascript
import {
  sendWelcomeTalentEmail,
  sendWelcomeCompanyEmail,
  sendNewApplicationEmail,
  sendContactReceivedEmail,
  sendResetPasswordEmail
} from './utils/emailService.js';
```

### Exemples

#### 1. Bienvenue Talent

```javascript
// authController.js - Après inscription
await sendWelcomeTalentEmail({
  to: talent.email,
  firstName: talent.prenom,
  loginUrl: `${process.env.FRONTEND_URL}/login`
});
```

#### 2. Bienvenue Entreprise

```javascript
// companyController.js - Après inscription
await sendWelcomeCompanyEmail({
  to: company.email,
  companyName: company.nom,
  contactName: company.contact,
  dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/entreprise`
});
```

#### 3. Nouvelle Candidature

```javascript
// talentDayController.js - Nouvelle inscription
await sendNewApplicationEmail({
  to: 'info@princeaman.dev',
  talentName: `${talent.prenom} ${talent.nom}`,
  position: talent.typeProfil,
  eventDate: talentDay.date,
  companyName: talentDay.entreprise,
  talentEmail: talent.email,
  talentTech: talent.technologies.join(', ')
});
```

#### 4. Contact Reçu

```javascript
// contactController.js - Formulaire de contact
await sendContactReceivedEmail({
  to: 'info@princeaman.dev',
  userName: req.body.nom,
  userEmail: req.body.email,
  message: req.body.message,
  receivedDate: new Date().toLocaleDateString('fr-FR')
});
```

#### 5. Reset Password

```javascript
// authController.js - Mot de passe oublié
await sendResetPasswordEmail({
  to: user.email,
  userName: user.prenom || user.nom,
  resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
});
```

---

## 🎨 Design et Branding

### Couleurs TalentProof

| Élément | Couleur | Code |
|---------|---------|------|
| Bleu principal | ![#1E3A8A](https://via.placeholder.com/15/1E3A8A/000000?text=+) | `#1E3A8A` |
| Bleu secondaire | ![#3B82F6](https://via.placeholder.com/15/3B82F6/000000?text=+) | `#3B82F6` |
| Orange CTA | ![#F97316](https://via.placeholder.com/15/F97316/000000?text=+) | `#F97316` |
| Vert succès | ![#059669](https://via.placeholder.com/15/059669/000000?text=+) | `#059669` |
| Rouge erreur | ![#DC2626](https://via.placeholder.com/15/DC2626/000000?text=+) | `#DC2626` |

### Structure des Emails

```
┌─────────────────────────────────────┐
│           HEADER                    │
│   [Logo TalentProof]                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           HERO BANNER               │
│   Titre principal (bleu)            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           CONTENT                   │
│   - Texte personnalisé              │
│   - Boutons CTA                     │
│   - Listes à puces                  │
│   - Encadrés d'information          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           FOOTER                    │
│   - Logo mini                       │
│   - Slogan                          │
│   - Coordonnées                     │
│   - Mentions légales                │
└─────────────────────────────────────┘
```

---

## 🧩 Composants Réutilisables

Pour créer des emails personnalisés :

```javascript
import { baseTemplate, ctaButton, infoBox, styledList } from './utils/emailTemplates.js';

const customEmail = baseTemplate(
  'Mon Titre',
  `
    <p>Contenu personnalisé...</p>
    
    ${ctaButton('Cliquer ici', 'https://example.com')}
    
    ${infoBox('Message important', '⚠️', '#FEF3C7', '#F59E0B')}
    
    ${styledList([
      'Élément 1',
      'Élément 2',
      'Élément 3'
    ])}
  `,
  '#1E3A8A' // Couleur bannière
);
```

---

## 🧪 Tests et Validation

### Script de Test Automatique

```bash
cd backend
node test-emails-complete.js
```

### Tests Manuels

1. **Logo** : Vérifiez que le logo TalentProof s'affiche
2. **Responsive** : Testez sur mobile et desktop
3. **Liens** : Cliquez sur tous les boutons CTA
4. **Texte** : Vérifiez que les données dynamiques sont correctes
5. **Spam** : Vérifiez le dossier spam si email non reçu

### Checklist Qualité

- [ ] Logo visible et centré
- [ ] Couleurs TalentProof présentes
- [ ] Boutons CTA fonctionnels
- [ ] Texte personnalisé correct
- [ ] Footer complet (coordonnées)
- [ ] Design responsive
- [ ] Aucune faute d'orthographe
- [ ] Liens valides

---

## 🔧 Dépannage

### Emails non reçus

1. **Vérifier les variables d'environnement**
   ```bash
   echo $EMAIL_HOST
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

2. **Vérifier SKIP_EMAILS**
   ```env
   SKIP_EMAILS=false  # Doit être false en production
   ```

3. **Vérifier le dossier spam**

4. **Tester la connexion SMTP**
   ```javascript
   await transporter.verify();
   ```

### Timeouts SMTP

Si vous avez des timeouts après 60 secondes, c'est normal avec `pool: false`.

**Solution** : Les timeouts sont déjà configurés à 60s dans `emailService.js`.

### Logo non affiché

Le logo est embarqué en base64, donc il devrait toujours s'afficher.

**Vérifications** :
1. `client/public/logo.svg` existe
2. Sinon, un logo de fallback est utilisé automatiquement

---

## 📊 Monitoring

### Logs de Succès

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

### Logs d'Erreur

```
✗ Erreur envoi email: Error: ...
Détails: {
  code: 'ECONNECTION',
  command: 'CONN',
  response: '...'
}
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **Guide détaillé** : `backend/utils/EMAIL_USAGE_GUIDE.md`
- **Code source** : `backend/utils/emailService.js`
- **Templates** : `backend/utils/emailTemplates.js`

---

## 🔐 Sécurité

### Bonnes Pratiques

- ✅ **SMTP sur port 587** (TLS/STARTTLS)
- ✅ **Pas de pool de connexions** pour éviter timeouts
- ✅ **Timeouts configurés** (60s connection, 30s greeting, 60s socket)
- ✅ **Variables d'environnement** pour les credentials
- ✅ **Pas de credentials en dur** dans le code
- ✅ **Logo en base64** (pas de requête externe)

### Credentials SMTP

**NE JAMAIS commiter** les credentials dans Git :

```bash
# .env doit être dans .gitignore
echo ".env" >> .gitignore
```

---

## 🚀 Production

### Checklist Déploiement

- [ ] Variables d'environnement configurées sur Render
- [ ] `SKIP_EMAILS=false`
- [ ] `FRONTEND_URL` pointant vers le domaine de production
- [ ] Test d'envoi effectué en production
- [ ] Monitoring des logs activé

### Variables Render

```env
EMAIL_HOST=mail.infomaniak.com
EMAIL_PORT=587
EMAIL_USER=info@princeaman.dev
EMAIL_PASS=***********
EMAIL_FROM=TalentProof <info@princeaman.dev>
FRONTEND_URL=https://talentproof-client.onrender.com
CLIENT_URL=https://talentproof-client.onrender.com
SKIP_EMAILS=false
NODE_ENV=production
```

---

## 🤝 Support

### Contact

- **Email** : info@princeaman.dev
- **Téléphone** : +32 467 62 08 78
- **Adresse** : Avenue de Lille 4 A52, 4020 Liège, Belgique

### Ressources

- [Nodemailer Documentation](https://nodemailer.com)
- [Infomaniak SMTP](https://www.infomaniak.com/fr/support)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/)

---

## 📝 Changelog

### Version 1.0.0 (Novembre 2025)

- ✅ 5 templates d'emails professionnels
- ✅ Logo TalentProof intégré en base64
- ✅ Design responsive moderne
- ✅ Fonctions d'envoi prêtes à l'emploi
- ✅ Composants réutilisables
- ✅ Script de test automatique
- ✅ Documentation complète

---

**Auteur** : TalentProof Team  
**Dernière mise à jour** : Novembre 2025  
**License** : Propriétaire
