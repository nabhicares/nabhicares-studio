import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Horizontal highlight strip under title */
export function Layout09({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            alignItems: 'end',
            marginBottom: '1.5rem',
          }}
        >
          <SectionHeader kicker="About" title={c.title} body={c.body} />
          <TreatedMedia
            src={c.image}
            aspectRatio="16 / 10"
            emptyLabel="Add a hospital photo in Studio"
            style={{ minHeight: 160 }}
          />
        </div>
        {c.highlights?.length ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              borderTop: '1px solid color-mix(in srgb, var(--color-fg) 10%, transparent)',
              paddingTop: '1.25rem',
            }}
          >
            {c.highlights.map((h) => (
              <div
                key={h.label}
                style={{
                  ...elevatedCardStyle,
                  flex: '1 1 140px',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <IconBadge name={resolveServiceIcon(h.label)} size={36} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{h.label}</div>
                  <div style={{ ...mutedStyle, marginTop: 4, lineHeight: 1.5 }}>{h.text}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
