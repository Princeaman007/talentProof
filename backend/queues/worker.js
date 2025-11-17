import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendMailImmediate } from '../utils/Email.js';

// Start a worker that processes email sending jobs
const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : null;

if (connection) {
  const worker = new Worker(
    'emails',
    async (job) => {
      const data = job.data || {};
      // job.data should contain { to, subject, html, text }
      await sendMailImmediate(data);
      return { ok: true };
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`📧 Email job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Email job ${job.id} failed:`, err?.message || err);
  });

  console.log('🔁 Email worker started (connected to Redis)');
} else {
  console.log('🔁 Email worker not started (no REDIS_URL configured)');
}
