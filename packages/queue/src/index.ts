import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis(
  process.env.REDIS_URL ?? 'redis://:nabhicares_redis_dev@localhost:6379',
  { maxRetriesPerRequest: null },
);

export const publishQueue = new Queue('publish', { connection });

export interface PublishJobData {
  hospitalId: string;
  publishId: string;
  triggeredBy: string;
}
