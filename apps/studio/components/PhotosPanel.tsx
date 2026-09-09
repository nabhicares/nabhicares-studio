'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { ImageField } from '@/components/ImageField';

type PhotosState = {
  photoCandidates: string[];
  current: {
    hero: string;
    about: string;
    og: string;
    galleryFirst: string;
  };
};

type AssignTarget = 'hero' | 'about' | 'og' | 'gallery';

export function PhotosPanel({
  hospitalId,
  onAssigned,
}: {
  hospitalId: string;
  /** Called after hero/about/gallery assign so canvas can refresh */
  onAssigned?: () => void;
}) {
  const [data, setData] = useState<PhotosState | null>(null);
  const [paste, setPaste] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/photos`);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Failed to load photos');
      return;
    }
    setData(await res.json());
  }, [hospitalId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveCandidates(list: string[]) {
    setBusy('save');
    setError(null);
    setMessage(null);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoCandidates: list }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Save failed');
      return;
    }
    setData(await res.json());
    setMessage('Candidates saved');
  }

  async function addFromPaste() {
    if (!paste.trim()) return;
    setBusy('paste');
    setError(null);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoCandidates: paste }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Could not add URLs');
      return;
    }
    setData(await res.json());
    setPaste('');
    setMessage('URLs added');
  }

  async function addUploadedUrl(url: string) {
    setBusy('upload');
    setError(null);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addUrl: url }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Could not add upload');
      return;
    }
    setData(await res.json());
    setMessage('Uploaded image added to candidates');
  }

  async function assign(url: string, target: AssignTarget) {
    setBusy(`${target}:${url}`);
    setError(null);
    setMessage(null);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/photos`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assign: { url, target } }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Assign failed');
      return;
    }
    setData(await res.json());
    setMessage(`Assigned to ${target}`);
    onAssigned?.();
  }

  function removeCandidate(url: string) {
    if (!data) return;
    void saveCandidates(data.photoCandidates.filter((u) => u !== url));
  }

  const candidates = data?.photoCandidates ?? [];

  return (
    <div className="px-xl py-xl max-w-3xl mx-auto flex flex-col gap-lg">
      <div>
        <h2 className="font-outfit text-[20px] font-semibold text-brand-ink">Photos</h2>
        <p className="font-inter text-body-sm text-outline mt-xs">
          Paste image URLs or upload, then assign to Hero, About, OG share image, or gallery.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-error/30 bg-error-container/30 px-md py-sm font-inter text-label-sm text-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="font-inter text-label-sm text-primary">{message}</p>
      ) : null}

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg flex flex-col gap-md">
        <h3 className="font-outfit text-[15px] font-semibold text-on-surface m-0">
          Add candidates
        </h3>
        <textarea
          className="field-input resize-y min-h-[88px] font-mono text-[12px]"
          placeholder="One https:// image URL per line"
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
        />
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            className="btn-primary px-md py-xs"
            disabled={!!busy || !paste.trim()}
            onClick={() => void addFromPaste()}
          >
            Add URLs
          </button>
        </div>
        <ImageField
          label="Upload & crop (adds to candidates)"
          hospitalId={hospitalId}
          value=""
          aspectHint="16:9"
          onChange={(url) => void addUploadedUrl(url)}
        />
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <h3 className="font-outfit text-[15px] font-semibold text-on-surface mb-md">
          Candidates ({candidates.length})
        </h3>
        {candidates.length === 0 ? (
          <p className="font-inter text-label-sm text-outline m-0">
            No candidates yet. Paste URLs from the extension or upload above.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-md list-none m-0 p-0">
            {candidates.map((url) => (
              <li
                key={url}
                className="rounded-lg border border-outline-variant overflow-hidden bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-36 object-cover bg-surface-container" />
                <div className="p-sm flex flex-col gap-xs">
                  <p className="font-inter text-[11px] text-outline break-all m-0 line-clamp-2">
                    {url}
                  </p>
                  <div className="flex flex-wrap gap-xs">
                    {(
                      [
                        ['hero', 'Hero'],
                        ['about', 'About'],
                        ['og', 'OG'],
                        ['gallery', 'Gallery'],
                      ] as const
                    ).map(([t, label]) => (
                      <button
                        key={t}
                        type="button"
                        className="btn-ghost text-label-sm py-xs px-sm"
                        disabled={!!busy}
                        onClick={() => void assign(url, t)}
                      >
                        {busy === `${t}:${url}` ? '…' : label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="btn-ghost text-label-sm py-xs px-sm text-error"
                      disabled={!!busy}
                      onClick={() => removeCandidate(url)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {data?.current ? (
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
          <h3 className="font-outfit text-[15px] font-semibold text-on-surface mb-md">
            Currently assigned
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-md m-0 font-inter text-label-sm">
            {(
              [
                ['Hero', data.current.hero],
                ['About', data.current.about],
                ['OG / share', data.current.og],
                ['Gallery (first)', data.current.galleryFirst],
              ] as const
            ).map(([label, src]) => (
              <div key={label} className="flex gap-sm items-start">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="w-16 h-12 object-cover rounded-md border border-outline-variant shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-md border border-dashed border-outline-variant shrink-0" />
                )}
                <div className="min-w-0">
                  <dt className="font-semibold text-on-surface">{label}</dt>
                  <dd className="m-0 text-outline break-all line-clamp-2">{src || '—'}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
