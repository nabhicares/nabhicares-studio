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

/** Surface panel with inset content */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, ...surfaceStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', alignItems: 'center' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p>
        </div>
        <div style={{ borderRadius: 'calc(var(--radius-button) + 2px)', overflow: 'hidden', minHeight: 220, background: 'var(--color-bg)' }}>
          {c.image ? (
        <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', minHeight: 180, background: placeholderGradient }} />
      )}
        </div>
      </div>
    </section>
  );
}
