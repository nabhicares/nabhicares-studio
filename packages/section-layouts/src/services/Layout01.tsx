import type { LayoutProps } from '../types';
import {
  bodyStyle,
  cardStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeServices } from '../content';

function looksLikeUrl(s: string) {
  return /^https?:\/\//i.test(s.trim());
}

function serviceIconFallback(icon?: string) {
  const v = (icon ?? '').trim();
  return v ? v : '+';
}

/** Services — icon + card grid */
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
              gap: 'clamp(0.9rem, 2vw, 1.25rem)',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {items.map((item) => {
              const icon = (item.icon ?? '').trim();
              const iconText = serviceIconFallback(icon);
              const iconIsUrl = looksLikeUrl(icon);
              return (
                <article
                  key={item.title}
                  style={{
                    ...cardStyle,
                    padding: '1.25rem 1.25rem',
                    boxShadow: '0 10px 28px color-mix(in srgb, var(--color-fg) 8%, transparent)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'calc(var(--radius-button) + 2px)',
                        border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                        background: 'color-mix(in srgb, var(--color-surface) 60%, var(--color-bg))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {iconIsUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                          {iconText}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3
                        style={{
                          margin: '0 0 0.45rem',
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.2rem',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.2,
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p style={{ ...mutedStyle, margin: 0, lineHeight: 1.65 }}>{item.description}</p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
