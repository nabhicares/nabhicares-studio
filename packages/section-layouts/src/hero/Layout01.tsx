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

/** Split ~35/65 — text left, image right */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 'min(70vh, 640px)',
      }}
    >
      <div
        style={{
          flex: '1 1 320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-section-y) 1.75rem',
          background: 'color-mix(in srgb, var(--color-surface) 40%, var(--color-bg))',
          borderRight: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
        }}
      >
        <div style={{ maxWidth: 420, marginLeft: 'auto', width: '100%' }}>
          <h1 style={{ ...titleStyle, fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', marginBottom: '1rem' }}>
            {c.title}
          </h1>
          <p style={bodyStyle}>{c.body}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
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
          flex: '1.6 1 360px',
          minHeight: 280,
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? `url(${c.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </section>
  );
}
