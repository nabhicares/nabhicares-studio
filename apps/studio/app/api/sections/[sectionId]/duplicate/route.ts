import { prisma } from '@/lib/db';
import { json, notFound } from '@/lib/api';
import { requireSectionAccess } from '@/lib/auth';

/** Duplicate a section onto the same page (appended after original). */
export async function POST(
  _req: Request,
  { params }: { params: { sectionId: string } },
) {
  const access = await requireSectionAccess(params.sectionId);
  if ('error' in access) return access.error;

  const section = await prisma.section.findUnique({
    where: { id: params.sectionId },
    include: { template: true },
  });
  if (!section) return notFound('Section not found');

  const siblings = await prisma.section.findMany({
    where: { pageId: section.pageId },
    orderBy: { order: 'asc' },
  });

  const after = siblings.filter((s) => s.order > section.order);
  for (const s of after) {
    await prisma.section.update({
      where: { id: s.id },
      data: { order: s.order + 1 },
    });
  }

  const created = await prisma.section.create({
    data: {
      pageId: section.pageId,
      templateId: section.templateId,
      order: section.order + 1,
      enabled: section.enabled,
      content: section.content as object,
    },
    include: { template: true },
  });

  return json(created, 201);
}
