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

/** Image left / text right */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section
      style={{
        ...sectionBaseStyle,
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap-reverse',
        minHeight: 'min(68vh, 620px)',
      }}
    >
      <div
        style={{
          flex: '1.4 1 340px',
          minHeight: 260,
          background: c.image ? undefined : placeholderGradient,
          backgroundImage: c.image ? `url(${c.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        style={{
          flex: '1 1 320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-section-y) 1.75rem',
        }}
      >
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)' }}>{c.title}</h1>
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
    </section>
  );
}
