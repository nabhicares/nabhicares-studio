'use client';

import { apiFetch } from '@/lib/api-client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteHospitalButton({
  hospitalId,
  hospitalName,
}: {
  hospitalId: string;
  hospitalName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (
      !confirm(
        `Delete “${hospitalName}” and all its pages, sections, and publish history? This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(true);
    const res = await apiFetch(`/api/hospitals/${hospitalId}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? 'Delete failed');
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      title="Delete hospital"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void onDelete();
      }}
      className="p-xs rounded hover:bg-error-container text-outline hover:text-on-error-container transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[20px]">delete</span>
    </button>
  );
}
