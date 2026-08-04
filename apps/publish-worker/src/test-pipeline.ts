import { QueueEvents } from 'bullmq';
import { publishQueue, connection } from '@nabhicares/queue';
import { promoteToLive, readLivePublishId } from '@nabhicares/snapshot-store';
import { PrismaClient } from '@nabhicares/db-builder';
import { randomUUID } from 'crypto';

const queueEvents = new QueueEvents('publish', { connection });
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.BUILDER_DATABASE_URL } },
});

async function checkUrl(url: string, mustInclude: string[]) {
  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${url} -> ${res.status}\n${body}`);
  }
  for (const needle of mustInclude) {
    if (!body.includes(needle)) {
      throw new Error(`${url} missing expected content: ${JSON.stringify(needle)}\n---\n${body}`);
    }
  }
  return body;
}

async function publishAndWait(hospitalSlug: string) {
  const hospital = await prisma.hospital.findUnique({ where: { slug: hospitalSlug } });
  if (!hospital) throw new Error(`Hospital not found: ${hospitalSlug}`);

  const publishId = randomUUID();
  await prisma.publish.create({
    data: {
      id: publishId,
      hospitalId: hospital.id,
      status: 'PENDING',
      triggeredBy: 'test-script',
    },
  });

  console.log(`Enqueuing publish job for ${hospitalSlug} (${publishId})...`);
  const job = await publishQueue.add('publish', {
    hospitalId: hospitalSlug,
    publishId,
    triggeredBy: 'test-script',
  });

  console.log(`Waiting for job ${job.id} to finish...`);
  await job.waitUntilFinished(queueEvents, 180_000);
  await new Promise((r) => setTimeout(r, 500));

  const live = await readLivePublishId(hospitalSlug);
  if (live !== publishId) {
    throw new Error(`LIVE pointer expected ${publishId}, got ${live}`);
  }

  const url = `http://localhost:8080/${hospitalSlug}/`;
  const body = await checkUrl(url, [
    hospitalSlug === 'demo-hospital' ? 'Demo Hospital' : 'Metro Clinic',
    'data-nabhi-built-at',
  ]);
  return { body, publishId, hospitalId: hospital.id };
}

async function main() {
  const first = await publishAndWait('demo-hospital');
  console.log('✅ Pipeline works: build -> snapshot -> LIVE pointer -> CDN');
  console.log('--- home (first 400 chars) ---');
  console.log(first.body.slice(0, 400));

  if (!first.body.includes('/demo-hospital/_next/')) {
    throw new Error('Expected assetPrefix /demo-hospital/_next/ in exported HTML');
  }
  console.log('✅ assetPrefix points at /demo-hospital/_next/');

  await checkUrl('http://localhost:8080/demo-hospital/doctors/', ['doctors', 'Dr. Rao']);
  console.log('✅ /demo-hospital/doctors/ served');

  if (first.body.includes('Hidden FAQ') || first.body.includes('Should not appear')) {
    throw new Error('Disabled section leaked into home export');
  }
  console.log('✅ disabled sections excluded from demo-hospital home');

  const second = await publishAndWait('demo-hospital');
  console.log('✅ Second publish flipped LIVE pointer');

  await promoteToLive('demo-hospital', first.publishId);
  await prisma.$transaction([
    prisma.publish.updateMany({
      where: { hospitalId: first.hospitalId, isLive: true },
      data: { isLive: false, status: 'ROLLED_BACK' },
    }),
    prisma.publish.update({
      where: { id: first.publishId },
      data: { isLive: true, status: 'LIVE' },
    }),
  ]);
  await new Promise((r) => setTimeout(r, 300));

  const afterRollback = await readLivePublishId('demo-hospital');
  if (afterRollback !== first.publishId) {
    throw new Error(`Rollback failed: LIVE=${afterRollback}, want ${first.publishId}`);
  }
  await checkUrl('http://localhost:8080/demo-hospital/', ['Demo Hospital', 'data-nabhi-built-at']);
  console.log(`✅ Rollback restored LIVE → ${first.publishId} (not ${second.publishId})`);

  const metroHome = await publishAndWait('metro-clinic');
  await checkUrl('http://localhost:8080/metro-clinic/', ['Metro Clinic', 'Services']);
  await checkUrl('http://localhost:8080/metro-clinic/doctors/', ['Dr. Shah']);
  await checkUrl('http://localhost:8080/metro-clinic/services/', ['Dialysis']);
  console.log('✅ metro-clinic multi-page output served');

  if (metroHome.body.includes('Disabled testimonials') || metroHome.body.includes('"excluded"')) {
    throw new Error('Disabled section leaked into metro-clinic home');
  }
  console.log('✅ disabled sections excluded from metro-clinic');

  if (!metroHome.body.includes('/metro-clinic/_next/')) {
    throw new Error('Expected assetPrefix /metro-clinic/_next/ in metro HTML');
  }

  process.exit(0);
}

main()
  .catch((err) => {
    console.error('Pipeline test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await queueEvents.close();
  });
