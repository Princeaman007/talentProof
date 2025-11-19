import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { enqueueEmail, getEmailQueue } from '../queues/emailQueue.js';

dotenv.config();

// Create and return a transporter according to environment flags
export const createTransporter = async () => {
  if (process.env.SKIP_EMAILS === 'true' || process.env.EMAIL_TEST_MODE === 'noop') {
    console.log(' Email: using noop/jsonTransport (emails will not be sent)');
    return nodemailer.createTransport({ jsonTransport: true });
  }

  if (process.env.NODE_ENV === 'test' || process.env.EMAIL_TEST_MODE === 'ethereal') {
    console.log(' Email: using Ethereal test account for NODE_ENV=test');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const secureFlag = (process.env.EMAIL_SECURE === 'true') || port === 465;
  const tlsRejectUnauthorized = process.env.EMAIL_ALLOW_INVALID_CERT === 'true' ? false : true;

  console.log(' Configuration Email:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    passLength: process.env.EMAIL_PASS?.length,
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: secureFlag,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
    },
    tls: {
      rejectUnauthorized: tlsRejectUnauthorized,
    },
    //  NOUVEAU : Configuration pour éviter les timeouts sur Render
    connectionTimeout: 60000, // 60 secondes au lieu de 2 minutes par défaut
    greetingTimeout: 30000, // 30 secondes pour le greeting
    socketTimeout: 60000, // 60 secondes pour les opérations socket
    // Retry en cas d'échec
    pool: true, // Utiliser un pool de connexions
    maxConnections: 5,
    maxMessages: 100,
  });
};

/**
 * Send mail immediately (used by worker or when Redis not configured)
 */
export const sendMailImmediate = async ({ to, subject, html, text }) => {
  if (process.env.SKIP_EMAILS === 'true') {
    console.log(' Mode dev: Email non envoyé');
    console.log(' Destinataire:', to);
    console.log(' Sujet:', subject);
    return { success: true, messageId: 'dev-mode-skipped' };
  }

  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'TalentProof <noreply@talentproof.com>',
    to,
    subject,
    html,
    text: text || '',
  };

  const info = await transporter.sendMail(mailOptions);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log(' Email envoyé (Ethereal preview):', previewUrl);
  else console.log(' Email envoyé:', info.messageId);
  return { success: true, messageId: info.messageId, previewUrl };
};

/**
 * Public helper: send email. If a Redis queue is configured (or EMAIL_QUEUE=true), enqueue the job.
 * Otherwise send immediately.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  // If explicitly skipping emails, short-circuit
  if (process.env.SKIP_EMAILS === 'true' || process.env.EMAIL_TEST_MODE === 'noop') {
    console.log(' Mode dev/CI: Email non envoyé');
    return { success: true, messageId: 'dev-mode-skipped' };
  }

  // If REDIS_URL present or EMAIL_QUEUE explicitly enabled, attempt to enqueue
  const queue = getEmailQueue();
  const shouldQueue = !!queue || process.env.EMAIL_QUEUE === 'true';

  if (shouldQueue && queue) {
    try {
      await enqueueEmail({ to, subject, html, text });
      return { success: true, queued: true };
    } catch (err) {
      console.error(' Failed to enqueue email job, falling back to immediate send:', err?.message || err);
      // fall through to immediate send
    }
  }

  // Fallback: immediate send
  return sendMailImmediate({ to, subject, html, text });
};

export default sendEmail;