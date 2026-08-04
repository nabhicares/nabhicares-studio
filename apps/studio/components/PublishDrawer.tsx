'use client';

import { apiFetch } from '@/lib/api-client';

import { useEffect, useState } from 'react';
import { liveSiteUrl } from '@/lib/cdn';

type Publish = {
  id: string;
  status: string;
  isLive: boolean;
  snapshotPath: string | null;
  createdAt: string;
};

const STEPS = ['PENDING', 'BUILDING', 'UPLOADING', 'LIVE'] as const;

export function PublishDrawer({
  hospitalId,
  hospitalSlug,
  onClose,
}: {
  hospitalId: string;
  hospitalSlug: string;
  onClose: () => void;
}) {
  const [publishes, setPublishes] = useState<Publish[]>([]);
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>('PENDING');
  const [note, setNote] = useState('');

  async function refresh() {
    const res = await apiFetch(`/api/hospitals/${hospitalId}/publish`);
    setPublishes(await res.json());
  }

  useEffect(() => {
    void refresh();
  }, [hospitalId]);

  useEffect(() => {
    if (!activeId) return;
    const t = setInterval(async () => {
      const res = await apiFetch(`/api/publishes/${activeId}`);
      const pub = await res.json();
      setActiveStatus(pub.status);
      setNote(`Publish ${pub.status}`);
      if (pub.status === 'LIVE' || pub.status === 'FAILED') {
        setActiveId(null);
        setBusy(false);
        void refresh();
      }
    }, 1500);
    return () => clearInterval(t);
  }, [activeId]);

  async function publish() {
    const reviewNote = window.prompt(
      'Confirm content accuracy before publish (required).\nExample: Doctor credentials and bios verified.',
    );
    if (reviewNote === null) return;
    if (!reviewNote.trim()) {
      setNote('Publish cancelled — review note required');
      return;
    }
    setBusy(true);
    setNote('Enqueueing…');
    setActiveStatus('PENDING');
    const res = await apiFetch(`/api/hospitals/${hospitalId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewNote: reviewNote.trim() }),
    });
    const pub = await res.json();
    if (!res.ok) {
      setBusy(false);
      setNote(pub.error ?? 'Publish failed');
      return;
    }
    setActiveId(pub.id);
    setActiveStatus(pub.status);
    void refresh();
  }

  async function rollback(publishId: string) {
    if (!confirm('Roll back live site to this version? No rebuild — pointer flip only.')) {
      return;
    }
    setBusy(true);
    setNote('Rolling back (no rebuild)…');
    const started = performance.now();
    const res = await apiFetch(`/api/hospitals/${hospitalId}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publishId }),
    });
    const data = await res.json();
    const ms = Math.round(performance.now() - started);
    setNote(
      data.rebuilt === false
        ? `Rollback done in ${ms}ms — pointer flip only`
        : `Rollback finished in ${ms}ms`,
    );
    setBusy(false);
    void refresh();
  }

  const stepIndex = Math.max(
    0,
    STEPS.indexOf(
      (activeStatus === 'UPLOADING' ? 'BUILDING' : activeStatus) as (typeof STEPS)[number],
    ),
  );

  return (
    <div className="relative w-full max-w-md h-[min(720px,90%)] bg-surface-container-lowest border border-outline-variant shadow-2xl flex flex-col rounded-xl overflow-hidden z-10">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">cloud_upload</span>
          <h3 className="font-outfit text-h3 font-bold text-on-surface">Publish Status</h3>
        </div>
        <button
          type="button"
          className="p-sm hover:bg-surface-container rounded-full"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-on-surface-variant">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-lg space-y-xl">
        <div className="space-y-md">
          <button
            type="button"
            disabled={busy}
            onClick={publish}
            className="w-full py-md bg-primary-container text-on-primary-container font-outfit text-h3 font-bold rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-md disabled:opacity-60"
          >
            <span className="material-symbols-outlined filled">bolt</span>
            Publish
          </button>
          <p className="font-inter text-body-sm text-on-surface-variant text-center px-md">
            Deployment usually takes less than 60 seconds.
          </p>
          {note ? <p className="font-mono text-xs text-center text-primary">{note}</p> : null}
          <a
            className="block text-center text-body-sm text-primary underline"
            href={liveSiteUrl(hospitalSlug)}
            target="_blank"
            rel="noreferrer"
          >
            Open live site
          </a>
        </div>

        {busy || activeId ? (
          <div className="space-y-lg bg-surface-container-low p-md rounded-xl border border-outline-variant">
            {STEPS.filter((s) => s !== 'UPLOADING').map((step, i) => {
              const done = stepIndex > i || activeStatus === 'LIVE';
              const current = STEPS[stepIndex] === step || (step === 'BUILDING' && activeStatus === 'UPLOADING');
              return (
                <div key={step} className="flex items-center gap-md">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      done
                        ? 'bg-primary text-on-primary'
                        : current
                          ? 'bg-primary-container border-2 border-primary text-primary'
                          : 'bg-surface-container border-2 border-outline-variant text-on-surface-variant opacity-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {done ? 'check' : current ? 'sync' : 'rocket_launch'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-inter text-label-md font-bold ${
                        current ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {step}
                    </p>
                    <p className="font-inter text-body-sm text-on-surface-variant">
                      {step === 'PENDING'
                        ? 'Job queued'
                        : step === 'BUILDING'
                          ? 'Exporting static site…'
                          : 'Production deployment'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <p className="font-inter text-label-md font-bold text-on-surface-variant uppercase tracking-widest">
              Version History
            </p>
            <span className="material-symbols-outlined text-outline text-[20px]">info</span>
          </div>
          <div className="space-y-sm">
            {publishes.map((p, idx) => (
              <div
                key={p.id}
                className={`p-md bg-surface-container-lowest rounded-xl flex items-center justify-between ${
                  p.isLive
                    ? 'border-2 border-primary-container'
                    : 'border border-outline-variant'
                }`}
              >
                <div>
                  <div className="flex items-center gap-sm mb-xs">
                    <span className="font-inter text-label-md font-bold text-on-surface">
                      v{publishes.length - idx}
                    </span>
                    {p.isLive ? (
                      <span className="bg-primary-container text-on-primary-container text-[10px] px-sm py-xs rounded-full font-bold uppercase">
                        Live Now
                      </span>
                    ) : (
                      <span className="text-[10px] text-outline uppercase font-bold">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <p className="font-inter text-body-sm text-on-surface-variant opacity-70">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                {p.isLive ? (
                  <span className="material-symbols-outlined text-primary filled">verified</span>
                ) : (
                  <button
                    type="button"
                    disabled={busy || (!p.snapshotPath && p.status === 'FAILED')}
                    className="btn-ghost flex items-center gap-xs"
                    onClick={() => rollback(p.id)}
                  >
                    <span className="material-symbols-outlined text-sm">history</span>
                    Rollback
                  </button>
                )}
              </div>
            ))}
            {publishes.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant">No publishes yet.</p>
            ) : null}
          </div>
          <div className="flex items-start gap-sm p-sm bg-surface-container-low rounded-lg border border-dotted border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
            <p className="font-inter text-body-sm text-on-surface-variant italic">
              Rollback is instant — no rebuild required. Your assets are already cached.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
