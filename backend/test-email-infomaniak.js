import { sendEmail } from './utils/emailService.js';
import 'dotenv/config';

console.log('\n TEST EMAIL INFOMANIAK\n');

const testEmail = {
  to: 'info@princeaman.dev',
  subject: ' Test connexion SMTP Infomaniak',
  html: `
    <h1>Test de connexion</h1>
    <p>Ce test vérifie que la connexion SMTP avec Infomaniak fonctionne.</p>
    <p><strong>Port actuel :</strong> ${process.env.EMAIL_PORT}</p>
    <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
  `,
  text: 'Test de connexion SMTP'
};

console.log(` Envoi email de test vers ${testEmail.to}...`);
console.log(`  Port configuré : ${process.env.EMAIL_PORT}`);

try {
  const result = await sendEmail(testEmail);
  console.log('\n EMAIL ENVOYÉ AVEC SUCCÈS !');
  console.log('Message ID:', result.messageId);
} catch (error) {
  console.log('\n ÉCHEC ENVOI EMAIL');
  console.error('Erreur:', error.message);
  console.error('Code:', error.code);
}
