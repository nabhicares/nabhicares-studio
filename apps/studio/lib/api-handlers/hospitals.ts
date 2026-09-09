import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';
import { createHospitalWithStarter } from '@/lib/create-hospital';

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const url = new URL(req.url);
  const status = url.searchParams.get('pipelineStatus');
  const campaignId = url.searchParams.get('campaignId');
  const includeTrashed = url.searchParams.get('includeTrashed') === '1';

  const where: Record<string, unknown> = auth.user.isSuperAdmin
    ? {}
    : { memberships: { some: { userId: auth.user.id } } };

  if (status) {
    where.pipelineStatus = status;
  } else if (!includeTrashed) {
    where.pipelineStatus = { not: 'TRASHED' };
  }
  if (campaignId) where.campaignId = campaignId;

  const hospitals = await prisma.hospital.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { pages: true, publishes: true } },
      publishes: { where: { isLive: true }, take: 1 },
      campaign: true,
    },
  });
  return json(hospitals);
}

/** Create a hospital with starter pages/sections + design tokens. */
export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return badRequest('name is required');

  try {
    const hospital = await createHospitalWithStarter({
      name,
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      userId: auth.user.id,
      campaignId: typeof body.campaignId === 'string' ? body.campaignId : null,
      mapsUrl: typeof body.mapsUrl === 'string' ? body.mapsUrl : null,
      notes: typeof body.notes === 'string' ? body.notes : null,
      pipelineStatus: 'DEMO',
      seoIndex: false,
    });

    await writeAudit({
      actorId: auth.user.id,
      hospitalId: hospital.id,
      action: 'hospital.create',
      meta: { slug: hospital.slug },
    });

    return json(hospital, 201);
  } catch (e) {
    return badRequest(e instanceof Error ? e.message : 'Create failed');
  }
}
