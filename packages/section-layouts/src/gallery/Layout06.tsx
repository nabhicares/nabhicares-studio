import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia, elevatedShadow } from '../polish';

/** Framed bordered tiles */
export function Layout06({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Gallery" title={c.title} body={c.body} />
        {images.length === 0 ? (
          <>
            <TreatedMedia
              src={undefined}
              aspectRatio="21 / 9"
              emptyIcon="photo_library"
              emptyLabel="Photos coming soon. Add images in Studio or import from Maps."
              style={{ minHeight: 180 }}
            />
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          </>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            {images.map((img, i) => (
              <figure
                key={i}
                style={{
                  margin: 0,
                  border: '1px solid color-mix(in srgb, var(--color-fg) 12%, transparent)',
                  borderRadius: 'calc(var(--radius-button) + 2px)',
                  overflow: 'hidden',
                  padding: 8,
                  background: 'var(--color-bg)',
                  boxShadow: elevatedShadow,
                }}
              >
                <TreatedMedia
                  src={img.src}
                  aspectRatio="4 / 3"
                  emptyIcon="photo_library"
                  emptyLabel="Add photo"
                  style={{ borderRadius: 'calc(var(--radius-button) - 2px)' }}
                />
                {img.caption ? (
                  <figcaption style={{ ...mutedStyle, padding: '0.5rem 0.25rem 0', fontSize: '0.85rem' }}>
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
