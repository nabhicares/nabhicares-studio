import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { TopNav } from '@/components/TopNav';
import { CreateHospitalButton } from '@/components/CreateHospitalButton';
import { DeleteHospitalButton } from '@/components/DeleteHospitalButton';
import { liveSiteUrl } from '@/lib/cdn';

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

      <main className="pt-24 px-lg max-w-4xl mx-auto mb-xxl w-full flex-1">
        <div className="flex justify-between items-center mb-lg gap-md flex-wrap">
          <div>
            <h1 className="font-outfit text-h2 text-brand-ink tracking-tight">Hospitals</h1>
            <p className="font-inter text-body-sm text-outline mt-xs">
              {hospitals.length} site{hospitals.length === 1 ? '' : 's'}
            </p>
          </div>
          <CreateHospitalButton />
        </div>

        {hospitals.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest px-lg py-xl text-center">
            <p className="font-inter text-body-md text-on-surface-variant mb-md">
              No hospitals yet. Start with Maps → Gemini onboarding.
            </p>
            <CreateHospitalButton />
          </div>
        ) : (
          <ul className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden divide-y divide-outline-variant list-none m-0 p-0">
            {hospitals.map((h) => {
              const live = h.publishes.length > 0;
              return (
                <li
                  key={h.id}
                  className="flex items-center gap-md px-lg py-md hover:bg-surface-container-low/80 transition-colors"
                >
                  <Link href={`/h/${h.slug}`} className="flex-1 min-w-0 flex items-center gap-md">
                    <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-inter text-body-md font-semibold text-brand-ink truncate">
                        {h.name}
                      </div>
                      <div className="font-inter text-body-sm text-outline truncate">
                        {h.slug} · {h._count.pages} pages
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-sm shrink-0">
                    {live ? (
                      <a
                        href={liveSiteUrl(h.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-xs rounded-md bg-primary-container/60 px-sm py-xs font-inter text-label-sm text-on-primary-container font-semibold"
                      >
                        Live
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    ) : (
                      <span className="rounded-md bg-surface-container px-sm py-xs font-inter text-label-sm text-outline">
                        Draft
                      </span>
                    )}
                    <Link
                      href={`/h/${h.slug}`}
                      className="btn-ghost px-md py-sm font-inter text-label-sm font-semibold text-primary border-primary/20"
                    >
                      Open
                    </Link>
                    <DeleteHospitalButton hospitalId={h.id} hospitalName={h.name} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
