import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Horizontal strip */
export function Layout03({ content }: LayoutProps) {
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
              style={{ minHeight: 160 }}
            />
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
            {images.map((img, i) => (
              <TreatedMedia
                key={i}
                src={img.src}
                aspectRatio="3 / 2"
                emptyIcon="photo_library"
                emptyLabel="Add photo"
                style={{ flex: '0 0 240px', height: 160 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
