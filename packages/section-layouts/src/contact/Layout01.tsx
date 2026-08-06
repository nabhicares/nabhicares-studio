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

/** Contact — address, phone, hours, map CTA (full or home teaser) */
export function Layout01({ content, siteLinks }: LayoutProps) {
  const c = normalizeContact(content);
  const isTeaser = c.variant === 'teaser';
  const detailHref = c.ctaSecondaryHref || siteLinks?.contact || 'contact/';
  const telHref = c.phone ? `tel:${c.phone.replace(/[^\d+]/g, '')}` : undefined;
  const rows = [
    c.phone ? { label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/[^\d+]/g, '')}` } : null,
    !isTeaser && c.email
      ? { label: 'Email', value: c.email, href: `mailto:${c.email}` }
      : null,
    c.address ? { label: 'Address', value: c.address, href: undefined } : null,
    !isTeaser && c.hours ? { label: 'Hours', value: c.hours, href: undefined } : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  const hasDetails = rows.length > 0 || c.mapUrl;

  return (
    <section
      style={{
        ...sectionBaseStyle,
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(2rem, 5vw, 3.5rem)',
          gridTemplateColumns: isTeaser
            ? '1fr'
            : 'repeat(auto-fit, minmax(260px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div>
          <p style={kickerStyle}>{isTeaser ? 'Plan your visit' : 'Visit'}</p>
          <h2 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}>{c.title}</h2>
          {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
            {c.ctaPrimary && c.mapUrl ? (
              <a
                href={c.mapUrl}
                className="nabhi-btn"
                style={buttonPrimaryStyle}
                target="_blank"
                rel="noreferrer"
              >
                {c.ctaPrimary}
              </a>
            ) : null}
            {(isTeaser || c.ctaSecondary) && (
              <a
                href={detailHref}
                className="nabhi-btn"
                style={buttonGhostStyle}
              >
                {c.ctaSecondary || 'Contact details'}
              </a>
            )}
            {telHref ? (
              <a href={telHref} className="nabhi-btn" style={buttonGhostStyle}>
                Call now
              </a>
            ) : null}
          </div>

          {!isTeaser && c.mapUrl ? (
            <div
              style={{
                marginTop: '1.25rem',
                borderRadius: 'calc(var(--radius-button) + 4px)',
                overflow: 'hidden',
                border: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
                background: 'var(--color-surface)',
              }}
            >
              <iframe
                src={c.mapUrl}
                title="Map"
                loading="lazy"
                style={{ width: '100%', height: 240, border: 0, display: 'block' }}
              />
            </div>
          ) : null}

          {!hasDetails ? (
            <p className="nabhi-empty" style={{ ...mutedStyle, marginTop: '1rem' }}>
              Add phone, address, and hours in Studio — or import from Maps.
            </p>
          ) : null}
        </div>
        {rows.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: '1.35rem',
              borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
              paddingTop: '1.25rem',
            }}
          >
            {rows.map((row) => (
              <div key={row.label}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: 'color-mix(in srgb, var(--color-accent) 20%, var(--color-fg) 5%)',
                      border: '1px solid color-mix(in srgb, var(--color-fg) 18%, transparent)',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      ...mutedStyle,
                      fontSize: '0.72rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {row.label}
                  </div>
                </div>
                {row.href ? (
                  <a
                    href={row.href}
                    style={{
                      color: 'var(--color-fg)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
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
                      fontSize: '1.05rem',
                    }}
                  >
                    {row.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
