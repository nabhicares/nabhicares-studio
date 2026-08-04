'use client';

import { apiFetch } from '@/lib/api-client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { liveSiteUrl } from '@/lib/cdn';

export function HospitalSettings({
  hospitalId,
  hospitalName,
  hospitalSlug,
  seoTitle: initialSeoTitle = '',
  seoDescription: initialSeoDescription = '',
  onClose,
  onUpdated,
}: {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  seoTitle?: string;
  seoDescription?: string;
  onClose: () => void;
  onUpdated: (next: { name: string; slug: string }) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(hospitalName);
  const [slug, setSlug] = useState(hospitalSlug);
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus('Saving…');
    const res = await apiFetch(`/api/hospitals/${hospitalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, seoTitle, seoDescription }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setStatus(data.error ?? 'Save failed');
      return;
    }
    onUpdated({ name: data.name, slug: data.slug });
    setStatus('Saved');
    if (data.slug !== hospitalSlug) {
      router.replace(`/h/${data.slug}`);
    }
  }

  return (
    <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant flex flex-col z-40 shrink-0">
      <div className="flex items-center justify-between p-lg border-b border-outline-variant">
        <h3 className="font-outfit text-[18px] font-semibold">Hospital settings</h3>
        <button type="button" className="p-xs" onClick={onClose} title="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="p-lg flex flex-col gap-lg overflow-y-auto flex-1">
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">Display name</label>
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">Slug (URL)</label>
          <input
            className="field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <p className="font-inter text-label-sm text-outline">
            Live: {liveSiteUrl(slug || '…')}
          </p>
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">SEO title</label>
          <input
            className="field-input"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={name || 'Hospital name'}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-inter text-label-sm text-outline">SEO description</label>
          <textarea
            className="field-input min-h-[80px]"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Short blurb for search results"
          />
        </div>
        <p className="font-inter text-label-sm text-outline">
          Custom domains are not available yet.
        </p>
        <button
          type="button"
          className="btn-primary w-full"
          disabled={saving || !name.trim() || !slug.trim()}
          onClick={() => void save()}
        >
          Save hospital
        </button>
        {status ? (
          <p className="font-inter text-label-sm text-primary font-semibold">{status}</p>
        ) : null}
      </div>
    </aside>
  );
}
