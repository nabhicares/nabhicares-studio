import { prisma } from '@/lib/db';
import { json, notFound } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { demoWhatsAppMessage, hospitalPublicUrls } from '@/lib/whatsapp-share';

function phoneFromContent(content: unknown): string | null {
  if (!content || typeof content !== 'object') return null;
  const phone = (content as Record<string, unknown>).phone;
  if (typeof phone === 'string' && phone.trim()) return phone.trim();
  return null;
}

/**
 * GET /api/hospitals/:hospitalId/share-info
 * Phone (from contact), live URLs, and default WhatsApp message text.
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
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
  if (!hospital) return notFound('Hospital not found');

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
  const message = demoWhatsAppMessage({
    hospitalName: hospital.name,
    liveUrl,
    pathUrl,
    template: hospital.campaign?.whatsappTemplate,
  });

  return json({
    id: hospital.id,
    name: hospital.name,
    slug: hospital.slug,
    phone,
    liveUrl,
    pathUrl,
    message,
    whatsappTemplate: hospital.campaign?.whatsappTemplate ?? null,
    shareCardUrl: `/api/hospitals/${hospital.id}/share-card`,
  });
}
