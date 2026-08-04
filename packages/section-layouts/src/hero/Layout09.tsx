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

/** Dense clinical — headline / body split, full-bleed image */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 0 }}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', margin: 0 }}>{c.title}</h1>
        <div>
          <p style={{ ...bodyStyle, marginBottom: '1.25rem' }}>{c.body}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
      <div
        style={{
          width: '100%',
          height: 'clamp(180px, 28vw, 320px)',
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? `url(${c.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </section>
  );
}
