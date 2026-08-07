'use client';

import { FormEvent, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Sign in failed');
        return;
      }
      router.replace(next.startsWith('/') ? next : '/');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-lg">
      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="w-full max-w-md bg-surface-container-lowest border border-brand-sage rounded-xl shadow-soft p-xl flex flex-col gap-md"
      >
        <div>
          <h1 className="font-outfit text-h2 text-brand-ink">Nabhi Studio</h1>
          <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
            Sign in to edit hospital sites
          </p>
        </div>
        <label className="flex flex-col gap-xs">
          <span className="font-inter text-label-sm text-outline">Email</span>
          <input
            className="border border-brand-sage rounded-lg px-md py-sm font-inter text-body-sm"
            type="email"
            name="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-xs">
          <span className="font-inter text-label-sm text-outline">Password</span>
          <input
            className="border border-brand-sage rounded-lg px-md py-sm font-inter text-body-sm"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? (
          <p className="font-inter text-body-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <LoginForm />
    </Suspense>
  );
}
