import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, containerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Centered stack with optional image below */
export function Layout02({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, textAlign: 'center' }}>
        <SectionHeader kicker="About" title={c.title} body={c.body} center />
        <TreatedMedia
          src={c.image}
          aspectRatio="16 / 9"
          emptyLabel="Add a hospital photo in Studio"
          style={{ maxWidth: 640, margin: '0 auto', minHeight: 220 }}
        />
        {c.highlights?.length ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '1.5rem auto 0',
              maxWidth: 480,
              display: 'grid',
              gap: '0.85rem',
              textAlign: 'left',
            }}
          >
            {c.highlights.map((h) => (
              <li
                key={h.label}
                style={{
                  ...elevatedCardStyle,
                  display: 'flex',
                  gap: '0.9rem',
                  alignItems: 'flex-start',
                }}
              >
                <IconBadge name={resolveServiceIcon(h.label)} size={42} />
                <div>
                  <strong
                    style={{
                      display: 'block',
                      marginBottom: 4,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                    }}
                  >
                    {h.label}
                  </strong>
                  <span style={{ ...mutedStyle, lineHeight: 1.55 }}>{h.text}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
