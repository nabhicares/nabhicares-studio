import type { LayoutProps } from '../types';
import {
  bodyStyle,
  imageTreatmentStyle,
  kickerStyle,
  mutedStyle,
  sectionBaseStyle,
  titleStyle,
  wideContainerStyle,
} from '../styles';
import { normalizeGallery } from '../content';

/** Quiet photo grid */
export function Layout01({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <p style={kickerStyle}>Gallery</p>
        <h2 style={titleStyle}>{c.title}</h2>
        {c.body ? <p style={bodyStyle}>{c.body}</p> : null}
        {images.length === 0 ? (
          <div
            className="nabhi-empty-media"
            style={{
              ...imageTreatmentStyle,
              aspectRatio: '21 / 9',
              marginTop: '0.75rem',
              minHeight: 180,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--color-accent)' }}>
              photo_library
            </span>
            <p className="nabhi-empty" style={{ ...mutedStyle, margin: 0, textAlign: 'center' }}>
              Photos coming soon. Add images in Studio or import from Maps.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '0.65rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            }}
          >
            {images.map((img, i) => (
              <figure key={i} style={{ margin: 0, ...imageTreatmentStyle, aspectRatio: '1' }}>
                <img
                  src={img.src}
                  alt={img.caption ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {img.caption ? (
                  <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.65rem', fontSize: '0.8rem' }}>
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
