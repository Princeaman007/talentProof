import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmailSend() {

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
  } catch (error) {
    return;
  }

  try {
    const confirmationToken = 'test-token-123';
    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email/${confirmationToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Envoyer à soi-même pour test
      subject: 'TEST - Confirmation de votre compte TalentProof',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bienvenue sur TalentProof!</h2>
          <p>Cliquez sur le lien ci-dessous pour confirmer votre compte:</p>
          <a href="${confirmationLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Confirmer mon compte
          </a>
          <p>Lien: ${confirmationLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Ce lien expire dans 24 heures.
          </p>
        </div>
      `
    });
  } catch (error) {
  }

  try {
    const resetToken = 'test-reset-token-456';
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'TEST - Réinitialisation de votre mot de passe TalentProof',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
          <a href="${resetLink}" style="background-color: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p>Lien: ${resetLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Ce lien expire dans 1 heure.
          </p>
        </div>
      `
    });
  } catch (error) {
  }

}

testEmailSend().catch(console.error);
