'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';

type AppointmentRequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferredAt: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = ['new', 'contacted', 'closed'] as const;

function formatWhen(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function AppointmentRequestsPanel({ hospitalId }: { hospitalId: string }) {
  const [rows, setRows] = useState<AppointmentRequestRow[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const q = filter !== 'all' ? `?status=${encodeURIComponent(filter)}` : '';
    const res = await apiFetch(`/api/hospitals/${hospitalId}/appointment-requests${q}`);
    if (!res.ok) {
      setError('Failed to load appointment requests');
      setLoading(false);
      return;
    }
    const data = (await res.json()) as AppointmentRequestRow[];
    setRows(data);
    setLoading(false);
  }, [hospitalId, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    const res = await apiFetch(`/api/hospitals/${hospitalId}/appointment-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (!res.ok) {
      setError('Could not update status');
      return;
    }
    const updated = (await res.json()) as AppointmentRequestRow;
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-xl py-xl pb-24">
      <div className="flex flex-wrap items-end justify-between gap-md mb-lg">
        <div>
          <h2 className="font-headline text-headline-sm text-on-surface">Appointment requests</h2>
          <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
            Submissions from the Appointments section on your live site.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <select
            className="font-inter text-body-sm border border-outline-variant rounded-lg px-sm py-xs bg-surface-container-lowest"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary text-label-sm"
            onClick={() => void load()}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="text-error font-inter text-body-sm mb-md">{error}</p> : null}
      {loading ? (
        <p className="font-inter text-on-surface-variant">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="font-inter text-on-surface-variant">
          No requests yet. Add an Appointments section and publish, then visitors can submit from the
          live site.
        </p>
      ) : (
        <ul className="space-y-md">
          {rows.map((row) => (
            <li
              key={row.id}
              className="border border-outline-variant rounded-xl bg-surface-container-lowest p-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-sm">
                <div>
                  <p className="font-inter font-semibold text-on-surface">{row.name}</p>
                  <p className="font-inter text-body-sm text-on-surface-variant mt-xs">
                    {row.phone}
                    {row.email ? ` · ${row.email}` : ''}
                  </p>
                </div>
                <select
                  className="font-inter text-label-sm border border-outline-variant rounded-lg px-sm py-xs bg-surface"
                  value={row.status}
                  disabled={busyId === row.id}
                  onChange={(e) => void setStatus(row.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <dl className="mt-md grid gap-xs font-inter text-body-sm text-on-surface-variant">
                <div>
                  <dt className="inline text-outline">Preferred: </dt>
                  <dd className="inline">{formatWhen(row.preferredAt)}</dd>
                </div>
                <div>
                  <dt className="inline text-outline">Submitted: </dt>
                  <dd className="inline">{formatWhen(row.createdAt)}</dd>
                </div>
                {row.message ? (
                  <div>
                    <dt className="text-outline mb-xs">Notes</dt>
                    <dd className="text-on-surface whitespace-pre-wrap">{row.message}</dd>
                  </div>
                ) : null}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
