import { prisma } from '@/lib/db';
import {
  CONTENT_SCHEMA_VERSION,
  migrateSectionContent,
} from '@nabhicares/section-registry';

/**
 * Migrate a section row in DB if contentSchemaVersion is behind.
 * Returns warnings (empty if already current / no issues).
 */
export async function ensureSectionMigrated(sectionId: string): Promise<string[]> {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: { template: true },
  });
  if (!section) return [];

  if (section.contentSchemaVersion >= CONTENT_SCHEMA_VERSION) {
    return [];
  }

  const result = migrateSectionContent(
    section.template.key,
    (section.content ?? {}) as Record<string, unknown>,
    section.contentSchemaVersion,
  );

  if (result.changed || section.contentSchemaVersion < CONTENT_SCHEMA_VERSION) {
    await prisma.section.update({
      where: { id: section.id },
      data: {
        content: result.content,
        contentSchemaVersion: result.version,
      },
    });
  }

  return result.warnings;
}

/** Migrate all sections for a hospital; returns map sectionId → warnings. */
export async function ensureHospitalSectionsMigrated(
  hospitalId: string,
): Promise<Record<string, string[]>> {
  const sections = await prisma.section.findMany({
    where: { page: { hospitalId } },
    include: { template: true },
  });

  const out: Record<string, string[]> = {};
  for (const section of sections) {
    if (section.contentSchemaVersion >= CONTENT_SCHEMA_VERSION) continue;
    const result = migrateSectionContent(
      section.template.key,
      (section.content ?? {}) as Record<string, unknown>,
      section.contentSchemaVersion,
    );
    await prisma.section.update({
      where: { id: section.id },
      data: {
        content: result.content,
        contentSchemaVersion: result.version,
      },
    });
    if (result.warnings.length) out[section.id] = result.warnings;
  }
  return out;
}
