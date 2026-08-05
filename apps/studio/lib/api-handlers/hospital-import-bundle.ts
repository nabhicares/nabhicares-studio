import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import {
  CONTENT_SCHEMA_VERSION,
  exampleContentForSection,
  getSectionType,
  importHospitalBundleJson,
} from '@nabhicares/section-registry';

/**
 * POST /api/hospitals/:hospitalId/import-bundle
 * Body: { json: string } — whole-hospital Gemini bundle.
 * Updates hospital SEO fields and matching section content by template key.
 * Creates a missing section on the home page when needed.
 */
export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR');
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const raw = typeof body.json === 'string' ? body.json : '';
  if (!raw.trim()) return badRequest('json string required');

  const parsed = importHospitalBundleJson(raw);
  if (!parsed.ok) return badRequest(parsed.error);

  const hospitalPatch: {
    name?: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
  } = {};
  if (parsed.hospital.name) hospitalPatch.name = parsed.hospital.name;
  if (parsed.hospital.seoTitle !== undefined) {
    hospitalPatch.seoTitle = parsed.hospital.seoTitle || null;
  }
  if (parsed.hospital.seoDescription !== undefined) {
    hospitalPatch.seoDescription = parsed.hospital.seoDescription || null;
  }

  if (Object.keys(hospitalPatch).length) {
    await prisma.hospital.update({
      where: { id: access.hospital.id },
      data: hospitalPatch,
    });
  }

  const pages = await prisma.page.findMany({
    where: { hospitalId: access.hospital.id },
    include: {
      sections: { include: { template: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const home =
    pages.find((p) => p.slug === 'home') ??
    pages[0] ??
    null;

  const updatedSectionIds: string[] = [];
  const createdSectionKeys: string[] = [];

  for (const [key, content] of Object.entries(parsed.sections)) {
    if (!getSectionType(key)) continue;

    let target = pages
      .flatMap((p) => p.sections.map((s) => ({ page: p, section: s })))
      .find(({ section }) => section.template.key === key && section.enabled);

    if (!target && key === 'doctors') {
      target = pages
        .flatMap((p) => p.sections.map((s) => ({ page: p, section: s })))
        .find(({ section }) => section.template.key === 'doctors');
    }

    if (target) {
      await prisma.section.update({
        where: { id: target.section.id },
        data: {
          content: content as object,
          contentSchemaVersion: CONTENT_SCHEMA_VERSION,
        },
      });
      updatedSectionIds.push(target.section.id);
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

  await writeAudit({
    actorId: access.user.id,
    hospitalId: access.hospital.id,
    action: 'hospital.import_bundle',
    meta: {
      updatedSectionIds,
      createdSectionKeys,
      hospitalKeys: Object.keys(parsed.hospital),
    },
  });

  const refreshed = await prisma.hospital.findUniqueOrThrow({
    where: { id: access.hospital.id },
    include: {
      pages: {
        include: {
          sections: { include: { template: true }, orderBy: { order: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return json({
    hospital: refreshed,
    updatedSectionIds,
    createdSectionKeys,
  });
}
