'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import {
  normalizeWhatsAppDigits,
  whatsAppDeepLink,
} from '@/lib/whatsapp-share';

type ShareInfo = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  liveUrl: string;
  pathUrl: string;
  message: string;
  shareCardUrl: string;
};

export function HospitalShareActions({
  hospitalId,
  hospitalName,
}: {
  hospitalId: string;
  hospitalName: string;
}) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');

  async function loadInfo(): Promise<ShareInfo | null> {
    const res = await apiFetch(`/api/hospitals/${hospitalId}/share-info`);
    if (!res.ok) {
      setHint('Could not load share info');
      return null;
    }
    return (await res.json()) as ShareInfo;
  }

  async function resolvePhone(info: ShareInfo): Promise<string | null> {
    if (info.phone) {
      const d = normalizeWhatsAppDigits(info.phone);
      if (d) return d;
    }
    const typed = window.prompt(
      `WhatsApp number for ${hospitalName} (with country code, e.g. 9198…)`,
      info.phone || '',
    );
    if (!typed) return null;
    const d = normalizeWhatsAppDigits(typed);
    if (!d) {
      setHint('Enter a valid phone number');
      return null;
    }
    return d;
  }

  async function onWhatsApp() {
    setBusy(true);
    setHint('');
    try {
      const info = await loadInfo();
      if (!info) return;
      await navigator.clipboard.writeText(info.message).catch(() => undefined);
      const digits = await resolvePhone(info);
      if (!digits) {
        setHint('Message copied — open WhatsApp and paste when ready');
        return;
      }
      window.open(whatsAppDeepLink(digits, info.message), '_blank', 'noopener,noreferrer');
      setHint('WhatsApp opened · message copied');
    } finally {
      setBusy(false);
    }
  }

  async function onShareCard() {
    setBusy(true);
    setHint('');
    try {
      const info = await loadInfo();
      if (!info) return;
      await navigator.clipboard.writeText(info.message).catch(() => undefined);

      const res = await apiFetch(`/api/hospitals/${hospitalId}/share-card`);
      if (!res.ok) {
        setHint('Could not build share card');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${info.slug}-nabhi-demo.png`;
      a.click();
      URL.revokeObjectURL(url);

      const digits = info.phone ? normalizeWhatsAppDigits(info.phone) : null;
      if (digits) {
        window.open(whatsAppDeepLink(digits, info.message), '_blank', 'noopener,noreferrer');
        setHint('Card downloaded · WhatsApp opened — attach the PNG');
      } else {
        setHint('Card + message ready — attach PNG in WhatsApp');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-xs">
      <div className="flex items-center gap-xs">
        <button
          type="button"
          className="btn-ghost px-sm py-xs font-inter text-label-sm"
          title="Open WhatsApp with demo message"
          disabled={busy}
          onClick={() => void onWhatsApp()}
        >
          <span className="material-symbols-outlined text-[18px] align-middle">chat</span>
        </button>
        <button
          type="button"
          className="btn-ghost px-sm py-xs font-inter text-label-sm"
          title="Download QR share card"
          disabled={busy}
          onClick={() => void onShareCard()}
        >
          <span className="material-symbols-outlined text-[18px] align-middle">qr_code_2</span>
        </button>
      </div>
      {hint ? (
        <span className="font-inter text-[10px] text-outline max-w-[140px] text-right leading-snug">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
