import type { LayoutProps } from '../types';
import {
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeContact } from '../content';
import { contactRowIcon, IconBadge, toMapEmbedSrc } from '../icons';
import {
  contactDetailHref,
  contactMapHref,
  contactTelHref,
} from './bits';

/** Contact — address, phone, hours, map CTA (full or home teaser) */
export function Layout01({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const detailHref = contactDetailHref(c, siteLinks);
  const phoneHref = contactTelHref(c);
  const mapHref = contactMapHref(c);
  const embedSrc = toMapEmbedSrc(c.mapUrl, c.address);
  const rows = [
    c.phone ? { label: 'Phone', value: c.phone, href: phoneHref } : null,
    !isTeaser && c.email
      ? { label: 'Email', value: c.email, href: `mailto:${c.email}` }
      : null,
    c.address ? { label: 'Address', value: c.address, href: mapHref } : null,
    !isTeaser && c.hours ? { label: 'Hours', value: c.hours, href: undefined } : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  const hasDetails = rows.length > 0 || Boolean(mapHref) || Boolean(embedSrc);

  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(1.75rem, 4vw, 2.75rem)',
          gridTemplateColumns: isTeaser ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div>
          <p style={kickerStyle}>{isTeaser ? 'Plan your visit' : 'Visit'}</p>
          <h2 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}>{c.title}</h2>
          {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
            {c.ctaPrimary && mapHref ? (
              <a
                href={mapHref}
                className="nabhi-btn"
                style={buttonPrimaryStyle}
                target="_blank"
                rel="noreferrer"
              >
                {c.ctaPrimary}
              </a>
            ) : null}
            {(isTeaser || c.ctaSecondary) && (
              <a href={detailHref} className="nabhi-btn" style={buttonGhostStyle}>
                {c.ctaSecondary || 'Contact details'}
              </a>
            )}
            {phoneHref ? (
              <a href={phoneHref} className="nabhi-btn" style={buttonGhostStyle}>
                Call now
              </a>
            ) : null}
          </div>

          {rows.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gap: '1.15rem',
                marginTop: '1.75rem',
                padding: '1.25rem',
                border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                borderRadius: 'calc(var(--radius-button) + 4px)',
                background: 'color-mix(in srgb, var(--color-bg) 70%, var(--color-surface))',
              }}
            >
              {rows.map((row) => (
                <div key={row.label} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <IconBadge name={contactRowIcon(row.label)} size={40} />
                  <div>
                    <div
                      style={{
                        ...mutedStyle,
                        fontSize: '0.72rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      {row.label}
                    </div>
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
                      <div
                        style={{
                          fontWeight: 500,
                          whiteSpace: 'pre-line',
                          lineHeight: 1.6,
                          fontSize: '1.02rem',
                        }}
                      >
                        {row.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!hasDetails ? (
            <p className="nabhi-empty" style={{ ...mutedStyle, marginTop: '1rem' }}>
              Add phone, address, and hours in Studio — or import from Maps.
            </p>
          ) : null}
        </div>

        {!isTeaser ? (
          <div
            style={{
              borderRadius: 'calc(var(--radius-button) + 4px)',
              overflow: 'hidden',
              border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
              background: 'var(--color-surface)',
              minHeight: 280,
              position: 'relative',
            }}
          >
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title="Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ width: '100%', height: '100%', minHeight: 320, border: 0, display: 'block' }}
              />
            ) : (
              <div className="nabhi-empty-media" style={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
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
        ) : null}
      </div>
    </section>
  );
}
