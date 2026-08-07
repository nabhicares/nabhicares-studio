import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';

const STATUSES = new Set(['new', 'contacted', 'closed']);

/** Hospital staff: update appointment request status. */
export async function PATCH(
  req: Request,
  { params }: { params: { hospitalId: string; requestId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const status = typeof body.status === 'string' ? body.status.trim() : '';
  if (!STATUSES.has(status)) {
    return badRequest('status must be new, contacted, or closed');
  }

  const existing = await prisma.appointmentRequest.findFirst({
    where: { id: params.requestId, hospitalId: access.hospital.id },
  });
  if (!existing) return notFound('Appointment request not found');

  const updated = await prisma.appointmentRequest.update({
    where: { id: existing.id },
    data: { status },
  });

  return json(updated);
}
