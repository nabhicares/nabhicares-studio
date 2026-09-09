'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';
import { liveSiteUrl } from '@/lib/cdn';

type Campaign = {
  id: string;
  name: string;
  placeLabel: string | null;
  _count?: { hospitals: number };
};

type HospitalRow = {
  id: string;
  name: string;
  slug: string;
  pipelineStatus: string;
  trashedAt: string | null;
  notes: string | null;
  mapsUrl: string | null;
  campaignId: string | null;
  campaign: { id: string; name: string; placeLabel: string | null } | null;
  publishes: { id: string }[];
};

type TrashRow = HospitalRow & { daysLeft: number | null; purgeDue: boolean };

const STATUSES = ['DEMO', 'ACCEPTED', 'TRASHED'] as const;

export function CrmBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [hospitals, setHospitals] = useState<HospitalRow[]>([]);
  const [trash, setTrash] = useState<TrashRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('DEMO');
  const [campaignFilter, setCampaignFilter] = useState<string>('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [extToken, setExtToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<
    { id: string; label: string; prefix: string; createdAt: string }[]
  >([]);

  const load = useCallback(async () => {
    setError(null);
    const qs = new URLSearchParams();
    if (statusFilter === 'TRASHED') {
      qs.set('pipelineStatus', 'TRASHED');
      qs.set('includeTrashed', '1');
    } else if (statusFilter) {
      qs.set('pipelineStatus', statusFilter);
    }
    if (campaignFilter) qs.set('campaignId', campaignFilter);

    const [cRes, hRes, tRes, eRes] = await Promise.all([
      apiFetch('/api/campaigns'),
      apiFetch(`/api/hospitals?${qs}`),
      apiFetch('/api/crm/purge-trashed'),
      apiFetch('/api/extension/tokens'),
    ]);
    if (!cRes.ok || !hRes.ok) {
      setError('Failed to load CRM data');
      return;
    }
    setCampaigns(await cRes.json());
    setHospitals(await hRes.json());
    if (tRes.ok) {
      const t = await tRes.json();
      setTrash(t.trashed ?? []);
    }
    if (eRes.ok) {
      const e = await eRes.json();
      setTokens(e.tokens ?? []);
    }
  }, [statusFilter, campaignFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const showing = useMemo(() => hospitals, [hospitals]);

  async function createCampaign() {
    if (!newCampaignName.trim()) return;
    setBusy('campaign');
    const res = await apiFetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCampaignName.trim(),
        placeLabel: newPlace.trim() || null,
      }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Create campaign failed');
      return;
    }
    setNewCampaignName('');
    setNewPlace('');
    await load();
  }

  async function setPipeline(id: string, status: string, republish = false) {
    setBusy(id);
    setError(null);
    const res = await apiFetch(`/api/hospitals/${id}/pipeline`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, republish }),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Update failed');
      return;
    }
    await load();
  }

  async function issueToken() {
    setBusy('token');
    const res = await apiFetch('/api/extension/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: 'Field laptop' }),
    });
    setBusy(null);
    if (!res.ok) {
      setError('Could not issue extension token');
      return;
    }
    const data = await res.json();
    setExtToken(data.token);
    await load();
  }

  async function revokeToken(id: string) {
    await apiFetch(`/api/extension/tokens/${id}`, { method: 'DELETE' });
    await load();
  }

  async function purgeNow() {
    if (!confirm('Hard-delete all TRASHED hospitals older than 30 days?')) return;
    setBusy('purge');
    const res = await apiFetch('/api/crm/purge-trashed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setBusy(null);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || 'Purge failed');
      return;
    }
    await load();
  }

  return (
    <div className="flex flex-col gap-xl">
      {error ? (
        <p className="rounded-lg border border-error/30 bg-error-container/30 px-md py-sm font-inter text-label-sm text-error">
          {error}
        </p>
      ) : null}

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <h2 className="font-outfit text-[16px] font-semibold text-on-surface mb-sm">
          Campaigns (map places)
        </h2>
        <div className="flex flex-wrap gap-sm mb-md">
          <input
            className="flex-1 min-w-[160px] rounded-md border border-outline-variant px-sm py-xs font-inter text-body-sm"
            placeholder="Campaign name"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
          />
          <input
            className="flex-1 min-w-[160px] rounded-md border border-outline-variant px-sm py-xs font-inter text-body-sm"
            placeholder="Place label (e.g. Coimbatore north)"
            value={newPlace}
            onChange={(e) => setNewPlace(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary px-md py-xs"
            disabled={!!busy}
            onClick={() => void createCampaign()}
          >
            Add campaign
          </button>
        </div>
        <ul className="flex flex-wrap gap-sm list-none m-0 p-0">
          {campaigns.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-outline-variant px-md py-sm font-inter text-label-sm"
            >
              <strong>{c.name}</strong>
              {c.placeLabel ? ` · ${c.placeLabel}` : ''}
              {typeof c._count?.hospitals === 'number'
                ? ` · ${c._count.hospitals} sites`
                : ''}
              <a
                className="ml-sm text-primary"
                href={`/api/campaigns/${c.id}/demo-pack`}
                target="_blank"
                rel="noreferrer"
              >
                QR pack
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <h2 className="font-outfit text-[16px] font-semibold text-on-surface mb-sm">
          Chrome extension token
        </h2>
        <p className="font-inter text-label-sm text-outline mb-md">
          Paste Gemini JSON in the Nabhi extension using a Bearer token. Create one per field
          laptop; revoke when done.
        </p>
        {extToken ? (
          <p className="font-mono text-[12px] break-all bg-surface-container p-md rounded-md mb-md">
            {extToken}
            <span className="block font-inter text-label-sm text-outline mt-xs">
              Copy now — shown once.
            </span>
          </p>
        ) : null}
        <button
          type="button"
          className="btn-primary px-md py-xs mb-md"
          disabled={!!busy}
          onClick={() => void issueToken()}
        >
          Issue token
        </button>
        <ul className="list-none m-0 p-0 flex flex-col gap-xs">
          {tokens.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-sm font-inter text-label-sm"
            >
              <span>
                {t.label} · <code>{t.prefix}…</code>
              </span>
              <button
                type="button"
                className="btn-ghost px-sm py-xs text-error"
                onClick={() => void revokeToken(t.id)}
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-sm mb-md">
          <h2 className="font-outfit text-[16px] font-semibold text-on-surface mr-auto">
            Pipeline
          </h2>
          <select
            className="rounded-md border border-outline-variant px-sm py-xs font-inter text-label-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="">All (non-trash)</option>
          </select>
          <select
            className="rounded-md border border-outline-variant px-sm py-xs font-inter text-label-sm"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
          >
            <option value="">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden divide-y divide-outline-variant list-none m-0 p-0">
          {showing.length === 0 ? (
            <li className="px-lg py-xl text-center font-inter text-body-sm text-outline">
              No hospitals in this filter.
            </li>
          ) : (
            showing.map((h) => {
              const live = h.publishes?.length > 0;
              return (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center gap-md px-lg py-md"
                >
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-inter text-body-md font-semibold text-brand-ink">
                      {h.name}
                    </div>
                    <div className="font-inter text-label-sm text-outline">
                      {h.slug}
                      {h.campaign ? ` · ${h.campaign.name}` : ''}
                      {` · ${h.pipelineStatus}`}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-xs">
                    {live ? (
                      <a
                        href={liveSiteUrl(h.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost px-sm py-xs text-label-sm"
                      >
                        Live
                      </a>
                    ) : null}
                    <a
                      href={`/api/hospitals/${h.id}/qr`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost px-sm py-xs text-label-sm"
                    >
                      QR
                    </a>
                    <Link
                      href={`/h/${h.slug}`}
                      className="btn-ghost px-sm py-xs text-label-sm"
                    >
                      Open
                    </Link>
                    {h.pipelineStatus !== 'ACCEPTED' ? (
                      <button
                        type="button"
                        className="btn-primary px-sm py-xs text-label-sm"
                        disabled={!!busy}
                        onClick={() => void setPipeline(h.id, 'ACCEPTED', true)}
                      >
                        Accept
                      </button>
                    ) : null}
                    {h.pipelineStatus !== 'TRASHED' ? (
                      <button
                        type="button"
                        className="btn-ghost px-sm py-xs text-label-sm text-error"
                        disabled={!!busy}
                        onClick={() => void setPipeline(h.id, 'DECLINED')}
                      >
                        Decline → trash
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary px-sm py-xs text-label-sm"
                        disabled={!!busy}
                        onClick={() => void setPipeline(h.id, 'ACCEPTED', true)}
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="flex items-center gap-md mb-md flex-wrap">
          <h2 className="font-outfit text-[16px] font-semibold text-on-surface mr-auto">
            Trash bin (30 days)
          </h2>
          <button
            type="button"
            className="btn-ghost px-md py-xs text-error"
            disabled={!!busy}
            onClick={() => void purgeNow()}
          >
            Purge expired now
          </button>
        </div>
        <ul className="list-none m-0 p-0 divide-y divide-outline-variant">
          {trash.length === 0 ? (
            <li className="py-md font-inter text-label-sm text-outline">Trash is empty.</li>
          ) : (
            trash.map((h) => (
              <li
                key={h.id}
                className="flex flex-wrap items-center gap-md py-sm font-inter text-label-sm"
              >
                <span className="flex-1">
                  {h.name}{' '}
                  <span className="text-outline">
                    · {h.purgeDue ? 'due for purge' : `${h.daysLeft ?? '?'}d left`}
                  </span>
                </span>
                <button
                  type="button"
                  className="btn-primary px-sm py-xs"
                  disabled={!!busy}
                  onClick={() => void setPipeline(h.id, 'ACCEPTED', true)}
                >
                  Restore
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
