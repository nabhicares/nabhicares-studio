import type { LayoutProps } from '../types';
import { sectionBaseStyle, containerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Vertical stacked full-width images */
export function Layout07({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 720 }}>
        <SectionHeader kicker="Gallery" title={c.title} body={c.body} />
        {images.length === 0 ? (
          <>
            <TreatedMedia
              src={undefined}
              aspectRatio="16 / 9"
              emptyIcon="photo_library"
              emptyLabel="Photos coming soon. Add images in Studio or import from Maps."
              style={{ minHeight: 180 }}
            />
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          </>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {images.slice(0, 3).map((img, i) => (
              <TreatedMedia
                key={i}
                src={img.src}
                aspectRatio="16 / 9"
                emptyIcon="photo_library"
                emptyLabel="Add photo"
                style={{ minHeight: 180, maxHeight: 240 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
