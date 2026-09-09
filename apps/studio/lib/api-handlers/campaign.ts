import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } },
) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.campaignId },
    include: {
      hospitals: {
        orderBy: { name: 'asc' },
        include: {
          publishes: { where: { isLive: true }, take: 1 },
        },
      },
    },
  });
  if (!campaign) return notFound('Campaign not found');
  return json(campaign);
}

export async function PATCH(
  req: Request,
  { params }: { params: { campaignId: string } },
) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const data: { name?: string; placeLabel?: string | null } = {};
  if (typeof body.name === 'string' && body.name.trim()) {
    data.name = body.name.trim().slice(0, 120);
  }
  if (body.placeLabel === null) data.placeLabel = null;
  else if (typeof body.placeLabel === 'string') {
    data.placeLabel = body.placeLabel.trim().slice(0, 120) || null;
  }
  if (!data.name && data.placeLabel === undefined) {
    return badRequest('name or placeLabel required');
  }

  const campaign = await prisma.campaign.update({
    where: { id: params.campaignId },
    data,
  });
  return json(campaign);
}

export async function DELETE(
  req: Request,
  { params }: { params: { campaignId: string } },
) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  await prisma.hospital.updateMany({
    where: { campaignId: params.campaignId },
    data: { campaignId: null },
  });
  await prisma.campaign.delete({ where: { id: params.campaignId } });
  await writeAudit({
    actorId: auth.user.id,
    action: 'campaign.delete',
    meta: { campaignId: params.campaignId },
  });
  return json({ ok: true });
}
