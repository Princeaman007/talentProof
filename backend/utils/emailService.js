import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporter Nodemailer
const createTransporter = () => {
  const isSSL = process.env.EMAIL_PORT === '465';
  
  console.log('📧 Configuration Email:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: isSSL,
    user: process.env.EMAIL_USER,
  });
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: isSSL, // true pour 465, false pour 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Ne pas échouer sur les certificats invalides (optionnel)
      rejectUnauthorized: true
    }
  });
};


/**
 * Envoyer un email
 * @param {Object} options - Options de l'email
 * @param {string} options.to - Destinataire
 * @param {string} options.subject - Sujet
 * @param {string} options.html - Contenu HTML
 * @param {string} options.text - Contenu texte (optionnel)
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  // Mode développement - skip emails
  if (process.env.SKIP_EMAILS === 'true') {
    console.log('⚠️ Mode dev: Email non envoyé');
    console.log('📧 Destinataire:', to);
    console.log('📝 Sujet:', subject);
    return { success: true, messageId: 'dev-mode-skipped' };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TalentProof <noreply@talentproof.com>',
      to,
      subject,
      html,
      text: text || '', // Fallback texte si HTML non supporté
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

// ==================== TEMPLATES EMAIL ====================

// Template de base pour tous les emails
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TalentProof</title>
  <style>
    body {
      font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #475569;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
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
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748B;
    }
    .footer a {
      color: #1E3A8A;
      text-decoration: none;
    }
    h1 {
      color: #1E3A8A;
      font-size: 24px;
      margin-bottom: 20px;
    }
    p {
      margin: 15px 0;
      color: #475569;
    }
    .highlight {
      background-color: #fef3c7;
      padding: 15px;
      border-left: 4px solid #F97316;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">✓ TalentProof</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>TalentProof</strong> - Le label de confiance pour les talents tech</p>
      <p>Avenue de lille 4 A52, 4020 Liège, Belgique</p>
      <p>
        <a href="mailto:info@princeaman.dev">info@princeaman.dev</a> | 
        <a href="tel:+32467620878">+32 467 62 08 78</a>
      </p>
      <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">
        © ${new Date().getFullYear()} TalentProof. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email de confirmation d'inscription
 */
export const confirmationEmailTemplate = (companyName, confirmationLink) => {
  const content = `
    <h1>Bienvenue sur TalentProof, ${companyName} ! 🎉</h1>
    <p>Merci de vous être inscrit sur TalentProof, la plateforme de recrutement des meilleurs talents tech juniors.</p>
    <p>Pour activer votre compte et accéder à notre catalogue de talents, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
    <div style="text-align: center;">
      <a href="${confirmationLink}" class="button">Confirmer mon email</a>
    </div>
    <p style="font-size: 14px; color: #64748B; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
      <a href="${confirmationLink}" style="color: #1E3A8A; word-break: break-all;">${confirmationLink}</a>
    </p>
    <div class="highlight">
      <strong>⏰ Ce lien expire dans 24 heures.</strong><br>
      Si vous n'avez pas créé de compte sur TalentProof, vous pouvez ignorer cet email.
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Email de réinitialisation de mot de passe
 */
export const resetPasswordTemplate = (companyName, resetLink) => {
  const content = `
    <h1>Réinitialisation de votre mot de passe</h1>
    <p>Bonjour ${companyName},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe sur TalentProof. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
    </div>
    <p style="font-size: 14px; color: #64748B; margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
      <a href="${resetLink}" style="color: #1E3A8A; word-break: break-all;">${resetLink}</a>
    </p>
    <div class="highlight">
      <strong>⏰ Ce lien expire dans 1 heure.</strong><br>
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
    </div>
    <p style="margin-top: 30px; font-size: 14px; color: #64748B;">
      Pour votre sécurité, ne partagez jamais ce lien avec qui que ce soit.
    </p>
  `;
  return baseTemplate(content);
};

/**
 * Email de notification à Prince (demande de contact pour un talent)
 */
export const contactNotificationTemplate = (talentInfo, recruteurInfo) => {
  const content = `
    <h1>🎯 Nouvelle demande de contact talent</h1>
    <p><strong>Un recruteur souhaite entrer en contact avec un de vos talents validés.</strong></p>
    
    <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 30px;">👤 Informations du talent</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Prénom :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${talentInfo.prenom}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Technologies :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${talentInfo.technologies.join(', ')}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Score :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${talentInfo.scoreTest}/100 (${talentInfo.plateforme})</td>
      </tr>
    </table>

    <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 30px;">🏢 Informations du recruteur</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Nom :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${recruteurInfo.nom}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Email :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <a href="mailto:${recruteurInfo.email}">${recruteurInfo.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <a href="tel:${recruteurInfo.tel}">${recruteurInfo.tel}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Entreprise :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${recruteurInfo.entreprise}</td>
      </tr>
    </table>

    <div class="highlight" style="margin-top: 30px;">
      <strong>💬 Message du recruteur :</strong><br><br>
      ${recruteurInfo.message.replace(/\n/g, '<br>')}
    </div>

    <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
      <strong>📋 Actions à faire :</strong>
      <ol style="margin: 10px 0;">
        <li>Contacter le recruteur par email ou téléphone</li>
        <li>Envoyer le CV complet du talent</li>
        <li>Organiser une mise en relation si approprié</li>
      </ol>
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Email de confirmation de demande de contact (envoyé au recruteur)
 */
export const contactConfirmationTemplate = (recruteurNom, talentPrenom) => {
  const content = `
    <h1>Demande bien reçue ! ✓</h1>
    <p>Bonjour ${recruteurNom},</p>
    <p>Merci pour votre intérêt pour <strong>${talentPrenom}</strong>, l'un de nos talents validés TalentProof.</p>
    <p>Votre demande a bien été reçue et nous allons la traiter dans les plus brefs délais.</p>
    <div class="highlight">
      <strong>⏱️ Délai de réponse : 24-48 heures</strong><br>
      Nous vous recontacterons rapidement avec les informations complètes sur ce talent.
    </div>
    <p>Notre équipe va :</p>
    <ul style="line-height: 2;">
      <li>Analyser votre demande</li>
      <li>Vérifier la disponibilité du talent</li>
      <li>Vous envoyer son CV complet et ses coordonnées</li>
      <li>Organiser une mise en relation si approprié</li>
    </ul>
    <p style="margin-top: 30px;">Si vous avez des questions en attendant, n'hésitez pas à nous contacter.</p>
  `;
  return baseTemplate(content);
};

/**
 * Email de notification de demande de devis (à Prince)
 */
export const devisNotificationTemplate = (devisInfo) => {
  const content = `
    <h1>📋 Nouvelle demande de devis</h1>
    <p><strong>Un client souhaite obtenir un devis pour son projet.</strong></p>
    
    <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 30px;">👤 Informations client</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Nom :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${devisInfo.nom}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Email :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <a href="mailto:${devisInfo.email}">${devisInfo.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <a href="tel:${devisInfo.telephone}">${devisInfo.telephone}</a>
        </td>
      </tr>
      ${devisInfo.entreprise ? `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Entreprise :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${devisInfo.entreprise}</td>
      </tr>
      ` : ''}
    </table>

    <h2 style="color: #1E3A8A; font-size: 18px; margin-top: 30px;">🎯 Détails du projet</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Type :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${devisInfo.typeProjet}</td>
      </tr>
      ${devisInfo.budget ? `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Budget :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${devisInfo.budget}</td>
      </tr>
      ` : ''}
      ${devisInfo.delai ? `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Délai :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${devisInfo.delai}</td>
      </tr>
      ` : ''}
    </table>

    <div class="highlight" style="margin-top: 30px;">
      <strong>💬 Description du projet :</strong><br><br>
      ${devisInfo.description.replace(/\n/g, '<br>')}
    </div>

    <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
      <strong>📋 Actions à faire :</strong>
      <ol style="margin: 10px 0;">
        <li>Contacter le client dans les 24h</li>
        <li>Préparer un devis détaillé</li>
        <li>Planifier une réunion si nécessaire</li>
      </ol>
    </div>
  `;
  return baseTemplate(content);
};

/**
 * Email de confirmation de demande de devis (au client)
 */
export const devisConfirmationTemplate = (clientNom) => {
  const content = `
    <h1>Demande de devis bien reçue ! ✓</h1>
    <p>Bonjour ${clientNom},</p>
    <p>Merci pour votre demande de devis sur TalentProof. Nous avons bien reçu les détails de votre projet.</p>
    <div class="highlight">
      <strong>⏱️ Délai de réponse : 24-48 heures</strong><br>
      Notre équipe va analyser votre demande et vous envoyer un devis personnalisé.
    </div>
    <p>Voici ce qui va se passer ensuite :</p>
    <ul style="line-height: 2;">
      <li>Analyse détaillée de vos besoins</li>
      <li>Préparation d'un devis sur-mesure</li>
      <li>Envoi du devis par email</li>
      <li>Disponibilité pour discuter du projet</li>
    </ul>
    <p style="margin-top: 30px;">Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement.</p>
  `;
  return baseTemplate(content);
};

export default {
  sendEmail,
  confirmationEmailTemplate,
  resetPasswordTemplate,
  contactNotificationTemplate,
  contactConfirmationTemplate,
  devisNotificationTemplate,
  devisConfirmationTemplate
};