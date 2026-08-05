import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { TopNav } from '@/components/TopNav';
import { HospitalOnboardWizard } from '@/components/HospitalOnboardWizard';

export default async function OnboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/onboard');

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <TopNav active="hospitals" user={user} />
      <main className="pt-xxl px-lg pb-xxl flex-1 w-full">
        <div className="max-w-2xl mx-auto mb-lg pt-xl">
          <Link
            href="/"
            className="inline-flex items-center gap-xs font-inter text-label-sm text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Hospitals
          </Link>
        </div>
        <HospitalOnboardWizard />
      </main>
    </div>
  );
}
