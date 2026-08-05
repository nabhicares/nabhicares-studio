import type { LayoutProps } from '../types';
import {
  bodyStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  placeholderGradient,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeGallery } from '../content';

/** Quiet photo grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Gallery</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        <div
          style={{
            display: 'grid',
            gap: '0.65rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          }}
        >
          {(c.images ?? []).map((img, i) => (
            <figure key={i} style={{ margin: 0, ...imageTreatmentStyle, aspectRatio: '1' }}>
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.caption ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: placeholderGradient }} />
              )}
              {img.caption ? (
                <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}>
                  {img.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
