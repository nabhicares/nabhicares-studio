import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requirePageAccess } from '@/lib/auth';
import { SECTION_REGISTRY, getSectionType } from '@nabhicares/section-registry';

function defaultContent(key: string): Record<string, unknown> {
  switch (key) {
    case 'hero':
      return {
        title: 'New hero',
        body: 'Edit this supporting line.',
        ctaPrimary: 'Get started',
        ctaSecondary: 'Learn more',
      };
    case 'about':
      return { title: 'About us', body: 'Tell your hospital story here.' };
    case 'doctors':
      return {
        title: 'Our doctors',
        doctors: [{ name: 'Dr. Example', specialty: 'General Medicine' }],
      };
    case 'services':
      return {
        title: 'Our services',
        items: [
          { title: 'Outpatient care', description: '' },
          { title: 'Diagnostics', description: '' },
        ],
      };
    case 'gallery':
      return { title: 'Gallery', images: [{ src: '', caption: '' }] };
    case 'faq':
      return {
        title: 'Frequently asked questions',
        items: [{ question: 'New question?', answer: 'Add an answer.' }],
      };
    case 'testimonials':
      return {
        title: 'Patient stories',
        items: [{ quote: 'Excellent care.', author: 'Patient', role: '' }],
      };
    case 'contact':
      return {
        title: 'Visit us',
        body: 'Find us or get in touch.',
        phone: '',
        email: '',
        address: '',
        hours: '',
        mapUrl: '',
        ctaPrimary: 'Get directions',
      };
    case 'map':
      return {
        title: 'Find us',
        body: 'Visit our campus.',
        mapUrl: '',
        address: '',
      };
    case 'appointments':
      return {
        title: 'Book an appointment',
        body: 'Share your details and we will confirm your visit.',
        successMessage: 'Thank you — we will contact you shortly to confirm.',
        submitLabel: 'Request appointment',
      };
    case 'footer':
      return {
        tagline: '',
        phone: '',
        email: '',
        address: '',
        hours: '',
        mapUrl: '',
      };
    default:
      return { title: getSectionType(key)?.label ?? 'Section' };
  }
}

/** Add a section to a page. Body: { type: string, layout?: number } */
export async function POST(
  req: Request,
  { params }: { params: { pageId: string } },
) {
  const access = await requirePageAccess(params.pageId);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  if (!SECTION_REGISTRY.some((s) => s.key === type)) {
    return badRequest(`type must be one of: ${SECTION_REGISTRY.map((s) => s.key).join(', ')}`);
  }

  const layout =
    typeof body.layout === 'number' && body.layout >= 1 && body.layout <= 10
      ? Math.floor(body.layout)
      : 1;

  const template = await prisma.template.findUnique({
    where: { key_version: { key: type, version: layout } },
  });
  if (!template) {
    return badRequest(`Template ${type} layout ${layout} is not seeded`);
  }

  const max = await prisma.section.aggregate({
    where: { pageId: params.pageId },
    _max: { order: true },
  });
  const order = (max._max.order ?? -1) + 1;

  const section = await prisma.section.create({
    data: {
      pageId: params.pageId,
      templateId: template.id,
      order,
      enabled: true,
      content: defaultContent(type) as object,
    },
    include: { template: true },
  });

  return json(section, 201);
}
