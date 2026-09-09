import { prisma } from '@/lib/db';
import {
  CONTENT_SCHEMA_VERSION,
  exampleContentForSection,
  getSectionType,
  importHospitalBundleJson,
  type HospitalBundleHospital,
} from '@nabhicares/section-registry';

export type ApplyBundleResult =
  | {
      ok: true;
      updatedSectionIds: string[];
      createdSectionKeys: string[];
      hospitalKeys: string[];
    }
  | { ok: false; error: string };

/** Apply a parsed Gemini hospital bundle to an existing hospital. */
export async function applyHospitalBundle(
  hospitalId: string,
  rawJson: string,
): Promise<ApplyBundleResult> {
  const parsed = importHospitalBundleJson(rawJson);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const hospitalPatch: {
    name?: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
    ogCardStyle?: string | null;
  } = {};
  const h = parsed.hospital as HospitalBundleHospital;
  if (h.name) hospitalPatch.name = h.name;
  if (h.seoTitle !== undefined) hospitalPatch.seoTitle = h.seoTitle || null;
  if (h.seoDescription !== undefined) {
    hospitalPatch.seoDescription = h.seoDescription || null;
  }
  if (h.ogImage !== undefined) hospitalPatch.ogImage = h.ogImage || null;
  if (h.ogCardStyle !== undefined) {
    const style = String(h.ogCardStyle || '').toLowerCase();
    if (style === 'hero' || style === 'brand' || style === 'custom') {
      hospitalPatch.ogCardStyle = style;
    }
  }

  if (Object.keys(hospitalPatch).length) {
    await prisma.hospital.update({
      where: { id: hospitalId },
      data: hospitalPatch,
    });
  }

  const pages = await prisma.page.findMany({
    where: { hospitalId },
    include: {
      sections: { include: { template: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const home = pages.find((p) => p.slug === 'home') ?? pages[0] ?? null;
  const updatedSectionIds: string[] = [];
  const createdSectionKeys: string[] = [];

  const preferredPageSlug = (key: string): string | null => {
    if (key === 'doctors') return 'doctors';
    if (key === 'contact' || key === 'faq') return 'contact';
    return null;
  };

  function findSectionTarget(key: string) {
    const all = pages.flatMap((p) => p.sections.map((s) => ({ page: p, section: s })));
    const preferred = preferredPageSlug(key);
    if (preferred) {
      const onPage = all.find(
        ({ page, section }) => section.template.key === key && page.slug === preferred,
      );
      if (onPage) return onPage;
    }
    return (
      all.find(({ section }) => section.template.key === key && section.enabled) ??
      all.find(({ section }) => section.template.key === key)
    );
  }

  for (const [key, content] of Object.entries(parsed.sections)) {
    if (!getSectionType(key)) continue;

    const target = findSectionTarget(key);

    if (target) {
      await prisma.section.update({
        where: { id: target.section.id },
        data: {
          content: content as object,
          contentSchemaVersion: CONTENT_SCHEMA_VERSION,
        },
      });
      updatedSectionIds.push(target.section.id);

      if (key === 'contact') {
        const homeContact = pages
          .flatMap((p) => p.sections.map((s) => ({ page: p, section: s })))
          .find(
            ({ page, section }) =>
              section.template.key === 'contact' &&
              page.slug === 'home' &&
              section.id !== target.section.id,
          );
        if (homeContact) {
          const full = content as Record<string, unknown>;
          const teaser = {
            ...full,
            variant: 'teaser',
            title: typeof full.title === 'string' && full.title ? full.title : 'Plan your visit',
            body:
              'Phone, hours, and directions — see our contact page for the full details.',
            ctaSecondary:
              typeof full.ctaSecondary === 'string' && full.ctaSecondary
                ? full.ctaSecondary
                : 'Contact details',
            ctaSecondaryHref: 'contact/',
          };
          await prisma.section.update({
            where: { id: homeContact.section.id },
            data: {
              content: teaser as object,
              contentSchemaVersion: CONTENT_SCHEMA_VERSION,
            },
          });
          updatedSectionIds.push(homeContact.section.id);
        }
      }
      continue;
    }

    if (!home) continue;

    const template = await prisma.template.findUnique({
      where: { key_version: { key, version: 1 } },
    });
    if (!template) continue;

    const max = await prisma.section.aggregate({
      where: { pageId: home.id },
      _max: { order: true },
    });
    const created = await prisma.section.create({
      data: {
        pageId: home.id,
        order: (max._max.order ?? -1) + 1,
        enabled: true,
        templateId: template.id,
        content: (Object.keys(content).length
          ? content
          : exampleContentForSection(key)) as object,
        contentSchemaVersion: CONTENT_SCHEMA_VERSION,
      },
    });
    updatedSectionIds.push(created.id);
    createdSectionKeys.push(key);
  }

  return {
    ok: true,
    updatedSectionIds,
    createdSectionKeys,
    hospitalKeys: Object.keys(parsed.hospital),
  };
}
