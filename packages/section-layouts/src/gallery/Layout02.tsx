import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Centered title + wide masonry-ish uneven rows */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={{ ...bodyStyle, marginLeft: 'auto', marginRight: 'auto' }}>{c.body}</p> : null}
      </div>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '0.75rem', gridTemplateColumns: '2fr 1fr', gridAutoRows: '140px' }}>
        {(c.images ?? []).slice(0, 4).map((img, i) => (
          <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', gridRow: i === 0 ? 'span 2' : 'span 1', minHeight: 120 }}>
            {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
          </div>
        ))}
      </div>
    </section>
  );
}
