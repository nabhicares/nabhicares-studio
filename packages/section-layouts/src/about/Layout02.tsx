import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle
} from '../styles';
import { normalizeAbout } from '../content';

/** Centered stack with optional image below */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <h2 style={{ ...titleStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.title}</h2>
        <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p>
        <div style={{ ...surfaceStyle, overflow: 'hidden', maxWidth: 640, margin: '0 auto', minHeight: 220 }}>
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
