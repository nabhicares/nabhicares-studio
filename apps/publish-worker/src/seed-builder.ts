import { PrismaClient } from '@nabhicares/db-builder';
import {
  DEFAULT_DESIGN_TOKENS,
  LAYOUT_COUNT,
  SECTION_REGISTRY,
  componentRefFor,
  schemaForSection,
} from '@nabhicares/section-registry';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.BUILDER_DATABASE_URL },
  },
});

async function ensureTemplates() {
  for (const def of SECTION_REGISTRY) {
    for (let version = 1; version <= LAYOUT_COUNT; version++) {
      const componentRef = componentRefFor(def.key, version);
      const schema = schemaForSection(def.key);
      const existing = await prisma.template.findUnique({
        where: { key_version: { key: def.key, version } },
      });
      if (existing) {
        await prisma.template.update({
          where: { id: existing.id },
          data: { schema, componentRef },
        });
        continue;
      }
      await prisma.template.create({
        data: {
          key: def.key,
          version,
          schema,
          componentRef,
        },
      });
    }
  }
}

async function seedHospital(opts: {
  slug: string;
  name: string;
  pages: {
    slug: string;
    sections: {
      type: string;
      layout?: number;
      order: number;
      enabled: boolean;
      content: object;
    }[];
  }[];
}) {
  const hospital =
    (await prisma.hospital.findUnique({ where: { slug: opts.slug } })) ??
    (await prisma.hospital.create({
      data: { slug: opts.slug, name: opts.name },
    }));

  // Wipe pages/sections so re-seed is idempotent for content shape.
  await prisma.section.deleteMany({
    where: { page: { hospitalId: hospital.id } },
  });
  await prisma.page.deleteMany({ where: { hospitalId: hospital.id } });

  for (const pageDef of opts.pages) {
    const page = await prisma.page.create({
      data: {
        hospitalId: hospital.id,
        slug: pageDef.slug,
        isDraft: false,
      },
    });

    for (const sec of pageDef.sections) {
      const template = await prisma.template.findUniqueOrThrow({
        where: { key_version: { key: sec.type, version: sec.layout ?? 1 } },
      });
      await prisma.section.create({
        data: {
          pageId: page.id,
          templateId: template.id,
          order: sec.order,
          enabled: sec.enabled,
          content: sec.content,
        },
      });
    }
  }

  return hospital;
}

async function ensureDesignSystem(hospitalId: string) {
  await prisma.designSystem.upsert({
    where: { hospitalId },
    create: { hospitalId, tokens: DEFAULT_DESIGN_TOKENS },
    update: { tokens: DEFAULT_DESIGN_TOKENS },
  });
}

async function main() {
  await ensureTemplates();

  const demo = await seedHospital({
    slug: 'demo-hospital',
    name: 'Demo Hospital',
    pages: [
      {
        slug: 'home',
        sections: [
          {
            type: 'hero',
            layout: 1,
            order: 0,
            enabled: true,
            content: {
              title: 'Care close to home',
              body: 'Demo Hospital welcome — precision care for every patient.',
              ctaPrimary: 'Book appointment',
              ctaSecondary: 'Our services',
            },
          },
          {
            type: 'about',
            layout: 1,
            order: 1,
            enabled: true,
            content: { title: 'About us', body: 'We treat people, not charts.' },
          },
          {
            type: 'faq',
            layout: 1,
            order: 2,
            enabled: false,
            content: { title: 'Hidden FAQ', body: 'Should not appear in export' },
          },
        ],
      },
      {
        slug: 'doctors',
        sections: [
          {
            type: 'doctors',
            layout: 1,
            order: 0,
            enabled: true,
            content: {
              title: 'Our doctors',
              doctors: [{ name: 'Dr. Rao', specialty: 'Cardiology' }],
            },
          },
        ],
      },
    ],
  });

  await ensureDesignSystem(demo.id);

  const metro = await seedHospital({
    slug: 'metro-clinic',
    name: 'Metro Clinic',
    pages: [
      {
        slug: 'home',
        sections: [
          {
            type: 'hero',
            layout: 2,
            order: 0,
            enabled: true,
            content: {
              title: 'Metro Clinic',
              body: 'Second test hospital',
              ctaPrimary: 'Visit us',
            },
          },
          {
            type: 'services',
            layout: 1,
            order: 1,
            enabled: true,
            content: {
              title: 'Services',
              items: [
                { title: 'OPD' },
                { title: 'Lab' },
                { title: 'Pharmacy' },
              ],
            },
          },
          {
            type: 'testimonials',
            layout: 1,
            order: 2,
            enabled: false,
            content: { title: 'Disabled testimonials', body: 'excluded' },
          },
        ],
      },
      {
        slug: 'doctors',
        sections: [
          {
            type: 'doctors',
            layout: 1,
            order: 0,
            enabled: true,
            content: { title: 'Team', doctors: [{ name: 'Dr. Shah', specialty: 'General' }] },
          },
          {
            type: 'gallery',
            layout: 1,
            order: 1,
            enabled: false,
            content: { title: 'Disabled gallery' },
          },
        ],
      },
      {
        slug: 'services',
        sections: [
          {
            type: 'services',
            layout: 3,
            order: 0,
            enabled: true,
            content: {
              title: 'Full service list',
              items: [{ title: 'MRI' }, { title: 'CT' }, { title: 'Dialysis' }],
            },
          },
        ],
      },
    ],
  });
  await ensureDesignSystem(metro.id);

  await seedAuthUsers();

  console.log(`Seeded demo-hospital and metro-clinic (${LAYOUT_COUNT * SECTION_REGISTRY.length} templates)`);
}

async function hashPassword(password: string): Promise<string> {
  const { randomBytes, scryptSync } = await import('crypto');
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** LOCAL DEV ONLY — never use these passwords (or seed emails) in production.
 * First real hospital admin = manual User + HospitalMembership insert until onboarding exists.
 * See docs/ops/PILOT_ACCOUNTS.md */
async function seedAuthUsers() {
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Skipping seedAuthUsers in production — create admins manually (docs/ops/PILOT_ACCOUNTS.md)',
    );
    return;
  }

  const adminHash = await hashPassword('admin123');
  const editorHash = await hashPassword('editor123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nabhi.local' },
    create: {
      email: 'admin@nabhi.local',
      name: 'Nabhi Admin',
      passwordHash: adminHash,
      isSuperAdmin: true,
    },
    update: { passwordHash: adminHash, isSuperAdmin: true, name: 'Nabhi Admin' },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@nabhi.local' },
    create: {
      email: 'editor@nabhi.local',
      name: 'Demo Editor',
      passwordHash: editorHash,
      isSuperAdmin: false,
    },
    update: { passwordHash: editorHash, name: 'Demo Editor' },
  });

  const hospitals = await prisma.hospital.findMany({ select: { id: true, slug: true } });
  for (const h of hospitals) {
    await prisma.hospitalMembership.upsert({
      where: { userId_hospitalId: { userId: admin.id, hospitalId: h.id } },
      create: { userId: admin.id, hospitalId: h.id, role: 'ADMIN' },
      update: { role: 'ADMIN' },
    });
  }

  const demo = hospitals.find((h) => h.slug === 'demo-hospital');
  if (demo) {
    await prisma.hospitalMembership.upsert({
      where: { userId_hospitalId: { userId: editor.id, hospitalId: demo.id } },
      create: { userId: editor.id, hospitalId: demo.id, role: 'EDITOR' },
      update: { role: 'EDITOR' },
    });
  }

  console.log(
    'DEV Auth users: admin@nabhi.local / admin123 (super), editor@nabhi.local / editor123 (demo EDITOR) — NOT for prod',
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
