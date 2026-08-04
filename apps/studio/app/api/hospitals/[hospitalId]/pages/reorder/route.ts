import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';

/** Reorder pages. Body: { orderedIds: string[] } */
export async function PUT(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;
  const hospital = access.hospital;

  const body = await req.json().catch(() => ({}));
  const orderedIds = Array.isArray(body.orderedIds) ? (body.orderedIds as string[]) : [];
  if (!orderedIds.length) return badRequest('orderedIds required');

  const pages = await prisma.page.findMany({ where: { hospitalId: hospital.id } });
  const idSet = new Set(pages.map((p) => p.id));
  if (orderedIds.length !== pages.length || orderedIds.some((id) => !idSet.has(id))) {
    return badRequest('orderedIds must include every page exactly once');
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.page.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  const updated = await prisma.page.findMany({
    where: { hospitalId: hospital.id },
    orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    include: {
      sections: { include: { template: true }, orderBy: { order: 'asc' } },
    },
  });
  return json(updated);
}
