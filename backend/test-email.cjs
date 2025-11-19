const nodemailer = require('nodemailer');
require('dotenv').config();

console.log(' Test de configuration email...\n');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass length:', process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({  // ← Sans "er"
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
  },
});

console.log('\n Test de connexion SMTP...');

transporter.verify((error) => {
  if (error) {
    console.log(' ERREUR:', error.message);
    console.log('\n Vérifie ton App Password Gmail');
    console.log(' https://myaccount.google.com/apppasswords');
    process.exit(1);
  } else {
    console.log(' CONNEXION RÉUSSIE!');
    console.log('\n Envoi d\'un email de test...');
    
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: ' Test TalentProof',
      html: '<h1> Succès!</h1><p>Les emails fonctionnent!</p>',
    }, (err, info) => {
      if (err) {
        console.log(' Erreur envoi:', err.message);
      } else {
        console.log(' EMAIL ENVOYÉ!');
        console.log('Message ID:', info.messageId);
        console.log('\n Vérifie ta boîte mail:', process.env.EMAIL_USER);
      }
      process.exit(0);
    });
  }
});