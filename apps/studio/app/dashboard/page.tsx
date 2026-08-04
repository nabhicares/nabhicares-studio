import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { TopNav } from '@/components/TopNav';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/dashboard');

  const hospitalWhere = user.isSuperAdmin
    ? undefined
    : { memberships: { some: { userId: user.id } } };

  const [hospitals, liveCount, publishCount, pageCount] = await Promise.all([
    prisma.hospital.findMany({
      where: hospitalWhere,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { pages: true } },
        publishes: { where: { isLive: true }, take: 1, orderBy: { completedAt: 'desc' } },
      },
    }),
    prisma.publish.count({
      where: {
        isLive: true,
        ...(user.isSuperAdmin ? {} : { hospital: { memberships: { some: { userId: user.id } } } }),
      },
    }),
    prisma.publish.count({
      where: user.isSuperAdmin
        ? undefined
        : { hospital: { memberships: { some: { userId: user.id } } } },
    }),
    prisma.page.count({
      where: user.isSuperAdmin
        ? undefined
        : { hospital: { memberships: { some: { userId: user.id } } } },
    }),
  ]);

  const recent = await prisma.publish.findMany({
    where: user.isSuperAdmin
      ? undefined
      : { hospital: { memberships: { some: { userId: user.id } } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { hospital: { select: { name: true, slug: true } } },
  });

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <TopNav active="dashboard" user={user} />

      <main className="pt-xxl px-lg max-w-5xl mx-auto mb-xxl w-full flex-1">
        <section className="mt-xl mb-xl">
          <h1 className="font-outfit text-h1 text-brand-ink mb-sm">Dashboard</h1>
          <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl">
            Overview of hospital portals, live publishes, and recent deployment activity.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md mb-xl">
          {[
            { label: 'Hospitals', value: hospitals.length, icon: 'domain' },
            { label: 'Live sites', value: liveCount, icon: 'rocket_launch' },
            { label: 'Total publishes', value: publishCount, icon: 'cloud_upload' },
            { label: 'Pages', value: pageCount, icon: 'description' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest border border-brand-sage rounded-xl p-lg shadow-soft"
            >
              <span className="material-symbols-outlined text-primary">{stat.icon}</span>
              <div className="font-outfit text-h2 text-brand-ink mt-sm">{stat.value}</div>
              <div className="font-inter text-label-md text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest border border-brand-sage rounded-xl shadow-soft overflow-hidden">
            <div className="px-lg py-md border-b border-brand-sage bg-surface-container-low flex justify-between items-center">
              <h2 className="font-outfit text-h3 text-brand-ink">Hospitals</h2>
              <Link href="/" className="font-inter text-label-md text-primary font-semibold">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-brand-sage">
              {hospitals.map((h) => (
                <li key={h.id}>
                  <Link
                    href={`/h/${h.slug}`}
                    className="flex items-center justify-between px-lg py-md hover:bg-primary-container/20 transition-colors"
                  >
                    <div>
                      <div className="font-inter text-label-md font-semibold text-brand-ink">
                        {h.name}
                      </div>
                      <div className="font-inter text-body-sm text-on-surface-variant">
                        /{h.slug} · {h._count.pages} pages
                      </div>
                    </div>
                    <span
                      className={`text-label-sm font-semibold uppercase px-sm py-xs rounded ${
                        h.publishes.length
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-tertiary-container text-on-tertiary-container'
                      }`}
                    >
                      {h.publishes.length ? 'Live' : 'Draft'}
                    </span>
                  </Link>
                </li>
              ))}
              {hospitals.length === 0 ? (
                <li className="px-lg py-xl text-body-sm text-on-surface-variant">
                  No hospitals yet.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="bg-surface-container-lowest border border-brand-sage rounded-xl shadow-soft overflow-hidden">
            <div className="px-lg py-md border-b border-brand-sage bg-surface-container-low">
              <h2 className="font-outfit text-h3 text-brand-ink">Recent publishes</h2>
            </div>
            <ul className="divide-y divide-brand-sage">
              {recent.map((p) => (
                <li key={p.id} className="px-lg py-md flex justify-between gap-md items-center">
                  <div>
                    <div className="font-inter text-label-md font-semibold text-brand-ink">
                      {p.hospital.name}
                    </div>
                    <div className="font-inter text-body-sm text-on-surface-variant">
                      {new Date(p.createdAt).toLocaleString()} · {p.status}
                      {p.isLive ? ' · LIVE' : ''}
                    </div>
                  </div>
                  <Link
                    href={`/h/${p.hospital.slug}`}
                    className="material-symbols-outlined text-outline hover:text-primary"
                  >
                    arrow_forward
                  </Link>
                </li>
              ))}
              {recent.length === 0 ? (
                <li className="px-lg py-xl text-body-sm text-on-surface-variant">
                  No publishes yet. Open a hospital and click Publish.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
