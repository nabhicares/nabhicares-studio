import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { hospitals: true } },
    },
  });
  return json(campaigns);
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;
  if (!auth.user.isSuperAdmin) {
    // Any signed-in publisher can create campaigns for field days
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  if (!name) return badRequest('name is required');
  const placeLabel =
    typeof body.placeLabel === 'string'
      ? body.placeLabel.trim().slice(0, 120) || null
      : null;
  const whatsappTemplate =
    typeof body.whatsappTemplate === 'string'
      ? body.whatsappTemplate.trim().slice(0, 4000) || null
      : null;

  const campaign = await prisma.campaign.create({
    data: { name, placeLabel, whatsappTemplate },
  });

  await writeAudit({
    actorId: auth.user.id,
    action: 'campaign.create',
    meta: { campaignId: campaign.id, name },
  });

  return json(campaign, 201);
}
