import { PrismaClient } from '@nabhicares/db-builder';

const STALE_MS = 20 * 60 * 1000;
const IN_FLIGHT = ['PENDING', 'BUILDING', 'UPLOADING'] as const;

/** Mark publishes stuck in PENDING|BUILDING|UPLOADING longer than 20m as FAILED. */
export async function failStalePublishes(
  prisma: PrismaClient,
  opts?: { hospitalId?: string },
): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_MS);
  const where = {
    status: { in: [...IN_FLIGHT] },
    createdAt: { lt: cutoff },
    ...(opts?.hospitalId ? { hospitalId: opts.hospitalId } : {}),
  };

  const stale = await prisma.publish.findMany({
    where,
    include: { hospital: { select: { slug: true } } },
  });
  if (!stale.length) return 0;

  const now = new Date();
  await prisma.publish.updateMany({
    where: { id: { in: stale.map((p) => p.id) } },
    data: {
      status: 'FAILED',
      completedAt: now,
    },
  });

  for (const p of stale) {
    console.log(`[publish-stale] failed ${p.id} ${p.hospital.slug}`);
  }
  return stale.length;
}

export function isPublishStale(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() > STALE_MS;
}

export { STALE_MS as PUBLISH_STALE_MS };
