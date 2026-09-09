import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { applyHospitalBundle } from '@/lib/apply-hospital-bundle';

/**
 * POST /api/hospitals/:hospitalId/import-bundle
 * Body: { json: string } — whole-hospital Gemini bundle.
 */
export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const raw = typeof body.json === 'string' ? body.json : '';
  if (!raw.trim()) return badRequest('json string required');

  const result = await applyHospitalBundle(access.hospital.id, raw);
  if (!result.ok) return badRequest(result.error);

  await writeAudit({
    actorId: access.user.id,
    hospitalId: access.hospital.id,
    action: 'hospital.import_bundle',
    meta: {
      updatedSectionIds: result.updatedSectionIds,
      createdSectionKeys: result.createdSectionKeys,
      hospitalKeys: result.hospitalKeys,
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
    updatedSectionIds: result.updatedSectionIds,
    createdSectionKeys: result.createdSectionKeys,
  });
}
