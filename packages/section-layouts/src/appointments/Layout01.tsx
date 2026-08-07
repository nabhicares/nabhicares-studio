'use client';

import { useState, type CSSProperties, type FormEvent } from 'react';
import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonPrimaryStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeAppointments } from '../content';

const fieldStyle: CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: 'var(--radius-button)',
  border: '1px solid color-mix(in srgb, var(--color-fg) 16%, transparent)',
  background: 'var(--color-bg)',
  color: 'var(--color-fg)',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
};

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: '0.35rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  color: 'var(--color-muted)',
};

function resolveStudioApiUrl(explicit?: string): string {
  if (explicit && explicit.trim()) return explicit.replace(/\/$/, '');
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_STUDIO_API_URL) {
    return String(process.env.NEXT_PUBLIC_STUDIO_API_URL).replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
    return window.location.origin;
  }
  return '';
}

/** Visitor appointment request form */
export function Layout01({ content, hospitalSlug, studioApiUrl }: LayoutProps) {
  const c = normalizeAppointments(content);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hospitalSlug) {
      setStatus('error');
      setError('Hospital is not configured for online requests yet.');
      return;
    }
    const base = resolveStudioApiUrl(studioApiUrl);
    if (!base) {
      setStatus('error');
      setError('Booking API is not configured. Set NEXT_PUBLIC_STUDIO_API_URL.');
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const preferredRaw = String(fd.get('preferredAt') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !phone) {
      setStatus('error');
      setError('Name and phone are required.');
      return;
    }

    setStatus('submitting');
    setError('');
    try {
      const res = await fetch(
        `${base}/api/public/hospitals/${encodeURIComponent(hospitalSlug)}/appointment-requests`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            email: email || undefined,
            preferredAt: preferredRaw || undefined,
            message: message || undefined,
          }),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setStatus('ok');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <section style={sectionBaseStyle} id="appointments">
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div>
          <p style={kickerStyle}>Appointments</p>
          <h2 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}>{c.title}</h2>
          {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        </div>

        <div
          style={{
            padding: '1.35rem',
            borderRadius: 'calc(var(--radius-button) + 4px)',
            border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
            background: 'color-mix(in srgb, var(--color-surface) 55%, var(--color-bg))',
          }}
        >
          {status === 'ok' ? (
            <p style={{ ...bodyStyle, margin: 0 }}>{c.successMessage}</p>
          ) : (
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <label style={labelStyle}>
                Full name *
                <input name="name" required autoComplete="name" style={fieldStyle} />
              </label>
              <label style={labelStyle}>
                Phone *
                <input name="phone" required autoComplete="tel" style={fieldStyle} />
              </label>
              <label style={labelStyle}>
                Email
                <input name="email" type="email" autoComplete="email" style={fieldStyle} />
              </label>
              <label style={labelStyle}>
                Preferred date &amp; time
                <input name="preferredAt" type="datetime-local" style={fieldStyle} />
              </label>
              <label style={labelStyle}>
                Notes
                <textarea name="message" rows={3} style={{ ...fieldStyle, resize: 'vertical' }} />
              </label>
              {status === 'error' && error ? (
                <p style={{ ...mutedStyle, color: 'var(--color-accent)', margin: 0 }}>{error}</p>
              ) : null}
              <button
                type="submit"
                className="nabhi-btn"
                disabled={status === 'submitting'}
                style={{
                  ...buttonPrimaryStyle,
                  border: 'none',
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                  opacity: status === 'submitting' ? 0.75 : 1,
                }}
              >
                {status === 'submitting' ? 'Sending…' : c.submitLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
