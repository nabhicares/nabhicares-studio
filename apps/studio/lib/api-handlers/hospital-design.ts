import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';
import { DEFAULT_DESIGN_TOKENS } from '@nabhicares/section-registry';

export async function GET(
  _req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const design =
    (await prisma.designSystem.findUnique({
      where: { hospitalId: access.hospital.id },
    })) ??
    (await prisma.designSystem.create({
      data: { hospitalId: access.hospital.id, tokens: DEFAULT_DESIGN_TOKENS as object },
    }));

  return json(design);
}

export async function PUT(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const body = await req.json();
  if (!body.tokens || typeof body.tokens !== 'object') {
    return badRequest('tokens object required');
  }

  const design = await prisma.designSystem.upsert({
    where: { hospitalId: access.hospital.id },
    create: { hospitalId: access.hospital.id, tokens: body.tokens as object },
    update: { tokens: body.tokens as object },
  });
  return json(design);
}
