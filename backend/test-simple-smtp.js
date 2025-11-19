import pkg from 'nodemailer';
const { createTransporter } = pkg;
import 'dotenv/config';

console.log('\n🔍 TEST CONNEXION SMTP INFOMANIAK\n');

const PORTS = [2525, 587, 465];

for (const port of PORTS) {
  console.log(`\n📡 Test port ${port}...`);
  
  const transporter = createTransporter({
    host: 'mail.infomaniak.com',
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
  });

  try {
    await transporter.verify();
    console.log(`✅ Port ${port} : FONCTIONNE !`);
  } catch (error) {
    console.log(`❌ Port ${port} : ${error.code || error.message}`);
  }
}
