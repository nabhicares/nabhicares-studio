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

/** Stacked editorial — copy then wide image band */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, marginBottom: '1.75rem' }}>
        <h1 style={{ ...titleStyle, fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: '18ch' }}>{c.title}</h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ ...bodyStyle, margin: 0 }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
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
      </div>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, overflow: 'hidden', height: 'clamp(200px, 32vw, 360px)' }}>
        {c.image ? (
          <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
        )}
      </div>
    </section>
  );
}
