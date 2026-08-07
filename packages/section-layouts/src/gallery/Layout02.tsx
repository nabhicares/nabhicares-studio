import type { LayoutProps } from '../types';
import { sectionBaseStyle, containerStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Centered title + wide masonry-ish uneven rows */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center', marginBottom: '1.25rem' }}>
        <SectionHeader kicker="Gallery" title={c.title} body={c.body} center />
      </div>
      {images.length === 0 ? (
        <div style={{ ...wideContainerStyle }}>
          <TreatedMedia
            src={undefined}
            aspectRatio="21 / 9"
            emptyIcon="photo_library"
            emptyLabel="Photos coming soon. Add images in Studio or import from Maps."
            style={{ minHeight: 180 }}
          />
          <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
        </div>
      ) : (
        <div
          style={{
            ...wideContainerStyle,
            display: 'grid',
            gap: '0.75rem',
            gridTemplateColumns: '2fr 1fr',
            gridAutoRows: '140px',
          }}
        >
          {images.slice(0, 4).map((img, i) => (
            <TreatedMedia
              key={i}
              src={img.src}
              aspectRatio="auto"
              emptyIcon="photo_library"
              emptyLabel="Add photo"
              style={{
                gridRow: i === 0 ? 'span 2' : 'span 1',
                minHeight: 120,
                height: '100%',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
