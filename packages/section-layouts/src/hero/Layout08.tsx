import type { LayoutProps } from '../types';
import {
  accentBarStyle,
  bodyStyle,
  buttonGhostStyle,
  buttonPrimaryStyle,
  cardStyle,
  containerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeHero } from '../content';

/** Eyebrow + image with CTA strip */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 35%, var(--color-bg))',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <div>
          <p
            style={{
              ...mutedStyle,
              margin: '0 0 0.75rem',
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Hospital care
          </p>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.8rem, 3.2vw, 2.7rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
        </div>
        <div>
          <div style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '16 / 10', marginBottom: '1rem' }}>
            {c.image ? (
              <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {c.ctaPrimary ? (
              <a href="#" style={{ ...buttonPrimaryStyle, flex: '1 1 140px' }}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={{ ...buttonGhostStyle, flex: '1 1 140px' }}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
