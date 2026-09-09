import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { demoWhatsAppMessage, hospitalPublicUrls } from '@/lib/whatsapp-share';

function phoneFromContent(content: unknown): string | null {
  if (!content || typeof content !== 'object') return null;
  const phone = (content as Record<string, unknown>).phone;
  if (typeof phone === 'string' && phone.trim()) return phone.trim();
  return null;
}

async function loadSharePayload(hospitalId: string) {
  const hospital = await prisma.hospital.findUnique({
    where: { id: hospitalId },
    include: {
      campaign: true,
      pages: {
        where: { slug: { in: ['contact', 'home'] } },
        include: {
          sections: {
            include: { template: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
  if (!hospital) return null;

  let phone: string | null = null;
  const contactPage = hospital.pages.find((p) => p.slug === 'contact');
  const homePage = hospital.pages.find((p) => p.slug === 'home');
  for (const page of [contactPage, homePage]) {
    if (!page || phone) continue;
    for (const s of page.sections) {
      if (s.template.key !== 'contact') continue;
      phone = phoneFromContent(s.content);
      if (phone) break;
    }
  }

  const { liveUrl, pathUrl } = hospitalPublicUrls(hospital.slug, hospital.customDomain);
  const template =
    (hospital.whatsappMessage && hospital.whatsappMessage.trim()) ||
    hospital.campaign?.whatsappTemplate ||
    null;
  const message = demoWhatsAppMessage({
    hospitalName: hospital.name,
    liveUrl,
    pathUrl,
    template,
  });

  return {
    id: hospital.id,
    name: hospital.name,
    slug: hospital.slug,
    phone,
    liveUrl,
    pathUrl,
    message,
    whatsappMessage: hospital.whatsappMessage ?? null,
    whatsappTemplate: hospital.campaign?.whatsappTemplate ?? null,
    messageSource: hospital.whatsappMessage?.trim()
      ? 'hospital'
      : hospital.campaign?.whatsappTemplate?.trim()
        ? 'campaign'
        : 'default',
    shareCardUrl: `/api/hospitals/${hospital.id}/share-card`,
  };
}

/**
 * GET /api/hospitals/:hospitalId/share-info
 * Phone (from contact), live URLs, and WhatsApp message (hospital > campaign > default).
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const payload = await loadSharePayload(access.hospital.id);
  if (!payload) return notFound('Hospital not found');
  return json(payload);
}

/**
 * PATCH /api/hospitals/:hospitalId/share-info
 * Body: { whatsappMessage?: string | null }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  if (body.whatsappMessage === undefined) {
    return badRequest('whatsappMessage required');
  }

  let whatsappMessage: string | null = null;
  if (body.whatsappMessage === null || body.whatsappMessage === '') {
    whatsappMessage = null;
  } else if (typeof body.whatsappMessage === 'string') {
    whatsappMessage = body.whatsappMessage.trim().slice(0, 4000) || null;
  } else {
    return badRequest('whatsappMessage must be a string or null');
  }

  await prisma.hospital.update({
    where: { id: access.hospital.id },
    data: { whatsappMessage },
  });

  await writeAudit({
    actorId: access.user.id,
    hospitalId: access.hospital.id,
    action: 'hospital.whatsapp_message',
    meta: { length: whatsappMessage?.length ?? 0 },
  });

  const payload = await loadSharePayload(access.hospital.id);
  if (!payload) return notFound('Hospital not found');
  return json(payload);
}
