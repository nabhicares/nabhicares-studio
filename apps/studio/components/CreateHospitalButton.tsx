'use client';

import { apiFetch } from '@/lib/api-client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { liveSiteUrl } from '@/lib/cdn';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function CreateHospitalButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function onNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await apiFetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not create hospital');
        setBusy(false);
        return;
      }
      setOpen(false);
      router.push(`/h/${data.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="bg-primary-container text-on-primary-container flex items-center gap-sm px-lg py-md rounded-lg font-inter text-label-md font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-soft"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Create Hospital
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-lg">
          <button
            type="button"
            className="absolute inset-0 bg-brand-ink/40 border-0 cursor-default"
            aria-label="Close"
            onClick={() => !busy && setOpen(false)}
          />
          <div className="relative w-full max-w-md bg-surface-container-lowest border border-brand-sage rounded-xl shadow-canvas p-lg">
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h3 className="font-outfit text-h3 text-brand-ink">New hospital site</h3>
                <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                  Creates home, doctors, and contact pages you can edit and publish.
                </p>
              </div>
              <button
                type="button"
                className="p-sm rounded-full hover:bg-surface-container"
                onClick={() => !busy && setOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={submit} className="space-y-md">
              <div className="flex flex-col gap-xs">
                <label className="font-inter text-label-sm text-outline uppercase tracking-wider">
                  Hospital name
                </label>
                <input
                  className="field-input"
                  required
                  autoFocus
                  placeholder="e.g. Sunrise Care Hospital"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-inter text-label-sm text-outline uppercase tracking-wider">
                  URL slug
                </label>
                <div className="flex items-center gap-sm">
                  <span className="font-inter text-body-sm text-outline">/</span>
                  <input
                    className="field-input"
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    title="lowercase letters, numbers, and hyphens"
                    placeholder="sunrise-care"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(slugify(e.target.value));
                    }}
                  />
                </div>
                <p className="font-inter text-body-sm text-outline">
                  Live site will be at {liveSiteUrl(slug || '…')}
                </p>
              </div>

              {error ? (
                <p className="font-inter text-body-sm text-error bg-error-container px-sm py-sm rounded-lg">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-end gap-sm pt-sm">
                <button
                  type="button"
                  className="btn-ghost px-md py-sm"
                  disabled={busy}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={busy || !name || !slug}>
                  {busy ? 'Creating…' : 'Create & open editor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
