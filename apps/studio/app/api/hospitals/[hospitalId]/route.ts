import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { purgeHospitalStorage } from '@nabhicares/snapshot-store';
import { ensureHospitalSectionsMigrated } from '@/lib/migrate-sections';

export async function GET(
  _req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const migrationWarnings = await ensureHospitalSectionsMigrated(access.hospital.id);

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
    include: {
      designSystem: true,
      pages: {
        orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: { template: true },
          },
        },
      },
      publishes: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!hospital) return notFound('Hospital not found');
  return json({ ...hospital, migrationWarnings });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/** Update hospital name and/or slug. Body: { name?, slug? } */
export async function PATCH(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'ADMIN');
  if ('error' in access) return access.error;
  const hospital = access.hospital;

  const body = await req.json().catch(() => ({}));
  const data: { name?: string; slug?: string; seoTitle?: string | null; seoDescription?: string | null } =
    {};

  if (typeof body.name === 'string' && body.name.trim()) {
    data.name = body.name.trim().slice(0, 120);
  }
  if (typeof body.slug === 'string' && body.slug.trim()) {
    const slug = slugify(body.slug);
    if (!slug) return badRequest('slug is invalid');
    if (slug !== hospital.slug) {
      const taken = await prisma.hospital.findUnique({ where: { slug } });
      if (taken) return badRequest(`Slug "${slug}" is already taken`);
    }
    data.slug = slug;
  }
  if (typeof body.seoTitle === 'string') {
    data.seoTitle = body.seoTitle.trim().slice(0, 120) || null;
  }
  if (typeof body.seoDescription === 'string') {
    data.seoDescription = body.seoDescription.trim().slice(0, 320) || null;
  }
  if (!data.name && !data.slug && data.seoTitle === undefined && data.seoDescription === undefined) {
    return badRequest('name, slug, or SEO fields required');
  }

  const updated = await prisma.hospital.update({
    where: { id: hospital.id },
    data,
  });
  await writeAudit({
    actorId: access.user.id,
    hospitalId: hospital.id,
    action: 'hospital.update',
    meta: data,
  });
  return json(updated);
}

/** Delete hospital, builder rows, and all MinIO objects for the slug. */
export async function DELETE(
  _req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'ADMIN');
  if ('error' in access) return access.error;
  const hospital = access.hospital;
  const slug = hospital.slug;

  await prisma.section.deleteMany({
    where: { page: { hospitalId: hospital.id } },
  });
  await prisma.page.deleteMany({ where: { hospitalId: hospital.id } });
  await prisma.publish.deleteMany({ where: { hospitalId: hospital.id } });
  await prisma.designSystem.deleteMany({ where: { hospitalId: hospital.id } });
  await prisma.hospitalMembership.deleteMany({ where: { hospitalId: hospital.id } });
  await prisma.hospital.delete({ where: { id: hospital.id } });

  // ponytail: queue job purge deferred — orphaned jobs fail when hospital missing
  let objectsDeleted = 0;
  try {
    objectsDeleted = await purgeHospitalStorage(slug);
  } catch (err) {
    console.error('[hospital.delete] MinIO purge failed', err);
  }

  await writeAudit({
    actorId: access.user.id,
    hospitalId: hospital.id,
    action: 'hospital.delete',
    meta: { slug, name: hospital.name, objectsDeleted },
  });

  return json({ ok: true, id: hospital.id, objectsDeleted });
}
