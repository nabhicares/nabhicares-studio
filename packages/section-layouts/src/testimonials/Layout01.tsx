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
import { normalizeTestimonials } from '../content';

function initials(name: string) {
  const parts = name
    .split(/\s+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '•';
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function starsText(rating?: number) {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) return null;
  const filled = clamp(Math.round(rating), 0, 5);
  return Array.from({ length: 5 }, (_, i) => (i < filled ? '*' : '-')).join('');
}

/** Testimonials — card grid with optional rating/avatar */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  const items = c.items ?? [];
  return (
    <section
      style={sectionBaseStyle}
    >
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Stories</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {items.length === 0 ? (
          <p className="nabhi-empty" style={mutedStyle}>
            Patient stories coming soon.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 'clamp(1rem, 2vw, 1.25rem)',
              marginTop: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {items.map((item) => (
              <article
                key={item.author + item.quote.slice(0, 12)}
                style={{
                  ...cardStyle,
                  padding: '1.35rem 1.25rem',
                  boxShadow: '0 12px 28px color-mix(in srgb, var(--color-fg) 8%, transparent)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '999px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'color-mix(in srgb, var(--color-surface) 70%, var(--color-bg))',
                      border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      initials(item.author)
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {item.rating !== undefined ? (
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontWeight: 800,
                          color: 'var(--color-accent)',
                          letterSpacing: '0.12em',
                          fontSize: '0.95rem',
                          marginBottom: '0.35rem',
                        }}
                      >
                        {starsText(item.rating) ?? ''}
                      </div>
                    ) : null}

                    <p
                      style={{
                        margin: '0 0 0.85rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1rem',
                        lineHeight: 1.5,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    <footer>
                      {item.author ? (
                        <div style={{ fontWeight: 700, color: 'var(--color-fg)' }}>{item.author}</div>
                      ) : null}
                      {item.role ? (
                        <div style={{ ...mutedStyle, fontSize: '0.88rem', marginTop: 2 }}>{item.role}</div>
                      ) : null}
                    </footer>
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
