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

/** Floating card on soft surface */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        background: 'color-mix(in srgb, var(--color-surface) 50%, var(--color-bg))',
        display: 'grid',
        placeItems: 'center',
        minHeight: 'min(64vh, 600px)',
      }}
    >
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: 0,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          ...cardStyle,
          padding: 0,
          overflow: 'hidden',
          maxWidth: 960,
        }}
      >
        <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.6rem, 3vw, 2.35rem)' }}>{c.title}</h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
        <div
          style={{
            minHeight: 260,
            background: c.image ? undefined : placeholderGradient,
            backgroundImage: c.image ? `url(${c.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </section>
  );
}
