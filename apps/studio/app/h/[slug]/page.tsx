import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser, roleAtLeast, type MembershipRole } from '@/lib/auth';
import { ensureHospitalSectionsMigrated } from '@/lib/migrate-sections';
import { StudioEditor } from '@/components/StudioEditor';

export default async function HospitalPage({ params }: { params: { slug: string } }) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/h/${params.slug}`);

  const hospital = await prisma.hospital.findUnique({
    where: { slug: params.slug },
  });
  if (!hospital) notFound();

  if (!user.isSuperAdmin) {
    const membership = await prisma.hospitalMembership.findUnique({
      where: { userId_hospitalId: { userId: user.id, hospitalId: hospital.id } },
    });
    if (!membership || !roleAtLeast(membership.role as MembershipRole, 'EDITOR')) {
      redirect('/');
    }
  }

  const migrationWarnings = await ensureHospitalSectionsMigrated(hospital.id);

  const [full, livePublish] = await Promise.all([
    prisma.hospital.findUnique({
      where: { id: hospital.id },
      include: {
        pages: {
          orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
          include: {
            sections: {
              orderBy: { order: 'asc' },
              include: { template: true },
            },
          },
        },
      },
    }),
    prisma.publish.findFirst({
      where: { hospitalId: hospital.id, isLive: true },
      select: { id: true },
    }),
  ]);
  if (!full) notFound();

  const warningList = Object.entries(migrationWarnings).flatMap(([id, w]) =>
    w.map((msg) => `${id.slice(0, 8)}…: ${msg}`),
  );

  return (
    <StudioEditor
      hospitalId={full.id}
      hospitalSlug={full.slug}
      hospitalName={full.name}
      seoTitle={full.seoTitle ?? ''}
      seoDescription={full.seoDescription ?? ''}
      ogImage={full.ogImage ?? ''}
      ogCardStyle={full.ogCardStyle ?? 'hero'}
      seoIndex={full.seoIndex !== false}
      customDomain={full.customDomain ?? ''}
      isLive={Boolean(livePublish)}
      migrationWarnings={warningList}
      pages={full.pages.map((p) => ({
        id: p.id,
        slug: p.slug,
        sections: p.sections.map((s) => ({
          id: s.id,
          order: s.order,
          enabled: s.enabled,
          contentSchemaVersion: s.contentSchemaVersion,
          content: (s.content ?? {}) as Record<string, unknown>,
          template: {
            id: s.template.id,
            key: s.template.key,
            version: s.template.version,
            schema: s.template.schema,
          },
        })),
      }))}
    />
  );
}
