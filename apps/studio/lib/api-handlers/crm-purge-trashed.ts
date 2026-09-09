import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';
import { hardDeleteHospital } from '@/lib/hospital-lifecycle';

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * POST /api/crm/purge-trashed
 * Hard-deletes hospitals in TRASHED with trashedAt older than 30 days.
 * Super-admin only (also run from publish-worker cron).
 */
export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;
  if (!auth.user.isSuperAdmin) {
    return json({ error: 'Super admin required' }, 403);
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body.dryRun === true;
  const cutoff = new Date(Date.now() - RETENTION_MS);

  const due = await prisma.hospital.findMany({
    where: {
      pipelineStatus: 'TRASHED',
      trashedAt: { lte: cutoff },
    },
    select: { id: true, slug: true, name: true, trashedAt: true },
  });

  if (dryRun) {
    return json({ dryRun: true, count: due.length, hospitals: due });
  }

  const deleted: { id: string; slug: string; objectsDeleted: number }[] = [];
  for (const h of due) {
    try {
      const result = await hardDeleteHospital(h.id);
      deleted.push({
        id: h.id,
        slug: result.slug,
        objectsDeleted: result.objectsDeleted,
      });
      await writeAudit({
        actorId: auth.user.id,
        hospitalId: h.id,
        action: 'hospital.purge_trashed',
        meta: { slug: result.slug, objectsDeleted: result.objectsDeleted },
      });
    } catch (err) {
      console.error('[purge-trashed] failed', h.id, err);
    }
  }

  return json({ deleted: deleted.length, hospitals: deleted });
}

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const cutoff = new Date(Date.now() - RETENTION_MS);
  const trashed = await prisma.hospital.findMany({
    where: { pipelineStatus: 'TRASHED' },
    orderBy: { trashedAt: 'asc' },
    include: { campaign: true },
  });

  return json({
    retentionDays: 30,
    cutoff,
    trashed: trashed.map((h) => ({
      ...h,
      purgeDue: h.trashedAt ? h.trashedAt <= cutoff : false,
      daysLeft: h.trashedAt
        ? Math.max(
            0,
            Math.ceil((h.trashedAt.getTime() + RETENTION_MS - Date.now()) / 86400000),
          )
        : null,
    })),
  });
}
