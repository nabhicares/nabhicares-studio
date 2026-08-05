import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/** Create a page on a hospital. Body: { slug: string } */
export async function POST(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;
  const hospital = access.hospital;

  const body = await req.json().catch(() => ({}));
  const raw = typeof body.slug === 'string' ? body.slug : '';
  const slug = slugify(raw);
  if (!slug) return badRequest('slug is required');

  const taken = await prisma.page.findUnique({
    where: { hospitalId_slug: { hospitalId: hospital.id, slug } },
  });
  if (taken) return badRequest(`Page "${slug}" already exists`);

  const max = await prisma.page.aggregate({
    where: { hospitalId: hospital.id },
    _max: { sortOrder: true },
  });

  const page = await prisma.page.create({
    data: {
      hospitalId: hospital.id,
      slug,
      isDraft: true,
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
    include: {
      sections: { include: { template: true }, orderBy: { order: 'asc' } },
    },
  });

  return json(page, 201);
}
