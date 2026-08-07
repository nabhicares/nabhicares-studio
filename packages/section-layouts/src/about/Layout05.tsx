import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Asymmetric: large image left, sticky-feel text right */
export function Layout05({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div
        style={{
          ...wideContainerStyle,
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: '1.2fr 0.8fr',
          alignItems: 'start',
        }}
      >
        <TreatedMedia
          src={c.image}
          aspectRatio="4 / 5"
          emptyLabel="Add a hospital photo in Studio"
          style={{ minHeight: 320 }}
        />
        <div>
          <SectionHeader kicker="About" title={c.title} body={c.body} />
          {c.highlights?.length ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '1rem 0 0',
                display: 'grid',
                gap: '0.85rem',
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
      </div>
    </section>
  );
}
