import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { softUnpublishHospital } from '@/lib/hospital-lifecycle';
import { enqueueHospitalPublish } from '@/lib/enqueue-publish';

const STATUSES = new Set(['DEMO', 'ACCEPTED', 'DECLINED', 'TRASHED']);

/**
 * PATCH /api/hospitals/:hospitalId/pipeline
 * Body: { status, notes?, mapsUrl?, campaignId?, republish? }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'ADMIN', req);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const status =
    typeof body.status === 'string' ? body.status.trim().toUpperCase() : '';
  if (!STATUSES.has(status)) {
    return badRequest('status must be DEMO | ACCEPTED | DECLINED | TRASHED');
  }

  const data: {
    pipelineStatus: 'DEMO' | 'ACCEPTED' | 'DECLINED' | 'TRASHED';
    trashedAt?: Date | null;
    seoIndex?: boolean;
    notes?: string | null;
    mapsUrl?: string | null;
    campaignId?: string | null;
    contactedAt?: Date | null;
  } = {
    pipelineStatus: status as 'DEMO' | 'ACCEPTED' | 'DECLINED' | 'TRASHED',
  };

  if (status === 'TRASHED' || status === 'DECLINED') {
    // Decline moves to trash with 30-day retention
    data.pipelineStatus = 'TRASHED';
    data.trashedAt = new Date();
    data.seoIndex = false;
  } else if (status === 'ACCEPTED') {
    data.trashedAt = null;
    data.seoIndex = true;
    data.contactedAt = new Date();
  } else if (status === 'DEMO') {
    data.trashedAt = null;
    data.seoIndex = false;
  }

  if (typeof body.notes === 'string') {
    data.notes = body.notes.trim().slice(0, 2000) || null;
  }
  if (typeof body.mapsUrl === 'string') {
    data.mapsUrl = body.mapsUrl.trim().slice(0, 500) || null;
  }
  if (body.campaignId === null) {
    data.campaignId = null;
  } else if (typeof body.campaignId === 'string' && body.campaignId.trim()) {
    const camp = await prisma.campaign.findUnique({
      where: { id: body.campaignId.trim() },
    });
    if (!camp) return badRequest('campaignId not found');
    data.campaignId = camp.id;
  }

  const updated = await prisma.hospital.update({
    where: { id: access.hospital.id },
    data,
    include: { campaign: true, publishes: { where: { isLive: true }, take: 1 } },
  });

  if (updated.pipelineStatus === 'TRASHED') {
    await softUnpublishHospital(updated.id, updated.slug);
  }

  let publish = null;
  if (
    updated.pipelineStatus === 'ACCEPTED' &&
    body.republish === true
  ) {
    try {
      publish = await enqueueHospitalPublish({
        hospitalId: updated.id,
        hospitalSlug: updated.slug,
        userId: access.user.id,
        reviewNote:
          typeof body.reviewNote === 'string' && body.reviewNote.trim()
            ? body.reviewNote.trim()
            : 'Accepted — restore / republish from CRM',
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Publish failed';
      return json({ hospital: updated, publishError: msg }, 200);
    }
  }

  await writeAudit({
    actorId: access.user.id,
    hospitalId: updated.id,
    action: 'hospital.pipeline',
    meta: { status: updated.pipelineStatus, trashedAt: updated.trashedAt },
  });

  return json({ hospital: updated, publish });
}
