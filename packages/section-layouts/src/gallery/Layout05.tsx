import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Hero image + thumbnail row */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  const [hero, ...rest] = images;
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
              style={{ minHeight: 260 }}
            />
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          </>
        ) : (
          <>
            <TreatedMedia
              src={hero?.src}
              aspectRatio="21 / 9"
              emptyIcon="photo_library"
              emptyLabel="Add photo"
              style={{ minHeight: 260, marginBottom: '0.75rem' }}
            />
            {rest.length ? (
              <div
                style={{
                  display: 'grid',
                  gap: '0.65rem',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                }}
              >
                {rest.map((img, i) => (
                  <TreatedMedia
                    key={i}
                    src={img.src}
                    aspectRatio="4 / 3"
                    emptyIcon="photo_library"
                    emptyLabel="Add photo"
                    style={{ height: 90 }}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
