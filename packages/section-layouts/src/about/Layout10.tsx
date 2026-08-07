import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, containerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle } from '../polish';

/** Minimal: title + body on surface band */
export function Layout10({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, background: 'var(--color-surface)' }}>
      <div style={{ ...containerStyle, display: 'grid', gap: '1rem' }}>
        <SectionHeader kicker="About" title={c.title} body={c.body} />
        <TreatedMedia
          src={c.image}
          aspectRatio="16 / 9"
          emptyLabel="Add a hospital photo in Studio"
          style={{ maxWidth: 420, maxHeight: 200 }}
        />
        {c.highlights?.length ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0.5rem 0 0',
              display: 'grid',
              gap: '0.75rem',
              maxWidth: '36rem',
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
