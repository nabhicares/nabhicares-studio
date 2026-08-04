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

/** Split: captions list + image stack */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...wideContainerStyle, display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div>
          <h2 style={titleStyle}>{c.title}</h2>
          {c.body ? <p style={{ ...bodyStyle, maxWidth: 'none' }}>{c.body}</p> : null}
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-muted)' }}>
            {(c.images ?? []).map((img, i) => (
              <li key={i}>{img.caption || ('Image ' + (i + 1))}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: '1fr 1fr' }}>
          {(c.images ?? []).slice(0, 4).map((img, i) => (
            <div key={i} style={{ ...surfaceStyle, overflow: 'hidden', aspectRatio: '1' }}>
              {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
