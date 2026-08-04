import type { LayoutProps } from '../types';
import {
  bodyStyle,
  containerStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Vertical stacked full-width images */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 720 }}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {(c.images ?? []).slice(0, 3).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', minHeight: 180 }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }} /> : <div style={{ height: 180, background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
