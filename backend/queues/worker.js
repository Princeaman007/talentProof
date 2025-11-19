import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendMailImmediate } from '../utils/Email.js';

// Start a worker that processes email sending jobs
const connection = process.env.REDIS_URL ? new IORedis(process.env.REDIS_URL) : null;

let worker = null;

const startWorker = () => {
  if (!connection) {
    console.log(' Email worker not started (no REDIS_URL configured)');
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
    console.log(` Email job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(` Email job ${job.id} failed:`, err?.message || err);
  });

  console.log(' Email worker started (connected to Redis)');
};

startWorker();

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(` Email worker shutting down (${signal})`);
  try {
    if (worker) {
      await worker.close();
      console.log(' Worker closed');
    }
    if (connection) {
      await connection.quit();
      console.log(' Redis connection closed');
    }
    process.exit(0);
  } catch (err) {
    console.error(' Error during worker shutdown', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export { startWorker, shutdown };
