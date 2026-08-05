import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requirePageAccess } from '@/lib/auth';

/** Persist a new section order for a page. Body: { orderedIds: string[] } */
export async function PUT(
  req: Request,
  { params }: { params: { pageId: string } },
) {
  const access = await requirePageAccess(params.pageId);
  if ('error' in access) return access.error;

  const { orderedIds } = await req.json();
  if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== 'string')) {
    return badRequest('orderedIds must be a string array');
  }

  await prisma.$transaction(
    orderedIds.map((id: string, order: number) =>
      prisma.section.updateMany({
        where: { id, pageId: params.pageId },
        data: { order },
      }),
    ),
  );

  const sections = await prisma.section.findMany({
    where: { pageId: params.pageId },
    orderBy: { order: 'asc' },
    include: { template: true },
  });
  return json(sections);
}
