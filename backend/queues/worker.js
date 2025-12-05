import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendMailImmediate } from '../utils/Email.js';

// Start a worker that processes email sending jobs
const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : null;

let worker = null;

const startWorker = () => {
  if (!connection) {
    return;
  }

  worker = new Worker(
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
  });

  worker.on('failed', (job, err) => {
  });

};

startWorker();

// Graceful shutdown
const shutdown = async (signal) => {
  try {
    if (worker) {
      await worker.close();
    }
    if (connection) {
      await connection.quit();
    }
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { startWorker, shutdown };
