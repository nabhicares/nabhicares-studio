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

/** Side accent bar + split */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeHero(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
        <div style={{ ...accentBarStyle, width: 6, alignSelf: 'stretch', minHeight: 200 }} />
        <div
          style={{
            flex: 1,
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ ...titleStyle, fontSize: 'clamp(1.7rem, 3vw, 2.5rem)' }}>{c.title}</h1>
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
          <div style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '5 / 4', minHeight: 220 }}>
            {c.image ? (
              <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
