import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  surfaceStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Uniform 3-col grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {(c.images ?? []).map((img, i) => (
            <figure key={i} style={{ margin: 0, ...surfaceStyle, overflow: 'hidden', aspectRatio: '1' }}>
              {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
              {img.caption ? <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
