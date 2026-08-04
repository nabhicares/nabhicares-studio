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

/** Full-bleed centered overlay */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        minHeight: 'min(72vh, 680px)',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        background: c.image ? undefined : placeholderGradient,
        backgroundImage: c.image
          ? `linear-gradient(color-mix(in srgb, var(--color-fg) 45%, transparent), color-mix(in srgb, var(--color-fg) 45%, transparent)), url(${c.image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }}
    >
      <div style={{ ...containerStyle, textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 720 }}>
        <h1 style={{ ...titleStyle, color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>{c.title}</h1>
        <p style={{ ...bodyStyle, color: 'rgba(255,255,255,0.88)', margin: '0 auto 1.5rem', maxWidth: '36rem' }}>
          {c.body}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          {c.ctaPrimary ? (
            <a href="#" style={buttonPrimaryStyle}>
              {c.ctaPrimary}
            </a>
          ) : null}
          {c.ctaSecondary ? (
            <a href="#" style={{ ...buttonGhostStyle, borderColor: 'rgba(255,255,255,0.45)', color: '#fff' }}>
              {c.ctaSecondary}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
