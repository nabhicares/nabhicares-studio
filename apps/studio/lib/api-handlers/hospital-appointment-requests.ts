import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';

const STATUSES = new Set(['new', 'contacted', 'closed']);

/** Hospital staff: list website appointment requests. */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const url = new URL(req.url);
  const status = url.searchParams.get('status')?.trim();
  if (status && !STATUSES.has(status)) {
    return badRequest('status must be new, contacted, or closed');
  }

  const rows = await prisma.appointmentRequest.findMany({
    where: {
      hospitalId: access.hospital.id,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return json(rows);
}
