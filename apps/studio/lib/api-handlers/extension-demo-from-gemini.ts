import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';
import { createHospitalWithStarter } from '@/lib/create-hospital';
import { applyHospitalBundle } from '@/lib/apply-hospital-bundle';
import { enqueueHospitalPublish } from '@/lib/enqueue-publish';
import { importHospitalBundleJson } from '@nabhicares/section-registry';
import { liveSiteUrl, pathStyleLiveUrl } from '@/lib/cdn';

/**
 * POST /api/extension/demo-from-gemini
 * Body: { json, campaignId?, mapsUrl?, notes?, publish?, reviewNote? }
 * Auth: cookie or Bearer nabxt_…
 */
export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const raw = typeof body.json === 'string' ? body.json : '';
  if (!raw.trim()) return badRequest('json string required (Gemini hospital bundle)');

  const peek = importHospitalBundleJson(raw);
  if (!peek.ok) return badRequest(peek.error);

  const name =
    (peek.hospital.name && peek.hospital.name.trim()) ||
    (typeof body.name === 'string' && body.name.trim()) ||
    '';
  if (!name) return badRequest('hospital.name missing in JSON — include name in the Gemini bundle');

  let campaignId: string | null = null;
  if (typeof body.campaignId === 'string' && body.campaignId.trim()) {
    const camp = await prisma.campaign.findUnique({
      where: { id: body.campaignId.trim() },
    });
    if (!camp) return badRequest('campaignId not found');
    campaignId = camp.id;
  }

  const mapsUrl =
    typeof body.mapsUrl === 'string' ? body.mapsUrl.trim().slice(0, 500) : null;
  const notes =
    typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : null;
  const doPublish = body.publish !== false;

  let hospital;
  try {
    hospital = await createHospitalWithStarter({
      name,
      slug: peek.hospital.slug,
      userId: auth.user.id,
      campaignId,
      mapsUrl,
      notes,
      pipelineStatus: 'DEMO',
      seoIndex: false,
    });
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : 'Create failed');
  }

  await writeAudit({
    actorId: auth.user.id,
    hospitalId: hospital.id,
    action: 'hospital.create',
    meta: { slug: hospital.slug, via: 'extension.demo-from-gemini' },
  });

  const imported = await applyHospitalBundle(hospital.id, raw);
  if (!imported.ok) {
    return json(
      {
        error: `Created hospital but import failed: ${imported.error}`,
        hospital,
      },
      422,
    );
  }

  await writeAudit({
    actorId: auth.user.id,
    hospitalId: hospital.id,
    action: 'hospital.import_bundle',
    meta: {
      via: 'extension.demo-from-gemini',
      updatedSectionIds: imported.updatedSectionIds,
      createdSectionKeys: imported.createdSectionKeys,
    },
  });

  let publish = null;
  let publishError: string | null = null;
  if (doPublish) {
    const reviewNote =
      typeof body.reviewNote === 'string' && body.reviewNote.trim()
        ? body.reviewNote.trim()
        : 'Field demo — Gemini paste via Chrome extension';
    try {
      publish = await enqueueHospitalPublish({
        hospitalId: hospital.id,
        hospitalSlug: hospital.slug,
        userId: auth.user.id,
        reviewNote,
      });
    } catch (e) {
      publishError = e instanceof Error ? e.message : 'Publish enqueue failed';
    }
  }

  const refreshed = await prisma.hospital.findUniqueOrThrow({
    where: { id: hospital.id },
    include: { campaign: true },
  });

  const liveUrl = liveSiteUrl(refreshed.slug);
  const pathUrl = pathStyleLiveUrl(refreshed.slug);

  return json(
    {
      hospital: refreshed,
      import: {
        updatedSectionIds: imported.updatedSectionIds,
        createdSectionKeys: imported.createdSectionKeys,
      },
      publish,
      publishError,
      liveUrl,
      pathUrl,
      qrUrl: `/api/hospitals/${refreshed.id}/qr`,
    },
    201,
  );
}
