import type { LayoutProps } from '../types';
import {
  bodyStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Asymmetric: large image left, sticky-feel text right */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '1.5rem', gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start' }}>
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 320 }}>
          {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
        </div>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        </div>
      </div>
    </section>
  );
}
