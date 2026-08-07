import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { ContactContent, SiteLinks } from '../types';
import {
  buttonGhostStyle,
  buttonPrimaryStyle,
  mutedStyle,
} from '../styles';
import { contactRowIcon, IconBadge, toMapEmbedSrc } from '../icons';
import { resolveHref, telHref, toDirectionsUrl } from '../links';
import { elevatedCardStyle } from '../polish';

export type ContactRow = { label: string; value: string; href?: string };

export function contactRows(c: ContactContent, isTeaser: boolean): ContactRow[] {
  const phoneHref = c.phone ? telHref(c.phone) : undefined;
  const directionsHref = toDirectionsUrl(c.mapUrl, c.address);
  return [
    c.phone ? { label: 'Phone', value: c.phone, href: phoneHref } : null,
    !isTeaser && c.email
      ? { label: 'Email', value: c.email, href: `mailto:${c.email}` }
      : null,
    c.address
      ? { label: 'Address', value: c.address, href: directionsHref }
      : null,
    !isTeaser && c.hours ? { label: 'Hours', value: c.hours, href: undefined } : null,
  ].filter(Boolean) as ContactRow[];
}

export function contactDetailHref(c: ContactContent, siteLinks?: SiteLinks): string {
  return resolveHref(c.ctaSecondaryHref, siteLinks?.contact || 'contact/', siteLinks);
}

export function contactTelHref(c: ContactContent): string | undefined {
  return c.phone ? telHref(c.phone) : undefined;
}

/** Directions link for Maps app / Google Maps web. */
export function contactMapHref(c: ContactContent): string | undefined {
  return toDirectionsUrl(c.mapUrl, c.address);
}

export function ContactCtas({
  c,
  siteLinks,
  isTeaser,
}: {
  c: ContactContent;
  siteLinks?: SiteLinks;
  isTeaser: boolean;
}): ReactElement | null {
  const directionsHref = contactMapHref(c);
  const detailHref = contactDetailHref(c, siteLinks);
  const phoneHref = contactTelHref(c);
  const buttons: ReactNode[] = [];

  if (c.ctaPrimary && directionsHref) {
    buttons.push(
      <a
        key="dir"
        href={directionsHref}
        className="nabhi-btn"
        style={buttonPrimaryStyle}
        target="_blank"
        rel="noreferrer"
      >
        {c.ctaPrimary}
      </a>,
    );
  }
  if (isTeaser || c.ctaSecondary) {
    buttons.push(
      <a key="detail" href={detailHref} className="nabhi-btn" style={buttonGhostStyle}>
        {c.ctaSecondary || 'Contact details'}
      </a>,
    );
  }
  if (phoneHref) {
    buttons.push(
      <a key="call" href={phoneHref} className="nabhi-btn" style={buttonGhostStyle}>
        Call now
      </a>,
    );
  }

  if (!buttons.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
      {buttons}
    </div>
  );
}

const labelStyle: CSSProperties = {
  ...mutedStyle,
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 600,
  marginBottom: 4,
};

export function ContactRowCard({ row }: { row: ContactRow }): ReactElement {
  return (
    <div
      style={{
        ...elevatedCardStyle,
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'flex-start',
      }}
    >
      <IconBadge name={contactRowIcon(row.label)} size={40} />
      <div>
        <div style={labelStyle}>{row.label}</div>
        {row.href ? (
          <a
            href={row.href}
            style={{
              color: 'var(--color-fg)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              whiteSpace: 'pre-line',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {row.value}
          </a>
        ) : (
          <div style={{ fontWeight: 500, whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '1.02rem' }}>
            {row.value}
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactMapPanel({
  c,
  minHeight = 320,
}: {
  c: ContactContent;
  minHeight?: number;
}): ReactElement {
  const embedSrc = toMapEmbedSrc(c.mapUrl, c.address);
  const mapHref = contactMapHref(c);
  return (
    <div
      style={{
        borderRadius: 'calc(var(--radius-button) + 4px)',
        overflow: 'hidden',
        border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
        background: 'var(--color-surface)',
        boxShadow: '0 4px 18px color-mix(in srgb, var(--color-fg) 6%, transparent)',
        minHeight,
        position: 'relative',
      }}
    >
      {embedSrc ? (
        <iframe
          src={embedSrc}
          title="Map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: '100%', height: '100%', minHeight, border: 0, display: 'block' }}
        />
      ) : (
        <div
          className="nabhi-empty-media"
          style={{ minHeight, alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 42, color: 'var(--color-accent)' }}>
            location_on
          </span>
          <p style={{ margin: 0, textAlign: 'center' }}>
            {mapHref || c.address
              ? 'Map preview unavailable — use Get directions.'
              : 'Add a Maps link or address in Studio to show the map.'}
          </p>
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="nabhi-btn"
              style={{ ...buttonPrimaryStyle, marginTop: '0.75rem' }}
            >
              Open in Maps
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}
