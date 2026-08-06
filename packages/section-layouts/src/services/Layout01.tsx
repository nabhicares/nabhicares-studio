import type { LayoutProps } from '../types';
import {
  accentBarStyle,
  bodyStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeServices } from '../content';

/** Numbered list of services — one job, minimal chrome */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeServices(content);
  const items = (c.items as { title: string; description?: string; icon?: string }[]) ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Services</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {items.length === 0 ? (
          <p className="nabhi-empty" style={mutedStyle}>
            Services will appear here once added in Studio.
          </p>
        ) : (
        <div
          style={{
            display: 'grid',
            gap: 0,
            borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
            marginTop: '0.75rem',
          }}
        >
          {items.map((item, i) => (
            <article
              key={item.title}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '1.25rem',
                alignItems: 'start',
                padding: '1.35rem 0',
                borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                  minWidth: '2ch',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <span style={{ ...accentBarStyle, alignSelf: 'stretch', minHeight: 36 }} />
                <div>
                  <h3
                    style={{
                      margin: '0 0 0.35rem',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p style={{ ...mutedStyle, margin: 0, maxWidth: '40rem', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
