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

/** Caption-forward list with thumb */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(c.images ?? []).map((img, i) => (
            <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)' }}>
              <div style={{ width: 72, height: 72, ...surfaceStyle, overflow: 'hidden', flexShrink: 0 }}>
                {img.src ? <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />}
              </div>
              <span>{img.caption || ('Photo ' + (i + 1))}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
