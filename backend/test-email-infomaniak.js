import { sendEmail } from './utils/emailService.js';
import 'dotenv/config';


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


try {
  const result = await sendEmail(testEmail);
} catch (error) {
}
