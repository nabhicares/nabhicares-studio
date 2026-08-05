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
import { normalizeTestimonials } from '../content';

/** Quote stack — accent bar, no card grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeTestimonials(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 40%, var(--color-bg))',
      }}
    >
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Stories</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            marginTop: '0.75rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {(c.items ?? []).map((item) => (
            <blockquote
              key={item.author + item.quote.slice(0, 12)}
              style={{ margin: 0, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
            >
              <span style={{ ...accentBarStyle, alignSelf: 'stretch', minHeight: 64 }} />
              <div>
                <p
                  style={{
                    margin: '0 0 1rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    lineHeight: 1.45,
                    letterSpacing: '-0.02em',
                  }}
                >
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer>
                  <div style={{ fontWeight: 600 }}>{item.author}</div>
                  {item.role ? (
                    <div style={{ ...mutedStyle, fontSize: '0.88rem', marginTop: 2 }}>{item.role}</div>
                  ) : null}
                </footer>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
