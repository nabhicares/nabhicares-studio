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

/** Asymmetric bento */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          alignItems: 'stretch',
        }}
      >
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 320 }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto' }}>
            {c.ctaPrimary ? (
              <a href="#" style={buttonPrimaryStyle}>
                {c.ctaPrimary}
              </a>
            ) : null}
            {c.ctaSecondary ? (
              <a href="#" style={buttonGhostStyle}>
                {c.ctaSecondary}
              </a>
            ) : null}
          </div>
        </div>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 320 }}>
          {c.image ? (
            <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
          )}
        </div>
        <div
          style={{
            background: 'var(--color-accent)',
            borderRadius: 'calc(var(--radius-button) + 4px)',
            minHeight: 120,
            display: 'grid',
            placeItems: 'center',
            padding: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-fg)',
          }}
        >
          Trusted care
        </div>
      </div>
    </section>
  );
}
