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

/** Minimal centered — no image */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={{ ...sectionBaseStyle, minHeight: 'min(56vh, 520px)', display: 'grid', placeItems: 'center' }}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <div
          style={{
            width: 48,
            height: 3,
            background: 'var(--color-accent)',
            margin: '0 auto 1.25rem',
            borderRadius: 2,
          }}
        />
        <h1 style={{ ...titleStyle, fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)' }}>{c.title}</h1>
        <p style={{ ...bodyStyle, margin: '0 auto 1.5rem' }}>{c.body}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
