'use client';

import { apiFetch } from '@/lib/api-client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

type NavUser = { name: string; email: string; isSuperAdmin: boolean };

export function TopNav({
  active,
  user,
}: {
  active: 'dashboard' | 'hospitals';
  user?: NavUser | null;
}) {
  const router = useRouter();
  const link = (id: 'dashboard' | 'hospitals', href: string, label: string) => (
    <Link
      href={href}
      className={
        active === id
          ? 'font-inter text-label-md text-primary font-bold border-b-2 border-primary px-md py-sm'
          : 'font-inter text-label-md text-on-surface-variant hover:bg-surface-container transition-colors px-md py-sm rounded'
      }
    >
      {label}
    </Link>
  );

  async function signOut() {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center h-16 w-full px-lg max-w-container-max mx-auto">
        <div className="flex items-center gap-xl">
          <Link href="/" className="font-outfit text-h2 text-on-surface tracking-tight">
            Nabhi Studio
          </Link>
          <nav className="hidden md:flex items-center gap-lg">
            {link('dashboard', '/dashboard', 'Dashboard')}
            {link('hospitals', '/', 'Hospitals')}
          </nav>
        </div>
        <div className="flex items-center gap-md">
          {user ? (
            <>
              <span className="font-inter text-label-sm text-on-surface-variant hidden sm:inline">
                {user.name}
                {user.isSuperAdmin ? ' · admin' : ''}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="font-inter text-label-sm text-primary"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="font-inter text-label-sm text-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
