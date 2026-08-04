import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { TopNav } from '@/components/TopNav';
import { CreateHospitalButton } from '@/components/CreateHospitalButton';
import { DeleteHospitalButton } from '@/components/DeleteHospitalButton';
import { liveSiteUrl } from '@/lib/cdn';

const ICONS = ['health_and_safety', 'medical_services', 'domain', 'local_hospital'] as const;

export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const hospitals = await prisma.hospital.findMany({
    where: user.isSuperAdmin
      ? undefined
      : { memberships: { some: { userId: user.id } } },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { pages: true } },
      publishes: { where: { isLive: true }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <TopNav active="hospitals" user={user} />

      <main className="pt-xxl px-lg max-w-5xl mx-auto mb-xxl w-full flex-1">
        <section className="mt-xl mb-xxl text-center">
          <h1 className="font-outfit text-h1 text-brand-ink mb-sm">Nabhi Studio</h1>
          <p className="font-inter text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Build and publish professional hospital sites with our clinical, systematic design
            engine.
          </p>
        </section>

        <div className="flex justify-between items-end mb-lg gap-md flex-wrap">
          <div>
            <h2 className="font-outfit text-h3 text-brand-ink">Project Directory</h2>
            <p className="font-inter text-body-sm text-outline">
              Manage and monitor hospital portal deployments
            </p>
          </div>
          <CreateHospitalButton />
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-brand-sage shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-brand-sage">
                  <th className="px-lg py-md font-inter text-label-md text-outline uppercase tracking-wider">
                    Hospital Name
                  </th>
                  <th className="px-lg py-md font-inter text-label-md text-outline uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-lg py-md font-inter text-label-md text-outline uppercase tracking-wider text-center">
                    Pages
                  </th>
                  <th className="px-lg py-md font-inter text-label-md text-outline uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-lg py-md font-inter text-label-md text-outline uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sage">
                {hospitals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-lg py-xl text-on-surface-variant text-body-sm">
                      No hospitals yet. Click <strong>Create Hospital</strong> to start a new site.
                    </td>
                  </tr>
                ) : (
                  hospitals.map((h, i) => {
                    const live = h.publishes.length > 0;
                    return (
                      <tr
                        key={h.id}
                        className="transition-all duration-200 hover:bg-primary-container/20 group"
                      >
                        <td className="px-lg py-xl">
                          <Link href={`/h/${h.slug}`} className="flex items-center gap-md">
                            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                              <span className="material-symbols-outlined text-[22px]">
                                {ICONS[i % ICONS.length]}
                              </span>
                            </div>
                            <span className="font-inter text-body-md font-semibold text-brand-ink group-hover:text-primary">
                              {h.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-lg py-xl font-inter text-body-sm text-on-surface-variant">
                          {h.slug}
                        </td>
                        <td className="px-lg py-xl font-inter text-body-sm text-center text-on-surface">
                          {h._count.pages}
                        </td>
                        <td className="px-lg py-xl">
                          {live ? (
                            <a
                              href={liveSiteUrl(h.slug)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-xs font-inter text-label-sm text-primary"
                            >
                              Live
                              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            </a>
                          ) : (
                            <span className="font-inter text-label-sm text-outline">Draft</span>
                          )}
                        </td>
                        <td className="px-lg py-xl text-right">
                          <div className="inline-flex items-center gap-sm">
                            <Link
                              href={`/h/${h.slug}`}
                              className="font-inter text-label-sm text-primary font-bold"
                            >
                              Edit
                            </Link>
                            <DeleteHospitalButton hospitalId={h.id} hospitalName={h.name} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
