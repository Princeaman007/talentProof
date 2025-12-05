import pkg from 'nodemailer';
const { createTransporter } = pkg;
import 'dotenv/config';


const PORTS = [2525, 587, 465];

for (const port of PORTS) {
  
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
  } catch (error) {
  }
}
