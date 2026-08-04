import { prisma } from '@/lib/db';
import { json } from '@/lib/api';
import { requireHospitalAccess } from '@/lib/auth';

/**
 * Draft preview payload — same shape as site-renderer site.json, but always
 * reads current Page/Section drafts. Never touches the CDN / live snapshot.
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId);
  if ('error' in access) return access.error;

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
    include: {
      designSystem: true,
      pages: {
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: { template: true },
          },
        },
        orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      },
    },
  });
  if (!hospital) return json({ error: 'Hospital not found' }, 404);

  const url = new URL(req.url);
  const includeDisabled = url.searchParams.get('includeDisabled') === '1';

  return json({
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hospitalSlug: hospital.slug,
    designTokens: hospital.designSystem?.tokens ?? null,
    preview: true,
    pages: hospital.pages.map((page) => ({
      slug: page.slug,
      isDraft: page.isDraft,
      sections: page.sections
        .filter((s) => includeDisabled || s.enabled)
        .map((section) => ({
          id: section.id,
          type: section.template.key,
          layoutVersion: section.template.version,
          order: section.order,
          enabled: section.enabled,
          content: section.content,
        })),
    })),
  });
}
