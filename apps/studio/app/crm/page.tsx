import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { TopNav } from '@/components/TopNav';
import { CrmBoard } from '@/components/CrmBoard';

export default async function CrmPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <TopNav active="crm" user={user} />
      <main className="pt-24 px-lg max-w-5xl mx-auto mb-xxl w-full flex-1">
        <div className="mb-lg">
          <h1 className="font-outfit text-h2 text-brand-ink tracking-tight">CRM</h1>
          <p className="font-inter text-body-sm text-outline mt-xs">
            Field demos by campaign — accept, decline (30-day trash), QR packs, extension tokens.
          </p>
        </div>
        <CrmBoard />
      </main>
    </div>
  );
}
