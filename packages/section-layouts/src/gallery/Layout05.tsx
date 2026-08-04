import type { LayoutProps } from '../types';
import {
  bodyStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Hero image + thumbnail row */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const [hero, ...rest] = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 260, marginBottom: '0.75rem' }}>
          {hero?.src ? <img src={hero.src} alt={hero.caption ?? ''} style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} /> : <div style={{ height: 280, background: placeholderGradient }} />}
        </div>
        <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
          {rest.map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', height: 90 }}>
              {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
