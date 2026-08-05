import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { IncompleteSnapshotError, promoteToLive } from '@nabhicares/snapshot-store';

/**
 * Instant rollback: flip LIVE pointer to an older complete snapshot. No rebuild.
 */
export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'PUBLISHER');
  if ('error' in access) return access.error;
  const hospital = access.hospital;

  const { publishId } = await req.json();
  if (!publishId) return badRequest('publishId required');

  const target = await prisma.publish.findFirst({
    where: { id: publishId, hospitalId: hospital.id },
  });
  if (!target) return notFound('Publish not found');

  try {
    await promoteToLive(hospital.slug, publishId);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Promote failed';
    if (err instanceof IncompleteSnapshotError || (err as Error)?.name === 'IncompleteSnapshotError') {
      return badRequest(message);
    }
    throw err;
  }

  await prisma.$transaction([
    prisma.publish.updateMany({
      where: { hospitalId: hospital.id, isLive: true },
      data: { isLive: false, status: 'ROLLED_BACK' },
    }),
    prisma.publish.update({
      where: { id: publishId },
      data: { isLive: true, status: 'LIVE', completedAt: new Date() },
    }),
  ]);

  await writeAudit({
    actorId: access.user.id,
    hospitalId: hospital.id,
    action: 'publish.rollback',
    meta: { publishId },
  });

  const live = await prisma.publish.findUnique({ where: { id: publishId } });
  return json({ ok: true, live, rebuilt: false });
}
