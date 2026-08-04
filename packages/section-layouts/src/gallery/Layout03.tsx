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

/** Horizontal strip */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
          {(c.images ?? []).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', flex: '0 0 240px', height: 160 }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
