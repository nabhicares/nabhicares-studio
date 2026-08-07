'use client';

import { useEffect, useState, type CSSProperties, type ReactElement } from 'react';
import {
  allowsOptionalEmbeds,
  NABHI_CONSENT_EVENT,
  readConsent,
  writeConsent,
  type NabhiConsent,
} from './consent';
import { buttonPrimaryStyle, mutedStyle } from './styles';

/** Google Maps iframe — only loads after visitor accepts optional embeds. */
export function ConsentAwareMap({
  embedSrc,
  title = 'Map',
  minHeight = 320,
}: {
  embedSrc: string;
  title?: string;
  minHeight?: number;
}): ReactElement {
  const [consent, setConsent] = useState<NabhiConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    const onChange = () => setConsent(readConsent());
    window.addEventListener(NABHI_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(NABHI_CONSENT_EVENT, onChange);
  }, []);

  const allowed = allowsOptionalEmbeds(consent);

  if (!ready) {
    return <div style={{ minHeight, background: 'var(--color-surface)' }} aria-hidden />;
  }

  if (allowed) {
    return (
      <iframe
        src={embedSrc}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ width: '100%', height: '100%', minHeight, border: 0, display: 'block' }}
      />
    );
  }

  const wrap: CSSProperties = {
    minHeight,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.85rem',
    padding: '1.5rem',
    textAlign: 'center',
    background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
    boxSizing: 'border-box',
  };

  return (
    <div style={wrap} className="nabhi-empty-media">
      <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-accent)' }}>
        map
      </span>
      <p style={{ ...mutedStyle, margin: 0, maxWidth: 320 }}>
        Map preview uses Google Maps. Choose Accept all in the privacy banner to load directions
        embeds, or open directions in a new tab.
      </p>
      <button
        type="button"
        className="nabhi-btn"
        style={{ ...buttonPrimaryStyle, border: 'none', cursor: 'pointer' }}
        onClick={() => setConsent(writeConsent('all'))}
      >
        Accept all &amp; show map
      </button>
    </div>
  );
}
