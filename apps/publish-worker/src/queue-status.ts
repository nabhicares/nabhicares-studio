import { Queue } from 'bullmq';
import { connection, PUBLISH_QUEUE_NAME } from '@nabhicares/queue';

async function main() {
  const q = new Queue(PUBLISH_QUEUE_NAME, { connection });
  const [waiting, active, delayed, failed, completed] = await Promise.all([
    q.getWaitingCount(),
    q.getActiveCount(),
    q.getDelayedCount(),
    q.getFailedCount(),
    q.getCompletedCount(),
  ]);
  console.log({ waiting, active, delayed, failed, completed });
  const jobs = await q.getJobs(['waiting', 'active', 'delayed', 'failed'], 0, 10);
  for (const j of jobs) {
    console.log(j.id, j.name, await j.getState(), j.data);
  }
  await q.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
