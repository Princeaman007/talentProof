import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporter Nodemailer
const createTransporter = () => {
  const emailPort = parseInt(process.env.EMAIL_PORT);
  const isSSL = emailPort === 465;
  
  console.log('📧 Configuration Email:', {
    host: process.env.EMAIL_HOST,
    port: emailPort,
    secure: isSSL,
    user: process.env.EMAIL_USER,
    passLength: process.env.EMAIL_PASS?.length || 0,
  });

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: emailPort,
    secure: isSSL, // true pour 465 (SSL), false pour 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // ✅ Important pour éviter les erreurs de certificat
      minVersion: 'TLSv1.2', // ✅ Forcer TLS 1.2 minimum
    },
    // ✨ OPTIMISÉ : Timeouts plus longs pour Render
    connectionTimeout: 60000, // 60 secondes (au lieu de 10s)
    greetingTimeout: 30000, // 30 secondes
    socketTimeout: 60000, // 60 secondes
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
    // Pool de connexions pour meilleure performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
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

    // ✅ Vérifier la connexion avant d'envoyer (optionnel mais recommandé)
    try {
      await transporter.verify();
      console.log('✅ Serveur email prêt');
    } catch (verifyError) {
      console.warn('⚠️ Vérification du serveur email échouée, tentative d\'envoi quand même...');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TalentProof <info@princeaman.dev>',
      to,
      subject,
      html,
      text: text || '', // Fallback texte si HTML non supporté
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    console.error('Détails:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
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
      ${recruteurInfo.tel ? `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Téléphone :</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
          <a href="tel:${recruteurInfo.tel}">${recruteurInfo.tel}</a>
        </td>
      </tr>
      ` : ''}
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

// ✨ Import des templates professionnels avec logo TalentProof
export { 
  talentDayConfirmationTemplate, 
  companyTalentDayRegistrationTemplate,
  contactNotificationTemplate,
  contactConfirmationTemplate
} from './emailTemplates.professional.js';

// Note: Les anciens templates restent disponibles ci-dessous pour référence
// mais ne sont plus utilisés. Ils seront supprimés dans une prochaine version.
  const content = `
    <h1>🎉 Inscription confirmée !</h1>
    <p>Bonjour <strong>${inscription.nom}</strong>,</p>
    <p>Nous avons bien reçu votre inscription au TalentDay :</p>
    
    <div style="background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="color: white; margin-top: 0; font-size: 24px;">${talentDay.titre}</h2>
      
      <div style="margin: 15px 0; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="margin: 8px 0; color: #E0E7FF;"><strong>📅 Date :</strong> ${new Date(talentDay.date).toLocaleDateString('fr-BE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        
        <p style="margin: 8px 0; color: #E0E7FF;"><strong>🕐 Horaires :</strong> ${talentDay.heureDebut} - ${talentDay.heureFin}</p>
        
        <p style="margin: 8px 0; color: #E0E7FF;"><strong>📍 Lieu :</strong> ${
          talentDay.lieu.type === 'en-ligne' 
            ? 'En ligne (le lien vous sera envoyé)' 
            : `${talentDay.lieu.adresse}, ${talentDay.lieu.ville}`
        }</p>
        
        ${talentDay.technologies && talentDay.technologies.length > 0 ? `
        <p style="margin: 8px 0; color: #E0E7FF;"><strong>💻 Technologies :</strong> ${talentDay.technologies.join(', ')}</p>
        ` : ''}
      </div>
    </div>
    
    <h3 style="color: #1E3A8A; margin-top: 30px;">📋 Prochaines étapes</h3>
    <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
      <ol style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
        <li>Votre candidature sera examinée par notre équipe</li>
        <li>Vous recevrez une réponse sous <strong>48 heures</strong></li>
        <li>Si accepté, vous recevrez tous les détails pratiques</li>
        <li>Préparez-vous pour une expérience enrichissante ! 🚀</li>
      </ol>
    </div>
    
    ${talentDay.prerequis && talentDay.prerequis.length > 0 ? `
    <h3 style="color: #1E3A8A; margin-top: 30px;">✅ N'oubliez pas d'apporter</h3>
    <ul style="line-height: 1.8;">
      ${talentDay.prerequis.map(p => `<li>${p}</li>`).join('')}
    </ul>
    ` : ''}
    
    ${talentDay.avantages && talentDay.avantages.length > 0 ? `
    <h3 style="color: #1E3A8A; margin-top: 30px;">🎁 Ce que vous allez gagner</h3>
    <ul style="line-height: 1.8;">
      ${talentDay.avantages.map(a => `<li>${a}</li>`).join('')}
    </ul>
    ` : ''}
    
    <div class="highlight" style="margin-top: 30px;">
      <strong>📞 Une question ?</strong><br>
      Contactez-nous à <a href="mailto:${talentDay.organisateur.email}" style="color: #1E3A8A;">${talentDay.organisateur.email}</a>
      ou au <a href="tel:${talentDay.organisateur.telephone}" style="color: #1E3A8A;">${talentDay.organisateur.telephone}</a>
    </div>
    
    <p style="margin-top: 40px; text-align: center; font-size: 18px; color: #1E3A8A;">
      <strong>À très bientôt ! 🚀</strong>
    </p>
  `;
  return baseTemplate(content);
};

/**
 * Template email pour acceptation TalentDay
 */
export const talentDayAcceptationTemplate = (inscription, talentDay) => {
  const content = `
    <h1>✅ Félicitations ! Vous êtes accepté(e) !</h1>
    <p>Bonjour <strong>${inscription.nom}</strong>,</p>
    <p>Nous avons le plaisir de vous confirmer votre <strong style="color: #16A34A;">participation acceptée</strong> au TalentDay :</p>
    
    <div style="background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="color: white; margin-top: 0; font-size: 24px;">${talentDay.titre}</h2>
      
      <div style="margin: 15px 0; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="margin: 8px 0; color: #DCFCE7;"><strong>📅 Date :</strong> ${new Date(talentDay.date).toLocaleDateString('fr-BE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
        
        <p style="margin: 8px 0; color: #DCFCE7;"><strong>🕐 Horaires :</strong> ${talentDay.heureDebut} - ${talentDay.heureFin}</p>
        
        <p style="margin: 8px 0; color: #DCFCE7;"><strong>📍 Lieu :</strong> ${
          talentDay.lieu.type === 'en-ligne' 
            ? `En ligne - ${talentDay.lieu.lienVirtuel || 'Le lien vous sera envoyé 24h avant'}` 
            : `${talentDay.lieu.adresse}, ${talentDay.lieu.ville}`
        }</p>
        
        ${talentDay.technologies && talentDay.technologies.length > 0 ? `
        <p style="margin: 8px 0; color: #DCFCE7;"><strong>💻 Technologies :</strong> ${talentDay.technologies.join(', ')}</p>
        ` : ''}
      </div>
    </div>
    
    <h3 style="color: #16A34A; margin-top: 30px;">🎯 Informations importantes</h3>
    <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #22C55E;">
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
        <li>Soyez présent(e) <strong>15 minutes avant le début</strong></li>
        <li>Préparez votre CV et portfolio si demandé</li>
        <li>Habillez-vous de manière professionnelle</li>
        <li>Venez avec des questions et une attitude positive ! 💪</li>
      </ul>
    </div>
    
    ${talentDay.prerequis && talentDay.prerequis.length > 0 ? `
    <h3 style="color: #16A34A; margin-top: 30px;">✅ À apporter impérativement</h3>
    <ul style="line-height: 1.8;">
      ${talentDay.prerequis.map(p => `<li>${p}</li>`).join('')}
    </ul>
    ` : ''}
    
    ${talentDay.programme && talentDay.programme.length > 0 ? `
    <h3 style="color: #16A34A; margin-top: 30px;">📋 Programme de la journée</h3>
    <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
      ${talentDay.programme.map(p => `
        <div style="margin-bottom: 15px;">
          <strong style="color: #16A34A;">${p.heure}</strong> - ${p.activite}
          ${p.description ? `<br><span style="color: #6B7280; font-size: 14px;">${p.description}</span>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <div class="highlight" style="margin-top: 30px; background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
      <strong>⚠️ Important :</strong> En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.
    </div>
    
    <div class="highlight" style="margin-top: 20px;">
      <strong>📞 Questions ?</strong><br>
      Contactez-nous à <a href="mailto:${talentDay.organisateur.email}" style="color: #16A34A;">${talentDay.organisateur.email}</a>
      ou au <a href="tel:${talentDay.organisateur.telephone}" style="color: #16A34A;">${talentDay.organisateur.telephone}</a>
    </div>
    
    <p style="margin-top: 40px; text-align: center; font-size: 20px; color: #16A34A;">
      <strong>🎉 Nous avons hâte de vous rencontrer ! 🚀</strong>
    </p>
  `;
  return baseTemplate(content);
};

/**
 * Template email pour refus TalentDay
 */
export const talentDayRefusTemplate = (inscription, talentDay) => {
  const content = `
    <h1>Réponse à votre candidature</h1>
    <p>Bonjour <strong>${inscription.nom}</strong>,</p>
    <p>Nous vous remercions sincèrement pour l'intérêt que vous avez porté au TalentDay <strong>"${talentDay.titre}"</strong> prévu le ${new Date(talentDay.date).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}.</p>
    
    <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #6B7280;">
      <p style="margin: 0; line-height: 1.8;">
        Après examen attentif de votre profil, nous avons le regret de vous informer que nous ne pouvons pas retenir votre candidature pour cet événement. Le nombre de places étant limité, nous avons dû faire des choix difficiles.
      </p>
    </div>
    
    <h3 style="color: #1E3A8A; margin-top: 30px;">🚀 Ne vous découragez pas !</h3>
    <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
      <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>D'autres TalentDays arrivent bientôt</strong> - Restez à l'écoute de nos prochains événements</li>
        <li><strong>Améliorez votre profil</strong> - Continuez à développer vos compétences</li>
        <li><strong>Réessayez</strong> - Nous serions ravis de recevoir une nouvelle candidature</li>
        <li><strong>Consultez nos ressources</strong> - Visitez notre site pour des conseils carrière</li>
      </ul>
    </div>
    
    <div class="highlight" style="margin-top: 30px;">
      <strong>💡 Conseil :</strong> Continuez à postuler à nos futurs événements. Chaque expérience compte et votre profil peut évoluer !
    </div>
    
    <div style="margin-top: 30px; text-align: center;">
      <p style="color: #6B7280; font-size: 14px; margin: 10px 0;">
        Nous vous encourageons à suivre nos actualités et à postuler à nos prochains événements.
      </p>
      <a href="https://princeaman.dev" style="display: inline-block; background: #1E3A8A; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; margin-top: 10px; font-weight: bold;">
        Voir nos prochains événements
      </a>
    </div>
    
    <div class="highlight" style="margin-top: 30px;">
      <strong>📞 Besoin d'informations ?</strong><br>
      Notre équipe reste à votre disposition : <a href="mailto:${talentDay.organisateur.email}" style="color: #1E3A8A;">${talentDay.organisateur.email}</a>
    </div>
    
    <p style="margin-top: 40px; text-align: center; color: #6B7280;">
      Nous vous souhaitons beaucoup de succès dans vos projets professionnels.<br>
      <strong style="color: #1E3A8A;">L'équipe TalentProof</strong>
    </p>
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
  devisConfirmationTemplate,
  talentDayConfirmationTemplate,
  talentDayAcceptationTemplate,
  talentDayRefusTemplate,
};