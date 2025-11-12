import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  service: 'gmail', // ou 'smtp.gmail.com'
  auth: {
    user: process.env.EMAIL_USER, // Ton email Gmail
    pass: process.env.EMAIL_PASS  // Ton mot de passe d'application Gmail
  }
});

// Fonction pour envoyer un email
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: {
        name: 'TalentProof',
        address: process.env.EMAIL_USER
      },
      to,
      subject,
      html,
      text: text || '' // Version texte de l'email (optionnel)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Impossible d\'envoyer l\'email');
  }
};

// Templates d'emails prédéfinis

export const emailTemplates = {
  // Email de confirmation d'inscription entreprise
  confirmationInscription: (nom, confirmationLink) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1E3A8A; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Bienvenue sur TalentProof !</h1>
        </div>
        <div class="content">
          <h2>Bonjour ${nom},</h2>
          <p>Merci de vous être inscrit sur TalentProof ! Pour activer votre compte et accéder à notre catalogue de talents validés, veuillez confirmer votre adresse email.</p>
          
          <div style="text-align: center;">
            <a href="${confirmationLink}" class="button">Confirmer mon email</a>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <p style="background: #e9e9e9; padding: 10px; word-break: break-all; font-size: 12px;">${confirmationLink}</p>
          
          <p><strong>Ce lien expire dans 24 heures.</strong></p>
          
          <p>Si vous n'avez pas créé de compte sur TalentProof, vous pouvez ignorer cet email.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p>À bientôt sur TalentProof,<br>
          <strong>L'équipe TalentProof</strong></p>
        </div>
        <div class="footer">
          <p>📧 info@princeaman.dev | 📱 +32 467 62 08 78</p>
          <p>Avenue de lille 4 A52, 4020 Liège, Belgique</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Email de bienvenue après confirmation
  bienvenue: (nom) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .feature { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #1E3A8A; border-radius: 5px; }
        .button { display: inline-block; background: #F97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Compte activé !</h1>
        </div>
        <div class="content">
          <h2>Félicitations ${nom} ! 🎉</h2>
          <p>Votre compte TalentProof est maintenant actif. Vous avez accès à notre catalogue complet de talents tech validés.</p>
          
          <h3>Ce que vous pouvez faire maintenant :</h3>
          
          <div class="feature">
            <strong>🔍 Explorer notre catalogue</strong><br>
            Découvrez nos développeurs juniors testés en conditions réelles
          </div>
          
          <div class="feature">
            <strong>📋 Filtrer par compétences</strong><br>
            Trouvez le profil qui correspond exactement à vos besoins
          </div>
          
          <div class="feature">
            <strong>💬 Contacter nos talents</strong><br>
            Demandez plus d'informations sur les profils qui vous intéressent
          </div>
          
          <div class="feature">
            <strong>🚀 Demander un devis</strong><br>
            Besoin d'un site ou d'une app ? Nos talents peuvent vous aider !
          </div>
          
          <div style="text-align: center;">
            <a href="http://localhost:5173/talents" class="button">Découvrir les talents</a>
          </div>
          
          <p>Besoin d'aide ? N'hésitez pas à nous contacter !</p>
          
          <p>À très bientôt,<br>
          <strong>L'équipe TalentProof</strong></p>
        </div>
        <div class="footer">
          <p>📧 info@princeaman.dev | 📱 +32 467 62 08 78</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Email de notification de demande de contact pour un talent (à Prince)
  notificationContactTalent: (talent, recruteur) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F97316; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #ddd; }
        .label { font-weight: bold; color: #1E3A8A; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Nouvelle Demande de Contact</h1>
        </div>
        <div class="content">
          <h2>Un recruteur souhaite en savoir plus sur un talent !</h2>
          
          <div class="info-box">
            <h3>👤 Talent concerné</h3>
            <p><span class="label">Prénom:</span> ${talent.prenom}</p>
            <p><span class="label">Technologies:</span> ${talent.technologies.join(', ')}</p>
            <p><span class="label">Score:</span> ${talent.scoreTest} (${talent.plateforme})</p>
          </div>
          
          <div class="info-box">
            <h3>🏢 Informations Recruteur</h3>
            <p><span class="label">Nom:</span> ${recruteur.nom}</p>
            <p><span class="label">Email:</span> <a href="mailto:${recruteur.email}">${recruteur.email}</a></p>
            <p><span class="label">Téléphone:</span> <a href="tel:${recruteur.telephone}">${recruteur.telephone}</a></p>
            <p><span class="label">Entreprise:</span> ${recruteur.entreprise}</p>
          </div>
          
          <div class="info-box">
            <h3>💬 Message du recruteur</h3>
            <p>${recruteur.message}</p>
          </div>
          
          <p><strong>Action requise:</strong> Envoyer le CV complet et les informations détaillées du talent au recruteur.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            <strong>ID Demande:</strong> ${Date.now()}<br>
            <strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

export default { sendEmail, emailTemplates };