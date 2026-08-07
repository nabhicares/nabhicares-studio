import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Split: captions list + image stack */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        <div>
          <SectionHeader kicker="Gallery" title={c.title} body={c.body} />
          {images.length === 0 ? (
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-muted)' }}>
              {images.map((img, i) => (
                <li key={i}>{img.caption || 'Image ' + (i + 1)}</li>
              ))}
            </ul>
          )}
        </div>
        {images.length === 0 ? (
          <TreatedMedia
            src={undefined}
            aspectRatio="1"
            emptyIcon="photo_library"
            emptyLabel="Photos coming soon"
            style={{ minHeight: 200 }}
          />
        ) : (
          <div style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: '1fr 1fr' }}>
            {images.slice(0, 4).map((img, i) => (
              <TreatedMedia
                key={i}
                src={img.src}
                aspectRatio="1"
                emptyIcon="photo_library"
                emptyLabel="Add photo"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
