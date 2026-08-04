import type { LayoutProps } from '../types';
import {
  bodyStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle
} from '../styles';
import { normalizeGallery } from '../content';

/** Framed bordered tiles */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {(c.images ?? []).map((img, i) => (
            <figure key={i} style={{ margin: 0, border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)', borderRadius: 'var(--radius-button)', overflow: 'hidden', padding: 8 }}>
              <div style={{ aspectRatio: '4/3', background: placeholderGradient, overflow: 'hidden', borderRadius: 'calc(var(--radius-button) - 2px)' }}>
                {img.src ? <img src={img.src} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
              </div>
              {img.caption ? <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.25rem 0', fontSize: '0.85rem' }}>{img.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
