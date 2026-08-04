import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requirePageAccess } from '@/lib/auth';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

/** Rename a page slug. Body: { slug: string } */
export async function PATCH(
  req: Request,
  { params }: { params: { pageId: string } },
) {
  const access = await requirePageAccess(params.pageId);
  if ('error' in access) return access.error;
  const page = await prisma.page.findUnique({ where: { id: params.pageId } });
  if (!page) return notFound('Page not found');

  const body = await req.json().catch(() => ({}));
  const slug = typeof body.slug === 'string' ? slugify(body.slug) : '';
  if (!slug) return badRequest('slug is required');

  if (slug !== page.slug) {
    const taken = await prisma.page.findUnique({
      where: { hospitalId_slug: { hospitalId: page.hospitalId, slug } },
    });
    if (taken) return badRequest(`Page "${slug}" already exists`);
  }

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { slug },
    include: {
      sections: { include: { template: true }, orderBy: { order: 'asc' } },
    },
  });
  return json(updated);
}

/** Delete a page and all its sections. */
export async function DELETE(
  _req: Request,
  { params }: { params: { pageId: string } },
) {
  const access = await requirePageAccess(params.pageId);
  if ('error' in access) return access.error;

  const page = await prisma.page.findUnique({
    where: { id: params.pageId },
    include: { hospital: { include: { _count: { select: { pages: true } } } } },
  });
  if (!page) return notFound('Page not found');
  if (page.hospital._count.pages <= 1) {
    return badRequest('Cannot delete the last page');
  }

  await prisma.section.deleteMany({ where: { pageId: page.id } });
  await prisma.page.delete({ where: { id: page.id } });
  return json({ ok: true, id: page.id });
}
