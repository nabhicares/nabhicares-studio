import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, containerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, elevatedCardStyle } from '../polish';

/** Narrow editorial column */
export function Layout04({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={sectionBaseStyle}>
      <div style={{ ...containerStyle, maxWidth: 560 }}>
        <SectionHeader kicker="About" title={c.title} body={c.body} />
        {c.highlights?.length ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0.25rem 0 0',
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
    </section>
  );
}
