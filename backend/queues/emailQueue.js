import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL)
  : null;

let emailQueue;

export const getEmailQueue = () => {
  if (emailQueue) return emailQueue;

  if (!connection) {
    // No Redis configured - caller should fallback to immediate sending
    return null;
  }

  emailQueue = new Queue('emails', { connection });
  return emailQueue;
};

export const enqueueEmail = async (payload) => {
  const q = getEmailQueue();
  if (!q) return null;

  // Add job with some defaults; attempt retries on failure
  return q.add('send-email', payload, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
  });
};

export default { getEmailQueue, enqueueEmail };
