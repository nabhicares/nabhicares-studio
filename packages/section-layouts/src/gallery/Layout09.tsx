import type { LayoutProps } from '../types';
import { sectionBaseStyle, containerStyle } from '../styles';
import { normalizeGallery } from '../content';
import { SectionHeader, EmptyCopy, TreatedMedia } from '../polish';

/** Caption-forward list with thumb */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeGallery(content);
  const images = c.images ?? [];
  return (
    <section style={sectionBaseStyle}>
      <div style={containerStyle}>
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
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {images.map((img, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid color-mix(in srgb, var(--color-fg) 8%, transparent)',
                }}
              >
                <TreatedMedia
                  src={img.src}
                  aspectRatio="1"
                  emptyIcon="photo_library"
                  emptyLabel=""
                  style={{ width: 72, height: 72, flexShrink: 0 }}
                />
                <span>{img.caption || 'Photo ' + (i + 1)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
