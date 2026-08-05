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
import { normalizeContact } from '../content';

/** Contact — address, phone, hours, map CTA */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeContact(content);
  const rows = [
    c.phone ? { label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s+/g, '')}` } : null,
    c.email ? { label: 'Email', value: c.email, href: `mailto:${c.email}` } : null,
    c.address ? { label: 'Address', value: c.address, href: undefined } : null,
    c.hours ? { label: 'Hours', value: c.hours, href: undefined } : null,
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 60%, var(--color-bg))',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 'clamp(2rem, 5vw, 3.5rem)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          alignItems: 'start',
        }}
      >
        <div>
          <p style={kickerStyle}>Visit</p>
          <h2 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}>{c.title}</h2>
          {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
          {c.ctaPrimary && c.mapUrl ? (
            <a href={c.mapUrl} style={buttonPrimaryStyle} target="_blank" rel="noreferrer">
              {c.ctaPrimary}
            </a>
          ) : null}
        </div>
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
                  ...mutedStyle,
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 600,
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
      </div>
    </section>
  );
}
