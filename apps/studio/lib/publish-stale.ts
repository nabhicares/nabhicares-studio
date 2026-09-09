import { prisma } from '@/lib/db';

const STALE_MS = 20 * 60 * 1000;
const IN_FLIGHT = ['PENDING', 'BUILDING', 'UPLOADING'] as const;

/** Fail publishes stuck longer than 20 minutes. Optionally scoped to one hospital. */
export async function failStalePublishes(opts?: {
  hospitalId?: string;
}): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_MS);
  const stale = await prisma.publish.findMany({
    where: {
      status: { in: [...IN_FLIGHT] },
      createdAt: { lt: cutoff },
      ...(opts?.hospitalId ? { hospitalId: opts.hospitalId } : {}),
    },
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

export { STALE_MS as PUBLISH_STALE_MS };
