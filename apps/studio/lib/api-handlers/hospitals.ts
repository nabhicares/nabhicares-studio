import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';
import {
  DEFAULT_DESIGN_TOKENS,
  LAYOUT_COUNT,
  SECTION_REGISTRY,
  componentRefFor,
  schemaForSection,
} from '@nabhicares/section-registry';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

async function ensureTemplates() {
  for (const def of SECTION_REGISTRY) {
    for (let version = 1; version <= LAYOUT_COUNT; version++) {
      const existing = await prisma.template.findUnique({
        where: { key_version: { key: def.key, version } },
      });
      if (existing) {
        await prisma.template.update({
          where: { id: existing.id },
          data: {
            schema: schemaForSection(def.key),
            componentRef: componentRefFor(def.key, version),
          },
        });
        continue;
      }
      await prisma.template.create({
        data: {
          key: def.key,
          version,
          schema: schemaForSection(def.key),
          componentRef: componentRefFor(def.key, version),
        },
      });
    }
  }
}

async function templateId(key: string, version = 1) {
  const t = await prisma.template.findUniqueOrThrow({
    where: { key_version: { key, version } },
  });
  return t.id;
}

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const hospitals = auth.user.isSuperAdmin
    ? await prisma.hospital.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { pages: true, publishes: true } },
          publishes: { where: { isLive: true }, take: 1 },
        },
      })
    : await prisma.hospital.findMany({
        where: { memberships: { some: { userId: auth.user.id } } },
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { pages: true, publishes: true } },
          publishes: { where: { isLive: true }, take: 1 },
        },
      });
  return json(hospitals);
}

/** Create a hospital with starter pages/sections + design tokens. */
export async function POST(req: Request) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return badRequest('name is required');

  let slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? slugify(body.slug)
      : slugify(name);
  if (!slug) return badRequest('slug is invalid');

  const taken = await prisma.hospital.findUnique({ where: { slug } });
  if (taken) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  await ensureTemplates();

  const hospital = await prisma.hospital.create({
    data: {
      name,
      slug,
      designSystem: {
        create: { tokens: DEFAULT_DESIGN_TOKENS },
      },
      memberships: {
        create: { userId: auth.user.id, role: 'ADMIN' },
      },
      pages: {
        create: [
          {
            slug: 'home',
            isDraft: true,
            sortOrder: 0,
            sections: {
              create: [
                {
                  order: 0,
                  enabled: true,
                  templateId: await templateId('hero'),
                  content: {
                    title: `Welcome to ${name}`,
                    body: 'Compassionate care close to home. Edit this copy in Studio.',
                    ctaPrimary: 'Contact us',
                    ctaPrimaryHref: 'contact/',
                    ctaSecondary: 'Our services',
                    ctaSecondaryHref: '#services',
                  },
                },
                {
                  order: 1,
                  enabled: true,
                  templateId: await templateId('about'),
                  content: {
                    title: 'About us',
                    body: `Learn more about ${name} and our mission.`,
                  },
                },
                {
                  order: 2,
                  enabled: true,
                  templateId: await templateId('services'),
                  content: {
                    title: 'Our services',
                    items: [
                      { title: 'Outpatient care', description: 'Consultations and follow-ups' },
                      { title: 'Diagnostics', description: 'Lab and imaging' },
                      { title: 'Pharmacy', description: 'On-site medications' },
                    ],
                  },
                },
                {
                  order: 3,
                  enabled: true,
                  templateId: await templateId('doctors'),
                  content: {
                    title: 'Our care team',
                    body: 'Meet the clinicians who look after patients every day.',
                    doctors: [],
                  },
                },
                {
                  order: 4,
                  enabled: true,
                  templateId: await templateId('contact'),
                  content: {
                    title: 'Plan your visit',
                    body: `Phone, hours, and directions for ${name} — full details on our contact page.`,
                    variant: 'teaser',
                    phone: '',
                    email: '',
                    address: '',
                    hours: '',
                    mapUrl: '',
                    ctaPrimary: 'Get directions',
                    ctaSecondary: 'Contact details',
                    ctaSecondaryHref: 'contact/',
                  },
                },
              ],
            },
          },
          {
            slug: 'doctors',
            isDraft: true,
            sortOrder: 1,
            sections: {
              create: [
                {
                  order: 0,
                  enabled: true,
                  templateId: await templateId('doctors'),
                  content: {
                    title: 'Our doctors',
                    body: 'Add your care team in Studio — we never invent clinical names.',
                    doctors: [],
                  },
                },
              ],
            },
          },
          {
            slug: 'contact',
            isDraft: true,
            sortOrder: 2,
            sections: {
              create: [
                {
                  order: 0,
                  enabled: true,
                  templateId: await templateId('contact'),
                  content: {
                    title: 'Visit us',
                    body: `Reach ${name} by phone or visit our campus.`,
                    variant: 'full',
                    phone: '',
                    email: '',
                    address: '',
                    hours: 'Mon–Sat 8:00–20:00',
                    mapUrl: '',
                    ctaPrimary: 'Get directions',
                  },
                },
                {
                  order: 1,
                  enabled: true,
                  templateId: await templateId('faq'),
                  content: {
                    title: 'Frequently asked questions',
                    items: [
                      {
                        question: 'How do I book an appointment?',
                        answer: 'Call the front desk or use the booking form on our site.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      _count: { select: { pages: true } },
      pages: { include: { sections: true } },
    },
  });

  await writeAudit({
    actorId: auth.user.id,
    hospitalId: hospital.id,
    action: 'hospital.create',
    meta: { slug: hospital.slug },
  });

  return json(hospital, 201);
}
