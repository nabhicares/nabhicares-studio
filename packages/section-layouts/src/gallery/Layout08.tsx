import type { LayoutProps } from '../types';
import { sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia, elevatedShadow } from '../polish';

/** Overlapping collage */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const imgs = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <SectionHeader kicker="Gallery" title={c.title} body={c.body} />
        {imgs.length === 0 ? (
          <>
            <TreatedMedia
              src={undefined}
              aspectRatio="16 / 10"
              emptyIcon="photo_library"
              emptyLabel="Photos coming soon. Add images in Studio or import from Maps."
              style={{ minHeight: 240, maxWidth: 700, margin: '0 auto' }}
            />
            <EmptyCopy>Photos coming soon. Add images in Studio or import from Maps.</EmptyCopy>
          </>
        ) : (
          <div style={{ position: 'relative', height: 320, maxWidth: 700, margin: '0 auto' }}>
            {imgs.slice(0, 3).map((img, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: i === 0 ? '58%' : '42%',
                  height: i === 0 ? '70%' : '55%',
                  left: i === 0 ? '0%' : i === 1 ? '48%' : '28%',
                  top: i === 0 ? '0%' : i === 1 ? '8%' : '42%',
                  zIndex: i + 1,
                  boxShadow: elevatedShadow,
                  borderRadius: 'calc(var(--radius-button) + 4px)',
                }}
              >
                <TreatedMedia
                  src={img.src}
                  aspectRatio="auto"
                  emptyIcon="photo_library"
                  emptyLabel="Add photo"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
