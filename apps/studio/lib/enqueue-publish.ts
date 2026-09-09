import { randomUUID } from 'crypto';
import { prisma } from '@/lib/db';
import { publishQueue } from '@nabhicares/queue';
import { ensureHospitalSectionsMigrated } from '@/lib/migrate-sections';
import { writeAudit } from '@/lib/auth';

export async function enqueueHospitalPublish(opts: {
  hospitalId: string;
  hospitalSlug: string;
  userId: string;
  reviewNote: string;
  approvedBy?: string;
}) {
  const reviewNote = opts.reviewNote.trim().slice(0, 500);
  if (!reviewNote) {
    throw new Error('reviewNote required');
  }

  const inFlight = await prisma.publish.findFirst({
    where: {
      hospitalId: opts.hospitalId,
      status: { in: ['PENDING', 'BUILDING', 'UPLOADING'] },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (inFlight) {
    const err = new Error('A publish is already in progress for this hospital') as Error & {
      status: number;
      publishId: string;
    };
    err.status = 409;
    err.publishId = inFlight.id;
    throw err;
  }

  await ensureHospitalSectionsMigrated(opts.hospitalId);

  const publishId = randomUUID();
  const publish = await prisma.publish.create({
    data: {
      id: publishId,
      hospitalId: opts.hospitalId,
      status: 'PENDING',
      triggeredBy: opts.userId,
      approvedBy: opts.approvedBy ?? opts.userId,
      reviewNote,
    },
  });

  await publishQueue.add('publish', {
    hospitalId: opts.hospitalSlug,
    publishId,
    triggeredBy: opts.userId,
  });

  await writeAudit({
    actorId: opts.userId,
    hospitalId: opts.hospitalId,
    action: 'publish.enqueue',
    meta: { publishId, reviewNote },
  });

  return publish;
}
