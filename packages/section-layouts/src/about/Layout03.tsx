import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Image first, then text + highlight cards */
export function Layout03({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={wideContainerStyle}>
        <TreatedMedia
          src={c.image}
          aspectRatio="21 / 9"
          emptyLabel="Add a hospital photo in Studio"
          style={{ minHeight: 200, marginBottom: '1.75rem' }}
        />
        <SectionHeader kicker="About" title={c.title} body={c.body} />
        {c.highlights?.length ? (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              marginTop: '0.25rem',
            }}
          >
            {c.highlights.map((h) => (
              <div
                key={h.label}
                style={{
                  ...elevatedCardStyle,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <IconBadge name={resolveServiceIcon(h.label)} size={42} />
                <div>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>
                    {h.label}
                  </strong>
                  <p style={{ ...mutedStyle, margin: '0.4rem 0 0', lineHeight: 1.55 }}>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
