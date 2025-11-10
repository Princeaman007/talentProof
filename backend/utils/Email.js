import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporter Nodemailer
const createTransporter = () => {
  console.log('📧 Configuration Email:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    passLength: process.env.EMAIL_PASS?.length,
  });
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS?.replace(/\s/g, ''), // Enlever tous les espaces
    },
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

export default sendEmail;