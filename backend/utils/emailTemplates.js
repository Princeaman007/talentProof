/**
 * Templates d'emails HTML professionnels pour TalentProof
 * Thème: Bleu (#1e3a8a, #3b82f6) - Responsive (600px)
 * Contact: info@princeaman.dev | +32 467 62 08 78
 */

const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f3f4f6;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }
  .header {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    padding: 40px 20px;
    text-align: center;
  }
  .logo {
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
    text-decoration: none;
  }
  .content {
    padding: 40px 30px;
    color: #374151;
    line-height: 1.6;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: #ffffff !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
    transition: transform 0.2s;
  }
  .button:hover {
    transform: translateY(-2px);
  }
  .footer {
    background-color: #f9fafb;
    padding: 30px;
    text-align: center;
    color: #6b7280;
    font-size: 14px;
    border-top: 1px solid #e5e7eb;
  }
  .footer a {
    color: #3b82f6;
    text-decoration: none;
  }
  .highlight-box {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
    padding: 16px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .info-row {
    margin: 12px 0;
  }
  .info-label {
    font-weight: 600;
    color: #1e3a8a;
  }
  @media only screen and (max-width: 600px) {
    .content {
      padding: 30px 20px !important;
    }
    .button {
      display: block;
      text-align: center;
    }
  }
`;

/**
 * 1. Email de bienvenue pour les entreprises
 */
const welcomeCompanyEmail = (companyData) => {
  const { companyName, contactPerson, email } = companyData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur TalentProof</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <a href="https://talentproof.com" class="logo">🚀 TalentProof</a>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">
            La plateforme qui connecte les talents tech aux meilleures opportunités
          </p>
        </div>

        <div class="content">
          <h1 style="color: #1e3a8a; margin-bottom: 20px;">
            Bienvenue ${contactPerson || companyName} ! 🎉
          </h1>
          
          <p>
            Nous sommes ravis de vous accueillir sur <strong>TalentProof</strong>, la plateforme qui révolutionne 
            le recrutement tech en Belgique.
          </p>

          <div class="highlight-box">
            <h3 style="margin-top: 0; color: #1e3a8a;">✨ Votre compte est maintenant actif</h3>
            <div class="info-row">
              <span class="info-label">Entreprise:</span> ${companyName}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> ${email}
            </div>
          </div>

          <h3 style="color: #1e3a8a;">🎯 Prochaines étapes:</h3>
          <ol style="padding-left: 20px;">
            <li style="margin: 10px 0;">Complétez votre profil pour attirer les meilleurs talents</li>
            <li style="margin: 10px 0;">Explorez nos TalentDays - événements de recrutement exclusifs</li>
            <li style="margin: 10px 0;">Consultez notre base de talents validés et certifiés</li>
          </ol>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://talentproof.com/dashboard" class="button">
              Accéder à mon tableau de bord →
            </a>
          </div>

          <p style="margin-top: 30px;">
            À très bientôt,<br>
            <strong>L'équipe TalentProof</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>TalentProof</strong> - Recrutement Tech Simplifié
          </p>
          <p style="margin: 10px 0;">
            📧 <a href="mailto:info@princeaman.dev">info@princeaman.dev</a> | 
            📱 <a href="tel:+32467620878">+32 467 62 08 78</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 2. Email de bienvenue pour les talents
 */
const welcomeTalentEmail = (talentData) => {
  const { prenom, email, typeProfil, scoreTest } = talentData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur TalentProof</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <a href="https://talentproof.com" class="logo"> TalentProof</a>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">
            Votre carrière tech commence ici
          </p>
        </div>

        <div class="content">
          <h1 style="color: #1e3a8a; margin-bottom: 20px;">
            Bienvenue ${prenom} ! 🎉
          </h1>
          
          <p>
            Félicitations pour avoir rejoint <strong>TalentProof</strong> ! Votre profil 
            ${typeProfil || 'développeur'} est maintenant visible par les meilleures entreprises tech de Belgique.
          </p>

          ${scoreTest ? `
            <div class="highlight-box" style="background-color: #ecfdf5; border-color: #10b981;">
              <h3 style="margin-top: 0; color: #059669;">🏆 Votre score TalentProof</h3>
              <p style="font-size: 36px; font-weight: bold; color: #059669; margin: 10px 0;">
                ${scoreTest}/100
              </p>
            </div>
          ` : ''}

          <h3 style="color: #1e3a8a;">🚀 Comment maximiser vos opportunités:</h3>
          <ol style="padding-left: 20px;">
            <li style="margin: 10px 0;">Complétez votre profil à 100%</li>
            <li style="margin: 10px 0;">Participez aux TalentDays</li>
            <li style="margin: 10px 0;">Tenez votre profil à jour</li>
          </ol>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://talentproof.com/dashboard" class="button">
              Compléter mon profil →
            </a>
          </div>

          <p style="margin-top: 20px;">
            Bonne chance,<br>
            <strong>L'équipe TalentProof</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>TalentProof</strong> - Votre Carrière Tech
          </p>
          <p style="margin: 10px 0;">
            📧 <a href="mailto:info@princeaman.dev">info@princeaman.dev</a> | 
            📱 <a href="tel:+32467620878">+32 467 62 08 78</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 3. Email de confirmation d'inscription à un TalentDay
 */
const talentDayRegistrationEmail = (registrationData) => {
  const { 
    userName, 
    userEmail, 
    eventTitle, 
    eventDate, 
    eventTime, 
    eventLocation, 
    eventType,
    isOnline,
    meetingLink 
  } = registrationData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation TalentDay</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <a href="https://talentproof.com" class="logo">🚀 TalentProof</a>
        </div>

        <div class="content">
          <h1 style="color: #1e3a8a;">
            ✅ Inscription confirmée !
          </h1>
          
          <p>Bonjour <strong>${userName}</strong>,</p>

          <div class="highlight-box" style="background-color: #ecfdf5; border-color: #10b981;">
            <h2 style="color: #059669; margin-top: 0;">${eventTitle}</h2>
            <div class="info-row">
              <span class="info-label">📅 Date:</span> ${eventDate}
            </div>
            <div class="info-row">
              <span class="info-label">🕐 Heure:</span> ${eventTime}
            </div>
            <div class="info-row">
              <span class="info-label">📍 Lieu:</span> ${eventLocation}
            </div>
          </div>

          ${isOnline && meetingLink ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingLink}" class="button">
                Rejoindre l'événement →
              </a>
            </div>
          ` : ''}

          <p style="margin-top: 20px;">
            À très bientôt,<br>
            <strong>L'équipe TalentProof</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>TalentProof</strong>
          </p>
          <p style="margin: 10px 0;">
            📧 <a href="mailto:info@princeaman.dev">info@princeaman.dev</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 4. Email de réinitialisation de mot de passe
 */
const resetPasswordEmail = (resetData) => {
  const { userName, email, resetToken, resetUrl } = resetData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation mot de passe</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <a href="https://talentproof.com" class="logo">🚀 TalentProof</a>
        </div>

        <div class="content">
          <h1 style="color: #1e3a8a;">
            🔐 Réinitialisation de mot de passe
          </h1>
          
          <p>Bonjour${userName ? ` <strong>${userName}</strong>` : ''},</p>

          <p>
            Vous avez demandé la réinitialisation de votre mot de passe.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">
              Réinitialiser mon mot de passe →
            </a>
          </div>

          <div class="highlight-box" style="background-color: #fef2f2; border-color: #ef4444;">
            <h3 style="margin-top: 0; color: #dc2626;">⚠️ Important</h3>
            <p style="margin: 0;">
              Ce lien expire dans <strong>1 heure</strong> et ne peut être utilisé qu'une seule fois.
            </p>
          </div>

          <p style="margin-top: 20px;">
            Cordialement,<br>
            <strong>L'équipe TalentProof</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>TalentProof</strong>
          </p>
          <p style="margin: 10px 0;">
            📧 <a href="mailto:info@princeaman.dev">info@princeaman.dev</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 5. Email de demande de contact entreprise → talent
 */
const companyContactTalentEmail = (contactData) => {
  const { 
    talentName, 
    talentEmail,
    companyName, 
    companyContact,
    companyEmail,
    companyPhone,
    message,
    position
  } = contactData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle opportunité</title>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <a href="https://talentproof.com" class="logo">🚀 TalentProof</a>
        </div>

        <div class="content">
          <h1 style="color: #1e3a8a;">
            🎯 Nouvelle opportunité !
          </h1>
          
          <p>Bonjour <strong>${talentName}</strong>,</p>

          <p>
            L'entreprise <strong>${companyName}</strong> est intéressée par votre profil.
          </p>

          <div class="highlight-box" style="background-color: #ecfdf5; border-color: #10b981;">
            <h3 style="margin-top: 0; color: #059669;">🏢 Informations de l'entreprise</h3>
            <div class="info-row">
              <span class="info-label">Entreprise:</span> ${companyName}
            </div>
            <div class="info-row">
              <span class="info-label">Contact:</span> ${companyContact}
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> 
              <a href="mailto:${companyEmail}">${companyEmail}</a>
            </div>
            ${companyPhone ? `
              <div class="info-row">
                <span class="info-label">Téléphone:</span> 
                <a href="tel:${companyPhone}">${companyPhone}</a>
              </div>
            ` : ''}
          </div>

          ${message ? `
            <h3 style="color: #1e3a8a;">💬 Message:</h3>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; white-space: pre-line;">${message}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://talentproof.com/dashboard/opportunities" class="button">
              Voir mes opportunités →
            </a>
          </div>

          <p style="margin-top: 20px;">
            Bonne chance,<br>
            <strong>L'équipe TalentProof</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            <strong>TalentProof</strong>
          </p>
          <p style="margin: 10px 0;">
            📧 <a href="mailto:info@princeaman.dev">info@princeaman.dev</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * EXPORTS - Templates compatibles avec l'ancien système
 */

// Alias pour la compatibilité avec l'ancien code
export const confirmationEmailTemplate = (companyName, confirmationLink) => {
  return welcomeCompanyEmail({
    companyName,
    email: 'email@example.com',
    contactPerson: companyName
  });
};

export const resetPasswordTemplate = (userName, resetLink) => {
  return resetPasswordEmail({
    userName,
    email: 'email@example.com',
    resetUrl: resetLink
  });
};

export const contactNotificationTemplate = (talentInfo, recruteurInfo) => {
  return companyContactTalentEmail({
    talentName: talentInfo.prenom,
    talentEmail: 'talent@example.com',
    companyName: recruteurInfo.entreprise,
    companyContact: recruteurInfo.nom,
    companyEmail: recruteurInfo.email,
    companyPhone: recruteurInfo.tel,
    message: recruteurInfo.message
  });
};

export const contactConfirmationTemplate = (recruteurNom, talentPrenom) => {
  return companyContactTalentEmail({
    talentName: talentPrenom,
    talentEmail: 'talent@example.com',
    companyName: 'Entreprise',
    companyContact: recruteurNom,
    companyEmail: 'contact@example.com',
    message: 'Votre demande a été reçue.'
  });
};

// Exports ES6 pour les nouveaux templates
export {
  welcomeCompanyEmail,
  welcomeTalentEmail,
  talentDayRegistrationEmail,
  resetPasswordEmail,
  companyContactTalentEmail,
};

// Les anciens templates sont déjà exportés individuellement plus haut