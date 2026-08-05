import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { publishQueue } from '@nabhicares/queue';
import { ensureHospitalSectionsMigrated } from '@/lib/migrate-sections';
import { randomUUID } from 'crypto';

export async function GET(
  _req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const publishes = await prisma.publish.findMany({
    where: { hospitalId: access.hospital.id },
    orderBy: { createdAt: 'desc' },
  });
  return json(publishes);
}

export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'PUBLISHER');
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  const reviewNote =
    typeof body.reviewNote === 'string' ? body.reviewNote.trim().slice(0, 500) : '';
  if (!reviewNote) {
    return badRequest(
      'reviewNote required — briefly confirm content accuracy (e.g. doctor credentials checked)',
    );
  }

  const inFlight = await prisma.publish.findFirst({
    where: {
      hospitalId: access.hospital.id,
      status: { in: ['PENDING', 'BUILDING', 'UPLOADING'] },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (inFlight) {
    return json(
      {
        error: 'A publish is already in progress for this hospital',
        publishId: inFlight.id,
        status: inFlight.status,
      },
      409,
    );
  }

  await ensureHospitalSectionsMigrated(access.hospital.id);

  // Pilot default: self-attestation (approvedBy === publisher). Set
  // REQUIRE_DISTINCT_APPROVER=true to require a second PUBLISHER/ADMIN when ≥2 exist.
  let approvedBy = access.user.id;
  if (process.env.REQUIRE_DISTINCT_APPROVER === 'true') {
    const bodyApprover =
      typeof body.approvedBy === 'string' ? body.approvedBy.trim() : '';
    if (!bodyApprover || bodyApprover === access.user.id) {
      return badRequest(
        'Distinct approvedBy required (REQUIRE_DISTINCT_APPROVER) — cannot self-approve',
      );
    }
    const approverMembership = await prisma.hospitalMembership.findUnique({
      where: {
        userId_hospitalId: { userId: bodyApprover, hospitalId: access.hospital.id },
      },
    });
    const approver = await prisma.user.findUnique({ where: { id: bodyApprover } });
    const canApprove =
      approver?.isSuperAdmin ||
      (approverMembership &&
        (approverMembership.role === 'PUBLISHER' || approverMembership.role === 'ADMIN'));
    if (!canApprove) {
      return badRequest('approvedBy must be a PUBLISHER, ADMIN, or super admin for this hospital');
    }
    const publisherCount = await prisma.hospitalMembership.count({
      where: {
        hospitalId: access.hospital.id,
        role: { in: ['PUBLISHER', 'ADMIN'] },
      },
    });
    if (publisherCount < 2 && !approver?.isSuperAdmin) {
      return badRequest(
        'Distinct approver needs ≥2 PUBLISHER/ADMIN members (or a super admin as approver)',
      );
    }
    approvedBy = bodyApprover;
  }

  const publishId = randomUUID();
  const publish = await prisma.publish.create({
    data: {
      id: publishId,
      hospitalId: access.hospital.id,
      status: 'PENDING',
      triggeredBy: access.user.id,
      approvedBy,
      reviewNote,
    },
  });

  await publishQueue.add('publish', {
    hospitalId: access.hospital.slug,
    publishId,
    triggeredBy: access.user.id,
  });

  await writeAudit({
    actorId: access.user.id,
    hospitalId: access.hospital.id,
    action: 'publish.enqueue',
    meta: { publishId, reviewNote },
  });

  return json(publish, 201);
}
