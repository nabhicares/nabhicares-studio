import { Queue } from 'bullmq';
import IORedis from 'ioredis';

export const connection = new IORedis(
  process.env.REDIS_URL ?? 'redis://:nabhicares_redis_dev@localhost:6379',
  { maxRetriesPerRequest: null },
);

/** Bump when stale remote workers must be cut off from new Studio jobs. */
export const PUBLISH_QUEUE_NAME = 'publish-v2';

export const publishQueue = new Queue(PUBLISH_QUEUE_NAME, { connection });

export interface PublishJobData {
  hospitalId: string;
  publishId: string;
  triggeredBy: string;
}
