import type { LayoutProps } from '../types';
import { mutedStyle, sectionBaseStyle, wideContainerStyle } from '../styles';
import { normalizeAbout } from '../content';
import { IconBadge, resolveServiceIcon } from '../icons';
import { SectionHeader, TreatedMedia, elevatedCardStyle, elevatedShadow } from '../polish';

/** Overlapping visual: image strip + floating text card */
export function Layout08({ content }: LayoutProps) {
  const c = normalizeAbout(content);
  return (
    <section style={{ ...sectionBaseStyle, paddingBottom: 'calc(var(--space-section-y) + 2rem)' }}>
      <div style={{ ...wideContainerStyle, position: 'relative' }}>
        <TreatedMedia
          src={c.image}
          aspectRatio="21 / 9"
          emptyLabel="Add a hospital photo in Studio"
          style={{ minHeight: 240, maxHeight: 320 }}
        />
        <div
          style={{
            ...elevatedCardStyle,
            maxWidth: 480,
            margin: '-3rem 1.5rem 0 auto',
            position: 'relative',
            boxShadow: `0 12px 40px color-mix(in srgb, var(--color-fg) 12%, transparent), ${elevatedShadow}`,
          }}
        >
          <SectionHeader kicker="About" title={c.title} body={c.body} />
          {c.highlights?.length ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '1rem 0 0',
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              {c.highlights.map((h) => (
                <li
                  key={h.label}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                >
                  <IconBadge name={resolveServiceIcon(h.label)} size={36} />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: 2,
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {h.label}
                    </strong>
                    <span style={{ ...mutedStyle, fontSize: '0.9rem', lineHeight: 1.5 }}>{h.text}</span>
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
