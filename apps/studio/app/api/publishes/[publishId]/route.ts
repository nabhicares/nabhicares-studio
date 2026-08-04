import { prisma } from '@/lib/db';
import { json, notFound } from '@/lib/api';
import { requireHospitalAccess, requireUser } from '@/lib/auth';

/** Single publish status — Studio polls this after clicking Publish. */
export async function GET(
  _req: Request,
  { params }: { params: { publishId: string } },
) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const publish = await prisma.publish.findUnique({ where: { id: params.publishId } });
  if (!publish) return notFound();

  const access = await requireHospitalAccess(publish.hospitalId);
  if ('error' in access) return access.error;

  return json(publish);
}
